# TS 04.2 — `import type`

> **Topic 04: Lists & Imports** · Prev: [04.1](04-1-arrays.md) · Next: [04.3](04-3-discriminated-unions.md)

---

## The one-sentence version

`import type` brings in a label (a type) without importing any actual
code. It vanishes completely when TypeScript compiles to JavaScript.

---

## Regular import vs type import

```ts
// Regular — brings in real code that runs at runtime
import { buildConfig } from 'payload'

// Type — brings in a label that only exists at compile time
import type { CollectionConfig } from 'payload'
```

`buildConfig` = a function you call. Exists in the JavaScript output.
`CollectionConfig` = a type you annotate with. Erased at compile time.

---

## Why use `import type`?

1. **Clarity** — anyone reading knows: "this is for type checking only"
2. **Bundle size** — guaranteed to be erased. Zero runtime cost.
3. **Convention** — the TS and Payload communities use it consistently

---

## The pattern you'll write hundreds of times

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [],
}
```

Line 1: import the label. Line 3: use it as an annotation.

---

## What if you forget `type`?

```ts
import { CollectionConfig } from 'payload'  // works, but sloppy
```

Still works. But linters will flag it.

The reverse is worse:

```ts
import type { buildConfig } from 'payload'
buildConfig({})  // ← ERROR: can't use a type as a value
```

---

## Exercise

> **Create file:** `exercises/04-2-import-type.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 04.2 — import type

// 1. Import a type
import type { CollectionConfig } from 'payload'

// 2. Use it as an annotation — works
const x: CollectionConfig = { slug: 'test', fields: [] }

// 3. Try using it as a value — see the squiggle
console.log(CollectionConfig)

// 4. Fix it: you can't console.log a type. Remove the line.

// 5. Try the reverse mistake:
//    import type { buildConfig } from 'payload'
//    buildConfig({})   // ← can't use a type-import as a value
```

Save. See the squiggle. Understand why types aren't values. When the
file is clean, this lesson is done.
