# TS Lesson 04 — Optional properties & null

> **Used in:** [Steps 01.3–01.4](../steps/01-3-slug.md) — fields with `required: true` vs optional fields

---

## The one-sentence version

`?` means "this property might not exist." `| null` means "this
property exists but might be empty." Payload uses both together on
non-required fields.

---

## Optional (`?`) — the property might be missing

```ts
type User = {
  name: string
  email?: string   // ← optional: might not be on the object at all
}

const alice: User = { name: 'Alice' }              // fine — no email
const bob: User = { name: 'Bob', email: 'b@x.com' } // also fine
```

When you access an optional property, its type includes `undefined`:

```ts
alice.email  // type: string | undefined
```

TypeScript reminds you: this might not be there. Handle it.

---

## Null (`| null`) — the property exists but is empty

```ts
type User = {
  name: string
  email: string | null   // ← exists, but might be null
}

const alice: User = { name: 'Alice', email: null }   // fine
const bob: User = { name: 'Bob', email: 'b@x.com' }  // fine
// const carol: User = { name: 'Carol' }              // ← ERROR: email is required
```

The difference: with `?`, the property can be *missing*. With
`| null`, the property must be *present* but its value can be `null`.

---

## Payload uses both together

In generated types, a non-required field gets both:

```ts
export interface Post {
  title: string               // required — always present, always a string
  excerpt?: string | null     // not required — might be missing OR null
}
```

Why both? Because:
- `?` — the field might not be in the API response (especially at
  different depths)
- `| null` — the database column exists but stores NULL when empty

It's belt *and* suspenders. Your code needs to handle both cases:

```ts
// Safe access pattern:
const summary = post.excerpt ?? 'No excerpt available'
```

The `??` operator (nullish coalescing) returns the right side if the
left is `null` or `undefined`. It handles both the `?` case and the
`| null` case in one shot.

---

## Required fields are simpler

```ts
export interface Post {
  title: string   // no ? — always present. no | null — never empty.
}
```

When you set `required: true` on a Payload field, the generated type
drops both `?` and `| null`. The value is guaranteed to be there.

That's why `required` matters beyond validation — it simplifies the
types your code needs to handle.

---

## Try it yourself

```ts
type Profile = {
  username: string
  bio?: string | null
  age?: number
}

const p1: Profile = { username: 'alice' }                    // fine
const p2: Profile = { username: 'bob', bio: null }           // fine
const p3: Profile = { username: 'carol', bio: 'Developer' }  // fine

// Access safely:
const bioText = p1.bio ?? 'No bio yet'     // 'No bio yet'
const ageText = p1.age ?? 'Age unknown'    // 'Age unknown'

// Access unsafely:
const len = p1.bio.length   // ← red squiggle: bio might be null/undefined
```

The squiggle on `p1.bio.length` is TypeScript protecting you from a
runtime crash. `null.length` would throw an error in JavaScript.
TypeScript catches it at compile time.

---

## What's next

[TS Lesson 05 — Arrays](05-arrays.md) — how to type a list of things,
and why `string[]` and `Array<string>` are the same.
