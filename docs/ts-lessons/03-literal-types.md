# TS Lesson 03 — Literal types & unions

> **Used in:** [Steps 01.5–01.8](../steps/01-5-content.md) — field types, select options, status values

---

## The one-sentence version

A **literal type** is a type that allows only one exact value. A
**union** combines multiple types with `|` (or).

---

## From "any string" to "one specific string"

A regular `string` type allows any string:

```ts
let color: string = 'red'
color = 'blue'     // fine
color = 'banana'   // fine — any string works
```

A **literal type** allows only one specific value:

```ts
let color: 'red' = 'red'
color = 'blue'   // ← red squiggle: Type '"blue"' is not assignable to type '"red"'
```

`'red'` (in quotes, as a type) means "only the exact string 'red'."
Not very useful alone — but combined with unions, it's powerful.

---

## Unions: "this OR that"

The `|` operator means "or":

```ts
let color: 'red' | 'green' | 'blue' = 'red'
color = 'green'   // fine
color = 'blue'    // fine
color = 'yellow'  // ← red squiggle: not in the union
```

Only the three listed values are allowed. TypeScript rejects everything
else. Your editor's autocomplete shows exactly three options.

---

## Real-world example: traffic light

```ts
type TrafficLight = 'red' | 'yellow' | 'green'

function canGo(light: TrafficLight): boolean {
  return light === 'green'
}

canGo('green')   // fine
canGo('purple')  // ← red squiggle: not a TrafficLight
```

This pattern is everywhere. Any time you have a fixed set of choices,
a union of literals is the right type.

---

## Where you see this in Payload

Payload's `type` field on every field definition is a literal union:

```ts
type: 'text'          // only 'text' — not 'txt' or 'string'
type: 'relationship'  // only 'relationship' — not 'relation'
type: 'select'        // only 'select' — not 'dropdown'
```

The `select` field's options create a union too:

```ts
{
  name: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
}
```

After `generate:types`, the `Post` interface has:

```ts
status: 'draft' | 'published'
```

That union was built from your options array. Payload read
`value: 'draft'` and `value: 'published'`, and generated a union of
those two literals.

---

## Unions aren't just for strings

You can union any types:

```ts
let id: string | number = 'abc'
id = 123      // also fine
id = true     // ← squiggle: boolean is not string | number
```

You'll see `string | number` and `number | null` frequently in
Payload's generated types.

---

## Try it yourself

1. Create a `Direction` type: `'north' | 'south' | 'east' | 'west'`
2. Write a function `move(dir: Direction)` that logs the direction
3. Call it with `'north'` — works
4. Call it with `'up'` — squiggle
5. Try a `Season` type: `'spring' | 'summer' | 'fall' | 'winter'`

```ts
type Direction = 'north' | 'south' | 'east' | 'west'

function move(dir: Direction): void {
  console.log(`Moving ${dir}`)
}

move('north')  // fine
move('up')     // ← squiggle
```

---

## What's next

[TS Lesson 04 — Optional properties & null](04-optional-and-null.md) —
what `?` and `| null` mean, and why Payload uses both.
