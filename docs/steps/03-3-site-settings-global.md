# Step 03.3 — Site Settings global

Create a Site Settings global for site-wide configuration: name,
tagline, default OG image. This is where the SEO plugin will read
fallback meta data.

---

## 1. The story

Every site has settings that don't belong to any single page or post:
the site name, a tagline, a default social-share image for pages that
don't have their own. CMS teams call this "site settings" or "site
config."

For the SEO plugin, this is important — when a post doesn't have custom
meta, the plugin falls back to the site-wide defaults stored here.

---

## 2. What you'll learn — Payload

> **Official docs:** [Globals](https://payloadcms.com/docs/configuration/globals)

**New concept: `group` field type.** Not `admin.group` (which organizes
the sidebar) — this is a field type that visually groups sub-fields under
a collapsible panel in the admin UI. It doesn't affect the data shape, it
just makes the form more organized.

```ts
{
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
```

In the data, this nests: `siteSettings.seo.metaTitle`. The `group` field
creates an object in the stored data.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [02.3 — Nested objects](../ts-lessons/02-object-shapes/02-3-nested-objects.md)
>
> The `group` field creates a nested object in the generated types.
> `siteSettings.seo.metaTitle` is the same nesting pattern you learned
> in lesson 02.3.

When you run `generate:types` later, notice how the `group` field
becomes a nested interface — Payload generates a type for the group's
shape.

---

## 4. Builds on

- **Step 03.1** — Header global pattern.
- **Step 01.6** — upload field for `defaultOgImage`, same as
  `featuredImage`.

---

## 5. Steps

### 5.1 — Create the Site Settings global

Create `src/globals/SiteSettings.ts`:

```ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'My Payload Site',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'A short tagline for the site — used in the title bar and meta tags.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Default SEO',
      admin: {
        description: 'Fallback SEO values when a page or post does not have its own.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Default meta title. The site name is appended automatically.',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Default meta description (max 160 characters).',
          },
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default social share image when a page has no featured image.',
          },
        },
      ],
    },
  ],
}
```

**What's new here:**

- `type: 'group'` — visually groups SEO fields under a collapsible panel
- `maxLength: 160` on textarea — enforces a character limit in the admin
  UI (meta descriptions should be under 160 chars)
- This global is the foundation the SEO plugin will read from

### 5.2 — Register in payload.config.ts

Add the import:

```ts
import { SiteSettings } from './globals/SiteSettings'
```

Update the globals array:

```ts
globals: [Header, Footer, SiteSettings],
```

### 5.3 — Restart and test

Restart `pnpm dev`. Open `/admin`. Click **Site Settings** in the
sidebar. You should see:

- `siteName` pre-filled with "My Payload Site"
- `tagline` text field
- A collapsible **Default SEO** group with meta title, meta description,
  and a media upload for the default OG image

Fill in some values and save.

### 5.4 — Explore: group vs no group

Notice how the SEO fields are visually grouped together with a heading.
If you moved `metaTitle` out of the `group` and into the top-level
`fields` array, it would appear as a flat field alongside `siteName`.

The `group` field does two things:
1. **Admin UI** — collapsible panel for visual organization
2. **Data shape** — nests the fields: `seo.metaTitle` instead of
   `metaTitle`

---

## 6. Verify

- [ ] `src/globals/SiteSettings.ts` exists with `group` field for SEO
- [ ] `payload.config.ts` has `globals: [Header, Footer, SiteSettings]`
- [ ] Site Settings appears in sidebar
- [ ] The SEO group is collapsible and contains 3 fields
- [ ] `metaDescription` enforces the 160-char limit in the admin
- [ ] You can pick a default OG image from Media

Commit:

```bash
git add src/globals/SiteSettings.ts src/payload.config.ts
git commit -m "step 03.3 — Site Settings global with SEO group"
```

---

## 7. Unlocks

- **Step 03.4** — Admin polish for globals (`admin.group: 'Settings'`
  to organize the sidebar).
- The SEO plugin (future) will read `siteSettings.seo.*` as fallback
  meta values.
