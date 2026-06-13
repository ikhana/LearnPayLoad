# Step 04.2 — Media admin polish + discriminated unions

Add admin organization to Media, then learn discriminated unions — the
TS pattern that makes Payload's field system type-safe.

---

## 1. The story

Media is functional but the admin could be tidier. A `caption` field,
a sidebar group, and proper default columns make the editor experience
better.

More importantly, this is where you learn **discriminated unions** — the
TypeScript pattern behind Payload's field type system. When you write
`type: 'text'`, TypeScript narrows to `TextField` and only allows text
options. Write `type: 'relationship'` and different options appear. How?
Discriminated unions.

---

## 2. What you'll learn — Payload

> **Official docs:** [Upload Collections](https://payloadcms.com/docs/upload/overview)

Small additions:
- `caption` field — optional text for image captions
- `admin.group` — put Media under a logical sidebar group
- `admin.defaultColumns` — useful columns in the list view

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [04-2-discriminated-unions.md](../ts-lessons/04-lists-and-imports/04-3-discriminated-unions.md)
>
> Read the lesson and do the exercise. This is how Payload's field
> system works under the hood.

**Discriminated unions** are unions of objects that share a common
property (the "discriminant") with a different literal value in each
variant:

```ts
type TextField = { type: 'text'; maxLength?: number }
type NumberField = { type: 'number'; min?: number; max?: number }
type Field = TextField | NumberField

// When you check the discriminant, TS narrows:
function describe(field: Field) {
  if (field.type === 'text') {
    field.maxLength  // ✅ TypeScript knows this is TextField
  }
  if (field.type === 'number') {
    field.min         // ✅ TypeScript knows this is NumberField
  }
}
```

This is exactly how Payload's field config works. The `type` property
is the discriminant. That's why you get different autocomplete for
different field types.

---

## 4. Builds on

- **Step 04.1** — Media upload config is already expanded.
- **Step 02.6** — `admin.group` pattern.

---

## 5. Steps

### 5.1 — Add caption and admin config

Update `src/collections/Media.ts` — add `caption` field and admin
options:

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
}
```

### 5.2 — Restart and check

Restart `pnpm dev`. Check:
- Media list view shows filename, alt, updatedAt columns
- Media appears under the correct sidebar group
- Edit view shows both alt and caption fields

### 5.3 — Explore discriminated unions in the field config

In any collection file, type a new field and set `type: 'text'`. Hover
over the field object — notice TypeScript narrows to `TextField`.

Now change it to `type: 'relationship'` — autocomplete changes.
`relationTo` appears. `maxLength` disappears. That's the discriminated
union at work.

Try `type: 'select'` — now `options` is required. Each `type` value
activates a different set of properties.

---

## 6. Verify

- [ ] Media has `caption` field and admin config
- [ ] Sidebar shows Media in the correct group
- [ ] List view has useful default columns
- [ ] You understand discriminated unions: the `type` property is the
      discriminant that narrows the field config type
- [ ] You completed the discriminated unions TS exercise

Commit:

```bash
git add src/collections/Media.ts
git commit -m "step 04.2 — Media admin polish, discriminated unions lesson"
```

---

## 7. Unlocks

- **Step 04.3** — Generate types to see the Media interface with sizes.
- Discriminated unions appear everywhere in Payload — field configs,
  hook arguments, block variants (Step 09).
