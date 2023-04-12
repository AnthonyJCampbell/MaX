# Introduction

This doc covers information on tools that are used across our test frameworks. You should be familiar with it before adding tests.

For information on specific frameworks, see their respective READMEs

- [Node UT readme](node/node-ut-readme.md)
- [React UT readme](react/react-ut-readme.md)
- [Electron FV readme](electron-fv/electron-fv-readme.md)

For information on testing as a whole, see `docs/testing.md`.

## Jest

All our tests frameworks are run by [Jest](https://jestjs.io/). Jest is not particularly complicated, but there are a couple of bits worth knowing.

### Suites, components and tests

A single test is run using the `it()` function.
E.g.

```JavaScript
it("does something", () => {
    // Test some stuff
})
```

Tests are grouped into components using the `describe()` function and into suites (separate test files). A component's name should "describe" a scenario or a piece of functionality then the tests' names should specify expected behaviours.  Components may themselves be groups inside other components within the suite.

E.g.

```JavaScript
describe("Pane Control", () => {
    it("launches a new window", () => {
        // Test new window being launched...
    })
    it("closes a window", () => {
        // Test window being closed...
    })
});
```

When you run Jest these are displayed as:

```
  Pane Control
    √ launches a new window (8ms)
    √ closes a window (10ms)
```

so they read as e.g. "Pane control launches a new window".

### Setup and teardown

Jest provides two pairs of functions for setting and tearing down setup required by tests (e.g. starting the app). They are

- `beforeAll()`
- `afterAll()`
- `beforeEach()`
- `afterEach()`

They can be specified at component or suite scope.

`beforeAll()` and `afterAll()` run once each - before any tests have been executed and after all tests have been executed within the component.

`beforeEach()` and `afterEach()` run before and after every test within the component respectively.

In the case of multiple setup functions applying to a single test from different scopes they run in this order:
1. Outer `beforeAll()`
2. Inner `beforeAll()`
3. Outer `beforeEach()`
4. Inner `beforeEach()`
5. Test runs
6. Inner `afterEach()`
7. Outer `afterEach()`
8. Inner `afterAll()`
9. Outer `afterAll()`

### Mocking

In some tests we want to mock out module imports. For instance, if some code will be importing `window-messaging` (to send IPCs to Renderer processes) then we can mock out that import from our test code with

```JavaScript
let { windows } = require("public/window-messaging");
jest.mock("public/window-messaging);
```

Now we can edit `windows` and those changes will be reflected in the code being tested. E.g.

```JavaScript
const codeUnderTest = require("my-production-code");

mockSendMessage = jest.fn(() => {});
windows.sendMessage = mockSendMessage

it("Sends a message with some parameters", () => {
  expect(mockSendMessage).not.toHaveBeenCalled();
  codeUnderTest.doStuffThatInvolvesSendingAMessage("test", "parameters");

  expect(mockSendMessage.mock.calls).toHaveLength(1);
  expect(mockSendMessage.mock.calls[0]).toEqual(["test", "parameters"]);
});
```

For full details of mocking in Jest see [Mock functions](https://jestjs.io/docs/en/mock-functions) and [Manual mocks](https://jestjs.io/docs/en/manual-mocks) in the Jest docs.

### Asserting

Jest comes with an `expect()` function that should be used in tests to verify behaviour.

Calls to `expect()` are coupled with "matchers" that allow validation in a range of contexts. For example, the matcher `.toContain()` allows you to verify that an array contains a given element:

```JavaScript
const myArray = ["hello", "world"];
expect(myArray).toContain("hello")
```

In this case Jest refers to `myArray` as the `received` value and `"hello"` as the `expected` value. This can be a little confusing since the `expected` value is not the one in `expect()`.

The most common matchers are:

- `toBe()`: Compares the two values shallowly
- `toStrictEqual()`: Compares the two values deeply, e.g. verifying objects properties match or all array elements are the same
- `toHaveLength()`: Verify the length of a given array

See [the Jest docs](https://jestjs.io/docs/en/expect) for a comprehensive list.

## Utils

We have a utils directory containing utilities to be used by both UTs and FVs. See its [readme](./utils/test-utils-readme.md) for more information

## CSS Selectors

CSS selectors are a format for writing queries that match HTML elements. In a similar way to how regex strings are used to search strings for certain patterns, CSS selectors are used to search HTML for elements. They were originally used for picking bits of HTML to style in certain ways, hence their name. We use them heavily in the Electron FVs and React UTs for verifying HTML.

These queries are strings that may have formats like `"#root"` or `".Midbar"`. These strings will be passed to functions that then parse HTML looking for matches.

They aren't very complicated, but it's worth taking a look at the syntax in the [W3 schools reference](https://www.w3schools.com/cssref/css_selectors.asp)

## Locale, language, region and timezone

The OS language and region, which affects language and formatting, are mocked out to be "en-US" in all tests. Timezone cannot be mocked, and tests with checks specific to machine timezone convert the expected output into the local timezone.