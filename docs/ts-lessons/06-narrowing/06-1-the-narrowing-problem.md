# TS 06.1 — The narrowing problem

> **Topic 06: Narrowing & Type Guards** · Next: [06.2](06-2-typeof-guards.md)

---

## The one-sentence version

When a value can be multiple types, TypeScript won't let you use
type-specific features until you check which type it actually is.

---

## The problem

```ts
function printLength(value: string | number) {
  console.log(value.length)
  // ← squiggle: Property 'length' does not exist on type 'number'
}
```

`value` is `string | number`. Strings have `.length`. Numbers don't.
TypeScript refuses to guess — it makes you check first.

---

## A Payload example

```ts
interface Post {
  category: number | Category
}

console.log(post.category.title)
// ← squiggle: Property 'title' does not exist on type 'number'
```

Same problem. `category` might be a number (just the ID) or a
`Category` object. TypeScript won't let you access `.title` until you
prove it's the object.

---

## Why TypeScript does this

JavaScript would happily run `(42).title` — it just returns `undefined`.
That `undefined` then cascades through your code and crashes somewhere
else, far from the original mistake.

TypeScript catches it at the source: "you're treating this as an object,
but it might be a number. Prove it first."

---

## The fix (next lesson)

The fix is a **type guard** — a runtime check that tells TypeScript
which branch of the union you're in. Lesson 06.2 covers this.

---

## Exercise

> **Create file:** `exercises/06-1-narrowing-problem.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 06.1 — The narrowing problem

// 1. Try accessing string methods on a union
function shout(value: string | number): string {
  return value.toUpperCase()   // ← squiggle — DON'T fix yet
}

// 2. Try accessing object properties on a union
type User = { id: number; name: string }

function getName(ref: number | User): string {
  return ref.name   // ← squiggle — DON'T fix yet
}

// 3. Explain in a comment: why does each one squiggle?

// 4. Try one more: category from Payload
type Category = { id: number; title: string }
function getCategoryTitle(cat: number | Category): string {
  return cat.title   // ← squiggle — same reason
}

// Leave the squiggles. Next lesson (06.2) teaches the fix.
```

Save. See three squiggles. **Don't fix them** — understand why they
happen. This lesson is done when you can explain the reason.
