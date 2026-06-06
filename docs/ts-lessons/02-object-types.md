# TS Lesson 02 — Object types & interfaces

> **Used in:** [Steps 01.2–01.4](../steps/01-2-title.md) — adding fields to a collection

---

## The one-sentence version

An **object type** describes the shape of an object — which properties
it has, what type each property is, and which ones are optional.

---

## Describing a person

Without TypeScript, an object is just a bag of stuff:

```js
const person = { name: 'Alice', age: 30 }
```

JavaScript doesn't care if you later write `person.naem` (typo) — it
just returns `undefined` at runtime. No warning.

With TypeScript, you describe the shape first:

```ts
type Person = {
  name: string
  age: number
}

const person: Person = { name: 'Alice', age: 30 }

person.naem  // ← red squiggle: Property 'naem' does not exist on type 'Person'
```

The `type Person = { ... }` line creates a **type alias** — a name for
a shape. Then `: Person` on the variable says "this must match that
shape."

---

## `type` vs `interface` — two ways to say the same thing

TypeScript has two syntaxes for object shapes:

```ts
// Using "type" (type alias)
type Person = {
  name: string
  age: number
}

// Using "interface"
interface Person {
  name: string
  age: number
}
```

For everyday use, they're interchangeable. The differences are subtle
and won't matter until much later. Payload's generated types use
`interface`. We'll use both and won't stress about which.

---

## Required vs optional properties

By default, every property in a type is **required**. Miss one and
TypeScript complains:

```ts
type Person = {
  name: string
  age: number
  email: string
}

const alice: Person = { name: 'Alice', age: 30 }
// ← red squiggle: Property 'email' is missing
```

Add a `?` to make a property **optional**:

```ts
type Person = {
  name: string
  age: number
  email?: string   // ← the ? makes it optional
}

const alice: Person = { name: 'Alice', age: 30 }  // ← no error
```

Optional properties can be missing or `undefined`. In Payload's
generated types, non-required fields get `?` and `| null`:

```ts
excerpt?: string | null   // optional AND can be null
```

---

## Nested objects

Objects can contain objects:

```ts
type Address = {
  street: string
  city: string
}

type Person = {
  name: string
  address: Address   // ← nested object type
}

const alice: Person = {
  name: 'Alice',
  address: {
    street: '123 Main St',
    city: 'Quetta',
  },
}
```

You'll see this in Payload constantly. Every field's `admin` block is a
nested object:

```ts
{
  name: 'slug',
  type: 'text',
  admin: {             // ← nested object
    position: 'sidebar',
  },
}
```

TypeScript validates every level of nesting. A typo inside `admin`
gets caught just like a typo at the top level.

---

## Try it yourself

1. Define a `Book` type with: `title` (string), `pages` (number),
   `isbn` (optional string)
2. Create two books — one with isbn, one without
3. Try adding a property that's not in the type (e.g., `color: 'red'`)
4. See the squiggle, then remove it

```ts
type Book = {
  title: string
  pages: number
  isbn?: string
}

const book1: Book = { title: 'TS Handbook', pages: 200, isbn: '123-456' }
const book2: Book = { title: 'JS Guide', pages: 150 }  // no isbn — fine
const book3: Book = { title: 'Bad', pages: 100, color: 'red' }  // ← squiggle
```

---

## What's next

[TS Lesson 03 — Literal types & unions](03-literal-types.md) — how
TypeScript can narrow a value from "any string" to "only these specific
strings."
