# Step 13.1 — What is Live Preview and how it works

Understand the architecture before touching any code. This step is
reading + understanding only — no code changes.

---

## 1. The story

Your client edits a page in the Payload admin. They change the hero
headline, tweak the CTA text, swap an image. Right now they have to
save, switch to the frontend tab, refresh, and hope it looks right.
If it doesn't — back to admin, edit, save, refresh again.

Live Preview eliminates that loop. The frontend renders **inside** the
admin panel as an iframe. Every change the editor makes appears in
real-time, right next to the form. No save-refresh cycle.

This is the feature that makes clients say "wow" in demos. HighLevel
can't do this. WordPress needs third-party plugins for it. Payload
has it built in.

---

## 2. What you'll learn — Payload

> **Official docs:** [Live Preview Overview](https://payloadcms.com/docs/live-preview/overview)

### The architecture (iframe + postMessage)

Live Preview has three moving parts:

```
┌─────────────────────────────────────────────────┐
│  Payload Admin Panel                            │
│                                                 │
│  ┌──────────────┐    ┌───────────────────────┐  │
│  │  Edit Form   │    │  iframe               │  │
│  │              │───>│  (your frontend app)   │  │
│  │  title: "…"  │ postMessage                │  │
│  │  slug: "…"   │    │  renders the page      │  │
│  │  layout: […] │    │  with live data        │  │
│  └──────────────┘    └───────────────────────┘  │
└─────────────────────────────────────────────────┘
```

1. **The admin panel** loads your frontend in an iframe
2. **Every time a field changes**, the admin fires a `window.postMessage`
   event containing the current document data
3. **Your frontend listens** for that message and re-renders with the
   new data

### Two approaches: server-side vs client-side

| Approach | How it works | Speed | Complexity |
|---|---|---|---|
| **Server-side** (recommended) | On save/autosave → router refreshes → server re-fetches via Local API | Slightly slower | Simpler — one component |
| **Client-side** | On every keystroke → merges form state directly into React state | Instant | More complex — hook + depth matching |

Payload recommends **server-side** for Next.js App Router (which we use).
We'll follow that recommendation.

### Server-side flow in detail

```
Editor types in admin
    ↓
Autosave triggers (every N ms)
    ↓
Document saved to database (as draft)
    ↓
Admin sends postMessage to iframe
    ↓
Frontend's RefreshRouteOnSave component catches the message
    ↓
Calls router.refresh()
    ↓
Next.js Server Component re-runs
    ↓
payload.find() fetches the latest draft data
    ↓
Page re-renders with new content
```

### Why drafts + autosave are required

Live Preview needs **drafts** because the editor hasn't published yet —
they're still editing. Without drafts, saves go straight to published
and visitors see half-finished content.

It needs **autosave** because the editor shouldn't have to manually
click "Save Draft" every time they change a word. Autosave does it
automatically at a configurable interval.

### The config shape (preview)

```ts
// payload.config.ts
admin: {
  livePreview: {
    // URL of your frontend — becomes the iframe src
    url: 'http://localhost:3000',

    // Which collections get the Live Preview button
    collections: ['pages'],

    // Optional: device breakpoints for responsive preview
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
  },
},
```

### What appears in the admin UI

When `livePreview` is configured on a collection:

- A **"Live Preview"** button appears at the top of the edit view
- Clicking it opens a split view: form on the left, iframe on the right
- A **toolbar** appears with breakpoint selector and manual resize inputs
- A button to **pop out** the preview into a separate window
- A **"Responsive"** option is always available (100% width/height)

---

## 3. What you'll learn — TypeScript

- No new TypeScript concepts in this step (concept-only step)
- Next step introduces the `RefreshRouteOnSave` client component pattern

---

## 4. Builds on

- [Step 09.1 — Pages collection with blocks](09-1-first-block.md) (the frontend we'll preview)
- [Step 10.1 — Versions](10-1-versions-drafts.md) (versions are required for drafts)
- [Step 10.2 — Drafts on Pages](10-2-drafts-pages.md) (drafts are required for Live Preview)

---

## 5. Steps

### 5a. Read the official docs

Open and read these two pages:

1. [Live Preview Overview](https://payloadcms.com/docs/live-preview/overview)
2. [Server-side Live Preview](https://payloadcms.com/docs/live-preview/server)

### 5b. Answer these questions to yourself

Before moving to the next step, make sure you can answer:

1. **What transport mechanism** does Live Preview use to communicate
   between admin and frontend? (Answer: `window.postMessage`)

2. **Why can't you use Live Preview without drafts?** (Answer: without
   drafts, every save publishes immediately — editors would push
   half-finished content to visitors)

3. **What's the difference between server-side and client-side Live
   Preview?** (Answer: server-side refreshes on save via router,
   client-side merges form state on every keystroke)

4. **Why do we choose server-side?** (Answer: simpler setup, works with
   Server Components, Payload recommends it for Next.js App Router)

5. **What does `RefreshRouteOnSave` do?** (Answer: listens for
   postMessage events from admin, calls `router.refresh()` to
   re-render the Server Component with fresh data)

---

## 6. Verify

- [ ] I can explain the iframe + postMessage architecture
- [ ] I understand why drafts and autosave are prerequisites
- [ ] I know the difference between server-side and client-side approach
- [ ] I've read both official docs pages

---

## 7. Commit

No code changes — no commit needed.

---

## 8. Unlocks

- **Step 13.2** — Add the `livePreview` config to `payload.config.ts`

---

| Nav | |
|---|---|
| <- Previous | [Step 12.2 — writing a plugin](12-2-writing-a-plugin.md) |
| -> Next | [Step 13.2 — livePreview config](13-2-live-preview-config.md) |
