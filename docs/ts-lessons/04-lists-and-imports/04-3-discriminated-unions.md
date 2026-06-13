# TS 04.3 — Discriminated unions

> **Topic 04: Lists & Imports** · Prev: [04.2](04-2-import-type.md) · Next: [05.1](../05-generics/05-1-what-are-generics.md)

---

## The one-sentence version

A **discriminated union** is a union of object types that share one
property with a different literal value in each variant — TypeScript
uses that property to tell the variants apart.

---

## The problem: unions of objects are ambiguous

```ts
type Cat = { sound: string; purrs: boolean }
type Dog = { sound: string; fetches: boolean }

type Pet = Cat | Dog

function describe(pet: Pet) {
  pet.purrs  // ❌ Error: Property 'purrs' does not exist on type Dog
}
```

TypeScript can't tell if `pet` is a Cat or a Dog — both have `sound`,
so there's no property to check.

---

## The fix: add a discriminant

Give each variant a shared property with a **different literal type**:

```ts
type Cat = { kind: 'cat'; sound: string; purrs: boolean }
type Dog = { kind: 'dog'; sound: string; fetches: boolean }

type Pet = Cat | Dog

function describe(pet: Pet) {
  if (pet.kind === 'cat') {
    pet.purrs    // ✅ TypeScript knows this is Cat
  }
  if (pet.kind === 'dog') {
    pet.fetches  // ✅ TypeScript knows this is Dog
  }
}
```

The `kind` property is the **discriminant**. It exists on every variant,
and each variant has a unique literal value. When you check `kind`,
TypeScript narrows the union.

---

## Why this matters

This is not an abstract pattern — it's how real libraries work.

**Payload's field system:**

```ts
type TextField = { type: 'text'; maxLength?: number }
type NumberField = { type: 'number'; min?: number; max?: number }
type SelectField = { type: 'select'; options: string[] }

type Field = TextField | NumberField | SelectField
```

When you write `type: 'text'` in a field config, TypeScript narrows to
`TextField` and only offers text-specific options like `maxLength`. Write
`type: 'select'` and `options` becomes required. That's the discriminated
union at work.

**Redux actions, API responses, event handlers** — all use this pattern.

---

## Rules for discriminated unions

1. Every variant must have the **same property name** (the discriminant)
2. Each variant must have a **different literal type** for that property
3. Check the discriminant with `===` inside an `if` to narrow

Common discriminant names: `type`, `kind`, `status`, `action`, `tag`.

---

## Payload connection

Every field you've written uses this pattern:

```ts
// When you type: type: 'text'
// TypeScript narrows to TextField — only text options autocomplete

// When you type: type: 'relationship'
// TypeScript narrows to RelationshipField — relationTo appears

// When you type: type: 'upload'
// TypeScript narrows to UploadField — relationTo + upload options

// When you type: type: 'select'
// TypeScript narrows to SelectField — options is required
```

This is why changing `type` in a field config changes what autocomplete
offers. The `type` property is the discriminant of a union of all
Payload field types.

---

## Exercise

> **Create file:** `exercises/04-3-discriminated-unions.ts`

Type this into the file (don't copy-paste):

```ts
// Exercise 04.3 — Discriminated unions

// 1. Define the variants
type TextInput = {
  kind: 'text'
  placeholder: string
  maxLength?: number
}

type NumberInput = {
  kind: 'number'
  min: number
  max: number
}

type SelectInput = {
  kind: 'select'
  options: string[]
}

// 2. The union
type FormInput = TextInput | NumberInput | SelectInput

// 3. Write a function that uses the discriminant
function describeInput(input: FormInput): string {
  // Uncomment and fill in:
  // if (input.kind === 'text') {
  //   return `Text input with max ${input.maxLength} chars`
  // }
  // if (input.kind === 'number') {
  //   return `Number from ${input.min} to ${input.max}`
  // }
  // if (input.kind === 'select') {
  //   return `Select with ${input.options.length} options`
  // }
  return 'unknown'
}

// 4. Test it — each should work without errors:
const nameField: FormInput = {
  kind: 'text',
  placeholder: 'Enter name',
  maxLength: 100,
}

const ageField: FormInput = {
  kind: 'number',
  min: 0,
  max: 150,
}

// 5. Try adding a property that doesn't belong:
const broken: FormInput = {
  kind: 'text',
  placeholder: 'Hello',
  min: 0,  // ❌ should squiggle — min doesn't exist on TextInput
}

// 6. Try a kind that doesn't exist:
const invalid: FormInput = {
  kind: 'checkbox',  // ❌ should squiggle — not in the union
  checked: true,
}
```

Save. Uncomment the function body. Fix the two broken objects. This
lesson is done when you can explain what a discriminant is and why
Payload's field `type` property is one.
