# Step 07.1 — Your first custom component — a `ui` field

Add a character counter below the excerpt field using a custom React
component. No data stored — pure admin UI enhancement.

---

## 1. The story

Editors need to know how long their excerpt is while typing. Search
engines cut meta descriptions at ~155 characters. Rather than counting
manually, we'll show a live character count right in the admin panel.

This is the simplest possible custom component — a `ui` field that
renders React in the admin but stores nothing in the database.

---

## 2. What you'll learn — Payload

> **Official docs:** [Custom Components](https://payloadcms.com/docs/admin/components)
> **Skill reference:** `.claude/skills/payload/reference/ADVANCED.md` → Custom Components

**Custom components in Payload:**

| Concept | What it means |
|---|---|
| `ui` field type | A field that renders a React component but stores no data |
| `'use client'` | Required — admin components run in the browser |
| `admin.components.Field` | Path to your component file (string, not import) |
| `useField` | Payload hook to read/write the current field's value |
| `useWatchForm` | Payload hook to watch other fields in the form |

**Why string paths, not imports?**

Payload uses a special import map system. You pass the **file path** as
a string (e.g., `'/src/components/CharCount'`), and Payload resolves it
at build time. This keeps server code out of the client bundle.

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [07.1 — React + TS basics](../ts-lessons/07-react-ts/07-1-react-component-types.md)

- `'use client'` directive — tells Next.js this is a client component
- Typing React components with arrow functions
- The `FC` (FunctionComponent) type — and why you might skip it
- Importing types from `@payloadcms/ui`

---

## 4. Builds on

- [Step 01.4 — excerpt field](01-4-excerpt.md) — the field we're enhancing
- [Step 06 — hooks](06-1-before-change-slug.md) — server-side logic vs client-side UI

---

## 5. Steps

### 5a. Create the component file

Create `src/components/ExcerptCharCount.tsx`:

```tsx
'use client'

import { useWatchForm } from '@payloadcms/ui'

export const ExcerptCharCount = () => {
  const { getDataByPath } = useWatchForm()

  const excerpt = getDataByPath<string>('excerpt') || ''
  const count = excerpt.length
  const limit = 155

  const color = count > limit ? 'red' : count > 120 ? 'orange' : 'green'

  return (
    <div style={{ fontSize: '13px', color, padding: '4px 0' }}>
      {count} / {limit} characters
      {count > limit && ' — too long for meta descriptions'}
    </div>
  )
}
```

**What's happening:**

| Line | What it does |
|---|---|
| `'use client'` | Required — this runs in the browser |
| `useWatchForm()` | Payload hook that watches the entire form's state |
| `getDataByPath('excerpt')` | Reads the current value of the `excerpt` field |
| The color logic | Green under 120, orange 120–155, red over 155 |

### 5b. Add the `ui` field to Posts

Open `src/collections/Posts.ts`. Add a `ui` field right **after** the
`excerpt` field:

```ts
{
  name: 'excerpt',
  type: 'textarea',
  admin: {
    description: 'Short summary used on listing pages and as a fallback meta description.',
  },
},
// 👇 Add this right after excerpt
{
  name: 'excerptCharCount',
  type: 'ui',
  admin: {
    components: {
      Field: '/src/components/ExcerptCharCount',
    },
  },
},
```

**Key points:**

- `type: 'ui'` — no data stored, just renders a component
- The `name` is required but won't appear in the database
- The `Field` path uses forward slashes, starts from the project root
- No `#` export syntax needed — we're using the default export name

### 5c. Run the import map

After adding a custom component, Payload needs to update its import map:

```bash
pnpm dev
```

Payload regenerates the import map automatically when you start dev.
You'll see `Compiling import map` in the terminal.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Open a post in the admin → you see the character count below excerpt
- [ ] Type in the excerpt field → count updates live
- [ ] Count turns orange above 120 characters
- [ ] Count turns red above 155 characters with a warning message
- [ ] The `excerptCharCount` field does NOT appear in the API response (`/api/posts`)

---

## 7. Commit

```bash
git add src/components/ExcerptCharCount.tsx src/collections/Posts.ts
git commit -m "step 07.1 — ui field character counter for excerpt"
```

---

## 8. Unlocks

- **Step 07.2** — Custom field component that replaces an existing field
  (not just adds UI alongside it)
- **Step 07.3** — Custom cell component for the list view
- You now know the pattern: `'use client'` + Payload UI hooks + string
  path in the config. Every custom admin feature uses this same pattern.

---

| Nav | |
|---|---|
| ← Previous | [Step 06.3 — hook context & loops](06-3-hook-context-loops.md) |
| → Next | [Step 07.2 — custom slug field](07-2-custom-slug-field.md) |
