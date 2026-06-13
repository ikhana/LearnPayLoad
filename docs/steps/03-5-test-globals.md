# Step 03.5 — Generate types + test globals

Generate types to see global interfaces, then verify everything works
end-to-end.

---

## 1. The story

You've built three globals. Time to generate the TypeScript types and
see what Payload made for you — then test that the API works.

---

## 2. What you'll learn — Payload

> **Official docs:** [TypeScript — Generating Types](https://payloadcms.com/docs/typescript/generating-types)

**Global types vs collection types.** When you run `generate:types`,
Payload creates interfaces for globals too — but they look slightly
different:

- Collections generate a type for the **document**: `Post`, `Category`
- Globals generate a type for the **whole global**: `Header`, `Footer`,
  `SiteSettings`

There's no array of headers — just one object.

**Global API endpoints:**

- REST: `GET /api/globals/header` (read), `POST /api/globals/header` (update)
- No `findByID`, no `create`, no `delete` — globals are always exactly one document

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [02.3 — Nested objects](../ts-lessons/02-object-shapes/02-3-nested-objects.md)
>
> The generated types for `SiteSettings` will show the `seo` group as a
> nested object type. Same concept as lesson 02.3.

Look at the generated `SiteSettings` interface. Notice how the `group`
field creates a nested object:

```ts
// What Payload generates (simplified):
interface SiteSettings {
  id: string
  siteName: string
  tagline?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    defaultOgImage?: number | Media
  }
}
```

The `seo` group became `seo?: { ... }` — a nested optional object.

---

## 4. Builds on

- **Steps 03.1–03.4** — all three globals must exist and be registered.
- **Step 01.10** — `pnpm generate:types` pattern.

---

## 5. Steps

### 5.1 — Generate types

```bash
pnpm generate:types
```

### 5.2 — Read the generated types

Open `src/payload-types.ts`. Search for `Header`, `Footer`, and
`SiteSettings`. Notice:

1. Each global has its own interface
2. The `nav` array in Header generated an array of objects
3. The `seo` group in SiteSettings generated a nested object
4. The `logo` and `defaultOgImage` uploads are `number | Media` — the
   same union pattern from relationships

### 5.3 — Test the REST API

With `pnpm dev` running, open your browser or use curl:

**Read Header:**
```
GET http://localhost:3000/api/globals/header
```

**Read Site Settings:**
```
GET http://localhost:3000/api/globals/site-settings
```

You should see the data you entered in the admin UI. Notice the slug
in the URL matches the `slug` in your global config.

### 5.4 — Test depth behavior

```
GET http://localhost:3000/api/globals/header?depth=0
```

The `logo` field shows a number (the media ID). Now:

```
GET http://localhost:3000/api/globals/header?depth=1
```

The `logo` field shows the full media object. Same depth behavior as
relationships in collections.

---

## 6. Verify

- [ ] `pnpm generate:types` ran without errors
- [ ] `payload-types.ts` has `Header`, `Footer`, `SiteSettings` interfaces
- [ ] The `seo` group appears as a nested object in the `SiteSettings` type
- [ ] `nav` appears as an array of `{ label, url }` objects in `Header`
- [ ] REST API returns global data at `/api/globals/header`
- [ ] Depth 0 returns media IDs, depth 1 returns full media objects

Commit:

```bash
git add .
git commit -m "step 03.5 — generate types, verify globals end-to-end"
```

---

## 7. Unlocks

- **Step 04** — Uploads and Media collection. You already used `upload`
  fields — now you'll configure the Media collection with image sizes
  and focal point.
- All three globals are ready for the SEO plugin to read from.
- You now know both Payload config types (`CollectionConfig` and
  `GlobalConfig`) and can build any standard CMS structure.
