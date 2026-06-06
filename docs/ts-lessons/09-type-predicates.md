# TS Lesson 09 — Type predicates (`value is T`)

> **Used in:** [Step 02.8](../steps/02-8-test-relationships.md) — the `isPopulated` helper

---

## The one-sentence version

A **type predicate** is a return type that says "if this function
returns true, the input is this specific type." It lets you write
reusable type guards.

---

## The problem with inline checks

You *can* narrow types inline every time:

```ts
if (typeof post.category === 'object' && post.category !== null) {
  console.log(post.category.title)
}
```

But if you do this 20 times across your codebase, it's noisy. And if
the check logic changes, you fix it 20 times.

---

## The solution: a type guard function

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

The `value is string` return type is the type predicate. It says:

> "When this function returns `true`, TypeScript should treat `value`
> as a `string` from that point on."

Usage:

```ts
function process(input: string | number) {
  if (isString(input)) {
    // TypeScript knows: input is string
    console.log(input.toUpperCase())
  } else {
    // TypeScript knows: input is number
    console.log(input.toFixed(2))
  }
}
```

Same narrowing as `typeof input === 'string'`, but wrapped in a
reusable function.

---

## The Payload pattern: `isPopulated`

Relationship fields return `number | SomeObject`. You check this often
enough that a helper pays for itself:

```ts
function isPopulated<T>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}
```

Break it down:
- `<T>` — generic parameter (lesson 07). `T` is whatever the
  populated type is (Category, Tag, Media, etc.)
- `value: number | T` — the input is either an ID or a populated object
- `value is T` — the predicate: if true, treat `value` as `T`
- The check: is it an object (not a number) and not null?

Usage:

```ts
if (isPopulated(post.category)) {
  // TypeScript knows: post.category is Category
  console.log(post.category.title)
}

if (isPopulated(post.featuredImage)) {
  // TypeScript knows: post.featuredImage is Media
  console.log(post.featuredImage.url)
}
```

One function handles every relationship field. The generic `<T>` adapts
to whatever the populated type is.

---

## Type predicates in `.filter()`

Arrays have a special trick. `.filter()` normally returns the same
array type. But with a type predicate, it narrows the element type:

```ts
// Without type predicate — result is still (number | Tag)[]
const items = post.tags?.filter(tag => typeof tag !== 'number')

// With type predicate — result is Tag[]
const tags = post.tags?.filter(
  (tag): tag is Tag => typeof tag !== 'number'
)
```

The `(tag): tag is Tag =>` syntax puts the type predicate on an arrow
function. After `.filter()`, TypeScript knows every item in `tags` is
a `Tag`, not a number.

---

## When to write a type predicate vs inline check

- **Inline (`typeof x === 'string'`)** — use for one-off checks. Simple,
  local, no extra code.
- **Type predicate function** — use when you repeat the same check 3+
  times. Cleaner, reusable, one place to maintain.

The `isPopulated` helper is worth writing because every relationship
field in every Payload project needs the same check.

---

## Try it yourself

```ts
// 1. Write a simple type predicate
function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

const x: string | number = 42
if (isNumber(x)) {
  console.log(x.toFixed(2))  // ← works, TypeScript knows it's number
}

// 2. Write the isPopulated helper
function isPopulated<T>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}

type Category = { id: number; title: string }
const ref: number | Category = { id: 1, title: 'JavaScript' }

if (isPopulated(ref)) {
  console.log(ref.title)  // ← works, TypeScript knows it's Category
}

// 3. Use in .filter()
type Tag = { id: number; title: string }
const mixed: (number | Tag)[] = [1, { id: 2, title: 'react' }, 3]

const onlyTags = mixed.filter(
  (item): item is Tag => typeof item !== 'number'
)
// onlyTags is Tag[] — [{ id: 2, title: 'react' }]
```

---

## What's next

This is the last TS lesson for step 02. The concepts covered so far —
annotations, object types, literal unions, optionals, arrays, generics,
narrowing, and type predicates — are enough to read and write any
Payload collection, field, or generated type.

Step 03 introduces **literal types and `as const`**. Step 05 goes
deeper on **function types and type predicates** for access control.
Each future step adds one more TS concept on top of this foundation.
