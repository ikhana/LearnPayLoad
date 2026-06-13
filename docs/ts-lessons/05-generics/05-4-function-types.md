# TS 05.4 — Function types

> **Topic 05: Generics** · Prev: [05.3](05-3-generics-in-payload.md) · Next: [06.1](../06-narrowing/06-1-the-narrowing-problem.md)

---

## The one-sentence version

TypeScript can describe the **shape of a function** — what it takes in
and what it gives back — as a type.

---

## Typing a function inline

You've been typing variables: `const name: string = 'Inaam'`. Functions
work the same way — you type the parameters and the return:

```ts
function add(a: number, b: number): number {
  return a + b
}
```

- `a: number` — first parameter is a number
- `b: number` — second parameter is a number
- `: number` after `)` — the return type is a number

TypeScript enforces all three:

```ts
add('hello', 5)   // ❌ Error: 'hello' is not a number
add(1, 2, 3)      // ❌ Error: Expected 2 arguments, got 3
```

---

## Arrow functions

Same thing, arrow syntax:

```ts
const add = (a: number, b: number): number => {
  return a + b
}
```

Or as a one-liner:

```ts
const add = (a: number, b: number): number => a + b
```

---

## Function types as standalone types

Here's the key concept. You can describe a function's shape as a type:

```ts
type MathFn = (a: number, b: number) => number
```

Now you can use it to type a variable:

```ts
const add: MathFn = (a, b) => a + b
const multiply: MathFn = (a, b) => a * b
```

Notice: you don't need to re-type `a: number, b: number` — TypeScript
infers them from the `MathFn` type. The type annotation on the variable
flows down into the function parameters.

---

## Why function types matter

They let you:

1. **Enforce consistency** — all functions matching a type have the same
   shape
2. **Type callbacks** — when a function takes another function as a
   parameter
3. **Type library hooks** — Payload's `Access`, `BeforeChangeHook`,
   etc. are all function types

---

## Callbacks (functions as parameters)

```ts
type FilterFn = (item: string) => boolean

function filterList(items: string[], test: FilterFn): string[] {
  return items.filter(test)
}

// Usage:
const longWords = filterList(['hi', 'hello', 'hey'], (word) => word.length > 3)
// Result: ['hello']
```

The `test` parameter has type `FilterFn` — TypeScript knows it receives
a `string` and returns a `boolean`.

---

## Payload connection

Payload's access control uses function types:

```ts
import type { Access } from 'payload'

// Access is a function type:
// (args: { req, id?, data? }) => boolean | Where | Promise<...>

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}
```

When you write `: Access`, TypeScript:
- Knows `req` has a `user` property
- Knows the return must be `boolean` or a `Where` query
- Shows red squiggles if you return something else

Hooks use the same pattern:

```ts
import type { CollectionBeforeChangeHook } from 'payload'

const slugify: CollectionBeforeChangeHook = ({ data }) => {
  // TypeScript knows data exists and what it contains
  return data
}
```

---

## Exercise

> **Create file:** `exercises/05-4-function-types.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 05.4 — Function types

// 1. Define a function type
type Greeting = (name: string) => string

// 2. Create a function that matches it
const hello: Greeting = (name) => `Hello, ${name}!`
const goodbye: Greeting = (name) => `Goodbye, ${name}!`

// 3. This should squiggle — wrong return type:
const broken: Greeting = (name) => 42

// 4. This should squiggle — wrong parameter type:
const alsoBroken: Greeting = (name: number) => `Hi ${name}`

// 5. Function as a parameter (callback):
type Transform = (value: string) => string

function applyTwice(value: string, fn: Transform): string {
  return fn(fn(value))
}

const shout = applyTwice('hello', (s) => s.toUpperCase())
// shout = 'HELLO'

// 6. Simulate Payload's Access type:
type SimpleAccess = (args: { user: { role: string } | null }) => boolean

const adminOnly: SimpleAccess = ({ user }) => {
  return user?.role === 'admin'
}

const anyone: SimpleAccess = () => true

// 7. This should squiggle — returning string instead of boolean:
const badAccess: SimpleAccess = ({ user }) => user?.role ?? 'none'
```

Save. Fix the squiggles on lines 3, 4, and 7. This lesson is done when
you can explain how `: Access` on a variable enforces the function's
parameter and return types.
