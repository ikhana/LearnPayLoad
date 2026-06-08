# TS 06.2 — `typeof` type guards

> **Topic 06: Narrowing & Type Guards** · Prev: [06.1](06-1-the-narrowing-problem.md) · Next: [06.3](06-3-type-predicates.md)

---

## The one-sentence version

A `typeof` check inside an `if` block tells TypeScript which type a
union value actually is. After the check, TypeScript **narrows** the
type automatically.

---

## The fix for lesson 06.1

```ts
function printLength(value: string | number) {
  if (typeof value === 'string') {
    // Inside here, TypeScript KNOWS value is a string
    console.log(value.length)       // ← no squiggle
  } else {
    // Inside here, TypeScript KNOWS value is a number
    console.log(value.toFixed(2))   // ← no squiggle
  }
}
```

TypeScript reads the `typeof` check and removes options from the union:

- Before: `string | number`
- Inside `if`: `string` only
- Inside `else`: `number` only

---

## Common type guards

```ts
// String
if (typeof x === 'string') { /* x is string */ }

// Number
if (typeof x === 'number') { /* x is number */ }

// Not null / not undefined
if (x !== null && x !== undefined) { /* x is defined */ }

// Object (not a primitive)
if (typeof x === 'object' && x !== null) { /* x is an object */ }

// Array
if (Array.isArray(x)) { /* x is an array */ }
```

---

## The Payload pattern

```ts
interface Post {
  category: number | Category
}

// Check if it's NOT a number → it must be Category
if (typeof post.category !== 'number') {
  console.log(post.category.title)   // ← works
}

// Or check if it IS an object
if (typeof post.category === 'object' && post.category !== null) {
  console.log(post.category.title)   // ← works
}
```

This is the pattern you'll use every time you access a populated
relationship field.

---

## Exercise

> **Create file:** `exercises/06-2-typeof-guards.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 06.2 — typeof type guards

// 1. Fix the shout function from 06.1 using typeof
function shout(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

// 2. Fix the getName function from 06.1
type User = { id: number; name: string }

function getName(ref: number | User): string {
  if (typeof ref === 'number') {
    return `User #${ref}`
  }
  return ref.name
}

// 3. Null check pattern
function greet(name: string | null): string {
  if (name === null) {
    return 'Hello, stranger!'
  }
  return `Hello, ${name.toUpperCase()}!`
}

// 4. Fix the getCategoryTitle from 06.1 using typeof
type Category = { id: number; title: string }
function getCategoryTitle(cat: number | Category): string {
  // Add your typeof guard here
  return cat.title
}
```

Save. Verify no squiggles on 1-3. Add the guard to fix 4. When the
file is clean, this lesson is done.
