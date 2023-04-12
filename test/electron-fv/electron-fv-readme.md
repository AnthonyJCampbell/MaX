# Electron FV testing

This README details how to work with the Electron FV framework. For a general overview of testing MaX UC UI, see `docs/testing.md`.

## Introduction

The Electron FV framework tests the Electron app in isolation. In particular this means:

- WISPA is mocked out
- The HTML displayed by the app is verified (rather than verifying that e.g. functions are called with certain parameters).

The main library used to achieve this is [Spectron](https://www.electronjs.org/spectron). Tests are driven by [Jest](https://jestjs.io/).

The tests rely heavily on mock WISPA (`test/utils/mock-wispa.js`) and the _UI Interface_ (readme at `test/electron-fv/utils/interface-readme.md`)

## Running the tests

The tests can be run with `npm run test-electron-fv`.

Inidividual suites (files) or components (describe blocks) can be run by adding them to the `specificTestsToRun` array in [run-fvs.test.ts](./run-fvs.test.ts).
Individual tests can be run by changing `it(...)` to `it.only(...)`. Having multiple `it.only(...)` calls will run all those tests and no others.

Application logs, along with WebDriver process logs, will appear in `%appdata%/max_uc_react/fv`.

Other data files will appear in `%localappdata%/Temp` in a folder beginning with `scoped_dir`. These aren't expected to be important.

### Test success
We use concurrently to run the React process and the test suite process.  The exit code from the 1st process to end is then considered the code for the whole test.  However, the React process often gives the wrong value!  Therefore we check that the Jest test process outputs a test completion message before we consider it a succcess in CI.  For local tests, the output on screen is sufficient, so all we do there is ensure the output is shown.

## Organisation into suites and components
This section covers how our tests are split up into components and suites. See the [test frameworks readme](../test-frameworks-readme.md#suites,-components-and-tests) for details on what suites/components are.

Tests are split into suites based on the function of the app they interact with. E.g. there is a suite for "calls". This will include tests covering a range of areas, e.g.
- Behaviour (Answering, ringing, hanging up)
- UI contents (The in-call header panel contains the right buttons, incoming call window pops up)
- Accessibility (Can use keyboard to navigate around in-call header panel)

One of these suites covers "idle" and mostly involves navigation around the app.

If these suites get too large (>20 tests is a good rule of thumb) they are made into directories. These directories then contain suites which are split-up sensibly. This may vary depending on which function is under test. E.g. suites could be separated by the type of test as listed above, or by which geographical section of the app is being tested.

Tests should be grouped into components within a suite. There are no hard and fast rules on how this should be done, but there are some guidelines:
- Tests that share setup probably belong in the same component
- The name of the component followed by the name of the test should give a clear indication of what the test is covering

Note - It's possible to have components within components

## Adding tests

### Rampup

This section covers general information you should know before adding tests

There are 4 main tools you should be familiar with before adding tests:

1. [_Spectron_](#1.-spectron) - Tool for launching and interacting with Electron apps
2. [_Webdriver_](#2.-Webdriver) - Tool for interacting with HTML docs. Exposed by Spectron
3. [_UI Interface_](#3.-ui-interface) - Utility for interacting with the UI. Enables writing clear tests
4. [_Mock WISPA_](#4.-mock-wispa) - Utility for mocking WISPA

It's also worth being familiar with [Promises](https://javascript.info/promise-basics) and [async/await](https://javascript.info/async)

#### 1. Spectron

Spectron itself is fairly straightforward. It handles launching the app, then provides a bunch of utilities for interacting with it. You won't interact with it very much.

#### 2. Webdriver

Spectron relies on [Webdriver](http://v4.webdriver.io/) for verifying HTML. The core Webdriver API object (`browser`) is accessible via Spectron as `app.client`. The [API docs](http://v6.webdriver.io/docs/api.html) are a key resource - there's plenty you can do with it. See the [Webdriver reference](#section-methods-reference) below.

Many Webdriver commands involve performing some action on/with a specific section of the UI. These sections can be described either by an **XPath** or as a **WebDriver Element**. An XPath specifies the series of HTML elements that leads to the one you're trying to describe. A Webdriver element is, unsurprisingly, specific to Webdriver. The internals aren't relevant.

In the majority of cases these operations are asynchronous and return Promises. Hence any tests using Webdriver should be `async` and you should typically `await` Webdriver commands resolving.

Any Webdriver command that involves passing an XPath or Webdriver Element should not be called directly, instead they should be called on the `Section` objects provided by the `UI interface`, see [UI Interface](#ui-interface) below

#### 3. UI Interface

The UI interface allows users to identify logical "sections" of the app by drilling down, e.g. `UI.sidebar.contactsTabButton`. Webdriver methods can then be called on any section and some have custom methods attached, e.g. `contactList` has a custom method for returning all its contacts as sections.

Any interaction with the UI should be done via the UI interface.

For full usage details, see [the UI interface README](../utils/ui/ui-interface-readme.md)

#### 4. Mock WISPA

The FVs use a mock WISPA to send data to the client. This is a high level mock that actually connects with the client over `socket.io` and goes through register flows etc. It can be programmed to reply with data the client requests, or be triggered to send data independently.

For usage details see the `MockWispa` class [docstring](../utils/mock-wispa/mock-wispa.js)

### Setup and teardown
Here are details of what should happen in setup/teardown functions. See the [test frameworks readme](../test-frameworks-readme.md#setup-and-teardown) for general information on these functions.

Each component will use some or all of these functions. Follow these guidelines on which each should contain:
- `beforeAll()`:
  - Launch the app with `await startApplication()`
  - Increase the timeout after which Jest will mark a test as failed - useful for a componenet where tests are going to take longer for valid reasons. `jest.setTimeout(x)`
- `beforeEach()` typically has the most responsibility. Generally stick to this order:
  - Reset mock WISPA: `mockWispa.reset()`
  - Configure mock WISPA: `mockWispa.data.contacts = [...]`
  - Refresh the app to clear any previous state: `app.client.refresh()`. This will cause it to fetch up-to-date data from mock WISPA
  - Interact with the app. Any setup common to all tests in the scope that involves e.g. clicking on the app
- `afterEach()` rarely has anything in it. Any resetting that isn't covered by `beforeEach()`
- `afterAll()`:
  - Stop the app with `await stopApplication()`
  - Reset the Jest timeout if it was changed in `beforeAll()` - `jest.setTimeout(defaultTestTimeout)`

### Common areas to test
When deciding what tests you should add, consider the following areas:
- **Accessibility** - All function needs to be accessible. Spectron's builtin accessibility audit is carried out after each test.

## Further resources

### Spectron

[This tutorial](https://livebook.manning.com/book/electron-in-action/chapter-13/) goes into more detail on practical use of Spectron and gives a good overview of its APIs.

### Section methods reference

The [Webdriver API](http://v6.webdriver.io/docs/api.html) is the goto resource for everything you can do with webdriver. It explains things reasonably well. Custom methods can be found defined on their respective sections in [UI-interface](../utils/ui/ui-interface.js).

Some key methods that may be useful are listed here:

#### Webdriver

- `getHTML()` - Gets all HTML of a section as a string. Useful for verifying something hasn't changed
- `getText()` - Gets all visible text within a section

#### Custom

- `click()` - Thin wrapper to log the action before calling the Webdriver click method above
- `isVisible()` - Checks whether a section is visible
- `pressKey()` - press a key or key combination

## Accessibility

Tests should call `auditAccessibility()` when a new part of the UI is shown, at a minimum when the test completes (i.e. in `afterAll()`).  This only checks the current UI, so it should be called when each part of the UI is shown.  Obviously, it needn't be called for the same bit of UI in multiple tests.

## Maintenance

It's quite easy to write FV tests that intermittently fail, sometimes very rarely. We do two things to counteract this:
1. Automatically retry the FV job in CI once if it fails. This means the job needs to fail twice in a row for a pipeline to fail
2. Run 100 FV jobs over the weekend to find flakey tests (without the above retries). Action is taken if either of the following are true:
  - **A single test fails twice or more.** Someone will be designated to fix the test, probably whoever touched it last.
  - **More than 10 jobs fail.** This is a guesstimate of a good balance for the FVs overall flakiness. Making them very robust is expensive, but making them not robust enough wastes people's time with false negatives. If the probability of a job failing is 10%, and it has 1 retry, then only 1% of pipelines will fail because of it (i.e. get two failed jobs in a row). Given these can still be manually retried, that seems fine. So, if more than 10 fail, then some of the failing tests need to be made more robust, even if they each only fail once.

## Troubleshooting

### Sleeping

If you are debugging, and want to keep the app window open for inspection, or pause between commands, use the `pause` utility, imported from `utils.js`.

E.g. to pause for 20 seconds (20000ms):

```js
await pause(20000);
```

### Random things keep claiming they're undefined

Make sure you're `await`ing any `async` functions you call, there are lots of them in this framework due to the async nature of Webdriver.

Also note you can't await an entire chain of async function calls all at once. E.g. to get the name of the first contact in the contact list we use `.contacts()` and `.name()`, both of which are async. The following won't work:

```js
await UI.midbar.contactList.contacts()[0].name();
```

It has to be

```js
await (await UI.midbar.contactList.contacts())[0].name();
```

### Odd and intermittent failures and differences between tests run locally and via CI

This is likely to be that the app isn't in the correct state due to timing windows.  Similar to the above item about awaiting, many methods, e.g. `isVisible()` will return as soon as they can provide an answer, but often the test needs a particular value, so you need to `waitForCondition()` to poll up to a timeout.  Likewise, use `expectWithinTimeout()` rather than just expecting something.

### Stale element reference exceptions

This is typically caused by the app rerendering and attempts to access an element in the time window in which it doesn't exist.  Once the offending line is found, the exception can be swallowed and the access re-attempted a couple of times until it works.  More than a couple arguably means that there is a bigger problem with the UI rerendering too often.

### Error: no such window: target window already closed

This is likely due to an async Webdriver method happening after the window has been closed (due to the test completing).  This has been seen due to calling `async` methods without using the `await` keyword to delay the test until it completes.

### App focus gotcha

Watch out if you are testing code that behaves differently depending on whether the app is in focus or not: CI pipelines always run with the app in focus, but you can remove focus running FV tests locally.

### ESLint error `Promises must be handled appropriately.`

You've forgotten to `await` an `async` function call.