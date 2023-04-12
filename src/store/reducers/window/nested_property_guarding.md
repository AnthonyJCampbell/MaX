# Nested Property Guarding

In the reducer, we need to pull the `type` up to be a top level field.
TypeScript's type guarding isn't smart enough to work with nested properties, e.g.

```ts
interface A {
  identifiers: {
    type: "a";
  };
  foo: string;
}
interface B {
  identifiers: {
    type: "b";
  };
  bar: number;
}
let x: A | B;
if (x.identifiers.type === "a") {
  console.log(x.foo);
}

// This will result in the following error:
// ❌
// Property 'foo' does not exist on type 'A | B'.
// Property 'foo' does not exist on type 'B'.
```

So instead, we should do:

```ts
interface A {
  type: "a";
  foo: string;
}
interface B {
  type: "b";
  bar: number;
}

let x: A | B;
if (x.type === "a") {
  console.log(x.foo);
}
// ✅
```
