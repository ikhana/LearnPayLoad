# TS 04.1 — Arrays

> **Topic 04: Lists & Imports** · Next: [04.2](04-2-import-type.md)

---

## The one-sentence version

An array type says "a list where every item is this type." Write it as
`string[]` or `Array<string>` — same thing.

---

## Basic arrays

```ts
const names: string[] = ['Alice', 'Bob', 'Carol']
const ages: number[] = [25, 30, 35]

names.push('Dave')    // fine
names.push(42)        // ← squiggle: number ≠ string

ages.push(40)         // fine
ages.push('old')      // ← squiggle: string ≠ number
```

---

## Arrays of objects

```ts
type Fruit = { name: string; color: string }

const fruits: Fruit[] = [
  { name: 'Apple', color: 'red' },
  { name: 'Banana', color: 'yellow' },
]

fruits.push({ name: 'Grape' })
// ← squiggle: 'color' is missing
```

In Payload, `fields` is an array of field objects — same idea.

---

## Arrays of unions (parentheses matter!)

```ts
// Array of (string or number) — each item can be either
const a: (string | number)[] = ['hello', 42, 'world', 7]

// A string, OR an array of numbers — very different!
const b: string | number[] = [1, 2, 3]
```

The parentheses change the grouping. Without them, `[]` only applies
to the last type in the union.

---

## Where Payload uses arrays

```ts
defaultColumns: ['title', 'status', 'publishedAt']   // string[]
fields: [{ name: 'title', type: 'text' }]            // Field[]
collections: [Users, Media, Posts]                     // CollectionConfig[]
```

---

## Exercise

> **Create file:** `exercises/04-1-arrays.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 04.1 — Arrays

// 1. Typed array — push wrong type
const colors: string[] = ['red', 'green', 'blue']
colors.push(42)  // ← squiggle — fix it

// 2. Array of objects — missing property
type Todo = { task: string; done: boolean }
const todos: Todo[] = [
  { task: 'Learn TS', done: true },
  { task: 'Learn Payload', done: false },
]
todos.push({ task: 'Ship it' })  // ← squiggle — fix it

// 3. Parentheses matter — explain the difference:
const x: (string | number)[] = ['a', 1]
const y: string | number[] = 'hello'

// 4. Write your own: an array of { name: string; score: number }
//    Push a valid item and an invalid item.
```

Save. See two squiggles. Fix them. When the file is clean, this
lesson is done.
