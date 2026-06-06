# TS Lesson 01 — Type annotations

> **Used in:** [Step 01.1 — Skeleton Posts collection](../steps/01-1-skeleton.md)

---

## The one-sentence version

A type annotation is a label you write after a colon (`:`) that tells
TypeScript what a variable, parameter, or return value should be.

---

## The three basic types

TypeScript has many types, but everything starts with these three:

```ts
let name: string = 'Alice'       // text
let age: number = 30              // any number (integer, decimal, negative)
let isActive: boolean = true      // true or false — nothing else
```

The `: string`, `: number`, `: boolean` parts are the annotations.
Remove them and TypeScript still works — it *infers* the type from the
value. But writing them explicitly is clearer, especially when learning.

---

## Annotating function parameters

Functions are where annotations matter most. Without them, TypeScript
has no idea what you'll pass in:

```ts
// Without annotations — TypeScript doesn't know what greeting expects
function greet(name) {
  return `Hello, ${name}!`
}

// With annotations — TypeScript knows name is a string
function greet(name: string): string {
  return `Hello, ${name}!`
}
```

The `: string` after `name` says "this parameter must be a string."
The `: string` after the `)` says "this function returns a string."

Now try calling it wrong:

```ts
greet(42)  // ← red squiggle: number is not assignable to string
```

TypeScript catches it before you run the code.

---

## Annotating variables with complex types

You can annotate a variable with a type that someone else defined:

```ts
import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [],
}
```

`: CollectionConfig` says "this object must match the shape that Payload
defined for a collection." If you add a property that doesn't exist on
`CollectionConfig`, or misspell one, or use the wrong value type —
red squiggle.

That's the entire mechanism behind Payload's type safety. One
annotation, and your editor knows every valid property and value.

---

## `import type` — labels that disappear

```ts
import type { CollectionConfig } from 'payload'
```

The `type` keyword tells TypeScript: "I'm importing a label, not actual
code." At compile time, this import vanishes completely — it produces
zero JavaScript. It's scaffolding for the compiler, nothing more.

Use `import type` whenever you're importing something that only exists
as a type annotation (interfaces, type aliases). It makes your intent
clear and keeps your runtime bundle clean.

---

## Try it yourself

1. Open a blank `.ts` file
2. Type these lines and watch for squiggles:

```ts
let city: string = 'Quetta'
let population: number = '1 million'   // ← squiggle: string ≠ number
let isCapital: boolean = 'false'       // ← squiggle: string ≠ boolean

function double(x: number): number {
  return x * 2
}

double('ten')  // ← squiggle: string ≠ number
```

3. Fix each squiggle. The fixes are obvious once you see them — that's
   the point. TypeScript tells you what's wrong *and* what it expected.

---

## What's next

[TS Lesson 02 — Object types & interfaces](02-object-types.md) — how
to describe the shape of an entire object, not just a single value.
