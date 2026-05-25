# Step 01 — Your first collection (Posts)

Add a `Posts` collection with seven fields covering most of Payload's common
field types. Watch the admin UI generate itself from your config alone.

---

## 1. The story

Step 00 gave us a working Payload app with `Users` + `Media`. Now we add the
first content type: `Posts`. Title, slug, content, status — the canonical CMS
data shape every blog and CMS-driven site has. Every later step in this
curriculum either uses Posts or extends it.

For the AI SEO plugin project this repo is building toward, `Posts` is also
the first thing the plugin will eventually analyze. So this isn't a generic
exercise — we're laying the foundation for everything that comes after.

---

## 2. What you'll learn — Payload

> **Official docs for this step:** [Collections](https://payloadcms.com/docs/configuration/collections). Companion reference: `.claude/skills/payload/reference/COLLECTIONS.md` (installed when you scaffolded with Claude Code support).

- **What a collection is.** A collection is the Payload equivalent of a table
  (Postgres / SQLite) or a document type (Mongo). The collection config
  defines:
  - A **`slug`** — URL-safe identifier used by the REST/GraphQL API and the admin sidebar
  - **`fields`** — the data shape
  - **`admin`** options — how the collection presents in the admin UI
  - *(Optional, later steps)* access control, hooks, lifecycle events
- **How a collection lands in the admin UI.** Payload reads `collections`
  from `payload.config.ts` and auto-generates: a sidebar entry, a list view,
  a detail/edit view, and the REST + GraphQL endpoints. No UI code from us.
- **Field types we'll use this step:**
  - `text` — single-line strings
  - `textarea` — multi-line strings
  - `richText` (with the `lexicalEditor` configured in step 00) — block-level rich content
  - `upload` — relationship to a media collection (featured image)
  - `date` — datetime values
  - `select` — enum of options
- **Admin niceties:**
  - `useAsTitle` — which field labels the document in lists and breadcrumbs
  - `defaultColumns` — which columns appear in list view
  - `group` — which section the collection lives in inside the sidebar
  - `description` — help text shown above the form
  - `admin: { position: 'sidebar' }` on individual fields — pushes a field out of the main edit area into the sidebar (great for slug, status, publishedAt)

---

## 3. What you'll learn — TypeScript

**Lesson: interfaces & type aliases — typing `CollectionConfig`.**

Payload exports `CollectionConfig` as a TypeScript type. Annotate your
collection object with `: CollectionConfig` to unlock autocomplete and
compile-time checking on every option.

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  // your fields here — autocomplete works on every property
}
```

**Why annotate?** Three concrete wins:

1. **Autocomplete in your editor** for every option (`name`, `type`, `required`, `unique`, `admin`, `hooks`, etc.)
2. **Typos become compile errors.** `type: 'tex'` doesn't compile; the editor flags it red before you even save.
3. **Required vs optional properties are enforced.** Forget `slug` on a collection? Compile error.

**`type` vs `interface` in TypeScript:**

- **`interface`** — best for object shapes you expect to be extended later (e.g., via declaration merging). Class-like contracts.
- **`type`** — best for unions, intersections, primitives, mapped types, or shapes that won't be extended.
- **For consumer code** (you, importing `CollectionConfig`) it doesn't matter — you're *using* the type, not designing it. Payload uses both styles in different places; pick what reads naturally in your own code.

**`import type` syntax.** `import type { ... } from '...'` tells TypeScript
"this is a type-only import, no runtime code." Modern bundlers strip the
import at build time, keeping your JS bundle smaller and avoiding accidental
side-effects from a library's runtime initialization.

That `: CollectionConfig` annotation is the entire lesson. Strip it, and you
lose autocomplete + compile checking. Keep it, and the editor becomes your
safety net.

---

## 4. Builds on

- **Step 00** — you have a working Payload app, the dev server runs, the admin login works, and `src/collections/` already exists with `Users.ts` and `Media.ts`.
- **`src/payload.config.ts`** has `collections: [Users, Media]` which we'll extend.
- **`lexicalEditor`** is already configured globally in `payload.config.ts`, so any `richText` field on any collection uses it.

---

## 5. Steps

> **Follow [Collections](https://payloadcms.com/docs/configuration/collections) alongside this step.** Also useful: [Fields overview](https://payloadcms.com/docs/fields/overview).

### 5.1 — Create the Posts collection file

Make a new file at `src/collections/Posts.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    group: 'Content',
    description:
      'Blog posts and articles — the canonical content type our AI SEO plugin will eventually analyze.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description:
          'Short summary used on listing pages and as a fallback meta description.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
