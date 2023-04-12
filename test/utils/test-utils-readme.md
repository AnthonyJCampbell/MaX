# Test utils readme

This directory contains utilities used in both the UTs and FVs.

This mainly consists of test data.

## Test Data

There are several ready-made objects that can be used throughout various tests. These live `test-<object-type>.ts` files.

They are instances of the WISPA data objects that are passed around the app. They each come in two forms, a `proto` form and a normal form. The normal form is of the type that is used within the app, the `proto` form is of the type that is used when communicating with WISPA.

This means that, by and large, the FVs use `proto` forms and the UTs use normal forms.

The objects are also all [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze). This means they can't be accidentally changed by tests, which would result in the changes cropping up in other tests and causing hard-to-debug issues.

Any test which wishes to use different data should:

- Clone the test data (with `mutableCloneDeep` from [shared/mocks/ts-utils](../../src/shared/mocks/ts-utils.ts)) that is most similar to the desired different data
- Modify the clone

E.g. to change Bilbo's name to Frodo:

```javascript
import { mutableCloneDeep } from "shared/mocks/ts-utils"
import { bilbo } from "shared/mocks/mock-contacts"

it("Does something", () => {
  const frodo = mutableCloneDeep(bilbo)
  frodo.identity.firstName = "Frodo"

  // ...test with frodo
});
```
