# TS Lesson 08 — Union narrowing & type guards

> **Used in:** [Step 02.7](../steps/02-7-generate-types-relationships.md) — reading relationship union types

---

## The one-sentence version

When a value can be multiple types (`string | number`), you **narrow**
it by checking which type it actually is. After the check, TypeScript
knows the specific type.

---

## The problem

```ts
function printLength(value: string | number) {
  console.log(value.length)
  // ← red squiggle: Property 'length' does not exist on type 'number'
}
```

TypeScript sees `string | number` and says: "this might be a number,
and numbers don't have `.length`." It won't let you access `.length`
until you prove it's a string.

---

## The fix: `typeof` checks

```ts
function printLength(value: string | number) {
  if (typeof value === 'string') {
    // Inside this block, TypeScript KNOWS value is a string
    console.log(value.length)   // ← no squiggle
  } else {
    // Inside this block, TypeScript KNOWS value is a number
    console.log(value.toFixed(2))   // ← no squiggle
  }
}
```

The `typeof value === 'string'` check is called a **type guard**.
TypeScript reads it and narrows the type:

- Before the check: `value` is `string | number`
- Inside the `if`: `value` is `string`
- Inside the `else`: `value` is `number`

TypeScript literally removes options from the union based on your check.

---

## Common type guards

```ts
// Check for string
if (typeof x === 'string') { /* x is string */ }

// Check for number
if (typeof x === 'number') { /* x is number */ }

// Check for null/undefined
if (x !== null && x !== undefined) { /* x is not null/undefined */ }

// Check for object (vs primitive)
if (typeof x === 'object' && x !== null) { /* x is an object */ }

// Check for array
if (Array.isArray(x)) { /* x is an array */ }
```

Each check narrows the type. TypeScript tracks all of them.

---

## Where you see this in Payload

Payload relationship fields generate union types:

```ts
export interface Post {
  category: number | Category    // ID or populated object
}
```

To access `category.title`, you must narrow first:

```ts
// Won't work — TypeScript doesn't know if it's a number or Category
post.category.title   // ← red squiggle

// Works — after the check, TypeScript knows it's a Category
if (typeof post.category === 'object' && post.category !== null) {
  post.category.title   // ← no squiggle
}

// Shorter: check if it's NOT a number
if (typeof post.category !== 'number') {
  post.category.title   // ← no squiggle
}
```

This is the pattern you'll use every time you touch a populated
relationship field.

---

## Narrowing with arrays

For `hasMany` relationships:

```ts
export interface Post {
  tags?: (number | Tag)[] | null
}
```

Use `.filter()` with a type guard to narrow array items:

```ts
if (post.tags) {
  const populated = post.tags.filter(
    (tag): tag is Tag => typeof tag !== 'number'
  )
  // populated is Tag[] — every item is guaranteed to be a Tag
  populated.map(t => t.title)  // ← works
}
```

The `(tag): tag is Tag =>` syntax is a **type predicate** — covered in
the next lesson.

---

## Try it yourself

```ts
// 1. Basic narrowing
function describe(value: string | number): string {
  if (typeof value === 'string') {
    return `Text: ${value.toUpperCase()}`    // string methods work
  }
  return `Number: ${value.toFixed(2)}`       // number methods work
}

// 2. Null check
function greet(name: string | null): string {
  if (name === null) {
    return 'Hello, stranger!'
  }
  return `Hello, ${name.toUpperCase()}!`    // string — safe
}

// 3. Object check (Payload-style)
type User = { id: number; name: string }

function getId(ref: number | User): number {
  if (typeof ref === 'number') {
    return ref                   // it's the ID directly
  }
  return ref.id                  // it's the full object
}
```

---

## What's next

[TS Lesson 09 — Type predicates](09-type-predicates.md) — how to write
your own custom type guard function with `value is T`.
