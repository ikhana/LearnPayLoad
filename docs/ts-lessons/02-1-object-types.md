# TS 02.1 — Object types & `type` aliases

> **Topic 02: Object Shapes** · Next: [02.2](02-2-interfaces.md)

---

## The one-sentence version

An **object type** describes which properties an object has and what
type each property holds.

---

## Describing a person

Without TypeScript:

```ts
const person = { name: 'Alice', age: 30 }
person.naem  // ← no error at compile time, just undefined at runtime
```

With TypeScript:

```ts
type Person = {
  name: string
  age: number
}

const person: Person = { name: 'Alice', age: 30 }
person.naem  // ← red squiggle: 'naem' doesn't exist on Person
```

---

## The `type` keyword

`type` creates a **type alias** — a name for a shape:

```ts
type Color = string
type Point = { x: number; y: number }
type Status = 'draft' | 'published'
```

Once defined, use it like any other type:

```ts
const p: Point = { x: 10, y: 20 }
```

---

## Missing properties = error

```ts
type Person = {
  name: string
  age: number
  email: string
}

const alice: Person = { name: 'Alice', age: 30 }
// ← squiggle: 'email' is missing
```

Every property is required by default. (Optional comes in lesson 02.4.)

---

## Extra properties = error

```ts
const bob: Person = { name: 'Bob', age: 25, email: 'b@x.com', color: 'red' }
// ← squiggle: 'color' does not exist on type 'Person'
```

TypeScript is strict both ways — nothing missing, nothing extra.

---

## Try it yourself

```ts
// 1. Define a Book type
type Book = {
  title: string
  pages: number
  author: string
}

// 2. Create a valid book
const book1: Book = { title: 'TS Guide', pages: 200, author: 'Alice' }

// 3. Try missing a property
const book2: Book = { title: 'JS Guide', pages: 150 }
// ← squiggle: 'author' is missing

// 4. Try adding an extra property
const book3: Book = { title: 'Bad', pages: 100, author: 'Bob', color: 'red' }
// ← squiggle: 'color' doesn't exist on Book
```
