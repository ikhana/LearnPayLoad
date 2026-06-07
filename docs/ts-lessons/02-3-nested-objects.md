# TS 02.3 — Nested objects

> **Topic 02: Object Shapes** · Prev: [02.2](02-2-interfaces.md) · Next: [02.4](02-4-optional-and-null.md)

---

## The one-sentence version

Objects can contain objects. TypeScript validates every level of
nesting — autocomplete works all the way down.

---

## One level of nesting

```ts
type Address = {
  street: string
  city: string
}

type Person = {
  name: string
  address: Address
}

const alice: Person = {
  name: 'Alice',
  address: {
    street: '123 Main St',
    city: 'Quetta',
  },
}
```

`address` is an object inside `Person`. TypeScript validates both
levels — a typo in `street` or `city` gets caught.

---

## Two levels of nesting

```ts
type Config = {
  admin: {
    date: {
      pickerAppearance: 'dayOnly' | 'dayAndTime'
    }
  }
}
```

Each `{ }` is its own typed shape. Autocomplete works at every depth —
type `admin.date.` and your editor shows `pickerAppearance`.

---

## Where you see this in Payload

Every field has an `admin` block — that's a nested object:

```ts
{
  name: 'publishedAt',
  type: 'date',
  admin: {                          // level 1
    position: 'sidebar',
    date: {                         // level 2
      pickerAppearance: 'dayAndTime',
    },
  },
}
```

Typo `positon` instead of `position`? Red squiggle — at level 1.
Typo `pickerApearance`? Red squiggle — at level 2.

---

## Try it yourself

```ts
type School = {
  name: string
  address: {
    city: string
    country: string
  }
  principal: {
    name: string
    email: string
  }
}

// 1. Create a valid school
const school: School = {
  name: 'Quetta Academy',
  address: { city: 'Quetta', country: 'Pakistan' },
  principal: { name: 'Ali', email: 'ali@school.pk' },
}

// 2. Typo in nested property
const bad: School = {
  name: 'Test',
  address: { citty: 'Quetta', country: 'PK' },  // ← squiggle on 'citty'
  principal: { name: 'X', email: 'x@x.com' },
}
```
