# TS 03.4 — `as const`

> **Topic 03: Restricting Values** · Prev: [03.3](03-3-unions-of-shapes.md) · Next: [04.1](../04-lists-and-imports/04-1-arrays.md)

---

## The one-sentence version

`as const` tells TypeScript: "These values will never change — remember
them exactly as literal types."

---

## The problem: TypeScript forgets your values

When you write a plain array or object, TypeScript **widens** the types:

```ts
const colors = ['red', 'green', 'blue']
// TypeScript sees: string[]
// It forgot they're specifically 'red', 'green', 'blue'!

const config = { mode: 'dark', fontSize: 14 }
// TypeScript sees: { mode: string; fontSize: number }
// It forgot mode is specifically 'dark'!
```

This makes sense for `let` variables — they can change. But `const`
arrays and objects can still have their *contents* changed (`push`,
reassign properties), so TypeScript plays it safe and widens.

---

## The fix: `as const`

Add `as const` and TypeScript remembers the exact values:

```ts
const colors = ['red', 'green', 'blue'] as const
// TypeScript sees: readonly ['red', 'green', 'blue']

const config = { mode: 'dark', fontSize: 14 } as const
// TypeScript sees: { readonly mode: 'dark'; readonly fontSize: 14 }
```

Two things happened:
1. **Literal types preserved** — `'red'` stays `'red'`, not `string`
2. **Readonly** — you can't `push`, `pop`, or reassign properties

---

## Why `readonly`?

If you could change the array, TypeScript couldn't guarantee the literal
types are accurate anymore:

```ts
const colors = ['red', 'green', 'blue'] as const
colors.push('yellow')  // ❌ Error: Property 'push' does not exist on readonly

colors[0] = 'pink'     // ❌ Error: Cannot assign to '0' because it is read-only
```

The readonly and the literal types go hand in hand — you get both or
neither.

---

## Extracting a union from a const array

This is the most useful pattern:

```ts
const PLATFORMS = ['twitter', 'github', 'linkedin'] as const

type Platform = typeof PLATFORMS[number]
// Platform = 'twitter' | 'github' | 'linkedin'
```

Breaking it down:
- `typeof PLATFORMS` → `readonly ['twitter', 'github', 'linkedin']`
- `[number]` → "give me the type at any numeric index"
- Result → `'twitter' | 'github' | 'linkedin'`

Without `as const`, `typeof PLATFORMS[number]` would just be `string` —
useless.

---

## `as const` on objects

Works the same way:

```ts
const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

type Role = typeof ROLES[keyof typeof ROLES]
// Role = 'admin' | 'editor' | 'viewer'
```

Every property becomes `readonly` with its literal type. You get a
union of the values using `keyof typeof`.

---

## Payload connection

In Payload, `as const` is useful when defining select options outside
the field config:

```ts
const STATUS_OPTIONS = ['draft', 'published', 'archived'] as const

// Reuse for both the field AND a TypeScript type:
type Status = typeof STATUS_OPTIONS[number]
// 'draft' | 'published' | 'archived'

// In the collection:
{
  name: 'status',
  type: 'select',
  options: [...STATUS_OPTIONS],
}
```

Without `as const`, the options would be typed as `string[]` and you'd
lose the connection between your TypeScript type and the Payload field.

---

## Exercise

> **Create file:** `exercises/03-4-as-const.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 03.4 — as const

// 1. Without as const — hover and check the type
const sizes = ['sm', 'md', 'lg', 'xl']

// 2. With as const — hover and compare
const sizesConst = ['sm', 'md', 'lg', 'xl'] as const

// 3. Extract a union type from the const array
type Size = typeof sizesConst[number]

// 4. Try to break it — uncomment these one at a time:
// sizesConst.push('xxl')
// sizesConst[0] = 'xs'

// 5. Use your Size type — this should work:
const mySize: Size = 'md'

// 6. This should get a red squiggle — why?
const badSize: Size = 'xxs'

// 7. Object version:
const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

type Theme = typeof THEME[keyof typeof THEME]

const current: Theme = 'dark'   // ✅ works
const wrong: Theme = 'blue'     // ❌ squiggle
```

Save. Hover over each variable. Uncomment lines 4 one at a time to see
the errors. This lesson is done when you can explain why `as const`
gives you both `readonly` and literal types.
