# Step 07.2 — Custom slug field with "Generate" button

Replace the default slug text input with a custom component that has a
"Generate from title" button. This shows how to **override** an existing
field's rendering while keeping its data storage.

---

## 1. The story

In Step 06.1 we auto-generate slugs via a `beforeChange` hook. But
editors can't see the slug until after they save. What if they want to
preview or tweak the slug before saving? A custom field component lets
them click "Generate" to see the slug instantly, then edit it if needed.

---

## 2. What you'll learn — Payload

> **Official docs:** [Custom Components — Field](https://payloadcms.com/docs/admin/components#field)

**Overriding a field's component:**

| Pattern | What it does |
|---|---|
| `type: 'ui'` + `components.Field` | Adds a component, stores nothing |
| Any field + `components.Field` | **Replaces** the default field UI but keeps data storage |

The difference: a `ui` field stores nothing. But putting `components.Field`
on a `text` field replaces how it **renders** while still saving to the
database as a normal text field.

**Payload UI hooks you'll use:**

| Hook | What it gives you |
|---|---|
| `useField` | `value` and `setValue` for the current field |
| `useWatchForm` | `getDataByPath` to read any other field's value |
| `useFieldProps` | Field config (label, required, etc.) |

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [07.1 — React + TS basics](../ts-lessons/07-react-ts/07-1-react-component-types.md)

- `TextFieldClientComponent` — Payload's type for text field overrides
- Event handler typing: `React.MouseEvent<HTMLButtonElement>`
- Typing the return value of `useField<string>()`

---

## 4. Builds on

- [Step 07.1 — ui field component](07-1-ui-field-component.md) — the basic pattern
- [Step 06.1 — slugify hook](06-1-before-change-slug.md) — the slugify logic we'll reuse
- [Step 01.3 — slug field](01-3-slug.md) — the field we're replacing

---

## 5. Steps

### 5a. Create a shared slugify utility

We already have the hook version in `src/hooks/slugify.ts`. Let's extract
the pure slugify logic so both the hook and the component can use it.

Create `src/utilities/formatSlug.ts`:

```ts
export const formatSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
```

### 5b. Create the custom slug component

Create `src/components/SlugField.tsx`:

```tsx
'use client'

import { TextInput, FieldLabel, useField, useWatchForm } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'

export const SlugField: TextFieldClientComponent = ({ field }) => {
  const { value, setValue } = useField<string>({ path: 'slug' })
  const { getDataByPath } = useWatchForm()

  const handleGenerate = () => {
    const title = getDataByPath<string>('title') || ''
    if (title) {
      setValue(formatSlug(title))
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <FieldLabel label={field.label || 'Slug'} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            path="slug"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          style={{
            padding: '10px 16px',
            cursor: 'pointer',
            backgroundColor: 'var(--theme-elevation-150)',
            border: '1px solid var(--theme-elevation-250)',
            borderRadius: '4px',
            color: 'var(--theme-text)',
            whiteSpace: 'nowrap',
          }}
        >
          Generate
        </button>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '4px' }}>
        Auto-generated from title. Edit manually if needed.
      </p>
    </div>
  )
}
```

**What's happening:**

| Piece | What it does |
|---|---|
| `TextFieldClientComponent` | Payload's type — tells TS this component replaces a text field |
| `field` prop | Payload passes the field config (label, required, etc.) |
| `useField<string>({ path: 'slug' })` | Reads and writes the slug field's value |
| `useWatchForm` | Reads the title field's current value |
| `formatSlug()` | The same slugify logic from our hook |
| `var(--theme-*)` | Payload's CSS variables — respects light/dark mode |

### 5c. Update the slug field in Posts

Open `src/collections/Posts.ts`. Update the slug field to use the
custom component:

```ts
{
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    components: {
      Field: '/src/components/SlugField',
    },
  },
},
```

That's it — Payload replaces the default text input with your component
but still stores the value as a normal `text` field.

---

## 6. Verify

- [ ] Dev server restarts and compiles the import map
- [ ] Open a post → slug field shows a text input with a "Generate" button
- [ ] Type a title → click "Generate" → slug populates from title
- [ ] You can manually edit the slug after generating
- [ ] The slug still saves to the database correctly
- [ ] The `beforeChange` hook still works on save (belt-and-suspenders)

---

## 7. Commit

```bash
git add src/utilities/formatSlug.ts src/components/SlugField.tsx src/collections/Posts.ts
git commit -m "step 07.2 — custom slug field with Generate button"
```

---

## 8. Unlocks

- **Step 07.3** — Custom cell components for the list view
- You now know how to **override** any field's rendering while keeping
  its data storage. This is the pattern behind every custom admin UI in
  Payload — the PriceInput component in SGT uses exactly this pattern.

---

| Nav | |
|---|---|
| ← Previous | [Step 07.1 — ui field component](07-1-ui-field-component.md) |
| → Next | [Step 07.3 — custom cell component](07-3-custom-cell-component.md) |
