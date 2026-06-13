# Step 03.1 — Header global

Create your first **global** — a single-instance document for the site
header. Globals live in `src/globals/` and use `GlobalConfig` instead of
`CollectionConfig`.

---

## 1. The story

Every site has a header — logo, navigation links. Unlike posts or
categories, there's only ever **one** header. You don't "create another
header." You edit *the* header.

That's what globals are: single documents. No list view, no "create new."
Just one form that you edit. The SEO plugin will eventually read the
site-wide settings from a global to build default meta tags.

---

## 2. What you'll learn — Payload

> **Official docs:** [Globals](https://payloadcms.com/docs/configuration/globals)
> **Skill reference:** `.claude/skills/payload/reference/COLLECTIONS.md` → Globals section

**Globals vs. Collections:**

| | Collection | Global |
|---|---|---|
| Type | `CollectionConfig` | `GlobalConfig` |
| Instances | Many documents | Exactly one |
| Sidebar | Shows list view | Shows edit form directly |
| API | `/api/posts` (CRUD) | `/api/globals/header` (read/update) |
| Config key | `collections: [...]` | `globals: [...]` |

The `fields` array works exactly the same. If you can build a collection,
you can build a global — just swap the type and the config key.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [03.1 — Literal types](../ts-lessons/03-restricting-values/03-1-literal-types.md)
>
> You've used `CollectionConfig` many times. Now you'll use `GlobalConfig`
> — same idea, different type. The TS concept here is **recognizing that
> different types enforce different shapes**. `GlobalConfig` doesn't have
> `auth` or `upload` because globals don't support those features.

Hover over `GlobalConfig` in VS Code after you write the import. Compare
what autocomplete offers vs `CollectionConfig`. Fewer options — because
globals are simpler.

---

## 4. Builds on

- **Step 01.1** — same pattern: create file, define config, register.
  But this time it's a global, not a collection.
- **Step 01.6** — we used `upload` + `relationTo` for `featuredImage`.
  The header will use the same pattern for a logo.

---

## 5. Steps

### 5.1 — Create the globals directory

Create `src/globals/` — this is where all globals live. Same convention
as `src/collections/`.

### 5.2 — Create the Header global

Create `src/globals/Header.ts`:

```ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'nav',
      type: 'array',
      label: 'Navigation Links',
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
```

**What's new here:**

- `GlobalConfig` instead of `CollectionConfig`
- `array` field type — a repeatable group of sub-fields. Each nav item
  has a `label` and `url`. The user can add up to 8 (`maxRows: 8`).
- No `useAsTitle` — globals don't have a list view, so there's nothing
  to title.

### 5.3 — Register in payload.config.ts

Open `src/payload.config.ts`. Add the import:

```ts
import { Header } from './globals/Header'
```

Add a `globals` key to `buildConfig` (it doesn't exist yet):

```ts
export default buildConfig({
  // ... existing config
  collections: [Users, Media, Posts, Categories, Tags],
  globals: [Header],
  // ...
})
```

Save both files.

### 5.4 — Restart dev server and verify

Stop and restart `pnpm dev`. Open `/admin`.

You should see **Header** in the sidebar — but it's NOT under a list.
Click it and you go straight to an edit form. No "create new" button.
That's the global difference.

### 5.5 — Break it: use CollectionConfig

In `Header.ts`, temporarily change:

```ts
import type { CollectionConfig } from 'payload'

export const Header: CollectionConfig = {
```

**Red squiggles.** `CollectionConfig` expects different properties than
what globals need. The type catches the mistake before you even save.

Change it back to `GlobalConfig`. Squiggles gone.

### 5.6 — Test it: add a logo and nav links

1. Upload an image in Media first (any image — this is the logo)
2. Go to Header, pick that image as the logo
3. Add 2-3 nav links: `Home` → `/`, `Blog` → `/blog`, `About` → `/about`
4. Save

---

## 6. Verify

- [ ] `src/globals/Header.ts` exists with `GlobalConfig` type
- [ ] `payload.config.ts` imports Header and has `globals: [Header]`
- [ ] Header shows in sidebar as a direct edit form (not a list)
- [ ] You can set a logo and add nav links
- [ ] You saw red squiggles when using `CollectionConfig` instead (5.5)
- [ ] The `nav` array field lets you add/remove/reorder items

Commit:

```bash
git add src/globals/Header.ts src/payload.config.ts
git commit -m "step 03.1 — Header global with logo and nav array"
```

---

## 7. Unlocks

- **Step 03.2** — Footer global. Same pattern, different fields. Speed
  round.
- **Step 03.3** — Site Settings global. The SEO plugin will read default
  meta from here.
- You now know both config types Payload offers: `CollectionConfig` for
  many-document data, `GlobalConfig` for single-instance settings.
