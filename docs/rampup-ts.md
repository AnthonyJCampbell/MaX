# Typescript Ramp-up

To get up and running with Typescript, it's important that you're first reasonably comfortable with JavaScript. After all, Typescript is a superset of JavaScript: all TypeScript code is valid JavaScript. In this guide, we'll lay out a basic curriculum so you can get started with Typescript as soon as possible. If you're not yet familiar with Javascript and the JS-related technologies we use as part of the MaX refresh, please view the rampup materials under `docs/rampup.md`.

## Why Typescript

The main benefit of Typescript is that it helps us in the development of large scale applications written in JavaScript by adding duck typing to JS (which is a notoriously "weakly-typed" language). What's more, it also adds common concepts such as classes, modules, interfaces and generics to JavaScript. So essentially it forces developers to write cleaner code, hopefully resulting in fewer bugs later down the line.

As part of the MaX Refreshers drive, we're going to be writing Typescript in two semi-separate areas: React and Node (as part of the Electron environment). There's a reason for the distinction between the two. In Node, we can essentially write vanilla Javascript/Typescript without any issue. When it comes to React, however, the implementation of React and JSX makes it a bit trickier to use Typescript correctly and requires some extra knowledge.

## About This Guide

This ramp-up guide will consist of the following elements:

- General ramp-up - Covering basic Typescript concepts, typing, writing functions, and best-practices
- React with Typescript - A separate section dealing with writing TS-compatible JSX and Redux, capped off with a small tutorial to help put it all into practice.
- Converting an existing JS codebase to TS - Since TS can be added to a JS codebase incrementally, there's a small section highlighting how we should be going about this
- FAQs & Reference - Links to frequently asked questions & documentation
- Further reading - A number of cheatsheets and other useful resources for help during development.
- Thoughts on TS - Some random thoughts and other important distinctions that are implicit to TS which are good to know for new learners

In total, the mandatory bit of the ramp-up (TS ramp-up, React, Conversion, and Type-Fest) to take ~6 hours if you're completely new to Typescript and anywhere between 3 to 5 hours if you're reasonably familiar with it already. In addition, there's a wealth of information listed under the FAQs, helpful tools, and 'Thinking with Types' sections.

## General TypeScript Ramp-up (~2 hours):

