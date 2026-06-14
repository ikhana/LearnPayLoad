# Step 06.3 — Hook context + preventing infinite loops

Learn how hooks can accidentally create infinite loops and how
`req.context` prevents them. Then generate types and test everything.

---

## 1. The story

Imagine a hook that updates a counter on save. The update triggers the
same hook again. That triggers another update. Infinite loop — your
server hangs or crashes.

This is a real production bug. Payload solves it with `context` — a bag
of flags you pass through the request to tell downstream hooks "I
already handled this, don't do it again."

---

## 2. What you'll learn — Payload

> **Official docs:** [Hooks — Context](https://payloadcms.com/docs/hooks/context)
> **Skill reference:** `.claude/skills/payload/reference/HOOKS.md` → Context

**The infinite loop pattern:**

```ts
// ❌ INFINITE LOOP
afterChange: [
  async ({ doc, req }) => {
    await req.payload.update({
      collection: 'posts',
      id: doc.id,
      data: { views: doc.views + 1 },
      req,
    })
    // This triggers afterChange again → loop!
  },
]
```

**The fix — context flags:**

```ts
// ✅ SAFE
afterChange: [
  async ({ doc, req, context }) => {
    if (context.skipViewCount) return doc

    await req.payload.update({
      collection: 'posts',
      id: doc.id,
      data: { views: doc.views + 1 },
      context: { skipViewCount: true },
      req,
    })
  },
]
```

**Key rules:**

1. Always pass `req` to nested operations — maintains transaction safety
2. Use `context` flags to prevent re-triggers
3. Context is a plain object — add any keys you want

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [06-4 — async-await](../ts-lessons/06-narrowing/06-4-async-await.md)
>
> The async/await patterns in hooks and the `Promise<T>` return type.

**Typing context:** The `context` object is `Record<string, unknown>` —
a loose object type. You can add any keys. TypeScript won't squiggle on
`context.skipViewCount` because the type allows any string key.

---

## 4. Builds on

- **Steps 06.1–06.2** — you know hooks, now you learn the safety pattern.

---

## 5. Steps

### 5.1 — Understand the problem

Look at this code (DON'T add it to your project):

```ts
afterChange: [
  async ({ doc, req }) => {
    // "I'll update the related category's post count"
    await req.payload.update({
      collection: 'categories',
      id: doc.category,
      data: { postCount: /* ... */ },
      req,
    })
  },
]
```

This is safe — it updates a *different* collection. The infinite loop
only happens when a hook updates the *same* collection it's attached to.

### 5.2 — Create a safe hook with context

Create `src/hooks/logChanges.ts` — a hook that logs when a post changes
and uses context to avoid re-triggering:

```ts
import type { CollectionAfterChangeHook } from 'payload'

export const logChanges: CollectionAfterChangeHook = ({
  doc,
  operation,
  req,
  context,
}) => {
  if (context.skipLog) return doc

  req.payload.logger.info(
    `[Posts] ${operation}: "${doc.title}" (id: ${doc.id})`,
  )

  return doc
}
```

### 5.3 — Register on Posts

Open `src/collections/Posts.ts`. Add the import:

```ts
import { logChanges } from '../hooks/logChanges'
```

Add the `afterChange` array:

```ts
hooks: {
  beforeChange: [slugify, autoPublishDate],
  afterChange: [logChanges],
},
```

### 5.4 — Test it

1. Restart `pnpm dev`
2. Create or edit a post
3. Check the terminal — you should see the log message
4. The log only fires once per save (no loop)

### 5.5 — Generate types

```bash
pnpm generate:types
```

Check `payload-types.ts` — make sure everything looks correct with the
roles field, all collections, and all globals.

### 5.6 — Review: the three hook safety rules

1. **Always return data** from `beforeChange` hooks (or the document
   saves empty)
2. **Always pass `req`** to nested operations (transaction safety)
3. **Use `context` flags** when a hook updates the same collection
   (prevents infinite loops)

These three rules come up in every Payload project. Know them cold for
the interview.

---

## 6. Verify

- [ ] You understand the infinite loop pattern and why it happens
- [ ] `logChanges` hook works and logs to the terminal
- [ ] You know the three hook safety rules
- [ ] `pnpm generate:types` runs clean
- [ ] You can explain `context` — what it is and when to use it

Commit:

```bash
git add src/hooks/logChanges.ts src/collections/Posts.ts
git commit -m "step 06.3 — afterChange logging hook, context pattern"
```

---

## 7. Unlocks

- **Step 07** — Custom field components in the admin UI. Hooks handle
  the data side; components handle the UI side.
- You now have the full backend pattern: collections, globals, access
  control, hooks. Everything after this builds on these foundations.
- For the interview, you can explain hooks with real examples from
  your own projects (Top Cleaning, New Birth Labs).
