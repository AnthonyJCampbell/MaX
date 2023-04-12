# React UT testing

This README details how to work with the React UT framework. For a general overview of testing MaX UC UI, see `docs/testing.md`.

## Introduction

The React unit tests cover the Renderer processes. There are two subsets of tests:

### 1 - Components

Testing individual React components in isolation. These use [Enzyme](https://enzymejs.github.io/enzyme/docs/guides/jest.html) and shallow rendering.

### 2 - Redux

Testing Redux reducers and actions as pure functions. These are pure JavaScript, so no libraries or testing frameworks needed.

## Running the tests

The tests can be run with `npm run test-react-ut`

To run specific test files, run with `npx jest test/react-ut/path/to/file`

To further specify to a single *Describe/It* statement, run with `npx jest test/react-ut/path/to/file -t "statement"`

## Adding tests

### Types of test

There are several ways to test React components. The main ones are:

- Shallow rendering: Render a component but not its children
- Mount rendering: Renders a component and it's children
- Snapshots: Compares a rendered component to a previously saved off snapshot of that component

Only shallow rendering should be used, do not use mounting or snapshots.

We decided against mounting because:

- It makes it harder to test components in isolation
- More care has to be taken when running parallel tests (due to all tests sharing a DOM to mount in)
- It's slower
- Its advantages (i.e. testing across multiple components) are covered in FV

We decided against using snapshots because the snapshots themselves are likely to change very often as components do. This makes the tests difficult to maintain and of little value as they will rarely catch genuine errors.

### Writing good tests

#### Writing good component tests

- Only test one component at a time
- Only interact with a component via its external interfaces (e.g. passing props, clicking things). Don't call its methods directly as this risks testing implementation detail.
- A single user action should have a single UT, unless there are interesting external factors. For example, if clicking on a button makes two things happen, both things should be tested in the same UT. If clicking on a button has different results depending on external factors, there can be a single UT for each set of external factors.
- Don't test whether html is present - your tests will end up flaky. Instead test that functions have been called.
- Components that have no logic are not worth testing - instead add a .md explaining why no tests were added.

#### Writing good Redux tests

- Only verify return value for given parameters
- For testing reducers, be creative with the range of state inputs

## Rampup

Here are some useful articles to help you create React tests:

- [Enzyme cheat sheet](https://devhints.io/enzyme)

It is worth being comfortable with CSS Selectors. See `test/getting-started.md` for more information.

## Infrastructure

In Gitlab CI, the tests run in a headless environment, so some classes and functions that would be provided by the browser are not available in JSDOM (the DOM implementation used by JEST).  Therefore we need to provide dummy implementations for those classes/methods, or mock around them so we don't need to import them at all.  Initially we used jest-runner/electron to do this, but that has it's own complex dependency requirements for the gitlab runner.

## Mocks

### Mocking Redux state

The most robust way to mock Redux state is with this pattern:

```javascript
const mockState = {
// Substitute whichever reducers you actually need in here, e.g.
  activeCallsReducer: { activeCalls: [] },
  contactReducer: { contacts: [] },
  paneManagementReducer: { metadata: {} },
};
const useSelectorMock = jest.spyOn(redux, "useSelector");
useSelectorMock.mockImplementation((callback) => callback(mockState));
```

Each test then updates `mockState` to be whatever it likes and doesn't need to interact with the `useSelectorMock`

```javascript
it("Does something", () => {
    mockState.activeCallsReducer.activeCalls = [myActiveCall]

    // Write test code. Any code interacting with Redux will receive `[myActiveCall]` in the `activeCallsReducer`
    // field
})
```
