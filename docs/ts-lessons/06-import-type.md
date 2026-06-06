# TS Lesson 06 — `import type` & type-only imports

> **Used in:** [Step 01.1](../steps/01-1-skeleton.md) — the first line of every collection file

---

## The one-sentence version

`import type` brings in a label (a type) without importing any actual
code. It vanishes completely when TypeScript compiles to JavaScript.

---

## Regular import vs type import

```ts
// Regular import — brings in real code that runs at runtime
import { buildConfig } from 'payload'

// Type import — brings in a label that only exists at compile time
import type { CollectionConfig } from 'payload'
```

`buildConfig` is a function — you call it, it does things. It exists
in the JavaScript output.

`CollectionConfig` is a type — it describes a shape. It only exists
for TypeScript to check your code. After compilation, it's gone. The
JavaScript output doesn't contain it at all.

---

## Why use `import type`?

Three reasons:

1. **Clarity.** Anyone reading the code knows immediately: "this import
   is for type checking only, not for runtime behavior."

2. **Bundle size.** Type imports are guaranteed to be erased. A regular
   import *might* pull in code even if you only use it as a type.
   `import type` makes the erasure explicit and guaranteed.

3. **Convention.** The TypeScript and Payload communities use `import
   type` consistently. Following the convention makes your code feel
   native.

---

## The pattern you'll write hundreds of times

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [],
}
```

Line 1: import the label.
Line 3: use the label as an annotation.

That's it. Every collection file starts this way. Every one.

---

## What happens if you forget `type`?

```ts
import { CollectionConfig } from 'payload'  // ← works, but...
```

This still works. TypeScript is smart enough to erase unused regular
imports. But it's sloppy — you're importing a type as if it were code.
Most linters will flag this and suggest adding `type`.

The reverse is worse:

```ts
import type { buildConfig } from 'payload'  // ← then try to call it
buildConfig({})  // ← ERROR: 'buildConfig' is a type and cannot be used as a value
```

If you `import type` something you need to *call* or *use* at runtime,
TypeScript stops you. Types can't be called, instantiated, or passed
around — they're labels, not things.

---

## Try it yourself

1. In a `.ts` file, write:
   ```ts
   import type { CollectionConfig } from 'payload'
   ```
2. Use it as an annotation: `const x: CollectionConfig = { slug: 'test', fields: [] }`
3. Now try using it as a value: `console.log(CollectionConfig)` — red squiggle.
4. Types are labels, not values. You can annotate with them, but you
   can't log them, pass them, or call them.

---

## What's next

[TS Lesson 07 — Generics](07-generics.md) — types that take a
parameter, like `Array<string>`. The most important TS concept in this
project.
