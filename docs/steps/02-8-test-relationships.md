# Step 02.8 — Test relationships end-to-end

The capstone. Create categories, tags, assign them to posts. See how
relationships look at different depth levels. Mark step 02 done.

---

## 1. The story

Step 02 introduced the `relationship` field — the link between
collections. We built two new collections (Categories, Tags), connected
them to Posts, generated types, and saw the union shapes. Now we prove
it all works end-to-end.

This is the same verification pattern as 01.11: create data, read it
from the admin, from the REST API, and from a type-safe scratch file.
Three angles on the same records.

---

## 2. What you'll learn — Payload

> **Official docs:** [REST API — Depth](https://payloadcms.com/docs/rest-api/overview#depth)

The focus: **depth** and how it affects relationship fields in API
responses.

- `depth=0` — relationships return as IDs only. Fastest response, smallest payload.
- `depth=1` — relationships are populated one level deep. The related document's own relationships are still IDs.
- `depth=2` (default) — relationships are populated two levels deep.

This matters because:
- Frontend pages usually want depth 1–2 (show the category title, not just an ID)
- List pages might want depth 0 (just need IDs for links)
- The SEO plugin will need depth 1+ to read category and tag titles for keyword analysis

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [09 — Type predicates](../ts-lessons/09-type-predicates.md)
>
> **Read this lesson now.** It builds the `isPopulated<T>` helper from
> scratch and shows how to use type predicates in `.filter()`.

One concept: **type predicates for reusable narrowing**.

Inline `typeof` checks (lesson 08) work but get noisy when repeated.
A type predicate function wraps the check:

```ts
function isPopulated<T>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}
```

The `value is T` return type tells TypeScript: "if true, the value is
type T." One function handles every relationship field in the project.

**Step 02's full TS arc:**
- Generics (`Array<T>`, `Box<T>`) — lesson 07
- Union types on relationships (`number | Category`) — lesson 08
- Type narrowing (`typeof` checks) — lesson 08
- Type predicates (`isPopulated<T>`) — lesson 09
- Array vs single (`hasMany` changes the type shape) — lesson 05 + 07

---

## 4. Builds on

- **All step 02 sub-steps** — this is the verification round
- **Step 01.11** — same capstone pattern (create, read, verify, scratch file)

---

## 5. Steps

### 5.1 — Create test data

Open `/admin`. Make sure you have:

**Categories** (create if missing):
1. `JavaScript` / `javascript` / "Posts about JavaScript fundamentals"
2. `DevOps` / `devops` / "CI/CD, Docker, deployment topics"

**Tags** (create if missing):
1. `react-hooks` / `react-hooks`
2. `typescript` / `typescript`
3. `payload-cms` / `payload-cms`
4. `docker` / `docker`

**Posts** — edit your existing test post (or create a new one):
- Set **Category** to `JavaScript`
- Set **Tags** to `react-hooks`, `typescript`, `payload-cms`
- Make sure all other fields are filled (title, slug, content, etc.)

Save.

### 5.2 — Verify the list view

Go to the Posts list. The four default columns are: title, status,
publishedAt, updatedAt. Category and Tags aren't in the default columns
(we didn't add them), but you can toggle them on if you want.

Go to the Categories list. Posts labeled with titles, three columns.

Go to the Tags list. Same pattern.

### 5.3 — REST API at different depths

**Depth 2 (default):**
```
http://localhost:3000/api/posts/<id>
```

`category` is a full object. Each item in `tags` is a full object.

**Depth 1:**
```
http://localhost:3000/api/posts/<id>?depth=1
```

Same as depth 2 for this data (Categories and Tags don't have their own
relationships, so there's nothing deeper to resolve).

**Depth 0:**
```
http://localhost:3000/api/posts/<id>?depth=0
```

`category` is a number. `tags` is an array of numbers. `featuredImage`
is also a number (it was already a relationship — you've been seeing it
populated at depth 2 since 01.6).

### 5.4 — Type-safe scratch file

Create `src/scratch.ts`:

```ts
import type { Post, Category, Tag } from './payload-types'

// Helper: check if a relationship value is populated
function isPopulated<T>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}

async function analyzePost() {
  const res = await fetch('http://localhost:3000/api/posts/REPLACE_WITH_ID')
  const post = (await res.json()) as Post

  // Category — single relationship
  if (isPopulated(post.category)) {
    console.log(`Category: ${post.category.title}`)
    console.log(`Slug: ${post.category.slug}`)
  } else {
    console.log(`Category ID: ${post.category}`)
  }

  // Tags — hasMany relationship
  if (post.tags) {
    const populatedTags = post.tags.filter(
      (tag): tag is Tag => typeof tag !== 'number'
    )
    console.log(`Tags: ${populatedTags.map((t) => t.title).join(', ')}`)
  }
}
```

Read this carefully. Notice:
- `isPopulated(post.category)` narrows from `number | Category` to `Category`
- The `.filter()` with a type predicate narrows array items from
  `number | Tag` to `Tag`
- After narrowing, autocomplete works: `post.category.title`,
  `t.slug`, etc.

Try `post.category.title` *without* the `isPopulated` check —
**red squiggle**. TypeScript won't let you access `.title` on a `number`.

Delete `src/scratch.ts` when done.

### 5.5 — Mark step 02 done in the master plan

Open `docs/MASTER_PLAN.md`. Mark all step 02 sub-steps and the parent
as `[x]`.

---

## 6. Verify

- [ ] You have at least 2 categories and 3+ tags created
- [ ] A post is assigned one category and multiple tags
- [ ] REST API at depth 2 returns populated category and tags objects
- [ ] REST API at depth 0 returns only IDs
- [ ] The scratch file type-narrows `category` with `isPopulated` and `tags` with `.filter`
- [ ] You saw the red squiggle when accessing `.title` without narrowing
- [ ] Step 02 is marked `[x]` in `MASTER_PLAN.md` (parent and all sub-steps)

Commit:

```bash
git add .
git commit -m "step 02.8 — test relationships end-to-end; step 02 complete"
```

---

## 7. Unlocks

- **Step 03 — Globals.** Site-wide settings (header, footer, site
  config) that exist as singletons, not collections. The TS lesson is
  **literal types and `as const`** — how TypeScript can make values
  immutable and narrow their types to exact strings.
- **For the AI SEO plugin:** with Categories and Tags linked to Posts,
  the plugin can now do per-category content analysis ("you have 8
  JavaScript posts but zero DevOps posts") and tag-based keyword
  density ("react-hooks appears in 12 posts, react-server-components
  in zero — content gap detected").
- **For your interview prep:** the relationship pattern is one of the
  most common Payload questions. "How do you model X-to-Y?" You now
  have a concrete answer: `type: 'relationship'`, `relationTo`,
  `hasMany`, depth control. Pair this with the Top Cleaning or New
  Birth Labs stories about data modeling decisions.
