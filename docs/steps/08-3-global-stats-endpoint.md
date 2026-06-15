# Step 08.3 — Global endpoint — site stats + generate types

Add a `GET /api/globals/site-settings/stats` endpoint that returns
content statistics for the whole site. This shows endpoints on
**globals** (not collections) and wraps up Step 08 with type generation.

---

## 1. The story

A dashboard needs to show "12 posts, 5 categories, 3 published today."
You could make 3 separate API calls, or you could create one custom
endpoint that aggregates everything. Global endpoints are perfect for
site-wide data that doesn't belong to any single collection.

---

## 2. What you'll learn — Payload

> **Official docs:** [Custom Endpoints](https://payloadcms.com/docs/rest-api/overview#custom-endpoints)

**Global endpoints vs Collection endpoints:**

| Placement | URL pattern | Use case |
|---|---|---|
| Collection `endpoints` | `/api/{slug}/{path}` | Per-collection actions |
| Global `endpoints` | `/api/globals/{slug}/{path}` | Site-wide actions |

Same `{ path, method, handler }` shape. Only the URL prefix changes.

---

## 3. What you'll learn — TypeScript

- Multiple `await` calls with `Promise.all()` for parallel queries
- Shaping a response type manually
- `Date` manipulation for "today" filtering

---

## 4. Builds on

- [Step 08.1 — search endpoint](08-1-custom-endpoint.md) — endpoint basics
- [Step 08.2 — authenticated endpoint](08-2-authenticated-endpoint.md) — auth check
- [Step 03.3 — SiteSettings global](03-3-site-settings-global.md) — the global we're extending

---

## 5. Steps

### 5a. Create the endpoint file

Create `src/endpoints/siteStats.ts`:

```ts
export const siteStats = {
  path: '/stats',
  method: 'get' as const,
  handler: async (req: any) => {
    if (!req.user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [posts, categories, tags] = await Promise.all([
      req.payload.count({ collection: 'posts' }),
      req.payload.count({ collection: 'categories' }),
      req.payload.count({ collection: 'tags' }),
    ])

    const publishedToday = await req.payload.count({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { publishedAt: { greater_than_equal: today.toISOString() } },
        ],
      },
    })

    return Response.json({
      totalPosts: posts.totalDocs,
      totalCategories: categories.totalDocs,
      totalTags: tags.totalDocs,
      publishedToday: publishedToday.totalDocs,
      generatedAt: new Date().toISOString(),
    })
  },
}
```

### 5b. Import into SiteSettings

Open `src/globals/SiteSettings.ts` and add:

```ts
import { siteStats } from '@/endpoints/siteStats'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  // ... existing fields, access ...

  endpoints: [siteStats],
}
```

**What's happening:**

| Line | What it does |
|---|---|
| `req.payload.count(...)` | Like `find` but only returns the count — much faster |
| `Promise.all([...])` | Runs all 3 counts in parallel instead of one-by-one |
| `today.setHours(0,0,0,0)` | Midnight today — for "published today" filter |
| `greater_than_equal` | Payload query operator — posts after midnight |

### 5b. Generate types

```bash
pnpm generate:types
```

The endpoints themselves don't change generated types, but it's good
practice to regenerate after any config change.

### 5c. Test it

In the browser (while logged into admin):

```
http://localhost:3000/api/globals/site-settings/stats
```

Or via curl with a JWT token:

```bash
curl http://localhost:3000/api/globals/site-settings/stats \
  -H "Authorization: JWT TOKEN_HERE"
```

Expected response:

```json
{
  "totalPosts": 3,
  "totalCategories": 2,
  "totalTags": 5,
  "publishedToday": 1,
  "generatedAt": "2026-06-15T12:00:00.000Z"
}
```

---

## 6. Verify

- [ ] `GET /api/globals/site-settings/stats` returns stats when authenticated
- [ ] Returns 401 when not authenticated
- [ ] `totalPosts`, `totalCategories`, `totalTags` match your actual data
- [ ] `publishedToday` only counts posts published today
- [ ] All existing global and collection endpoints still work

---

## 7. Commit

```bash
git add src/endpoints/siteStats.ts src/globals/SiteSettings.ts
git commit -m "step 08.3 — global stats endpoint on SiteSettings"
```

---

## 8. Unlocks

- **Step 09** — Blocks (flexible content / page-builder pattern)
- You now know both **collection endpoints** and **global endpoints**.
  Combined with hooks and access control from earlier steps, you can
  build any custom API surface on top of Payload.
- **Interview connection:** The SGT project uses custom endpoints for
  price calculation previews and order processing. Same pattern, bigger scale.

---

## Step 08 Summary

Three sub-steps, three endpoint patterns:

| Sub-step | What we built | Pattern |
|---|---|---|
| 08.1 | Search posts | Public GET, query params, `req.payload.find()` |
| 08.2 | Bulk publish | Auth check, POST body, `Promise.all()`, error handling |
| 08.3 | Site stats | Global endpoint, `req.payload.count()`, parallel queries |

---

| Nav | |
|---|---|
| ← Previous | [Step 08.2 — authenticated endpoint](08-2-authenticated-endpoint.md) |
| → Next | [Step 09.1 — blocks](09-1-blocks.md) |
