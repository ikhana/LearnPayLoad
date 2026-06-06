# Step 01.11 — First test post + verify whole step

The capstone. Create a real post with all seven fields populated. See the
REST API output. Try type-safe consumption in a scratch file. Mark step 01
done in the master plan.

---

## 1. The story

We've added 7 fields, polished the admin, generated types. Now it's time
to *use* the collection like a real editor would. Create a post, fill in
every field, save it, look at the result. Then look at the same post
through the REST API and through a TypeScript scratch file. Three angles
on the same record.

This sub-step is short and has no new Payload or TypeScript concept. It's
a verification round: prove that step 01 hangs together as one coherent
collection that a real blog editor could use day-to-day.

If anything looks broken, this is the moment to catch it. Step 02
(relationships) builds on this surface.

---

## 2. What you'll learn — Payload

> **Official docs:** [REST API](https://payloadcms.com/docs/rest-api/overview), [Local API](https://payloadcms.com/docs/local-api/overview)
> **Skill reference:** `.claude/skills/payload/SKILL.md` (Query Example section)

No new field types or admin options this sub-step. What you *will* see:

- **The full edit form.** All 7 fields, the admin polish from 01.9, the type generation from 01.10. End-to-end.
- **The REST API output.** What `/api/posts` and `/api/posts/<id>` return for a fully-populated post. The Lexical tree, the populated Media object, the ISO timestamps — all there.
- **The type-safe consumption pattern.** A tiny scratch file that imports `Post`, accesses fields with full autocomplete, and demonstrates what the rest of the codebase will look like when it touches Posts.

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** All of [00](../ts-lessons/00-what-is-typescript.md)–[06](../ts-lessons/06-import-type.md) — this is the payoff.

The payoff moment: **autocomplete on a generated interface**.

The `: CollectionConfig` annotation gave you autocomplete *when
defining* the schema. The generated `Post` interface gives you
autocomplete *when consuming* records. Same idea, two directions —
types as a contract between code-that-writes and code-that-reads.

Type `post.` in a scratch file and your editor lists every field.
That's every TS lesson from 01.1–01.10 paying off at once.

---

## 4. Builds on

- **Steps 01.1 through 01.10** — every previous sub-step in step 01. This is the verification round.

---

## 5. Steps

### 5.1 — Create a real post in the admin

Open `/admin`. Click **Posts** (under the Content group). Click **Create New**.

Fill in all 7 fields:

- **Title:** *something descriptive* — e.g. `"Hello from LearnPayLoad"`
- **Slug:** *url-safe version* — e.g. `"hello-from-learnpayload"`
- **Excerpt:** *1–2 sentence summary* — e.g. *"A first real post showing all the field types we built in step 01."*
- **Content:** *click in the Lexical editor — type a heading, a paragraph, maybe a link*
- **Featured Image:** *upload any image, or pick one already in the Media collection from 01.6*
- **Published At:** *pick a date and time*
- **Status:** *change from Draft to Published*

Click **Save**.

### 5.2 — Look at it in the list view

Click **Posts** in the sidebar. The list shows your post. Each column is populated (title, status, publishedAt, updatedAt). The row is labeled with your title — not the ID — because of `useAsTitle: 'title'` from 01.9.

### 5.3 — Look at it via the REST API

Visit `http://localhost:3000/api/posts/<your-post-id>` (find the ID in the URL on the edit screen).

Read the JSON. You should see:

- `id` — the post's ID (numeric or hash, depending on the DB)
- `title`, `slug`, `excerpt` — plain strings
- `content` — a nested JSON tree (Lexical's serialized state)
- `featuredImage` — the **full Media object** (URL, alt text, sizes) because default depth is 2
- `publishedAt` — ISO datetime string
- `status` — `"published"`
- `createdAt`, `updatedAt` — ISO datetime strings

This is the exact shape the generated `Post` interface describes. The runtime and the type match.

### 5.4 — Confirm type-safe consumption in a scratch file

Create `src/scratch.ts`:

```ts
import type { Post } from './payload-types'

async function exampleUsage() {
  // Imagine this came from a fetch or payload.findByID()
  const post = (await fetch(
    'http://localhost:3000/api/posts/REPLACE_WITH_ID',
  ).then((r) => r.json())) as Post

  // Type-safe access — try `post.` and watch autocomplete
  console.log(post.title)                      // string
  console.log(post.status)                     // 'draft' | 'published'
  console.log(post.excerpt ?? 'no excerpt')    // optional, handle null

  // Try this on purpose:
  // console.log(post.nonExistent)             // ← red squiggle
}
```

Type `post.` and confirm autocomplete lists every field on `Post`.

Try `post.nonExistent` — **red squiggle**. The `Post` type is a closed shape; only the documented properties exist.

Delete `src/scratch.ts` when you're done.

### 5.5 — Mark step 01 done in the master plan

Open `docs/MASTER_PLAN.md`. As you've been committing each sub-step, you've been (informally) ticking off 01.1 through 01.10. Now formalize:

- Change every sub-step row's status from `[ ]` (or `[~]`) to `[x]` — for 01.1 through 01.11
- Change the parent **01** row's status to `[x]`

Save.

### 5.6 — Final commit

```bash
git add .
git commit -m "step 01.11 — verify Posts collection end-to-end; step 01 complete"
```

---

## 6. Verify

- [ ] You created a post in the admin with all 7 fields populated
- [ ] List view shows your post labeled with its title, with the 4 default columns
- [ ] `/api/posts/<id>` returns JSON matching the `Post` interface (content is nested JSON, featuredImage is the full Media object at default depth)
- [ ] In `src/scratch.ts`, you tried `post.` and saw autocomplete listing all fields
- [ ] You tried `post.nonExistent` and saw a red squiggle
- [ ] `docs/MASTER_PLAN.md` has step 01 (parent) marked `[x]` and all 11 sub-steps marked `[x]`

Commit:

```bash
git add .
git commit -m "step 01.11 — verify Posts collection end-to-end; step 01 complete"
```

---

## 7. Unlocks

- **Step 02 — Relationships.** With Posts existing and fully type-generated, we can introduce real cross-collection relationships: a `Categories` collection that has many Posts, and a `Tags` many-to-many. The TS lesson at step 02 is **generic types** — `Field<T>`, `RelationshipField<T>`, and how Payload uses generics to type the *other* side of a relationship.
- **For the AI SEO plugin track:** Posts is now the canonical content surface the plugin will eventually attach to. Every plugin feature from step 07 onward mounts against a collection — and Posts is the prototype.
- **For your interview prep:** Posts is the natural pairing for the RNJ Media private story (see `interview-prep/stories/`). When we write that story, we'll lean on what we built here — the field choices, the trade-off between flexibility and constraints, the choice to use a manual `status` field vs Payload's proper drafts.
