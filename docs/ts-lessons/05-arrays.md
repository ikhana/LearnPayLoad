# TS Lesson 05 — Arrays

> **Used in:** [Step 01.9](../steps/01-9-admin-polish.md) — `defaultColumns`, `options` arrays

---

## The one-sentence version

An array type says "a list where every item is this type." Write it as
`string[]` or `Array<string>` — they mean the same thing.

---

## The two syntaxes

```ts
// Shorthand (more common)
const names: string[] = ['Alice', 'Bob', 'Carol']

// Generic syntax (same thing, just longer)
const names: Array<string> = ['Alice', 'Bob', 'Carol']
```

Both compile to the same JavaScript. Use whichever reads better. Most
Payload code uses the `string[]` shorthand.

---

## Arrays enforce element types

```ts
const ages: number[] = [25, 30, 35]
ages.push(40)       // fine — 40 is a number
ages.push('old')    // ← red squiggle: string is not a number
```

Every item must match the declared type. You can't sneak a string into
a `number[]`.

---

## Arrays of objects

Arrays can hold objects too:

```ts
type Fruit = {
  name: string
  color: string
}

const fruits: Fruit[] = [
  { name: 'Apple', color: 'red' },
  { name: 'Banana', color: 'yellow' },
]

fruits.push({ name: 'Grape' })
// ← red squiggle: Property 'color' is missing
```

In Payload, the `fields` array is exactly this — an array of field
objects, where each object must match one of Payload's field shapes.

---

## Arrays of unions

An array can hold a union type:

```ts
const ids: (string | number)[] = ['abc', 123, 'def', 456]
```

The parentheses matter (we'll cover this more in lesson 07):

```ts
(string | number)[]   // array of (string or number) — each item can be either
string | number[]     // a string, OR an array of numbers — very different!
```

---

## Where you see arrays in Payload

```ts
// defaultColumns — array of strings
defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt']

// options — array of objects
options: [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]

// fields — array of field objects
fields: [
  { name: 'title', type: 'text' },
  { name: 'slug', type: 'text' },
]

// collections — array of CollectionConfig objects
collections: [Users, Media, Posts]
```

Every one of these is a typed array. Add an item of the wrong shape
and TypeScript catches it.

---

## Try it yourself

```ts
// 1. Create a string array
const colors: string[] = ['red', 'green', 'blue']
colors.push(42)  // ← squiggle

// 2. Create an array of objects
type Todo = { task: string; done: boolean }
const todos: Todo[] = [
  { task: 'Learn TS', done: true },
  { task: 'Learn Payload', done: false },
]
todos.push({ task: 'Ship it' })  // ← squiggle: missing 'done'

// 3. Try the parentheses difference
const a: (string | number)[] = ['hello', 42]     // array of mixed items
const b: string | number[] = [1, 2, 3]           // number array (or a string)
```

---

## What's next

[TS Lesson 06 — `import type`](06-import-type.md) — why we import types
differently from regular code, and what happens at compile time.
