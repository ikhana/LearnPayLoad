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

## Try it yourself

Type these lines and watch for squiggles:

```ts
let city: string = 'Quetta'
let population: number = '1 million'   // ← squiggle
let isCapital: boolean = 'false'       // ← squiggle

function double(x: number): number {
  return x * 2
}

double('ten')  // ← squiggle
```

Fix each one. The fixes are obvious — that's the point.