1. 5 min - Start by reading the intro to this document (if you haven't already) and then move on to reading this quick [introduction to TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
2. 30-45 min - Next, read through all the sections of the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html). Open [this editor](https://www.typescriptlang.org/play) in a secondary window and play around with the examples and see what behaviour TS allows and doesn't. You can see the compiled JS output on the right-hand side of your screen to see what TS actually does under the hood. If some things don't make sense just yet, don't worry. The purpose of this is to simply expose you to the way TypeScript looks & to see the difference between vanilla JavaScript and its typed cousin.
   However, if you prefer things in a simpler, to-the-point way (or if you're already familiar with TS), give this blog post a read instead: https://2ality.com/2018/04/type-notation-typescript.html
   - [Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
   - [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
   - [Functions](https://www.typescriptlang.org/docs/handbook/functions.html)
   - [Literal Types](https://www.typescriptlang.org/docs/handbook/literal-types.html)
   - [Unions & Intersection Types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
   - [Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
   - [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
   - [Generics](https://www.typescriptlang.org/docs/handbook/generics.html)
3. 60-90 min - Work through the examples in the [TypeScript Playground](https://www.typescriptlang.org/play). These should each take anywhere between 5 to 10 minutes each. Most of this will be familiar from reading through the handbook. Once again, the point of this is to get exposed to the way TS forces you to write code.
   - JS Essentials:
     - [Hello World](https://www.typescriptlang.org/play/?target=1&q=242#example/hello-world)
     - [Objects & Arrays](https://www.typescriptlang.org/play/?strict=false&q=327#example/objects-and-arrays)
     - [Functions](https://www.typescriptlang.org/play/?noImplicitAny=false&q=366#example/functions)
     - [Code Flow](https://www.typescriptlang.org/play/?strictNullChecks=true&q=501#example/code-flow)
   - Modern JS:
     - [Async/Await](https://www.typescriptlang.org/play/?q=261#example/async-await)
     - [Immutability](https://www.typescriptlang.org/play/?q=381#example/immutability)
     - [Import/Export](https://www.typescriptlang.org/play/?q=200#example/import-export)
   - Functions:
     - [Generic](https://www.typescriptlang.org/play/?q=158#example/generic-functions)
     - [Typing](https://www.typescriptlang.org/play/?q=436#example/typing-functions)
     - [Chaining](https://www.typescriptlang.org/play/?esModuleInterop=true&q=266#example/function-chaining)
   - Frameworks:
     - [TS with Node](https://www.typescriptlang.org/play?useJavaScript=trueq=159#example/typescript-with-node)
4. 10 min (Optional) - If you're still a little iffy on some of the exact details or you just want a quick refresher, read through [this cheat sheet](https://learnxinyminutes.com/docs/typescript/) to get a general idea of how Typescript adds to vanilla Javascript. It'll quickly cover all basic types, functions, inheritance, classes, and much more.

## React With TypeScript (~2-3 hours)

- We're going back to the trusty playground to get our first taste of React with TS: https://www.typescriptlang.org/play?jsx=2&esModuleInterop=true&e=196#example/typescript-with-react
- Next, take a look through [this cheat sheet](https://github.com/typescript-cheatsheets/react)
- Next, watch this ~hour-long video on integrating React with TS. Some of this will be repackaged information, so feel free to skip around here and there. https://www.youtube.com/watch?v=F2JCjVSZlG0
- Optionally, work through this tutorial. (45-60 minutes): https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935

## Converting an existing JS codebase to TS (~30 minutes)

- https://github.com/microsoft/TypeScript-React-Conversion-Guide
- https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
- We don't have to convert the entirety of the project in one go. A good way of doing it is illustrated in: https://dev.to/suhas_chatekar/converting-a-javascript-project-to-typescript-one-file-at-a-time

## Type-Fest (~20 minutes)

Type-Fest, a utility library we use, deserves special mention because of the numerous useful implementations and built-in types it provides. For a good overview of what it offers, please check out the [Github repo](https://github.com/sindresorhus/type-fest) and the README.

A small sample of some of the utilities we have used thus far in the refresh project are:

- `SetOptional` - Create a type that makes the given keys optional.
- `SetRequired` - Create a type that makes the given keys required.
- `RequireAtLeastOne` - Create a type that requires at least one of the given keys.
- `RequireExactlyOne` - Create a type that requires exactly a single key of the given keys and disallows more.

## FAQs / Reference

- Troubleshooting Errors: https://github.com/typescript-cheatsheets/react/blob/main/README.md#troubleshooting-handbook-types
- The mother of all FAQs https://github.com/Microsoft/TypeScript/wiki/FAQ
- Common bugs that aren't bugs: https://github.com/Microsoft/TypeScript/wiki/FAQ#common-bugs-that-arent-bugs
- Typescript documentation: https://www.typescriptlang.org/docs/

## Helpful tools / Cheatsheets / Further reading

- Basic TS cheatsheet for types, setup, FAQ, troubleshooting https://github.com/typescript-cheatsheets/react/blob/main/README.md#basic-cheatsheet-table-of-contents
- Set of advanced types outside the standard bunch provided by TypeScript itself - https://github.com/sindresorhus/type-fest
- Complete guide / Cheatsheet for writing React & Redux in TypeScript https://github.com/piotrwitek/react-redux-typescript-guide. Note that a lot of the examples still use class-based components (and the associated way of connected Redux to a component) instead of Hooks. Therefore, make sure to use the Table of Contents to jump to the relevant parts.
- Best practices for writing React components with TS: https://www.sitepoint.com/react-with-typescript-best-practices/
- If you're looking for a short ~20-minute video on writing React components with Typescript type-checking, check out [this video](https://www.youtube.com/watch?v=Z5iWr6Srsj8)
- When to use `interface` vs `type` https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c
- Setting up TS with Webpack https://webpack.js.org/guides/typescript/
- Advanced TS cheatsheet for writing reusable utilities/functions/render props/HOCs and libraries: https://react-typescript-cheatsheet.netlify.app/docs/advanced/intro/

## Now You're Thinking With ~~Portals~~ Types!

As with any programming language or (in this case) superset, there are some caveats and unique ways of doing things that are particular to the language/framework/thingie. More often than not, these things are not self-evident at first glance. Typescript has its own blend of doing things and requires some special thinking in a couple of cases. Here are some pointers on how to think about TS and how it meshes with the rest of the codebase:

- Types don't exist in runtime. Simply put, Typescript is a development tool we can use to ensure that we write quality code. Whenever we add types, we do so in order to make sure the code we write is good. (The linter and the like help us spot any blindspots) However, all Typescript takes place pre-compilation, which means you can't use types or compare values against specific types at runtime. As soon as the TS gets compiled, it becomes regular old JavaScript, albeit with some added type-checks courtesy of TS. At the end of the day, we're not shipping Typescript code to our clients.
- Some data objects can be both types and values. In TS, there are types (which describe the shape/properties of a piece of data) and "values" (the value for a particular property, usually associated with a type). However, in certain cases a data structure can be used as both a type in type declarations, as well as a value.
