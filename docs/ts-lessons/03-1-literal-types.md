# TS 03.1 — Literal types

> **Topic 03: Restricting Values** · Next: [03.2](03-2-union-types.md)

---

## The one-sentence version

A **literal type** allows only one exact value — not "any string," but
"this specific string."

---

## From "any string" to "one string"

```ts
let color: string = 'red'
color = 'banana'   // fine — any string works

let exact: 'red' = 'red'
exact = 'blue'     // ← squiggle: only 'red' is allowed
```

`'red'` as a type (not a value) means "only the exact string `'red'`."

---

## Numbers and booleans can be literal too

```ts
let one: 1 = 1
one = 2           // ← squiggle: only 1 is allowed

let yes: true = true
yes = false       // ← squiggle: only true is allowed
```

---

## Where Payload uses literal types

Every `type` on a field is a literal:

```ts
type: 'text'          // only 'text' — not 'txt' or 'string'
type: 'relationship'  // only 'relationship' — not 'relation'
```

If you typo `type: 'tex'`, TypeScript rejects it — `'tex'` isn't one
of the allowed literals.

---

## Try it yourself

```ts
let direction: 'north' = 'north'
direction = 'south'   // ← squiggle: only 'north' allowed

let count: 42 = 42
count = 43            // ← squiggle: only 42 allowed

// Literal types alone aren't very useful — but combined with
// unions (next lesson), they're powerful.
```
