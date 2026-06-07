# TS 03.2 — Union types

> **Topic 03: Restricting Values** · Prev: [03.1](03-1-literal-types.md) · Next: [03.3](03-3-unions-of-shapes.md)

---

## The one-sentence version

The `|` operator means "or" — a union allows multiple types for the
same value.

---

## String literal unions

```ts
type Direction = 'north' | 'south' | 'east' | 'west'

let dir: Direction = 'north'   // fine
dir = 'east'                    // fine
dir = 'up'                      // ← squiggle: not in the union
```

Your editor's autocomplete shows exactly four options.

---

## Real-world example: traffic light

```ts
type TrafficLight = 'red' | 'yellow' | 'green'

function canGo(light: TrafficLight): boolean {
  return light === 'green'
}

canGo('green')    // fine
canGo('purple')   // ← squiggle
```

---

## Unions aren't just for strings

```ts
let id: string | number = 'abc'
id = 123       // also fine
id = true      // ← squiggle: boolean is not string | number
```

You can union any types: `string | number`, `string | null`,
`number | { id: number }`.

---

## Where Payload uses unions

The `select` field generates a union from your options:

```ts
options: [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]

// Generated type:
status: 'draft' | 'published'
```

Payload reads your option values and builds the union automatically.

---

## Try it yourself

```ts
// 1. Define a Season union
type Season = 'spring' | 'summer' | 'fall' | 'winter'

function describe(s: Season): string {
  return `It's ${s}!`
}

describe('summer')   // fine
describe('monsoon')  // ← squiggle

// 2. Mixed-type union
type Result = string | number | null

let r: Result = 'success'
r = 42
r = null
r = true   // ← squiggle
```
