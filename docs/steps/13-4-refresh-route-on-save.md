# Step 13.4 — RefreshRouteOnSave component

Install the Live Preview React package and add the component that
makes your frontend respond to admin panel changes.

---

## 1. The story

Right now the iframe loads your frontend, but it's just a static page.
The admin sends `postMessage` events every time you save, but nobody
is listening. The `RefreshRouteOnSave` component is the listener —
it catches the message and tells Next.js to re-render the page with
fresh data.

This is the step where Live Preview actually becomes "live."

---

## 2. What you'll learn — Payload

> **Official docs:** [Server-side Live Preview](https://payloadcms.com/docs/live-preview/server)

### The `RefreshRouteOnSave` component

This is a **client component** (`'use client'`) that:

1. Sends a `ready()` signal to the admin panel ("I'm loaded, start
   sending me messages")
2. Listens for `postMessage` events from the admin
3. Validates the event with `isDocumentEvent()` (ignores events from
   other sources)
4. Calls `router.refresh()` to re-run the Server Component

It renders **nothing** — returns `null`. It's a side-effect-only
component.

### The `@payloadcms/live-preview-react` package

Payload provides this package with two things:

| Export | What it does |
|---|---|
| `RefreshRouteOnSave` | Ready-to-use component (what we'll use) |
| `useLivePreview` | Client-side hook (alternative approach, not for us) |

The component accepts these props:

| Prop | Required | What it does |
|---|---|---|
| `refresh` | Yes | Function to call when a save event is received |
| `serverURL` | Yes | Your Payload server URL — used to validate message origin |

### How it connects to the page

```
[slug]/page.tsx (Server Component)
    │
    ├── <RefreshRouteOnSave />   ← client component, listens for messages
    │
    ├── <h1>{page.title}</h1>    ← server-rendered with latest data
    │
    └── <RenderBlocks />         ← server-rendered blocks
```

When `RefreshRouteOnSave` calls `router.refresh()`:
- Next.js re-runs the Server Component
- `payload.find()` fetches the latest draft data
- The page re-renders with the updated content
- The iframe shows the new content

### The `draft: true` parameter

Your `[slug]/page.tsx` already has draft mode logic:

```ts
const { isEnabled: isDraftMode } = await draftMode()

const result = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  draft: isDraftMode,  // ← fetches draft content when in draft mode
})
```

But wait — how does the iframe know to enable draft mode? When
Payload loads your frontend in the iframe, it **automatically
enables Next.js draft mode** via cookies. You don't need to do
anything extra.

### Environment variable

The `RefreshRouteOnSave` component needs your server URL. Add it
to `.env`:

```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

The `NEXT_PUBLIC_` prefix makes it available in client components.

---

## 3. What you'll learn — TypeScript

- **`'use client'` directive**: marks a component as a Client Component
  in Next.js App Router. Server Components can import Client Components,
  but not vice versa.
- **`React.FC` type**: `React.FC` (Function Component) is a type for
  components that take no props and return JSX. Our wrapper component
  uses this.
- **Wrapping a library component**: we create a thin wrapper around
  Payload's `RefreshRouteOnSave` to inject our Next.js router.

---

## 4. Builds on

- [Step 13.3 — Drafts + autosave on Pages](13-3-drafts-autosave-pages.md)
- [Step 09.1 — Frontend page route](09-1-first-block.md)

---

## 5. Steps

### 5a. Install the package

```bash
pnpm add @payloadcms/live-preview-react
```

### 5b. Add the environment variable

Open `.env` and add:

```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

### 5c. Create the RefreshRouteOnSave wrapper component

Create the file `src/app/(frontend)/[slug]/RefreshRouteOnSave.tsx`:

```tsx
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_PAYLOAD_URL || ''}
    />
  )
}
```

**Why a wrapper?** Payload's `RefreshRouteOnSave` needs a `refresh`
function. In Next.js, that's `router.refresh()` from `useRouter()`.
Since `useRouter()` is a React hook, it can only run in a Client
Component. The wrapper bridges the two.

### 5d. Add it to the page

Open `src/app/(frontend)/[slug]/page.tsx` and add the component:

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { draftMode } from 'next/headers'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params }: Args) {
  const { slug = 'home' } = await params
  const payload = await getPayload({ config })

  const { isEnabled: isDraftMode } = await draftMode()

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
    },
    overrideAccess: true,
    draft: isDraftMode,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return notFound()

  return (
    <main>
      <RefreshRouteOnSave />
      <h1>{page.title}</h1>
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
```

**Important change:** Notice the `where` clause now conditionally
includes `_status`. In draft mode (Live Preview), we **don't** filter
by `_status: 'published'` because we want to see draft content. On
the public frontend, we still filter to only show published pages.

```ts
// Before (always filters):
where: {
  slug: { equals: slug },
  _status: { equals: 'published' },
},

// After (conditional):
where: {
  slug: { equals: slug },
  ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
},
```

Without this change, Live Preview would show a 404 for any page that
isn't published yet.

### 5e. Restart the dev server

```bash
pnpm dev
```

### 5f. Test the connection

1. Go to the admin → open a Page → click **"Live Preview"**
2. The iframe should load your frontend page
3. Change the page title → wait for autosave (~1 second)
4. The iframe should **refresh** and show the updated title

If it works — congratulations, Live Preview is live.

---

## 6. Verify

- [ ] `@payloadcms/live-preview-react` is installed
- [ ] `NEXT_PUBLIC_PAYLOAD_URL` is in `.env`
- [ ] `RefreshRouteOnSave.tsx` exists and has `'use client'` directive
- [ ] `[slug]/page.tsx` imports and renders `<RefreshRouteOnSave />`
- [ ] Draft mode conditional is in the `where` clause
- [ ] Editing a page in admin → changes appear in the iframe after autosave
- [ ] Public frontend still only shows published pages

---

## 7. Commit

```bash
git add -A
git commit -m "step 13.4 — RefreshRouteOnSave for server-side Live Preview"
```

---

## 8. Unlocks

- **Step 13.5** — Dynamic URL so the iframe shows the correct page

---

| Nav | |
|---|---|
| <- Previous | [Step 13.3 — drafts + autosave](13-3-drafts-autosave-pages.md) |
| -> Next | [Step 13.5 — dynamic preview URL](13-5-dynamic-preview-url.md) |
