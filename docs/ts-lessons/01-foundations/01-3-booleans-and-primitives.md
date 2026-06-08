# TS 01.3 — Booleans & primitives

> **Topic 01: Foundations** · Prev: [01.2](01-2-type-annotations.md) · Next: [02.1](../02-object-shapes/02-1-object-types.md)

---

## The one-sentence version

TypeScript has five **primitive types** — `string`, `number`, `boolean`,
`null`, `undefined`. Booleans are the simplest: only `true` or `false`.

---

## The five primitives

```ts
let name: string = 'Alice'        // text
let age: number = 30               // any number
let active: boolean = true         // true or false
let empty: null = null             // intentionally empty
let missing: undefined = undefined // not yet assigned
```

Each one is a single, atomic value — no internal structure.

---

## Booleans: only two values

```ts
let isOpen: boolean = true    // fine
isOpen = false                 // fine
isOpen = 'yes'                 // ← squiggle: string ≠ boolean
isOpen = 1                     // ← squiggle: number ≠ boolean
isOpen = 'true'                // ← squiggle: string 'true' ≠ boolean true
```

The most common beginner mistake: `'true'` (a string) vs `true` (a
boolean). They look similar but are different types entirely.

---

## Where you see this in Payload

```ts
{
  name: 'slug',
  type: 'text',
  unique: true,      // boolean
  index: true,       // boolean
  required: true,    // boolean
}
```

Every `true`/`false` option on a Payload field is typed as `boolean`.
Write `unique: 'true'` (string) and TypeScript catches it immediately.

---

## Exercise

> **Create file:** `exercises/01-3-booleans.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 01.3 — Booleans & primitives

// 1. Which of these are valid? Predict, then check.
let a: boolean = true          // ?
let b: boolean = false         // ?
let c: boolean = 'true'        // ?
let d: boolean = 0             // ?
let e: boolean = null          // ?

// 2. Fix every squiggle above

// 3. Payload test — spot the bug
const field = {
  name: 'featured',
  type: 'checkbox',
  required: 'true',    // ← squiggle — fix it
}

// 4. Write one of each primitive type:
//    string, number, boolean, null, undefined
```

Save. Fix every squiggle. When the file is clean, this lesson is done.
