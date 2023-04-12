# Automated Testing

## Introduction

In the Electron codebase, we are testing at 3 different scopes:

- UTs in the Node code (Main process)
- UTs in the React code (Renderer process)
- FV tests for the Electron app end-to-end

Both sets of UTs are automatically run in the 'test' stage in Gitlab CI.

For details on testing MaX UC overall (rather than just the UI), start with [this metacom article](https://metacom2.metaswitch.com/confluence/x/VvOVBQ)

## Running tests

Tests can be run with

```cmd
# Run all the tests
npm test

# Run the Electron FVs
npm run test-electron-fv

or see [Electron FV readme](../test/electron-fv/electron-fv-readme.md) for how to run individual tests

# Run the Node UTs
npm run test-node-ut

# Run the React UTs
npm run test-react-ut
```

These commands run `jest` (our chosen test runner) over the relevant folders.

The `node-ut` and `react-ut` commands can pass flags through to Jest by adding a `--` after the command, like so

```cmd
npm run test-react-ut -- -my -jest -flags
```

Some useful flags include:

- `--silent` - supress console output and minimise detail on individual tests.
- `"[pattern or filename]"` - Run only tests that match the pattern or filename

Note: Flags **can not** be passed to `npm test` or `npm run test-electron-fv`. This is because they call Jest via `concurrently`. Hopefully this can be improved in the future.

## Working with the test frameworks

Take a look at the [getting started guide](../test/getting-started.md) for info on usage relevant to all the testing frameworks.

For help using individual frameworks, see their respective READMEs:

- [Node UT readme](../test/node-ut/node-ut-readme.md)
- [React UT readme](../test/react-ut/react-ut-readme.md)
- [Electron FV readme](../test/electron-fv/electron-fv-readme.md)

## Which tests should I write in which framework?

The following kinds of test should use the UT framework:

- Testing Node components and functions
- Testing individual React components
- Testing Redux functions

and these should use the FV framework:

- Testing end-to-end communication through the entire Electron app, from WISPA to the UI
- Testing the UI works as a whole (e.g. multiple React components/Redux working together)

A decision was made that the last of the above should be covered in FV. The other option was to use Enzyme's `Mount` functionality with either a mocked up or real Redux store. Advantages of the FV approach are:

- There's one fewer framework to work with
- It gives us a real Redux store for free

The advantages of the Mount-based approach were:

- It would quite probably be faster than the FVs

We decided that the extra speed was not worth the overhead of an extra framework.

## How many tests should I write?

Knowing when to stop writing UTs or FVs is just as important as knowing which ones to write. After all, you could write infinitely many, but there is a point at which adding more is no longer valuable. That could be zero tests!

To decide whether to write a test...

- First figure out how valuable it is:
  - What bugs will it catch?
  - Will the bugs be caught elsewhere? (e.g. by developers or other frameworks)
  - How much do we mind if the bugs make it to the field?
  - Will this test make debugging easier? (e.g. UTs catching a bug is better than FVs catching it as they give more indication where it is)
- Then figure out the cost associated with having it:
  - Is it going to take a long time to write?
  - Is it going to take a long time to run?
  - How much complexity does it add to our tests as a whole?
  - How hard will it be to maintain? (Depends how much churn there is in the code it tests)

If the value is not worth the cost - then don't write it 😄

If a given file has no UTs at all it should instead have a short doc in the location the UTs would be explaining why there aren't any. This makes it clear that we've deliberately not written any.
