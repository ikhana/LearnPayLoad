# TS 02.4 — Optional properties & null

> **Topic 02: Object Shapes** · Prev: [02.3](02-3-nested-objects.md) · Next: [03.1](../03-restricting-values/03-1-literal-types.md)

---

## The one-sentence version

`?` means "this property might not exist." `| null` means "this
property exists but might be empty."

---

## Optional (`?`)

```ts
type User = {
  name: string
  email?: string   // ← optional
}

const alice: User = { name: 'Alice' }              // fine — no email
const bob: User = { name: 'Bob', email: 'b@x.com' } // also fine
```

Accessing an optional property gives you `string | undefined`:

```ts
alice.email         // type: string | undefined
alice.email.length  // ← squiggle: might be undefined
```

---

## Null (`| null`)

```ts
type User = {
  name: string
  email: string | null   // ← present but maybe empty
}

const alice: User = { name: 'Alice', email: null }  // fine
// const bob: User = { name: 'Bob' }                // ← squiggle: email is required
```

With `| null`, the property must be there — but its value can be `null`.

---

## Payload uses both together

```ts
// In generated payload-types.ts:
export interface Post {
  title: string               // required — always present
  excerpt?: string | null     // not required — might be missing OR null
}
```

Non-required fields get `?` AND `| null`. Safe access:

```ts
const summary = post.excerpt ?? 'No excerpt'
```

`??` (nullish coalescing) returns the right side if left is `null` or
`undefined`. Handles both cases in one shot.

---

## Required fields are simpler

When you set `required: true` on a Payload field:

```ts
title: string   // no ?, no | null — guaranteed to be there
```

`required` simplifies the types your code handles.

---

## Exercise

> **Create file:** `exercises/02-4-optional-null.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 02.4 — Optional properties & null

type Profile = {
  username: string
  bio?: string | null
  age?: number
}

// 1. All three should be valid — no squiggles
const p1: Profile = { username: 'alice' }
const p2: Profile = { username: 'bob', bio: null }
const p3: Profile = { username: 'carol', bio: 'Developer' }

// 2. Unsafe access — type this EXACTLY, see the squiggle
const len = p1.bio.length           // ← squiggle: bio might be null/undefined
const upper = p2.bio.toUpperCase()  // ← squiggle: same reason

// 3. Fix len using optional chaining (?.)
// 4. Fix upper using ?? to provide a fallback first
// 5. Try a third fix: use an if-check to guard access

// 6. Remove the ? from bio in Profile — what breaks?
```

Save. See two squiggles on the unsafe access lines. Fix each one
using a different technique (?., ??, if-check). When the file is
clean, this lesson is done.
