# Step 11.1 — Localization (i18n)

Add multi-language support so editors can manage content in multiple
languages from a single document.

---

## 1. The story

Your client launches in Germany but wants the site in English too. Or
you're building for Pakistan — Urdu and English. Without localization,
you'd duplicate every page and every post for each language. That's a
maintenance nightmare.

Payload's localization lets you store multiple translations in the
same document. One "About" page, with the title in English, German,
and Urdu — each in a separate locale. The admin gets a language
switcher. The API accepts `?locale=de`.

---

## 2. What you'll learn — Payload

> **Official docs:** [Localization](https://payloadcms.com/docs/configuration/localization)
> **Skill reference:** `.claude/skills/payload/reference/ADVANCED.md` → Localization

**Core concepts:**

| Concept | What it means |
|---|---|
| `localization` in config | Enables multi-language support globally |
| `locales` array | The languages your site supports |
| `defaultLocale` | The fallback language |
| `localized: true` on a field | This field stores a value per locale |
| `fallback: true` | If a locale has no value, fall back to default |
| `?locale=de` | REST API parameter to fetch a specific language |

**How data is stored:**

Without localization:
```json
{ "title": "About Us" }
```

With localization on `title`:
```json
{
  "title": {
    "en": "About Us",
    "de": "Über Uns",
    "ur": "ہمارے بارے میں"
  }
}
```

The API returns just the value for the requested locale — the nested
object is internal storage only.

---

## 3. What you'll learn — TypeScript

- `Record<K, V>` for locale maps
- String literal unions for locale codes
- How generated types change when a field is localized

---

## 4. Builds on

- [Step 09.1 — Pages collection](09-1-first-block.md) — the collection we'll localize
- [Step 01.2 — title field](01-2-title.md) — basic field config

---

## 5. Steps

### 5a. Enable localization in the Payload config

Open `src/payload.config.ts` and add `localization`:

```ts
export default buildConfig({
  // ... existing config

  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'German',
        code: 'de',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // ... rest of config
})
```

**What each option does:**

| Option | What it does |
|---|---|
| `locales` | Array of supported languages with `label` + `code` |
| `label` | What editors see in the language switcher |
| `code` | The locale identifier used in the API (`?locale=de`) |
| `defaultLocale` | Used when no locale is specified |
| `fallback: true` | If German has no value, show the English one |

### 5b. Mark fields as localized

Enabling localization globally doesn't translate anything yet. You
need to mark specific fields with `localized: true`.

Open `src/collections/Pages.ts` — localize the `title` field:

```ts
fields: [
  {
    name: 'title',
    type: 'text',
    required: true,
    localized: true,
  },
  // ... slug stays non-localized (URLs don't change per language)
  // ... layout stays non-localized for now (blocks can be localized
  //     individually if needed)
]
```

Open `src/collections/Posts.ts` — localize `title` and `excerpt`:

```ts
{
  name: 'title',
  type: 'text',
  required: true,
  localized: true,
},
// ...
{
  name: 'excerpt',
  type: 'textarea',
  localized: true,
  admin: {
    description: 'Short summary used on listing pages and as a fallback meta description.',
  },
},
```

**What NOT to localize:**

| Field | Localize? | Why |
|---|---|---|
| `title` | Yes | Different title per language |
| `excerpt` | Yes | Different summary per language |
| `slug` | No | URLs stay the same across languages |
| `status` / `_status` | No | Publishing state is language-independent |
| `categories` / `tags` | No | Relationships point to the same docs |
| `publishedAt` | No | Dates don't change per language |
| `featuredImage` | Maybe | Usually same image, but some sites vary |

### 5c. The admin experience

After enabling localization, the admin shows a **language switcher**
in the top bar. Editors:

1. Write the English version of a page
2. Switch to German
3. Type the German version of the same fields
4. Save — one document, both languages stored

Fields without `localized: true` show the same value in all languages.

### 5d. Querying localized content

**REST API:**
```
GET /api/pages?locale=de          → German content
GET /api/pages?locale=en          → English content
GET /api/pages?locale=all         → All locales (nested object)
GET /api/pages                    → Default locale (English)
```

**Local API:**
```ts
const germanPages = await payload.find({
  collection: 'pages',
  locale: 'de',
})

const allLocales = await payload.find({
  collection: 'pages',
  locale: 'all',
})
```

**Frontend page route** — pass the locale from the URL or headers:

```tsx
// Example: src/app/(frontend)/[locale]/[slug]/page.tsx
const result = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  locale: locale, // 'en' or 'de'
  limit: 1,
})
```

### 5e. Generate types

```bash
pnpm generate:types
```

Check `payload-types.ts` — localized fields don't change the
interface shape. The API always returns the value for the requested
locale as a plain string, not the nested object. The nested storage
is an implementation detail.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Admin top bar shows language switcher (EN / DE)
- [ ] Edit a page in English → switch to German → `title` field is empty (ready for translation)
- [ ] Fill in German title → save → switch back to English → English title is preserved
- [ ] `GET /api/pages?locale=de` returns German titles
- [ ] `GET /api/pages?locale=en` returns English titles
- [ ] `GET /api/pages` returns English (default locale)
- [ ] Non-localized fields (slug, layout) show the same value in both languages
- [ ] `fallback: true` works — if German title is empty, the API returns the English one

---

## 7. Commit

```bash
git add src/payload.config.ts src/collections/Pages.ts src/collections/Posts.ts src/payload-types.ts
git commit -m "step 11.1 — localization with English and German locales"
```

---

## 8. Unlocks

- **Step 12** — Plugins (using a plugin, then writing one)
- You now have a multi-language CMS. Adding more locales is just
  adding entries to the `locales` array.
- **Interview connection:** "How do you handle multi-language sites?" →
  Payload's built-in localization — `localized: true` per field,
  locale switcher in admin, `?locale=de` in the API. No content
  duplication, fallback chain for missing translations.

---

| Nav | |
|---|---|
| ← Previous | [Step 10.1 — versions and drafts](10-1-versions-drafts.md) |
| → Next | [Step 12.1 — plugins](12-1-plugins.md) |
