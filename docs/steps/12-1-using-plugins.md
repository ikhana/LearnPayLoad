# Step 12.1 — Using plugins

Install and configure the SEO plugin — your first taste of how Payload
plugins extend a project with zero custom code.

---

## 1. The story

You need SEO fields on every page — title, description, preview image.
You could add those fields manually to every collection. Or you could
install `@payloadcms/plugin-seo` and get all of it in one line.

Plugins are the Payload ecosystem's power move. SGT uses 7 plugins:
SEO, redirects, nested docs, form builder, search, Stripe, and Payload
Cloud. Each one adds collections, fields, hooks, and admin UI
automatically.

---

## 2. What you'll learn — Payload

> **Official docs:** [Plugins Overview](https://payloadcms.com/docs/plugins/overview)
> **Skill reference:** `.claude/skills/payload/reference/ADVANCED.md` → Plugins

**How plugins work:**

A plugin is a function that takes your config and returns a modified
config. It can:
- Add new collections (e.g., `redirects`, `forms`, `search`)
- Add fields to your existing collections (e.g., SEO fields on Pages)
- Add hooks (e.g., revalidation after redirect changes)
- Add admin UI components (e.g., SEO preview panel)
- Add endpoints (e.g., Stripe webhooks)

```ts
// A plugin is just: (incomingConfig) => modifiedConfig
plugins: [
  seoPlugin({ ... }),       // adds SEO fields to collections
  redirectsPlugin({ ... }), // creates a redirects collection
  stripePlugin({ ... }),    // adds Stripe integration
]
```

**Plugin execution order:** Plugins run in array order. Each one
receives the config that the previous one returned. This means later
plugins see fields/collections added by earlier ones.

---

## 3. What you'll learn — TypeScript

- Plugin option types (each plugin exports its config type)
- How plugins extend your generated types (new fields appear in
  `payload-types.ts` after `generate:types`)
- Module augmentation (how plugins add to Payload's type system)

---

## 4. Builds on

- [Step 09.1 — Pages collection](09-1-first-block.md) — we'll add SEO to Pages
- [Step 01 — Posts collection](01-1-skeleton.md) — we'll add SEO to Posts

---

## 5. Steps

### 5a. Install the SEO plugin

```bash
pnpm add @payloadcms/plugin-seo
```

### 5b. Configure the plugin

Open `src/payload.config.ts`:

```ts
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Page, Post } from '@/payload-types'

const generateTitle: GenerateTitle<Page | Post> = ({ doc }) => {
  return doc?.title ? `${doc.title} | My Site` : 'My Site'
}

const generateURL: GenerateURL<Page | Post> = ({ doc }) => {
  return doc?.slug ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${doc.slug}` : ''
}

export default buildConfig({
  // ... existing config

  plugins: [
    seoPlugin({
      generateTitle,
      generateURL,
    }),
  ],

  // ... rest of config
})
```

**What the SEO plugin adds:**

| What | Where |
|---|---|
| `meta.title` field | Tab on every collection |
| `meta.description` field | Tab on every collection |
| `meta.image` upload field | Tab on every collection |
| SEO preview component | Shows Google search preview in admin |
| `generateTitle` | Auto-fills the SEO title from doc fields |
| `generateURL` | Auto-fills the canonical URL from slug |

### 5c. Limit to specific collections (optional)

By default, the SEO plugin adds fields to ALL collections. To limit
it to only Pages and Posts:

```ts
seoPlugin({
  collections: ['pages', 'posts'],
  generateTitle,
  generateURL,
}),
```

### 5d. How SGT organizes plugins

SGT keeps plugins in a separate file for cleanliness:

```
src/
  plugins/
    index.ts    ← exports Plugin[] array
```

```ts
// src/plugins/index.ts
import { Plugin } from 'payload'
import { seoPlugin } from '@payloadcms/plugin-seo'
// ... other plugin imports

export const plugins: Plugin[] = [
  seoPlugin({ ... }),
  // ... other plugins
]
```

```ts
// payload.config.ts
import { plugins } from './plugins'

export default buildConfig({
  // ...
  plugins: [...plugins],
})
```

This keeps your config file clean when you have 5+ plugins.

### 5e. Other official plugins worth knowing

| Plugin | What it does | SGT uses? |
|---|---|---|
| `@payloadcms/plugin-seo` | SEO meta fields + preview | Yes |
| `@payloadcms/plugin-redirects` | Redirect management collection | Yes |
| `@payloadcms/plugin-nested-docs` | Parent/child doc relationships with breadcrumbs | Yes |
| `@payloadcms/plugin-form-builder` | Drag-and-drop form builder | Yes |
| `@payloadcms/plugin-search` | Full-text search collection | Yes |
| `@payloadcms/plugin-stripe` | Stripe integration + webhooks | Yes |
| `@payloadcms/payload-cloud` | Payload Cloud hosting integration | Yes |
| `@payloadcms/plugin-import-export` | Import/export collection data | No |

### 5f. Generate types

```bash
pnpm generate:types
```

Check `payload-types.ts` — your `Page` and `Post` interfaces now have
a `meta` object with `title`, `description`, and `image` fields. The
plugin injected those fields into your collections automatically.

---

## 6. Verify

- [ ] `pnpm add @payloadcms/plugin-seo` installs without errors
- [ ] Dev server starts without errors
- [ ] Edit a Page → you see a new "SEO" tab with title, description, image fields
- [ ] The SEO title auto-fills from the page title via `generateTitle`
- [ ] The SEO preview shows how it would look in Google search
- [ ] Edit a Post → same SEO tab appears
- [ ] `payload-types.ts` has `meta` object on Page and Post interfaces
- [ ] Non-SEO collections (Categories, Tags) don't have the SEO tab (if you used `collections` option)

---

## 7. Commit

```bash
git add package.json pnpm-lock.yaml src/payload.config.ts src/payload-types.ts
git commit -m "step 12.1 — SEO plugin on Pages and Posts"
```

---

## 8. Unlocks

- **Step 12.2** — Writing your own plugin from scratch
- You now understand the plugin system from the consumer side. Next
  you'll see how plugins work internally — which is exactly how your
  AI SEO plugin will work.
- **Interview connection:** "What plugins have you used?" → SEO,
  redirects, nested docs, form builder, search, Stripe — all on SGT.
  Know what each does and why you chose it.

---

| Nav | |
|---|---|
| ← Previous | [Step 11.1 — localization](11-1-localization.md) |
| → Next | [Step 12.2 — writing a plugin](12-2-writing-a-plugin.md) |
