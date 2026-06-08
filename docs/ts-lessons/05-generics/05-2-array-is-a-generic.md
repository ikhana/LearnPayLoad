# TS 05.2 — `Array<T>` — a generic you already know

> **Topic 05: Generics** · Prev: [05.1](05-1-what-are-generics.md) · Next: [05.3](05-3-generics-in-payload.md)

---

## The one-sentence version

`Array<string>` and `string[]` are the exact same type. The first
uses generic syntax; the second is shorthand.

---

## The two syntaxes

```ts
const a: Array<string> = ['hello', 'world']
const b: string[] = ['hello', 'world']
// Identical. Use whichever reads better.
```

`Array` is a built-in generic type. `<string>` fills in the blank:
"an Array where every item is a string."

---

## Multiple type parameters

A generic can have more than one slot:

```ts
type Pair<A, B> = {
  first: A
  second: B
}

const nameAge: Pair<string, number> = {
  first: 'Alice',
  second: 30,
}

const coords: Pair<number, number> = {
  first: 10,
  second: 20,
}
```

`<A, B>` = two blanks. Fill both in when you use it.

---

## Built-in generics you'll see

```ts
Array<string>         // array of strings
Promise<number>       // a promise that resolves to a number
Record<string, any>   // an object with string keys and any values
Map<string, number>   // a map from strings to numbers
```

You don't need to memorize these now. Just recognize the `<T>` pattern
when you see it — it always means "fill in the blank."

---

## Exercise

> **Create file:** `exercises/05-2-array-generic.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 05.2 — Array<T> — a generic you already know

// 1. Confirm they're the same
const x: Array<number> = [1, 2, 3]
const y: number[] = [1, 2, 3]

// 2. Try a Pair — two type parameters
type Pair<A, B> = { first: A; second: B }

const p1: Pair<string, boolean> = { first: 'done', second: true }
const p2: Pair<string, boolean> = { first: 'done', second: 42 }
// ← squiggle on p2 — fix it

// 3. Array of a custom type
type Tag = { id: number; title: string }
const tags: Array<Tag> = [
  { id: 1, title: 'react' },
  { id: 2, title: 'typescript' },
]

// 4. Define a Triple<A, B, C> with first, second, third
```

Save. See the squiggle on p2. Fix it. When the file is clean, this
lesson is done.
