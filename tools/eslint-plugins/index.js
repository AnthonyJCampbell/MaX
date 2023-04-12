// Copyright 2021 Metaswitch Networks - Highly Confidential Material

// ESLint runs a Node process. Node can't execute TypeScript directly.
//
// So, to run ESLint rules written in TypeScript we must set up a TypeScript compiler to convert
// them to JavaScript on the fly as they are required. Any `require` statements after this one can
// safely bring in TypeScript code.
//
// We specify `CommonJS` to allow use of `import/export` syntax in the TypeScript.
require("ts-node").register({ compilerOptions: { module: "CommonJS" } });

const { contextComments } = require("./rules/context-comments");

module.exports = {
  rules: {
    "context-comments": contextComments,
  },
};
