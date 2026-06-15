# Step 09.2 — More blocks — Content + CallToAction

Add two more block types to the Pages layout. Each block gets its own
folder with `config.ts` + `Component.tsx`, following the same pattern.

---

## 1. The story

A hero alone doesn't make a page. You need body content (rich text,
maybe with an image) and call-to-action sections (buttons that drive
conversions). Each is a separate block that editors can stack in any
order.

---

## 2. What you'll learn — Payload

> **Official docs:** [Blocks Field](https://payloadcms.com/docs/fields/blocks)

**New concepts:**

| Concept | What it means |
|---|---|
| Multiple blocks in one field | `blocks: [Hero, Content, CallToAction]` |
| `labels` | Customize the "Add Block" button text per block type |
| `imageAlignment` select | Blocks can have their own layout/config fields |
| Arrays inside blocks | Blocks can contain `array` fields (e.g., buttons) |
| `row` layout | Multiple fields on the same line in the admin |

---

## 3. What you'll learn — TypeScript

- The generated union grows: `HeroBlock | ContentBlock | CallToActionBlock`
- Each block type narrows via `blockType` discriminant

---

## 4. Builds on

- [Step 09.1 — Hero block](09-1-first-block.md) — the pattern

---

## 5. Steps

### 5a. Create the Content block folder

Create `src/blocks/Content/config.ts`:

```ts
import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional side image',
      },
    },
    {
      name: 'imageAlignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'left',
      admin: {
        condition: (data, siblingData) => Boolean(siblingData?.image),
        description: 'Which side the image appears on',
      },
    },
  ],
}
```

Create `src/blocks/Content/Component.tsx`:

```tsx
import type { ContentBlock as ContentBlockType } from '@/payload-types'

export const ContentBlock = ({ text, imageAlignment }: ContentBlockType) => {
  return (
    <section style={{ padding: '2rem' }}>
      <div>Rich text content here</div>
      {imageAlignment && <small>Image aligned: {imageAlignment}</small>}
    </section>
  )
}
```

Create `src/blocks/Content/index.ts`:

```ts
export { ContentBlock as Component } from './Component'
export { Content as config } from './config'
```

### 5b. Create the CallToAction block folder

Create `src/blocks/CallToAction/config.ts`:

```ts
import type { Block } from 'payload'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'buttons',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'style',
              type: 'select',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' },
              ],
              defaultValue: 'primary',
              admin: { width: '20%' },
            },
          ],
        },
      ],
    },
  ],
}
```

Create `src/blocks/CallToAction/Component.tsx`:

```tsx
import type { CallToActionBlock as CTABlockType } from '@/payload-types'

export const CallToActionBlock = ({ heading, description, buttons }: CTABlockType) => {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>{heading}</h3>
      {description && <p>{description}</p>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {buttons?.map((btn, i) => (
          <a key={i} href={btn.link}>{btn.label}</a>
        ))}
      </div>
    </section>
  )
}
```

Create `src/blocks/CallToAction/index.ts`:

```ts
export { CallToActionBlock as Component } from './Component'
export { CallToAction as config } from './config'
```

**Folder structure so far:**

```
src/blocks/
  Hero/
    config.ts
    Component.tsx
    index.ts          ← barrel export
  Content/
    config.ts
    Component.tsx
    index.ts
  CallToAction/
    config.ts
    Component.tsx
    index.ts
  RenderBlocks.tsx
```

### 5c. Register all blocks in Pages

Open `src/collections/Pages.ts` and update the imports:

```ts
import type { CollectionConfig } from 'payload'
import { config as Hero } from '@/blocks/Hero'
import { config as Content } from '@/blocks/Content'
import { config as CallToAction } from '@/blocks/CallToAction'

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
      blocks: [Hero, Content, CallToAction],
    },
  ],
}
```

### 5d. Update RenderBlocks

Open `src/blocks/RenderBlocks.tsx` and add the new components to the map:

```tsx
import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { Component as HeroBlock } from './Hero'
import { Component as ContentBlock } from './Content'
import { Component as CallToActionBlock } from './CallToAction'

type LayoutBlock = NonNullable<Page['layout']>[number]

const blockComponents: Record<string, React.FC<any>> = {
  hero: HeroBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
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

**Adding a new block = two steps:**
1. Create the folder with `config.ts` + `Component.tsx`
2. Add one line to the `blockComponents` map

That's why SGT scales to 41 blocks without the renderer getting messy.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Create/edit a page → "Add Block" shows three options: Hero, Content Section, Call to Action
- [ ] Add one of each → they stack in order
- [ ] Content block: image alignment only shows when image is selected
- [ ] CTA block: you can add 1–3 buttons with label, link, and style
- [ ] Reorder blocks via drag-and-drop in the admin
- [ ] Save → check API response → each block has its `blockType`

---

## 7. Commit

```bash
git add src/blocks/Content/ src/blocks/CallToAction/ src/blocks/RenderBlocks.tsx src/collections/Pages.ts
git commit -m "step 09.2 — Content and CallToAction blocks for Pages"
```

---

## 8. Unlocks

- **Step 09.3** — Generate types and render blocks on the frontend
- You now have a real page-builder. Three blocks is enough to build
  most landing pages. Adding more blocks later follows the same pattern.
- **Interview connection:** SGT has 41 blocks. Same pattern, bigger library.

---

| Nav | |
|---|---|
| ← Previous | [Step 09.1 — Hero block](09-1-first-block.md) |
| → Next | [Step 09.3 — generate types + render blocks](09-3-generate-types-blocks.md) |
