# Step 09.1 — Your first block — Hero

Create a Pages collection with a `layout` blocks field and your first
block type: a Hero with heading, subheading, and background image.

---

## 1. The story

Posts have a fixed structure — title, content, excerpt. But a homepage
or landing page needs flexibility: a hero section, then a text block,
then a call-to-action, then an image gallery — in any order, repeated
as needed. **Blocks** are Payload's answer to this. Each block is a
mini-schema, and the editor stacks them like building blocks.

This is the page-builder pattern used by every modern CMS.

---

## 2. What you'll learn — Payload

> **Official docs:** [Blocks Field](https://payloadcms.com/docs/fields/blocks)
> **Skill reference:** `.claude/skills/payload/reference/FIELDS.md` → Blocks

**Blocks basics:**

| Concept | What it means |
|---|---|
| `Block` | A reusable mini-schema with its own `slug` and `fields` |
| `type: 'blocks'` | A field that holds an ordered array of block instances |
| `blockType` | Auto-injected discriminant — tells you which block this is |
| `interfaceName` | Optional — controls the name in generated types |

**How blocks work in data:**

```json
{
  "layout": [
    { "blockType": "hero", "heading": "Welcome", "id": "abc123" },
    { "blockType": "content", "text": "...", "id": "def456" }
  ]
}
```

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [04.3 — Discriminated unions](../ts-lessons/04-lists-and-imports/04-3-discriminated-unions.md)

- `Block` type annotation from Payload
- `blockType` as a discriminant field
- Generated types create a union: `HeroBlock | ContentBlock | ...`

---

## 4. Builds on

- [Step 01 — Posts collection](01-1-skeleton.md) — you know how to create a collection
- [Step 01.6 — upload field](01-6-featured-image.md) — relationship to media

---

## 5. Steps

### 5a. Create the Hero block folder

Each block gets its own folder with a `config.ts` (Payload schema) and
a `Component.tsx` (frontend rendering). This keeps blocks modular.

Create `src/blocks/Hero/config.ts`:

```ts
import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        description: 'Button text (e.g., "Get Started")',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'Button URL',
        condition: (data, siblingData) => Boolean(siblingData?.ctaText),
      },
    },
  ],
}
```

Create `src/blocks/Hero/Component.tsx`:

```tsx
import type { HeroBlock as HeroBlockType } from '@/payload-types'

export const HeroBlock = ({ heading, subheading, ctaText, ctaLink }: HeroBlockType) => {
  return (
    <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h2>{heading}</h2>
      {subheading && <p>{subheading}</p>}
      {ctaText && <a href={ctaLink || '#'}>{ctaText}</a>}
    </section>
  )
}
```

Create `src/blocks/Hero/index.ts` — the barrel export:

```ts
export { HeroBlock as Component } from './Component'
export { Hero as config } from './config'
```

**Folder structure:**

```
src/blocks/
  Hero/
    config.ts       ← Block schema (Payload admin)
    Component.tsx   ← Frontend rendering (React)
    index.ts        ← Barrel export (config + Component)
```

This lets you import either piece cleanly:

```ts
import { config } from '@/blocks/Hero'      // for Pages collection
import { Component } from '@/blocks/Hero'   // for RenderBlocks
```

### 5b. Create the RenderBlocks component

This is the central renderer. It maps `blockType` to a component using
a lookup object — no switch statement needed.

Create `src/blocks/RenderBlocks.tsx`:

```tsx
import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { Component as HeroBlock } from './Hero'

type LayoutBlock = NonNullable<Page['layout']>[number]

const blockComponents: Record<string, React.FC<any>> = {
  hero: HeroBlock,
}

export const RenderBlocks: React.FC<{
  blocks: LayoutBlock[]
}> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]
          if (Block) {
            return (
              <div key={index}>
                <Block {...block} />
              </div>
            )
          }
        }

        return null
      })}
    </Fragment>
  )
}
```

**Why a map object instead of switch?**

| Pattern | Pros | Cons |
|---|---|---|
| `switch (blockType)` | Exhaustive check with `never` | Gets huge with 40+ blocks |
| `blockComponents` map | Add blocks in one line, scales cleanly | No compile-time exhaustive check |

SGT has 41 blocks — the map pattern is the only sane choice at that scale.

### 5c. Create the Pages collection

Create `src/collections/Pages.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { config as Hero } from '@/blocks/Hero'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero],
    },
  ],
}
```

### 5d. Register Pages in the config

Open `src/payload.config.ts` and add Pages:

```ts
import { Pages } from './collections/Pages'

export default buildConfig({
  // ...
  collections: [Users, Media, Posts, Categories, Tags, Pages],
  // ...
})
```

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Pages collection appears in the admin under "Content"
- [ ] Create a page → the layout field shows "Add Block" button
- [ ] Add a Hero block → you see heading, subheading, background image, CTA fields
- [ ] CTA link only appears when CTA text is filled in
- [ ] Save the page → check `/api/pages` → layout array has `blockType: "hero"`

---

## 7. Commit

```bash
git add src/blocks/Hero/ src/blocks/RenderBlocks.tsx src/collections/Pages.ts src/payload.config.ts
git commit -m "step 09.1 — Pages collection with Hero block and RenderBlocks"
```

---

## 8. Unlocks

- **Step 09.2** — Add Content and CallToAction blocks
- **Step 09.3** — Generate types and wire up the frontend page route

---

| Nav | |
|---|---|
| ← Previous | [Step 08.3 — global stats endpoint](08-3-global-stats-endpoint.md) |
| → Next | [Step 09.2 — more blocks](09-2-content-and-cta-blocks.md) |
