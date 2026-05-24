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
| 01 | Your first collection — Posts with fields | Interfaces & type aliases — annotating `CollectionConfig` | `[ ]` | _(coming)_ |
| 02 | Relationships — relate Posts to Categories | Generic types — `Field<T>`, `RelationshipField` | `[ ]` | _(coming)_ |
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
3. **What you'll learn — TypeScript** — the TS lesson, anchored to the code we touch this step
4. **Builds on** — explicit links to earlier step(s) we rely on
5. **Steps** — exact code or config changes, copy-pasteable
6. **Verify** — checkboxes for "done"
7. **Unlocks** — forward links: what later steps can now happen

When a step is done: tick it in this file, commit, move to the next.
