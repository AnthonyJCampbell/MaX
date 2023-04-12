# Custom ESLint Rules

This directory contains our custom plugin for the linter we use, ESLint. We can add lint rules to this plugin to do whatever we like.

## Adding a new rule

1. Create a new TypeSript file in the `rules/` directory
2. Copy this template into it

```typescript
// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { Rule } from "eslint";
import * as ESTree from "estree";

/**
 * This rule enforces that blah blah blah...
 */
export const myNewRuleName: Rule.RuleModule = {
  create: (context: Rule.RuleContext) => {
      return { /* Rule code goes here */ }
  },
};
```

3. Write your rule code inside the `return` statement (see [how to write a rule](#how-to-write-a-rule))
4. Update `index.js` to `require` your new rule and export it with an appropriate name in `module.exports`. The rule's name should be in `kebab-case` to conform with ESLint syntax
5. Update whichever `eslintrc.yml` file you want to configure your new rule in:

```yaml
plugins:
  - electron-ui
rules:
  electron-ui/my-new-rule-name:
    - error
```
6. Your new rule should start applying to your code in your editor! If not, try these in order:
  - Restart the ESLint server (ctrl+shift+p -> EsLint: Restart EsLint server)
  - Run `npm run lint` and see if that applies your new rule
  - Run `npm install` then try the above again
  - If it's still not applying, check you've got the right ESLint config in `eslintrc.yml` and check that `node_modules/eslint-plugin-electron-ui` contains what you expect

## How to write a rule
Let's use a running example of erroring whenever a function name is longer than 20 characters

  - Figure out what kind of node you want your rule to apply to (that's an Abstract Syntax Tree (AST) node, not Node.js!)
    - Have a look at `NodeListener` in `node_modules/@types/eslint/index.d.ts` to see the available node types
    - See that `FunctionDeclaration` is one of them, we'll use that
  - Add a function call corresponding to the type of node inside the `return` statement.
    - For our example we'd add

    ```typescript
    return {
        FunctionDeclaration(functionNode): void {
            // This code now has access to the AST of the function declaration, i.e. `functionNode`
        }
    }
    ```
  - Write a bunch of logic acting on the AST of that node, calling `context.report()` to raise an error
    - Since the code is in TypeScript your editor will provide good hints on what information you have available in the AST object
    - You can also use the AST explorer, see below
    - For our example:
    ```typescript
    return {
        FunctionDeclaration(functionNode): void {
            if (functionNode.id.name.length > 20) {
                context.report({
                    node: functionNode,
                    message: "Name too long!"
                })
            }
        }
    }
    ```

This [online AST explorer](https://astexplorer.net/) is very useful when figuring out what the AST looks like for code you want to lint and quickly testing rules. It lets you write some code to be linted and a lint rule, then shows you the AST of the code you wrote and whether the lint rule raised any errors.

Check out an existing rule for more info, or read the [this section](https://eslint.org/docs/developer-guide/working-with-rules) of the ESLint docs for a deeper dive.


