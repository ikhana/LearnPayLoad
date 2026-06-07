# TS 03.3 — Unions of different shapes

> **Topic 03: Restricting Values** · Prev: [03.2](03-2-union-types.md) · Next: [04.1](04-1-arrays.md)

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

## Try it yourself

```ts
type Input = string | { raw: string; sanitized: string }

// Both are valid:
const a: Input = 'hello'
const b: Input = { raw: '<b>hi</b>', sanitized: 'hi' }

// Invalid shapes:
const c: Input = 42              // ← squiggle: number ≠ string | object
const d: Input = { raw: 'hi' }   // ← squiggle: missing 'sanitized'
```
