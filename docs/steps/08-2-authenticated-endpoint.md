# Step 08.2 — Authenticated endpoint — bulk status update

Add a `POST /api/posts/bulk-publish` endpoint that publishes multiple
posts at once. This one requires authentication and reads a JSON body.

---

## 1. The story

An editor just wrote 5 posts and wants to publish them all at once.
The built-in API only updates one document at a time. A custom endpoint
can accept an array of IDs and publish them in one request — but only
if the user is authenticated and has the right role.

---

## 2. What you'll learn — Payload

> **Official docs:** [Custom Endpoints](https://payloadcms.com/docs/rest-api/overview#custom-endpoints)
> **Skill reference:** `.claude/skills/payload/reference/ENDPOINTS.md`

**New concepts:**

| Concept | What it means |
|---|---|
| `req.user` | `null` if not authenticated — check this first |
| `req.json()` | Parse the request body as JSON |
| `APIError` | Payload's error class — throw it for consistent error responses |
| `req.payload.update()` | Update a document via the Local API |

**Authentication in custom endpoints:**

Custom endpoints have **no access control by default**. Payload's
collection-level `access` config does NOT apply to custom endpoints.
You must check `req.user` yourself.

---

## 3. What you'll learn — TypeScript

- `await req.json()` returns `any` — you need to validate the shape
- Type assertion vs runtime validation
- `Promise.all()` for parallel async operations

---

## 4. Builds on

- [Step 08.1 — search endpoint](08-1-custom-endpoint.md) — the basic endpoint pattern
- [Step 05 — Access control](05-1-roles-and-basic-access.md) — role-based checks

---

## 5. Steps

### 5a. Add the bulk-publish endpoint

Open `src/collections/Posts.ts`. Add a second endpoint to the `endpoints`
array (after the search endpoint):

```ts
endpoints: [
  // ... existing search endpoint ...
  {
    path: '/bulk-publish',
    method: 'post',
    handler: async (req) => {
      if (!req.user) {
        return Response.json(
          { error: 'You must be logged in' },
          { status: 401 },
        )
      }

      const roles = (req.user.roles as string[]) || []
      if (!roles.includes('admin') && !roles.includes('editor')) {
        return Response.json(
          { error: 'Only admins and editors can bulk publish' },
          { status: 403 },
        )
      }

      const body = await req.json()
      const ids: string[] = body?.ids

      if (!Array.isArray(ids) || ids.length === 0) {
        return Response.json(
          { error: 'Provide an array of post IDs in { "ids": [...] }' },
          { status: 400 },
        )
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const doc = await req.payload.update({
              collection: 'posts',
              id,
              data: { status: 'published' },
              req,
            })
            return { id, success: true, title: doc.title }
          } catch (error) {
            return { id, success: false, error: String(error) }
          }
        }),
      )

      const published = results.filter((r) => r.success)
      const failed = results.filter((r) => !r.success)

      return Response.json({
        published: published.length,
        failed: failed.length,
        results,
      })
    },
  },
],
```

**What's happening:**

| Line | What it does |
|---|---|
| `req.user` check | Returns 401 if not logged in |
| `roles` check | Returns 403 if user isn't admin or editor |
| `await req.json()` | Parses the POST body — expects `{ "ids": ["id1", "id2"] }` |
| `Promise.all(ids.map(...))` | Updates all posts in parallel |
| `req` passed to `update` | Keeps the operation in the same transaction |
| `try/catch` per ID | One bad ID doesn't fail the whole batch |

### 5b. Test it

First, get a JWT token by logging in:

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "yourpassword"}'
```

Copy the `token` from the response. Then:

```bash
# Bulk publish (replace TOKEN and IDs)
curl -X POST http://localhost:3000/api/posts/bulk-publish \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT TOKEN_HERE" \
  -d '{"ids": ["1", "2", "3"]}'

# Without auth — should return 401
curl -X POST http://localhost:3000/api/posts/bulk-publish \
  -H "Content-Type: application/json" \
  -d '{"ids": ["1"]}'
```

Or test via the browser console on the admin panel (you're already
authenticated there):

```js
const res = await fetch('/api/posts/bulk-publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: ['1', '2'] }),
  credentials: 'include',
})
const data = await res.json()
console.log(data)
```

---

## 6. Verify

- [ ] `POST /api/posts/bulk-publish` without auth returns 401
- [ ] With auth but wrong role returns 403
- [ ] With valid auth and IDs, posts get published
- [ ] Response shows count of published and failed
- [ ] Invalid IDs don't crash the whole request — they appear in `failed`
- [ ] The `afterChange` hooks still fire for each updated post

---

## 7. Commit

```bash
git add src/collections/Posts.ts
git commit -m "step 08.2 — authenticated bulk-publish endpoint"
```

---

## 8. Unlocks

- **Step 08.3** — Global endpoint for site-wide stats
- You now know authenticated endpoints, body parsing, and batch
  operations. This is the pattern behind every webhook handler,
  third-party integration, and custom action in Payload.

---

| Nav | |
|---|---|
| ← Previous | [Step 08.1 — custom search endpoint](08-1-custom-endpoint.md) |
| → Next | [Step 08.3 — global stats endpoint](08-3-global-stats-endpoint.md) |
