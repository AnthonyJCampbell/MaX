# Coding Standards

The majority of our coding standards so far are simply "what the linter and formatter enforce". Your pipeline will fail if code is non-compliant. See our [tooling doc](./tooling.md) for setting up VS Code to autoformat and warn you of linter errors.

## Design standards

We have some general principles around UI design that should be taken into consideration when assessing wireframes. These can be found in the [UI limitations](./ui_limitations.md) documentation.

## Extra standards

We have a loose collection of extra standards that aren't (yet) enforced by tooling:

**Within `src/`, you should not use `..` in an import path.** This is to make the imports easier to read and refactor if files move around. We have aliases set up (see `_moduleAliases` in [package.json](../package.json)) which can use as a root directory to drill down to instead of drilling up first with a chain of `..`s

```javascript
import "someString" from "../../../utils/strings"  // Bad
import "someString" from "src/shared/utils/strings"  // Good
```
