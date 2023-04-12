# Automated Visual Regression Test with BackstopJS

## Introduction

An automated visual regression test is a way to test a set of defined scenarios, and test them UI only, how they are rendered and so on.

Imagine the following scenario:

1. Dev makes a change on component / screen A.
2. Test session is run and focused on component / screen A.
3. But then, when the code is released, we find out that component / screen Z got broken.

The goal of an Automated Visual Regression Test is to minimise drastically the ocurrences of the above scenario, also named as Regression Bugs.

We are using the following libraries to achieve this goal:

* Storybook
  * Storybook generates as output, pages with our components isolated as well as whole screen isolated. All of that with mocked state.
* BackstopJS
  * This itself, generates screenshots of the current output of Storybook and compare them with the checked in code screenshot reference images.
  * The comparison is pixel by pixel
  * Finally, a report is given showing up the sucess cases, and the failed cases.

## Running a test on all pages and components

Run the following command in some terminal that is capable of executing Unix commands
(the Windows command prompt is not sufficient, but a git-bash one probably is):

```bash
npm run backstop:test
```

When it finishes, it will open the report in a new tab of your browser. But, if you want to open it manually later on, you can find the report here: `backstop/output/html_report/index.html`

## Running a test for specific Storybook stories (faster)

First, you need to have Storybook running. If you don't know how, read the `docs/storybook.md` documentation.

With Storybook running, you need to find out what is the story ids you want to test. For that, click in the story you are interested and look at the URL.

Imagine the URL you want to test is this one here: `http://localhost:6006/?path=/story/components-incallheaderpanel--gandalf`

The story id is the text after `/story/`, in the above case it is: `components-incallheaderpanel--gandalf`

Finally, run Backstop like this:

```bash
npm run backstop:test-local --stories=components-incallheaderpanel--gandalf
```

You can grab as many ids as you want. If you have more than one, separate them with comma:

```bash
npm run backstop:test-local --stories=components-incallheaderpanel--gandalf,components-incallheaderpanel--gandalf-main-window-blurred
```

## Fixing broken tests

If you have run the tests, and it fails with couple of stories broken you must do the following:

1. Is this a regression bug (aka: undesired change)? If so, fix your code, and then run the Backstop test again.

2. You must fix **all the regression bugs** first.

3. If there are still remaining failing tests, which MUST be desired UI changes, then you can approve those changes.

## Approving all UI changes

Run the following command in the terminal:

```bash
npm run backstop:approve
```

Then, you must commit the reference images to the remote (gitlab).

## Approving specific stories UI changes

On the same way described for running Backstop for specific stories, you must have Storybook running first.

Then you must pick the story id you want to approve.

Finally, just run the following command in the terminal:

```bash
npm run backstop:approve-local --stories=<storyId-comma-separated>
```

## Troubleshooting CI pipeline issues

If the pipeline `visual_regression_tests` fails, you can open the report into: `Jobs artifacts -> Browse -> backstop -> output -> html_report -> index.html`.

But, if you are a contractor and don't have access to the pages served into gitlab, download the artifactory folder of `backstop` (it must be at this level, otherwise it won't have the images), and open the `index.html` in your browser.

### Common cases when it will be a false negative scenario

**The broken story is using emojis or non-alphabetic characters**

* Why this works locally, but fails at CI?
  * Because the fonts you have installed locally are different from the fonts that we have in our CI

* **Resolution:**
  * **Quick fix:** change your story mocks to not use the problematic emoji or to not have the non-alphabetic characters.
  * **Proper fix:** we should install the same win10 default fonts into our CI windows runner. Or, instead of relying on OS fonts, we should always use our own.
