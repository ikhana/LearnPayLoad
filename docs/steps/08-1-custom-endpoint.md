# Step 08.1 — Your first custom endpoint — search posts

Add a custom `GET /api/posts/search` endpoint that searches posts by
title with query parameters. This is the simplest custom endpoint —
read-only, public, no auth required.

---

## 1. The story

Payload auto-generates CRUD endpoints for every collection. But
sometimes you need custom logic — a search endpoint with specific
filtering, a webhook receiver, or a public stats page. Custom endpoints
let you add your own API routes on top of Payload's built-in ones.

We'll start with a search endpoint because it's the most common custom
endpoint in any CMS project.

---

## 2. What you'll learn — Payload

> **Official docs:** [Custom Endpoints](https://payloadcms.com/docs/rest-api/overview#custom-endpoints)
> **Skill reference:** `.claude/skills/payload/reference/ENDPOINTS.md`

**Custom endpoint basics:**

| Property | Type | What it does |
|---|---|---|
| `path` | `string` | Route after the collection slug — `/search` becomes `/api/posts/search` |
| `method` | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | HTTP method (lowercase) |
| `handler` | `(req: PayloadRequest) => Promise<Response>` | The function that runs |

**What `req` gives you:**

| Property | What it is |
|---|---|
| `req.payload` | The Payload instance — use it to query the database |
| `req.user` | The authenticated user (or `null`) |
| `req.routeParams` | Path parameters like `:id` |
| `req.url` | The full request URL (parse it for query params) |

**Key insight:** Custom endpoints are **not authenticated by default**.
Unlike collection access control, anyone can hit your custom endpoint
unless you check `req.user` yourself.

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [07.1 — React + TS basics](../ts-lessons/07-react-ts/07-1-react-component-types.md)
> (No new TS lesson for 08 — we'll focus on the `PayloadRequest` type
> and `Response.json()` which use patterns you already know)

- `PayloadRequest` type — what Payload passes to your handler
- `Response.json()` — the Web API Response constructor
- `URL` and `URLSearchParams` — built-in browser/Node APIs for parsing URLs
- Type-safe query parameter parsing

---

## 4. Builds on

- [Step 01 — Posts collection](01-1-skeleton.md) — the collection we're extending
- [Step 05 — Access control](05-1-roles-and-basic-access.md) — understanding who can access what

---

## 5. Steps

### 5a. Add the endpoint to Posts

Open `src/collections/Posts.ts` and add an `endpoints` array:

```ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  // ... existing admin, access, hooks, fields ...

  endpoints: [
    {
      path: '/search',
      method: 'get',
      handler: async (req) => {
        const url = new URL(req.url)
        const query = url.searchParams.get('q') || ''
        const limit = parseInt(url.searchParams.get('limit') || '10')

        if (!query) {
          return Response.json(
            { error: 'Missing "q" query parameter' },
            { status: 400 },
          )
        }

        const results = await req.payload.find({
          collection: 'posts',
          where: {
            or: [
              { title: { contains: query } },
              { excerpt: { contains: query } },
            ],
          },
          limit,
          sort: '-createdAt',
        })

        return Response.json({
          query,
          total: results.totalDocs,
          posts: results.docs.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
          })),
        })
      },
    },
  ],
}
```

**What's happening:**

| Line | What it does |
|---|---|
| `path: '/search'` | Creates `/api/posts/search` |
| `new URL(req.url)` | Parses the full URL to extract query parameters |
| `url.searchParams.get('q')` | Gets the `?q=` query parameter |
| `req.payload.find(...)` | Uses Payload's Local API to search posts |
| `or: [...]` | Searches title OR excerpt |
| `Response.json(...)` | Returns a Web API Response with JSON body |
| The `.map()` | Returns only the fields we want (not the full document) |

### 5b. Test it

Start the dev server and try these URLs:

```bash
# Search for posts containing "banana"
curl http://localhost:3000/api/posts/search?q=banana

# With a limit
curl http://localhost:3000/api/posts/search?q=banana&limit=5

# Missing query — should return 400
curl http://localhost:3000/api/posts/search
```

Or just open the URL in your browser.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] `GET /api/posts/search?q=test` returns matching posts
- [ ] Response includes only `id`, `title`, `slug`, `excerpt` (not full documents)
- [ ] `GET /api/posts/search` (no query) returns a 400 error
- [ ] The `limit` parameter works
- [ ] Standard CRUD endpoints still work (`/api/posts` etc.)

---

## 7. Commit

```bash
git add src/collections/Posts.ts
git commit -m "step 08.1 — custom search endpoint on Posts"
```

---

## 8. Unlocks

- **Step 08.2** — Authenticated endpoint with POST body
- **Step 08.3** — Global endpoint + stats dashboard
- You now know the pattern: `endpoints: [{ path, method, handler }]`.
  Every custom API in Payload uses this shape.

---

| Nav | |
|---|---|
| ← Previous | [Step 07.3 — custom cell component](07-3-custom-cell-component.md) |
| → Next | [Step 08.2 — authenticated endpoint](08-2-authenticated-endpoint.md) |
