# TypeScript
This doc covers how we use TypeScript. There are 4 sections:
- [Converting React Components from JavaScript to TypeScript](#Converting-React-Components-from-JavaScript-to-TypeScript) covers all you need to know to convert a Component from JS to TS
- [Message Flow](#Message-flow) covers how data flows between the app and Wispa
- [Type Definitions](#Type-Definitions) covers how we define types and structures for use throughout the app
- [TypeScript conversion plan](#TypeScript-conversion-plan) covers our plan for converting more of the codebase to TypeScript

For general TypeScript rampup material, see [this Metacom article](https://metacom2.metaswitch.com/confluence/x/l7jMBg).

## Converting React Components from JavaScript to TypeScript

> This section may not contain all the necessary steps - if you find an extra step is needed please update it

1. Change the file extension using `git mv`. **Do not rename the file yourself**, this will cause all its git history to be lost, as we learned the hard way

```bash
git mv my/component/file.js my/component/file.tsx
```

2. Update it to be TypeScript compliant:

- Add types to function parameters and retun types, e.g.

```diff
- const clickHandler = (contact) => {
+ const clickHandler = (contact: Contact | null): void => {
    if (call.attention) updateHistoricCall(call.uid, false);
```

- Add props interfaces to components

```diff
+ interface Props {
+   call: HistoricCall;
+ }
- const CallBlock = ({ call }) => {
+ const CallBlock: React.FC<Props> = (props) => {
    const dispatch = useDispatch();
```

- Remove PropTypes (if any)

```diff
- CallBlock.propTypes = {
-   contact: PropTypes.shape({
-     uid: PropTypes.string.isRequired,
-     phone: PropTypes.arrayOf(
-       PropTypes.shape({
-         value: PropTypes.string,
-       })
-     ),
-     identity: PropTypes.shape({
-       firstName: PropTypes.string,
-       lastName: PropTypes.string,
-       profilePicture: PropTypes.string,
-     }),
-     presence: PropTypes.shape({
-       state: PropTypes.number,
-     }),
-     notifyWhenAvailable: PropTypes.bool,
-   }),
-   call: PropTypes.object.isRequired,
- };
```

- Add type information to any `useSelector` calls that don't use a pre-made selector

```diff
   // Pre-made selector, doesn't change
   const contact = useSelector(selectOneContactWithPhoneNumber(call.remoteParty));

   // Selecting function defined inline, you need to provide `StoreState` and the return type of the data being selected as generics
   // `StoreState` can be imported from `src/store/types`
-  const selectedContact = useSelector((state) => state.contactReducer.selectedContact);
+  const selectedContact = useSelector<StoreState, Contact>((state) => state.contactReducer.selectedContact);
```

- Double check your variables have the types you expect by hovering over them

3. Update the corresponding `styles.js` file to TypeScript:
  - `git mv styles.js styles.ts` (note that's `.ts`, not `.tsx`)
  - Add `interface` representing `props` to any Styled Component which uses props:
```diff
+ interface WrapperProps {
+  isRed: boolean;
+ }
+  export const Wrapper = styled.div<WrapperProps>`
-  export const Wrapper = styled.div`
    border: ${(props) => (props.isRed ? "1px solid red" : "1px solid blue")};
  `;
```
  - Note: You don't _have to_ update `styles.js` to TypeScript unless it uses `props`, but it's recommended you do anyway for consistency
4. Run the relevant UTs to check you haven't broken anything - `npx jest test/react-ut/my/component/file.test.js`
5. Write your new code in all the comfort and safety of TypeScript 😄

## Message flow

Data continually flows between the app and Wispa and in both directions. Data received from Wispa is referred to as a `WispaMessage`. Data sent to Wispa is referred to as a `WispaRequest`.

This diagram gives a rough indication of how `WispaMessage`s and `WispaRequest`s flow through the app

![Message and Request flow through the app](/docs/images/plumbing-design.drawio.svg)

Both message types are structured such that a piece of data can be put in a certain "slot" within it. This gives the handling code required metadata, namely the Namespace (e.g. `contacts/` or `activecalls/`) and the Method (e.g. `get`, `datalist` or `update`).

Here's some pseudo code to illustrate the point:
```typescript
// Minimised version of the WispaMessage structure
class WispaMessage {
  data: {
    contact: Contact | null;
    activeCall: ActiveCall | null;
  };
  dataList: {
    contacts: Contact[] | null;
    activeCalls: ActiveCall[] | null;
  };
  deleted: {
    contact: Contact | null;
    activeCall: ActiveCall | null;
  };
}

// Constructing a WispaMessage that signals a contact should be deleted
const myContact = new Contact();
const myWispaMessage = new WispaMessage();

myWispaMessage.deleted.contact = myContact

// Handling code that has received our WispaMessage
if (myWispaMessage.deleted.contact) {
    redux.delete(myWispaMessage.deleted.contact)
}
```

Both `WispaMessage`s and `WispaRequest`s are only expected to carry one piece of information at a time. In the example above, we wouldn't expect to set anything else on `myWispaMessage` having set the deleted contact.

This is enforced in the defintion of a `WispaRequest`, but not in the definition of a `WispaMessage`. This is because `WispaRequest`'s are first built in the app, so we want to guard against developers building them incorrectly. Conversely, `WispaMessage`s are built in the UC Daemon - enforcing correct structure is therefore its responsibility.

## Type Definitions

The high level types we use throughout the app are built up via a slightly complex set of steps:

- Wispa data structures are defined in the [protobuf-wispa](https://git.datcon.co.uk/accession/Desktop/protobuf-wispa/-/tree/master/definitions) codebase.
- The `protobuf-wispa` package is generated by [ts-proto](https://github.com/stephenh/ts-proto). It contains interfaces derived from the above.
- The shared types defintion file, i.e. [src/shared/types.ts](../src/shared/types.ts), imports everything from the `protobuf-wispa` package and re-exports the parts that are needed. It also tweaks some of the interfaces to specify which fields are optional before exporting them. See [optional protobuf defintions](#optional-protobuf-definitions) below for more info on this. This file also defines the `WispaMessage` and `WispaRequest` structures.

These shared type defintions are used in two places:
1. The `node-server` types definition file, i.e. [node-server/types.ts](../node-server/types.ts). This provides types to be used throughout `node-server` that are based off the shared types. All other code in `node-server` should import its types from here. It mostly provides functions for converting data to and from protobuf format/binary.
2. The `src` types definition file, i.e. [src/types.ts](../src/types.ts). This provides types to be used throughout `src` that are based off the shared types. All other code in `src` should import its types from here. It mostly provides Wispa data as classes - this allows methods that are useful to the React components to be defined on the Wispa data objects.

### Optional Protobuf definitions

Currently we have to define which fields on a Wispa data type are optional in the shared types defintions. This is non-ideal because:
- UC Daemon and Electron could fall out of sync
- If `ts-proto` thinks a certain field is mandatory then objects it creates will always have that field, it will be set to default if it wasn't provided in the binary. This is an artifact of how protobuf works - default and non-existence are the same for standard data types like string/number etc. If the type system then specifies that that field isn't mandatory it will still be there which can cause confusion down the line.

[DUIR-2014](https://jira.metaswitch.com/browse/DUIR-2014) aims to solve this by allowing "optional-ness" to be encoded in the protobuf definitions.

## TypeScript conversion plan

Currently only part of the app is written in TypeScript. Converting more of it from JavaScript to TypeScript will lower the number of interactions between JS and TS code, meaning we lower our chances of bugs.

The plan is to keep doing improvements stories to convert more parts of the app:
- [DUIR-2012](https://jira.metaswitch.com/browse/DUIR-2012) Remaining node-server code
- [DUIR-2013](https://jira.metaswitch.com/browse/DUIR-2013) Key React components

Simultaneously - any new files should be written in TypeScript and whenever making significant changes to a JavaScript file you should strongly consider converting it to TypeScript.