```

**Why each field is here:**

| Field | Why |
|---|---|
| `title` | Primary identifier; what the admin list view labels each row with (`useAsTitle: 'title'`). |
| `slug` | URL path. `unique: true` prevents two posts sharing the same URL; `index: true` makes lookup queries fast; sidebar position keeps it out of the way of editors. |
| `excerpt` | Preview text on listings; also a useful fallback for SEO meta description once the plugin lands. |
| `content` | The main body. Rich text via the Lexical editor (already configured globally in `payload.config.ts`). |
| `featuredImage` | Hero / OG image. Relationship to the existing `Media` collection from step 00. |
| `publishedAt` | When this post is intended to be visible. Intentionally separate from the auto `createdAt`. |
| `status` | Manual publish gate. We graduate to proper drafts/versions in step 10. |

`timestamps: true` adds `createdAt` and `updatedAt` automatically. Almost
always on for content collections.

### 5.2 — Register Posts in `payload.config.ts`

Open `src/payload.config.ts`. Add the import and put `Posts` in the
`collections` array:

```ts
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts' // ← new line

export default buildConfig({
  // ...everything else stays the same...
  collections: [Users, Media, Posts], // ← Posts added at the end
  // ...
})
```

Order in the array controls sidebar order in the admin UI.

### 5.3 — Restart the dev server

If `pnpm dev` is still running, stop it (Ctrl+C) and start it again:

```bash
pnpm dev
```

You should see Payload re-init with the new collection. If there are
TypeScript errors in the terminal, the `: CollectionConfig` annotation is
doing its job — it's catching whatever's wrong. Fix the error and the server
picks it up.

### 5.4 — Generate TypeScript types

Payload generates a `src/payload-types.ts` file with TS types for every
collection. Run:

```bash
pnpm generate:types
```

Open `src/payload-types.ts`. Find your new `Post` interface (Payload
singularizes the collection slug into a type name). The interface includes
every field you defined plus `id`, `createdAt`, `updatedAt`.

Now in any future code:

```ts
import type { Post } from '@/payload-types'

function format(post: Post) {
  // full type safety on post.title, post.featuredImage, post.status, etc.
}
```

The loop you'll repeat every step from here on: **edit collection → run `generate:types` → use the types everywhere**.

### 5.5 — Create one test post

In the admin UI (`http://localhost:3000/admin`):

1. Click **Posts** in the sidebar (under the "Content" group).
2. Click **Create New**.
3. Fill in `title`, `slug`, a short `excerpt`, some rich text in `content`. Leave `status` as `Draft`.
4. Click **Save**.

If you see your post in the list view with columns `title`, `status`,
`publishedAt`, `updatedAt`, the collection is wired correctly.

---

## 6. Verify

- [ ] `src/collections/Posts.ts` exists and exports `Posts`
- [ ] `src/payload.config.ts` imports `Posts` and includes it in the `collections` array
- [ ] `pnpm dev` runs cleanly with no Payload startup errors
- [ ] **Posts** appears in the admin sidebar under the **Content** group
- [ ] List view's `defaultColumns` show `title`, `status`, `publishedAt`, `updatedAt`
- [ ] You created one test post and it appears in the list view
- [ ] `pnpm generate:types` ran without errors
- [ ] `src/payload-types.ts` now contains a `Post` interface with all your fields
- [ ] Try removing the `: CollectionConfig` annotation in `Posts.ts` once — see what type errors light up, then put it back. That's the entire TS lesson in one experiment.

Commit:

```bash
git add .
git commit -m "step 01 — add Posts collection (text, slug, richText, upload, date, select)"
```

---

## 7. Unlocks

- **Step 02 — Relationships.** With Posts existing, we can introduce real relationships: a `Categories` collection that has many Posts, and a `Tags` many-to-many. The `relationship` field type makes both possible. The TS lesson at step 02 is **generic types** — `Field<T>`, `RelationshipField<T>`, and how Payload uses them to type the relationship's other side at the type level.
- **For the SEO plugin track:** `Posts` is the canonical content type the plugin will read, analyze, and write meta tags onto. From step 07's custom field component (the SEO analysis sidebar) onward, every plugin feature mounts against a collection that exposes a content field — and Posts is the prototype.
- **The auto-generated `Post` type** is now available throughout the codebase. Any custom endpoint, hook, or React component that operates on posts gets type-safe access from here forward.
