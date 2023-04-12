# Node UT Testing

This README details how to work with the Node UT framework. For a general overview of testing MaX UC UI, see `docs/testing.md`.

## Introduction

The Node unit tests focus on the Main process.

IPC calls to the renderer process are mocked out. Calls to/from WISPA are not explicitly mocked out, instead the UTs directly call the callbacks associated with certain WISPA events and pass in data of the correct format.

There are no special modules required to test this as it's all vanilla JavaScript. The most complex thing is mocking module imports with Jest. See `test/getting-started.md` for more info on Jest.

## Running the tests

The tests can be run with `npm run test-node-ut`

To run specific test files, run with `npx jest test/node-ut/path/to/file`

To further specify to a single *Describe/It* statement, run with `npx jest test/node-ut/path/to/file -t "statement"`

## Adding tests

### Scope

Node UTs should generally treat Data Fan/Guardian/Pane Control as black boxes. For example, call a callback within one of the components, then verify that the correct WISPA or IPC calls are made.

There may be some value testing individual functions that are complex and unlikely to change, although this will not be the norm.

Any files that have no UTs added should instead have a .md file explaining why no UTs have been added (so far).

The UTs should also cover any flows that involve multiple Node components working together.

### Rampup

Here are some useful articles to help you create Node tests:

- [Mocking Node modules](https://jestjs.io/docs/en/manual-mocks#mocking-node-modules)

## Infrastructure

In Gitlab CI, the tests run in a headless environment, so some classes and functions that would be provided by the browser are not available in JSDOM (the DOM implementation used by JEST).  Therefore we need to provide dummy implementations for those classes/methods, or mock around them so we don't need to import them at all.  Initially we used jest-runner/electron to do this, but that has it's own complex dependency requirements for the gitlab runner.