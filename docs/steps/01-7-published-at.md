# Step 01.7 — Add the `publishedAt` field (date)

Add a date-and-time field, push it to the sidebar, and configure the date
picker to include time-of-day.

---

## 1. The story

Every post needs to track *when* it was published. Payload already adds
`createdAt` and `updatedAt` automatically once we enable `timestamps: true`
(we do that in 01.9). But those are when the post was *created* and last
*edited* — not necessarily when it was *intended to be visible*.

A `publishedAt` field is the editor's manual control: "this post becomes
visible at this time." You can backdate it (for archival imports) or
schedule it for the future (for content calendars).

In this sub-step we add the date field, move it to the sidebar, and
configure its picker UI to include time-of-day.

---

## 2. What you'll learn — Payload

> **Official docs:** [Date Field](https://payloadcms.com/docs/fields/date)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md`

- **The `date` field type.** Stores a datetime value. The admin shows a date picker; the database stores it as a timestamp or ISO string depending on the adapter.
- **`admin: { date: { ... } }`.** A nested-nested admin config. `admin` is the outer wrapper, `date` is a sub-object that holds date-specific picker options.
- **`pickerAppearance`.** A literal union: `'dayAndTime' | 'dayOnly' | 'monthOnly' | 'timeOnly' | 'default'`. Controls what the date picker UI lets the user select.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [02 — Object types](../ts-lessons/02-object-types.md) (nested objects), [04 — Optional properties](../ts-lessons/04-optional-and-null.md)

One concept: **two-level nesting**. `admin: { date: { pickerAppearance: 'dayAndTime' } }`
nests `date` inside `admin`. Each level has its own typed shape.
Autocomplete works at every depth — type `admin: { date: { ` and press
`Ctrl+Space`.

Every level is optional (`?`). You can omit `date` entirely or include
it without `pickerAppearance`. The annotation only validates what you
*do* include.

---

## 4. Builds on

- **Step 01.4** — you've used `admin: { description: '...' }`. Same pattern, one level deeper this time.
- **Step 01.3** — you've used `admin: { position: 'sidebar' }`. We'll combine `position` and `date` in the same admin block this step.

---

## 5. Steps

### 5.1 — Add the date field, minimal

After featuredImage, add:

```ts
{
  name: 'publishedAt',
  type: 'date',
},
```

Save. Refresh a post's edit view. **A date picker appears below the featured image** — currently with day-only granularity (Payload's default).

### 5.2 — Move it to the sidebar

Like slug, publishedAt is metadata-ish, not main content. Push it to the sidebar:

```ts
{
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
  },
},
```

Save. Refresh. The date picker is now in the right sidebar, next to slug.

### 5.3 — Add the nested `date` config

Now configure the picker to show time-of-day, not just date:

```ts
{
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
},
```

Save. Refresh. **The picker now shows hours and minutes** in addition to the date. You can pick `2026-05-25 13:45` instead of just `2026-05-25`.

### 5.4 — Try autocomplete inside the nested `date`

Place your cursor inside the `date: { }` block, after `pickerAppearance:`. Press `Ctrl+Space`. The list shows other properties you can configure inside `date`: `displayFormat`, `monthsToShow`, `minDate`, `maxDate`, `timeFormat`, and more.

Same autocomplete as 01.4, just one level deeper. The annotation still works.

### 5.5 — Break it: invalid pickerAppearance

Set `pickerAppearance` to a value that isn't in the union:

```ts
pickerAppearance: 'fancy', // ← invalid
```

**Red squiggle.** The error lists the valid options: `'dayAndTime' | 'dayOnly' | 'monthOnly' | 'timeOnly' | 'default'`. Same string-literal-union pattern as 01.2 and 01.6, just applied to a deeply-nested property.

Fix it back to `'dayAndTime'`.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` has the publishedAt field with `name: 'publishedAt'`, `type: 'date'`, `admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } }`
- [ ] In the admin, publishedAt is in the right sidebar
- [ ] The picker lets you select both date AND time-of-day
- [ ] Autocomplete worked when you triggered it inside the nested `date: {}` block
- [ ] You saw the red squiggle on `pickerAppearance: 'fancy'` in 5.5

Commit:

```bash
git add .
git commit -m "step 01.7 — add Posts.publishedAt field (date, sidebar, day+time picker)"
```

---

## 7. Unlocks

- **Step 01.8** — `status` (select). The last field. Introduces options arrays — and an interesting TS quirk: select options can be written two different ways (array of strings, or array of `{ label, value }` objects).
- The "type nests as deep as needed" lesson is the foundation for understanding hooks (`hooks: { beforeChange: [fn1, fn2] }` — nesting + arrays of functions) and globals (similar) in future steps.
