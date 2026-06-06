# TS Lesson 07 — Generics

> **Used in:** [Step 02.2](../steps/02-2-categories-fields.md) — understanding `Array<T>` and how Payload types fields

---

## The one-sentence version

A **generic type** is a type with a fill-in-the-blank slot. You write
the type once, then fill in the blank each time you use it.

---

## The labeled box

Imagine a shipping box. You can put anything in it — shoes, books,
dishes. But once you label it "Books," everyone knows what's inside:

```ts
type Box<T> = {
  label: string
  contents: T
}
```

The `<T>` is the blank. `T` stands for "whatever type you fill in":

```ts
const shoeBox: Box<string> = {
  label: 'Running shoes',
  contents: 'Nike Air Max',    // T is string → contents must be string
}

const ageBox: Box<number> = {
  label: 'My age',
  contents: 30,                // T is number → contents must be number
}

const ageBox2: Box<number> = {
  label: 'My age',
  contents: 'thirty',         // ← red squiggle: string ≠ number
}
```

One type definition (`Box<T>`), infinite uses. Each use fills in `T`
with a concrete type.

---

## You already know one generic: `Array`

```ts
const names: Array<string> = ['Alice', 'Bob']
const ages: Array<number> = [25, 30]
```

`Array<string>` means "an Array where T is string — every item is a
string." The shorthand `string[]` is the same thing — just syntactic
sugar.

```ts
// These are identical:
const a: string[] = ['hello']
const b: Array<string> = ['hello']
```

---

## Reading the `<T>` — it's just a parameter

Think of generics like functions, but for types:

```ts
// A function takes a VALUE parameter:
function double(x: number): number {
  return x * 2
}
double(5)  // fill in x = 5

// A generic type takes a TYPE parameter:
type Box<T> = { contents: T }
Box<string>  // fill in T = string
```

The `<T>` is the type parameter. `T` is a convention — you can use any
name (`<Item>`, `<Value>`, `<Data>`), but single uppercase letters
(`T`, `U`, `K`, `V`) are the tradition.

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
```

You'll see this in Payload's internal types, but you rarely need to
write multi-parameter generics yourself.

---

## Where generics show up in Payload

Payload defines specific field types as generics internally:

```ts
// Simplified — Payload's actual types are more complex
type RelationshipField = {
  type: 'relationship'
  relationTo: string    // which collection
  hasMany?: boolean
  // ...
}
```

And the generated `Post` interface uses union types that reflect the
generic relationship:

```ts
category: number | Category       // T = Category
tags?: (number | Tag)[] | null    // Array of T = Tag
```

The `number |` part is because of depth — at depth 0 you get an ID
(number), at depth 1+ you get the full object. The union covers both.

---

## The key insight

Generics let you write **one type that works for many situations**.
Without generics, you'd need `StringArray`, `NumberArray`,
`PersonArray` — one per element type. With generics, `Array<T>` handles
them all.

You won't write your own generics often. But you'll *read* them
constantly — in Payload's types, in generated code, in library
definitions. Understanding the `<T>` pattern unlocks all of it.

---

## Try it yourself

```ts
// 1. Make a generic "Wrapper"
type Wrapper<T> = {
  value: T
  timestamp: number
}

const w1: Wrapper<string> = { value: 'hello', timestamp: Date.now() }
const w2: Wrapper<boolean> = { value: true, timestamp: Date.now() }
const w3: Wrapper<boolean> = { value: 'yes', timestamp: Date.now() }
// ← squiggle on w3: 'yes' is not boolean

// 2. Confirm Array<T> ≡ T[]
const x: Array<string> = ['a', 'b']
const y: string[] = ['a', 'b']
// Both are the same type

// 3. Try a Pair
type Pair<A, B> = { first: A; second: B }
const p: Pair<string, number> = { first: 'age', second: 30 }
```

---

## What's next

[TS Lesson 08 — Union narrowing & type guards](08-narrowing.md) — how
to tell TypeScript which branch of a union you're in, so it stops
complaining about "might be a number."
