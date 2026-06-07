# TS 05.3 — Generics in Payload

> **Topic 05: Generics** · Prev: [05.2](05-2-array-is-a-generic.md) · Next: [06.1](06-1-the-narrowing-problem.md)

---

## The one-sentence version

Payload uses generics internally for field types. The generated types
use union types that reflect relationship depth behavior.

---

## Payload's field types are specific shapes

Payload defines a type for each field kind:

```ts
// Simplified versions — Payload's real types are more complex
type TextField = { name: string; type: 'text'; required?: boolean; ... }
type RelationshipField = { name: string; type: 'relationship'; relationTo: string; hasMany?: boolean; ... }
type SelectField = { name: string; type: 'select'; options: ...; ... }
```

When you write `type: 'text'`, TypeScript narrows to `TextField` and
only allows text-specific options. Write `type: 'relationship'` and it
narrows to `RelationshipField` — now `relationTo` is valid.

---

## How `hasMany` changes the generated type

Without `hasMany`:
```ts
category: number | Category    // single value
```

With `hasMany: true`:
```ts
tags: (number | Tag)[]         // array of values
```

The `(number | Tag)[]` is an array generic in shorthand:
```ts
// These are the same:
(number | Tag)[]
Array<number | Tag>
```

---

## Why `number | Category` instead of just `Category`?

Because of **depth**:

- `depth: 0` → API returns IDs → `category` is `number`
- `depth: 1+` → API returns full objects → `category` is `Category`

The union covers both. Your code must handle both (lesson 06 teaches
how).

---

## The key insight

You rarely *write* generics in Payload projects. You *read* them:

- In `payload-types.ts` — the generated interfaces
- In Payload's error messages — when a type doesn't match
- In library type definitions — when you hover over a function

Understanding `<T>` unlocks reading all of these.

---

## Try it yourself

```ts
// Read these generated types and answer:

interface Post {
  id: number
  title: string
  category: number | Category        // Q1: What is this at depth 0?
  tags?: (number | Tag)[] | null     // Q2: What is this at depth 0?
  featuredImage?: number | Media     // Q3: What is this at depth 2?
}

// A1: category is a number (the ID)
// A2: tags is an array of numbers (the IDs), or null
// A3: featuredImage is a Media object (populated)
```
