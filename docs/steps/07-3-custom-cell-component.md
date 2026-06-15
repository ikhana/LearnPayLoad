# Step 07.3 — Custom cell component — status badge in list view

Add a colored status badge to the Posts list view. Instead of plain text
"draft" or "published", show a styled pill with color coding.

---

## 1. The story

The Posts list view shows "draft" and "published" as plain text. In a
real CMS, editors scan the list quickly — a green/yellow badge is faster
to parse than reading words. This is a custom **cell** component: it
changes how a field renders in the **list view** (not the edit form).

---

## 2. What you'll learn — Payload

> **Official docs:** [Custom Components — Cell](https://payloadcms.com/docs/admin/components#cell)

**Field component vs Cell component:**

| Slot | Where it renders | What it replaces |
|---|---|---|
| `components.Field` | Edit view (the form) | The field's input |
| `components.Cell` | List view (the table) | The field's column cell |

You can use one, both, or neither on any field.

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [07.1 — React + TS basics](../ts-lessons/07-react-ts/07-1-react-component-types.md)

- Props typing for cell components
- Conditional styling with TypeScript (mapping values to colors)
- `Record<string, string>` for lookup objects

---

## 4. Builds on

- [Step 07.1 — ui field component](07-1-ui-field-component.md) — the `'use client'` + path pattern
- [Step 01.8 — status field](01-8-status.md) — the field we're enhancing

---

## 5. Steps

### 5a. Create the cell component

Create `src/components/StatusCell.tsx`:

```tsx
'use client'

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#fef3c7', text: '#92400e' },
  published: { bg: '#d1fae5', text: '#065f46' },
}

export const StatusCell = ({ cellData }: { cellData: string }) => {
  const status = cellData || 'draft'
  const colors = statusColors[status] || statusColors.draft

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.text,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}
```

**What's happening:**

| Piece | What it does |
|---|---|
| `{ cellData: string }` | We type only what we need — Payload passes `cellData` as a prop to cell components |
| `Record<string, { bg; text }>` | A TS type — an object where keys are strings and values are color pairs |
| `cellData` | The field's value for this row — Payload passes it as a serializable prop |

> **Why not `DefaultCellComponentProps`?** That type includes an `onClick`
> function, which isn't serializable across the server/client boundary.
> For simple cells, typing just the props you use is cleaner.

### 5b. Add the cell component to the status field

Open `src/collections/Posts.ts`. Update the status field:

```ts
{
  name: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
  required: true,
  admin: {
    position: 'sidebar',
    components: {
      Cell: '/src/components/StatusCell',
    },
  },
},
```

### 5c. Regenerate types and restart

```bash
pnpm dev
```

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Go to the Posts list view
- [ ] The status column shows colored badges instead of plain text
- [ ] Draft posts show a yellow/amber badge
- [ ] Published posts show a green badge
- [ ] Clicking through to edit a post — the status field still works normally
  (the Cell component only affects the list view)

---

## 7. Commit

```bash
git add src/components/StatusCell.tsx src/collections/Posts.ts
git commit -m "step 07.3 — custom cell component for status badge"
```

---

## 8. Unlocks

- **Step 08** — Custom endpoints (your own API routes)
- You now know all three component slots: `ui` field (no data), `Field`
  override (edit view), and `Cell` override (list view). These three
  patterns cover 90% of admin customization in Payload.
- **Interview connection:** The SGT project's `PriceInput` component and
  the `VariantSelect` component both use the same `Field` override
  pattern you just learned.

---

| Nav | |
|---|---|
| ← Previous | [Step 07.2 — custom slug field](07-2-custom-slug-field.md) |
| → Next | [Step 08.1 — custom API endpoint](08-1-custom-endpoint.md) |
