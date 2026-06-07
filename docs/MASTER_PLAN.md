# LearnPayLoad — Build & Learn Plan

A curriculum for learning [Payload CMS](https://payloadcms.com) by building one
growing project, step by step. Each step is small (~30–60 min), self-contained,
and ends with a clean commit. We learn one Payload concept per step, build the
smallest thing that demonstrates it, verify it works, commit, move on.

If a step feels too big in practice → split it. If a step feels redundant once
we get there → skip and update this doc.

> **Rule**: never start the next step until the current one is committed.
> No "I'll come back to it." If something later needs to enrich an earlier
> step, that's a new step with its own doc.

> **Source of truth**: the [official Payload docs](https://payloadcms.com/docs).
> Every step's "What you'll learn — Payload" section links to the canonical
> docs page for that concept. These step docs annotate the official ones —
> they don't replace them. When the official docs change, our steps follow.

> **TypeScript lessons**: the [ts-lessons/](ts-lessons/README.md) directory
> has a standalone progressive track (lessons 00–09) that teaches TS from
> scratch with plain non-Payload examples. Each Payload step references the
> relevant TS lesson. New to TS? Read lessons 00–06 before starting step 01.

---

## The narrative

We start from an empty repo, scaffold a fresh Payload + Next.js app, and grow
it. Each step adds one piece — a collection, a relationship, a hook, an
integration — and explains *why* the piece exists, *what* it gave us, and
*what unlocks next* because of it.

By the end you'll have:

- One working Payload project that touches every major Payload feature
- A doc trail showing how each piece got added and why
- A pattern you can lift into your own projects

Each step points **forward** (what it unlocks) and **backward** (what it builds
on), but does NOT edit earlier steps. Refinements become new steps.

---

## Steps

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done & committed

Every step teaches TWO concepts in parallel — one Payload, one TypeScript.
`strict: true` always on. The TS lesson is always tied to the code we touch
in that step, never abstract.

| # | Step (Payload concept) | TS lesson | Status | Doc |
|---|---|---|---|---|
| 00 | Setup — scaffold Payload, run dev server, create first admin user | What TS is · `tsconfig.json` · `strict` | `[x]` | [steps/00-setup.md](steps/00-setup.md) |
| **01** | **Your first collection — Posts with fields** | Interfaces & type aliases — annotating `CollectionConfig` | `[x]` | _(see 01.1–01.11 below)_ |
| 01.1 | Skeleton Posts collection — register, no fields | `import type` + `: CollectionConfig` annotation | `[x]` | [steps/01-1-skeleton.md](steps/01-1-skeleton.md) |
| 01.2 | Add `title` field | Field-option autocomplete from the annotation | `[x]` | [steps/01-2-title.md](steps/01-2-title.md) |
| 01.3 | Add `slug` field | Boolean type constraints (`unique`, `index`) | `[x]` | [steps/01-3-slug.md](steps/01-3-slug.md) |
| 01.4 | Add `excerpt` field (textarea) | Nested admin config typing | `[x]` | [steps/01-4-excerpt.md](steps/01-4-excerpt.md) |
| 01.5 | Add `content` field (richText / Lexical) | Field-type-specific shape narrowing | `[x]` | [steps/01-5-content.md](steps/01-5-content.md) |
| 01.6 | Add `featuredImage` field (upload) | Literal-type `relationTo` narrowing | `[x]` | [steps/01-6-featured-image.md](steps/01-6-featured-image.md) |
| 01.7 | Add `publishedAt` field (date) | Nested type config (picker options) | `[x]` | [steps/01-7-published-at.md](steps/01-7-published-at.md) |
| 01.8 | Add `status` field (select) | Tagged-options shape | `[x]` | [steps/01-8-status.md](steps/01-8-status.md) |
| 01.9 | Admin polish (`useAsTitle`, `defaultColumns`, `group`) | Collection-level admin types | `[x]` | [steps/01-9-admin-polish.md](steps/01-9-admin-polish.md) |
| 01.10 | Generate types (`pnpm generate:types`) | Reading `payload-types.ts` | `[x]` | [steps/01-10-generate-types.md](steps/01-10-generate-types.md) |
| 01.11 | First test post + verify whole step | Type-safe consumption in practice | `[x]` | [steps/01-11-test-post.md](steps/01-11-test-post.md) |
| **02** | **Relationships — Categories, Tags, and relationship fields** | Generic types, union narrowing, `Array<T>` | `[ ]` | _(see 02.1–02.8 below)_ |
| 02.1 | Categories collection skeleton | Muscle memory — `import type` + annotation | `[x]` | [steps/02-1-categories-skeleton.md](steps/02-1-categories-skeleton.md) |
| 02.2 | Categories fields (title, slug, description) | Generic types — `Array<T>`, `Box<T>`, the `< >` slot | `[ ]` | [steps/02-2-categories-fields.md](steps/02-2-categories-fields.md) |
| 02.3 | Add `category` relationship field to Posts | `relationTo` narrowing, union preview (`number \| Category`) | `[ ]` | [steps/02-3-category-relationship.md](steps/02-3-category-relationship.md) |
| 02.4 | Tags collection (skeleton + fields) | Speed through familiarity — no new syntax | `[ ]` | [steps/02-4-tags-collection.md](steps/02-4-tags-collection.md) |
| 02.5 | Add `tags` relationship field to Posts (`hasMany`) | `hasMany` → array type, `(number \| Tag)[]` vs `number \| Tag[]` | `[ ]` | [steps/02-5-tags-relationship.md](steps/02-5-tags-relationship.md) |
| 02.6 | Admin polish for Categories and Tags | Same type, different instance; `group` string matching | `[ ]` | [steps/02-6-taxonomy-admin-polish.md](steps/02-6-taxonomy-admin-polish.md) |
| 02.7 | Generate types — see relationship shapes | Reading union types, type guards (`typeof`), narrowing | `[ ]` | [steps/02-7-generate-types-relationships.md](steps/02-7-generate-types-relationships.md) |
| 02.8 | Test relationships end-to-end | Type narrowing in practice, `isPopulated<T>` helper | `[ ]` | [steps/02-8-test-relationships.md](steps/02-8-test-relationships.md) |
| 03 | Globals — header, footer, site config | Literal types & `as const` | `[ ]` | _(coming)_ |
| 04 | Uploads — Media collection, image sizes, focal point | Discriminated unions | `[ ]` | _(coming)_ |
| 05 | Access control — who can read/create/update/delete | Function types & type predicates | `[ ]` | _(coming)_ |
| 06 | Hooks — `beforeChange`, `afterChange`, `beforeDelete` | `async`/`await` + `Promise<T>` | `[ ]` | _(coming)_ |
| 07 | Custom field components in the admin UI | React + TS — props typing, `FC`, `ReactElement` | `[ ]` | _(coming)_ |
| 08 | Custom endpoints — your own API routes on Payload | Request/response typing (Next.js handlers) | `[ ]` | _(coming)_ |
| 09 | Blocks — flexible content / page-builder pattern | Discriminated unions revisited (block variants) | `[ ]` | _(coming)_ |
| 10 | Versions and drafts | Utility types — `Partial<T>`, `Pick<T,K>`, `Omit<T,K>` | `[ ]` | _(coming)_ |
| 11 | Localization (i18n) | `Record<K,V>` for locale maps | `[ ]` | _(coming)_ |
| 12 | Plugins — using a plugin, then writing one from scratch | Module augmentation & ambient types | `[ ]` | _(coming)_ |
| 13+ | _(added as we go)_ | _(added as we go)_ | | |

---

## How a step doc is structured

Every step doc has the same 7 sections:

1. **The story** — why this step exists, what real-world thing it solves
2. **What you'll learn — Payload** — the Payload concept in plain words
3. **What you'll learn — TypeScript** — links to the relevant [TS lesson](ts-lessons/README.md), plus a short summary anchored to the code we touch
4. **Builds on** — explicit links to earlier step(s) we rely on
5. **Steps** — exact code or config changes, copy-pasteable
6. **Verify** — checkboxes for "done"
7. **Unlocks** — forward links: what later steps can now happen

When a step is done: tick it in this file, commit, move to the next.
