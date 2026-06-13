# Step 04.1 — Media upload configuration

Expand the Media collection from `upload: true` to a full upload config
with image sizes, focal point, crop, and mime type filtering.

---

## 1. The story

Right now Media accepts any file and stores it as-is. That's fine for
development, but a real site needs:

- **Image sizes** — auto-generated thumbnails and card images so the
  frontend doesn't serve a 4000px image in a 400px container
- **Focal point** — lets editors pick the focus area so crops don't cut
  off faces or important content
- **Mime type filtering** — only accept images, not random PDFs or ZIPs

The SEO plugin will eventually need a consistent `thumbnail` size for
OG image previews.

---

## 2. What you'll learn — Payload

> **Official docs:** [Upload Collections](https://payloadcms.com/docs/upload/overview)
> **Skill reference:** `.claude/skills/payload/reference/COLLECTIONS.md` → Upload Collection

**Upload config options:**

| Option | What it does |
|---|---|
| `staticDir` | Where files are stored on disk (relative to project root) |
| `mimeTypes` | Array of allowed MIME patterns (`['image/*']`) |
| `imageSizes` | Auto-generated resized versions of uploaded images |
| `adminThumbnail` | Which image size to show in the admin list view |
| `focalPoint` | Editor can pick a focal point for smart cropping |
| `crop` | Editor can crop the image in the admin UI |

When you define `imageSizes`, Payload generates those sizes
**automatically on upload**. The original stays untouched. Each size
gets its own URL in the API response.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [03.4 — `as const`](../ts-lessons/03-restricting-values/03-4-as-const.md)
>
> No new TS concept in this sub-step. You're applying what you know —
> `CollectionConfig` typing, nested config objects, autocomplete.

Hover over `imageSizes` after you type it — notice how TypeScript shows
the shape each size object needs: `name`, `width`, `height`, and
optional `position`.

---

## 4. Builds on

- **Step 00** — Media collection was scaffolded with `upload: true`.
- **Step 01.6** — Posts already reference Media via `featuredImage`.
- **Step 03.1** — Header references Media via `logo`.

---

## 5. Steps

### 5.1 — Expand the upload config

Open `src/collections/Media.ts`. Replace `upload: true` with a full
config object:

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
}
```

**What each part does:**

- `mimeTypes: ['image/*']` — only accept image files. Try uploading a
  `.txt` and Payload rejects it.
- `imageSizes` — three auto-generated sizes:
  - `thumbnail` (400×300) — for admin list views and small previews
  - `card` (768×1024) — for blog listing cards
  - `og` (1200×630) — for Open Graph / social media sharing (the SEO
    plugin will use this)
- `adminThumbnail: 'thumbnail'` — the admin list view shows the
  thumbnail size, not the full original
- `focalPoint: true` — adds a focal-point picker to the upload UI
- `crop: true` — adds a crop tool to the upload UI

### 5.2 — Restart and upload an image

Restart `pnpm dev`. Go to `/admin` → Media → Create New.

Upload an image. You should see:
1. The **crop tool** — drag to crop the image
2. The **focal point** — click to set the focus area
3. The alt text field (required)

Save the image.

### 5.3 — Check the API response

Open the browser: `http://localhost:3000/api/media`

Look at the uploaded image's JSON. You'll see a `sizes` object with
your three generated sizes:

```json
{
  "sizes": {
    "thumbnail": {
      "url": "/api/media/file/image-400x300.webp",
      "width": 400,
      "height": 300
    },
    "card": { ... },
    "og": { ... }
  }
}
```

Each size has its own URL. The frontend picks the right size for the
context — thumbnail for lists, og for social shares.

### 5.4 — Break it: upload a non-image

Try uploading a `.txt` or `.pdf` file. Payload should reject it because
of `mimeTypes: ['image/*']`. That's the filter working.

---

## 6. Verify

- [ ] `Media.ts` has full upload config with imageSizes, focalPoint, crop
- [ ] Upload UI shows crop tool and focal point picker
- [ ] API response includes `sizes` object with thumbnail, card, og
- [ ] Non-image files are rejected
- [ ] Admin list view shows thumbnail-sized previews

Commit:

```bash
git add src/collections/Media.ts
git commit -m "step 04.1 — Media upload config with image sizes and focal point"
```

---

## 7. Unlocks

- **Step 04.2** — Admin polish for Media and the discriminated unions
  TS lesson.
- **Step 04.3** — Generate types to see the `sizes` object in the
  Media interface.
- The `og` image size is what the SEO plugin will reference for social
  share previews.
