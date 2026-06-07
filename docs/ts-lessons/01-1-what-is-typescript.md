# TS 01.1 — What is TypeScript?

> **Topic 01: Foundations** · Next: [01.2 — Type annotations](01-2-type-annotations.md)

---

## The one-sentence version

TypeScript is JavaScript with labels that tell you (and your editor)
what shape your data has — before you run anything.

---

## Why labels matter

Imagine packing boxes for a move. You could throw everything in
unlabeled boxes and figure it out later. Or you could write "Kitchen —
Plates (fragile)" on each one.

- **JavaScript** = unlabeled box. Works, but you open it at runtime and
  discover shoes mixed with dishes.
- **TypeScript** = labeled box. The label doesn't change what's inside —
  it just tells you what to expect before you open it.

---

## What TypeScript actually does

1. You write `.ts` files instead of `.js` files
2. You add **type annotations** — labels on variables and functions
3. The TypeScript **compiler** checks those labels before your code runs
4. If a label doesn't match → **red squiggle** in your editor
5. The compiler **strips all labels** and outputs plain JavaScript

The labels exist only at **compile time**. They vanish at **runtime**.

---

## `tsconfig.json`

Every TypeScript project has this settings file at the root:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true` turns on all safety checks. We always use it.

---

## Try it yourself

1. Open any `.ts` file in your editor
2. Type: `let x: number = 'hello'`
3. See the red squiggle
4. Change it to: `let x: number = 42`
5. Squiggle gone

That interaction — write, see the squiggle, fix it — is the TypeScript
loop. You'll do it thousands of times.
