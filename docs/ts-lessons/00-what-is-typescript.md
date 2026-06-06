# TS Lesson 00 — What is TypeScript?

> **Used in:** [Step 00 — Setup](../steps/00-setup.md)

---

## The one-sentence version

TypeScript is JavaScript with labels that tell you (and your editor)
what shape your data has — before you run anything.

---

## Why labels matter

Imagine you're packing boxes for a move. You could throw everything in
unlabeled boxes and figure it out later. Or you could write "Kitchen —
Plates (fragile)" on each one.

JavaScript is the unlabeled box. It works, but you open it at runtime
and discover you packed shoes with the dishes.

TypeScript is the labeled box. The label doesn't change what's inside —
it just tells you what to expect before you open it.

---

## What TypeScript actually does

1. You write `.ts` files instead of `.js` files
2. You add **type annotations** — labels on variables, function
   parameters, return values
3. The TypeScript **compiler** checks those labels before your code runs
4. If a label doesn't match (you said "string" but passed a number),
   the compiler shows a **red squiggle** in your editor
5. The compiler then **strips all the labels** and outputs plain
   JavaScript. The browser/server never sees TypeScript — only JS.

The labels exist only at **compile time**. They vanish at **runtime**.
They're scaffolding, not structure.

---

## `tsconfig.json` — the settings file

Every TypeScript project has a `tsconfig.json` at the root. It tells the
compiler how strict to be, where to find files, and where to put output.

The most important setting for us:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true` turns on all the safety checks. Without it, TypeScript
lets you get away with things that will bite you later. We always use
strict mode — no exceptions.

---

## Your first type error

```ts
let age: number = 25
age = 'twenty-five'  // ← red squiggle: Type 'string' is not assignable to type 'number'
```

You labeled `age` as a `number`. Then you tried to put a string in it.
TypeScript stops you — the label says "number," and "twenty-five" is not
a number.

That's the entire idea. Every TS lesson from here builds on this one
concept: **labels that the compiler enforces**.

---

## Try it yourself

1. Open any `.ts` file in your editor
2. Type: `let x: number = 'hello'`
3. See the red squiggle
4. Change it to: `let x: number = 42`
5. Squiggle gone

That interaction — write, see the squiggle, fix it — is the TypeScript
development loop. You'll do it thousands of times.

---

## What's next

[TS Lesson 01 — Type annotations](01-type-annotations.md) — how to
write those labels on variables, function parameters, and return values.
