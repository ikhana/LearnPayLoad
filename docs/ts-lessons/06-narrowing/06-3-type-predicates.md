# TS 06.3 — Type predicates (`value is T`)

> **Topic 06: Narrowing & Type Guards** · Prev: [06.2](06-2-typeof-guards.md)

---

## The one-sentence version

A **type predicate** is a return type that says "if this function
returns true, the input is this specific type." It wraps a type guard
into a reusable function.

---

## The problem with inline checks

Inline `typeof` checks work but get noisy when repeated:

```ts
// You write this 20 times across your codebase...
if (typeof post.category === 'object' && post.category !== null) {
  console.log(post.category.title)
}
```

---

## The solution: a type guard function

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

`value is string` is the type predicate. It says:

> "When this function returns `true`, treat `value` as `string`."

```ts
function process(input: string | number) {
  if (isString(input)) {
    console.log(input.toUpperCase())   // TS knows: string
  } else {
    console.log(input.toFixed(2))      // TS knows: number
  }
}
```

---

## The Payload pattern: `isPopulated<T>`

```ts
function isPopulated<T>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}
```

Break it down:
- `<T>` — generic (Topic 05). Adapts to any populated type.
- `value: number | T` — input is ID or populated object
- `value is T` — if true, treat as the populated type
- The check: is it an object and not null?

Usage:

```ts
if (isPopulated(post.category)) {
  post.category.title    // TS knows: Category
}

if (isPopulated(post.featuredImage)) {
  post.featuredImage.url  // TS knows: Media
}
```

One function. Every relationship field. The generic `<T>` adapts.

---

## Type predicates in `.filter()`

```ts
// Without predicate — result is still (number | Tag)[]
const items = post.tags?.filter(tag => typeof tag !== 'number')

// With predicate — result is Tag[]
const tags = post.tags?.filter(
  (tag): tag is Tag => typeof tag !== 'number'
)
```

The `(tag): tag is Tag =>` puts the predicate on an arrow function.
After `.filter()`, TypeScript knows every item is a `Tag`.

---

## When to use which

- **Inline `typeof`** — one-off checks. Simple, local.
- **Type predicate function** — same check 3+ times. Reusable.

---

## Exercise

> **Create file:** `exercises/06-3-type-predicates.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 06.3 — Type predicates

// 1. Simple type predicate
function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

const x: string | number = 42
if (isNumber(x)) {
  console.log(x.toFixed(2))
}

// 2. The isPopulated helper — the key Payload pattern
function isPopulated<T>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}

type Category = { id: number; title: string }
const ref: number | Category = { id: 1, title: 'JavaScript' }

if (isPopulated(ref)) {
  console.log(ref.title)
}

// 3. In .filter() — turns (number | Tag)[] into Tag[]
type Tag = { id: number; title: string }
const mixed: (number | Tag)[] = [1, { id: 2, title: 'react' }, 3]

const onlyTags = mixed.filter(
  (item): item is Tag => typeof item !== 'number'
)

// 4. Write your own: isString predicate, use it with .filter()
//    on an array of (string | number)[] to get only strings
```

Save. Verify no squiggles. Write step 4. When the file is clean, this
lesson is done.
