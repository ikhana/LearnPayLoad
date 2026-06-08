# TS 01.2 — Type annotations

> **Topic 01: Foundations** · Prev: [01.1](01-1-what-is-typescript.md) · Next: [01.3](01-3-booleans-and-primitives.md)

---

## The one-sentence version

A type annotation is a label after a colon (`:`) that tells TypeScript
what a variable, parameter, or return value should be.

---

## The three basic types

```ts
let name: string = 'Alice'       // text
let age: number = 30              // any number (integer, decimal, negative)
let isActive: boolean = true      // true or false — nothing else
```

The `: string`, `: number`, `: boolean` are the annotations.

---

## Annotating function parameters

```ts
function greet(name: string): string {
  return `Hello, ${name}!`
}

greet('Alice')  // fine
greet(42)       // ← red squiggle: number is not string
```

`: string` after `name` = "this parameter must be a string."
`: string` after `)` = "this function returns a string."

---

## Annotating with a complex type

```ts
import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [],
}
```

`: CollectionConfig` = "this object must match Payload's collection
shape." Misspell a property → red squiggle.

---

## Exercise

> **Create file:** `exercises/01-2-annotations.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 01.2 — Type annotations

// 1. Annotate these variables — which squiggle?
let city: string = 'Quetta'
let population: number = '1 million'   // ← squiggle
let isCapital: boolean = 'false'       // ← squiggle

// 2. Fix both squiggles above

// 3. Annotate a function's params and return type
function double(x: number): number {
  return x * 2
}

double('ten')  // ← squiggle — fix it

// 4. Write your own: a function that takes a string and returns its length
```

Save. See three squiggles. Fix each one. When the file has zero
squiggles, this lesson is done.
