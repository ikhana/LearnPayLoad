# TS 02.2 — Interfaces

> **Topic 02: Object Shapes** · Prev: [02.1](02-1-object-types.md) · Next: [02.3](02-3-nested-objects.md)

---

## The one-sentence version

An **interface** is another way to describe an object shape — almost
identical to `type`, just different syntax.

---

## `type` vs `interface`

```ts
// Using type
type Person = {
  name: string
  age: number
}

// Using interface — same shape, different keyword
interface Person {
  name: string
  age: number
}
```

Both work the same way for everyday use. The differences are subtle:

| | `type` | `interface` |
|---|---|---|
| Syntax | `type X = { ... }` | `interface X { ... }` |
| Can describe non-objects | Yes (`type Color = string`) | No (objects only) |
| Can be merged | No | Yes (declaration merging) |
| Used by Payload's generator | — | ✓ (`export interface Post { ... }`) |

---

## When to use which

**Short answer:** use either. Don't stress about it.

**Convention in this project:**
- Payload's generated types use `interface` → you'll read interfaces
- When you define your own types, `type` is slightly more flexible
- Both are valid everywhere annotations are used

---

## Reading Payload's generated interfaces

After `pnpm generate:types`, you'll see:

```ts
export interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}
```

This is an interface. Read it like a type — each line is a property
with its type. `export` means it can be imported from other files.

---

## Exercise

> **Create file:** `exercises/02-2-interfaces.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 02.2 — Interfaces

// 1. Write the same shape both ways
type DogType = { name: string; breed: string }
interface DogInterface { name: string; breed: string }

// 2. Both work as annotations
const dog1: DogType = { name: 'Rex', breed: 'Lab' }
const dog2: DogInterface = { name: 'Max', breed: 'Poodle' }

// 3. Try type for a non-object (interface can't do this)
type ID = string | number

// 4. Uncomment and see the error:
// interface ID2 = string | number

// 5. Write an interface for a Payload-like generated type:
//    interface Post { id: number; title: string; status: 'draft' | 'published' }
```

Save. Verify no squiggles on the valid code, and that the commented
line would error. This lesson is done when the file exists and is clean.
