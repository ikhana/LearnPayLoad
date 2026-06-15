# Step 09.3 — Generate types + render blocks on the frontend

Generate types to see the discriminated union, then wire up the
RenderBlocks component on a frontend page route.

---

## 1. The story

You've built blocks. Now you need to render them on the frontend. The
challenge: the `layout` array contains different block types mixed
together. How do you safely access `heading` on a Hero block but `text`
on a Content block? TypeScript's discriminated unions solve this — and
Payload generates them for you.

You already have `RenderBlocks.tsx` with the `blockComponents` map.
Now you wire it into a Next.js page route.

---

## 2. What you'll learn — Payload

> **Official docs:** [Blocks Field](https://payloadcms.com/docs/fields/blocks)

**Generated types for blocks:**

```ts
// From payload-types.ts (after generate:types)
export interface Page {
  layout: (HeroBlock | ContentBlock | CallToActionBlock)[]
}

export interface HeroBlock {
  blockType: 'hero'
  heading: string
  subheading?: string | null
  // ...
}

export interface ContentBlock {
  blockType: 'content'
  text: any  // richText
  // ...
}
```

The `blockType` is the **discriminant**. The `RenderBlocks` component
uses it to look up the right component from the map.

---

## 3. What you'll learn — TypeScript

> **TS lesson:** [04.3 — Discriminated unions](../ts-lessons/04-lists-and-imports/04-3-discriminated-unions.md)

- Reading a generated discriminated union
- `Record<string, React.FC<any>>` for the component map
- `blockType in blockComponents` for safe lookup

---

## 4. Builds on

- [Step 09.2 — Content + CTA blocks](09-2-content-and-cta-blocks.md) — the blocks
- [Step 09.1 — RenderBlocks](09-1-first-block.md) — the renderer
- [Step 01.10 — generate types](01-10-generate-types.md) — the generation command

---

## 5. Steps

### 5a. Generate types

```bash
pnpm generate:types
```

Open `src/payload-types.ts` and find the `Page` interface. You'll see
the `layout` field typed as a union of block types.

### 5b. Create the frontend page route

Create `src/app/(frontend)/[slug]/page.tsx`:

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return notFound()

  return (
    <main>
      <h1>{page.title}</h1>
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
```

**What's different from the switch pattern:**

| Switch pattern (09.3 old) | Map pattern (SGT-style) |
|---|---|
| `RenderBlock` function with `switch` in the page file | `RenderBlocks` component imported from `src/blocks/` |
| Each `case` renders inline JSX | Each block has its own `Component.tsx` |
| Adding a block = add a `case` + inline JSX | Adding a block = new folder + one line in the map |
| Page route knows about every block | Page route just calls `<RenderBlocks />` |

The map pattern keeps your page routes clean. The page doesn't need to
know what blocks exist — `RenderBlocks` handles it.

### 5c. The switch pattern (alternative approach)

For comparison, here's how you'd render blocks with a switch statement
instead of the map. This is the approach you'd use with fewer blocks:

```tsx
import type { Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]

function assertNever(x: never): never {
  throw new Error(`Unexpected block type: ${JSON.stringify(x)}`)
}

function RenderBlock({ block }: { block: LayoutBlock }) {
  switch (block.blockType) {
    case 'hero':
      // TS knows this is HeroBlock — you get autocomplete for heading, subheading, etc.
      return (
        <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h2>{block.heading}</h2>
          {block.subheading && <p>{block.subheading}</p>}
          {block.ctaText && <a href={block.ctaLink || '#'}>{block.ctaText}</a>}
        </section>
      )

    case 'content':
      // TS knows this is ContentBlock — you get autocomplete for text, image, imageAlignment
      return (
        <section style={{ padding: '2rem' }}>
          <div>Rich text content here</div>
        </section>
      )

    case 'cta':
      // TS knows this is CallToActionBlock — you get autocomplete for heading, description, buttons
      return (
        <section style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>{block.heading}</h3>
          {block.description && <p>{block.description}</p>}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {block.buttons?.map((btn, i) => (
              <a key={i} href={btn.link}>{btn.label}</a>
            ))}
          </div>
        </section>
      )

    default:
      // If you add a new block to the union but forget a case,
      // TS errors here: "Argument of type 'NewBlock' is not assignable to parameter of type 'never'"
      return assertNever(block)
  }
}

// Usage in a page:
export default function PageRenderer({ page }: { page: Page }) {
  return (
    <main>
      <h1>{page.title}</h1>
      {page.layout?.map((block, index) => (
        <RenderBlock key={block.id || index} block={block} />
      ))}
    </main>
  )
}
```

**How `assertNever` works:**

The `never` type means "this should be unreachable." If every possible
`blockType` has a `case`, the `default` branch is truly unreachable and
`block` narrows to `never`. But if you add a 4th block and forget its
`case`, `block` is still that 4th type — not `never` — and TS throws a
compile error. It's a safety net.

**Map vs switch — when to use which:**

| | Map (`blockComponents`) | Switch (`blockType`) |
|---|---|---|
| **Type safety** | `Record<string, React.FC<any>>` — loose | Full narrowing + `never` exhaustive check |
| **Scalability** | One line per block, renderer stays 30 lines | Each block adds 10-20 lines to the switch |
| **Separation** | Each block renders in its own `Component.tsx` | All rendering inline in one function |
| **Missing block** | Silently renders nothing (catch at runtime) | Compile-time error via `assertNever` |
| **Best for** | 10+ blocks (SGT has 41) | Under 10 blocks |

We use the map pattern because it matches how SGT works at scale. But
knowing the switch pattern is important — it's the textbook TS answer
for discriminated unions, and interviewers may expect you to know it.

---

## 6. Verify

- [ ] `pnpm generate:types` succeeds
- [ ] `payload-types.ts` has `HeroBlock`, `ContentBlock`, `CallToActionBlock` interfaces
- [ ] The `Page` interface has `layout` as a union of those types
- [ ] Create a page with all 3 block types in the admin
- [ ] Visit `/pages/your-slug` → blocks render in order via `RenderBlocks`
- [ ] Each block renders its own `Component.tsx`

---

## 7. Commit

```bash
git add src/payload-types.ts src/app/
git commit -m "step 09.3 — generate types and frontend page route with RenderBlocks"
```

---

## 8. Unlocks

- **Step 10** — Versions and drafts
- You now have a full page-builder with the SGT-style block pattern:
  each block in its own folder, a central `blockComponents` map, and
  clean frontend page routes.
- **Interview connection:** "How do you handle flexible content?" →
  Blocks + `blockComponents` map + separate `config.ts`/`Component.tsx`
  per block. SGT has 41 blocks, all following this exact pattern.

---

## Step 09 Summary

Three sub-steps, one complete page-builder:

| Sub-step | What we built |
|---|---|
| 09.1 | Hero block folder (`config.ts` + `Component.tsx`) + Pages collection + `RenderBlocks` with `blockComponents` map |
| 09.2 | Content + CallToAction block folders, registered in map |
| 09.3 | Type generation + frontend page route using `<RenderBlocks />` |

**The pattern to remember:**

```
src/blocks/
  Hero/
    config.ts          ← Payload schema (admin)
    Component.tsx      ← React component (frontend)
    index.ts           ← Barrel export: { config, Component }
  Content/
    config.ts
    Component.tsx
    index.ts
  CallToAction/
    config.ts
    Component.tsx
    index.ts
  RenderBlocks.tsx      ← Central renderer with blockComponents map
```

---

| Nav | |
|---|---|
| ← Previous | [Step 09.2 — Content + CTA blocks](09-2-content-and-cta-blocks.md) |
| → Next | [Step 10.1 — versions and drafts](10-1-versions-drafts.md) |
