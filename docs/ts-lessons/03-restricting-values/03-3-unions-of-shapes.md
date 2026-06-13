# TS 03.3 — Unions of different shapes

> **Topic 03: Restricting Values** · Prev: [03.2](03-2-union-types.md) · Next: [03.4](03-4-as-const.md)

---

## The one-sentence version

A union can combine different **object shapes**, not just primitive
values. "This is either a string OR an object with label and value."

---

## Two shapes for the same thing

Some APIs accept a simple form and a detailed form:

```ts
// Simple: just a string
'draft'

// Detailed: object with label and value
{ label: 'Draft', value: 'draft' }
```

The type describes both:

```ts
type Option = string | { label: string; value: string }
```

---

## Payload's select options use this pattern

```ts
// Short form — plain strings
options: ['draft', 'published']

// Long form — objects with labels
options: [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]
```

Both are valid. You pick one form per field. TypeScript validates
whichever form you chose.

---

## Don't mix forms in one array

```ts
options: [
  'draft',                            // string
  { label: 'Published', value: 'published' },  // object
]
// ← TypeScript may flag this as inconsistent
```

Pick one form and stick with it for that field.

---

## This pattern is everywhere

"Simple version OR detailed version" shows up throughout Payload:

- **Field `options`**: `string` or `{ label, value }`
- **Access control**: `boolean` or `({ req }) => boolean`
- **Hooks**: a function or an array of functions
- **Plugin configs**: simple flag or detailed config object

The union type tells your editor which forms are valid.

---

## Exercise

> **Create file:** `exercises/03-3-shape-unions.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 03.3 — Unions of different shapes

type Input = string | { raw: string; sanitized: string }

// 1. Both should be valid — no squiggles
const a: Input = 'hello'
const b: Input = { raw: '<b>hi</b>', sanitized: 'hi' }

// 2. Invalid shapes — see squiggles
const c: Input = 42
const d: Input = { raw: 'hi' }

// 3. Fix both squiggles

// 4. Define your own: a Payload-like Option type
//    type Option = string | { label: string; value: string }
//    Create one valid string option, one valid object option,
//    and one invalid option.
```

Save. See two squiggles. Fix them. When the file is clean, this
lesson is done.
