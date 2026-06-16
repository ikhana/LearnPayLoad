# Step 12.2 — Writing a plugin from scratch

Build a minimal plugin that adds a "Last Edited By" field to any
collection. This teaches you the plugin architecture you'll use for
the AI SEO plugin.

---

## 1. The story

You want every collection to show who last edited a document. You
could add the field and hook manually to each collection — but that's
repetitive and error-prone. A plugin lets you write it once and apply
it everywhere.

This is also how your AI SEO plugin will work: a function that takes
options, walks through collections, and injects fields + hooks.

---

## 2. What you'll learn — Payload

> **Official docs:** [Building Custom Plugins](https://payloadcms.com/docs/plugins/overview#building-custom-plugins)
> **Skill reference:** `.claude/skills/payload/reference/PLUGIN-DEVELOPMENT.md`

**Plugin architecture:**

A plugin is a function with this signature:

```ts
type Plugin = (incomingConfig: Config) => Config
```

That's it. It receives the full Payload config, modifies it, and
returns it. Most plugins are wrapped in a factory function that takes
options:

```ts
// The pattern:
const myPlugin = (options: MyPluginOptions) => (incomingConfig: Config): Config => {
  // modify config based on options
  return modifiedConfig
}
```

**What a plugin can do:**

| Action | How |
|---|---|
| Add fields to collections | Map over `config.collections`, spread new fields |
| Add hooks to collections | Preserve existing hooks, add yours to the array |
| Add new collections | Push to `config.collections` |
| Add globals | Push to `config.globals` |
| Add admin components | Modify `config.admin.components` |
| Add endpoints | Push to collection/global `endpoints` |

---

## 3. What you'll learn — TypeScript

- Higher-order functions (function that returns a function)
- Generics in plugin options
- Spreading and mapping config arrays safely
- Module augmentation concepts

---

## 4. Builds on

- [Step 12.1 — Using plugins](12-1-using-plugins.md) — consumer side
- [Step 06.1 — hooks](06-1-before-change-slug.md) — the hook pattern

---

## 5. Steps

### 5a. Create the plugin file

Create `src/plugins/lastEditedBy.ts`:

```ts
import type { Config, Plugin } from 'payload'

type LastEditedByPluginOptions = {
  collections?: string[]
}

export const lastEditedByPlugin =
  (options: LastEditedByPluginOptions = {}): Plugin =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    const targetCollections = options.collections || config.collections?.map((c) => c.slug) || []

    config.collections = (config.collections || []).map((collection) => {
      if (!targetCollections.includes(collection.slug)) {
        return collection
      }

      return {
        ...collection,
        fields: [
          ...collection.fields,
          {
            name: 'lastEditedBy',
            type: 'relationship' as const,
            relationTo: 'users',
            admin: {
              readOnly: true,
              position: 'sidebar' as const,
            },
          },
        ],
        hooks: {
          ...collection.hooks,
          beforeChange: [
            ...(collection.hooks?.beforeChange || []),
            async ({ data, req }) => {
              if (req.user) {
                data.lastEditedBy = req.user.id
              }
              return data
            },
          ],
        },
      }
    })

    return config
  }
```

**What's happening line by line:**

| Line | What it does |
|---|---|
| `(options) =>` | Factory function — takes plugin config |
| `(incomingConfig) =>` | The actual plugin — receives Payload config |
| `{ ...incomingConfig }` | Shallow copy — don't mutate the original |
| `options.collections \|\| ...map(c => c.slug)` | Target specific collections, or all of them |
| `.map((collection) => ...)` | Walk through each collection |
| `...collection.fields` | Keep existing fields, add ours |
| `...(collection.hooks?.beforeChange \|\| [])` | Preserve existing hooks, add ours |
| `data.lastEditedBy = req.user.id` | Set the field in the hook |

**Critical pattern: preserving existing hooks.** If you just write
`beforeChange: [myHook]`, you wipe out all existing beforeChange
hooks on that collection. Always spread the existing array first.

### 5b. Register the plugin

Open `src/payload.config.ts`:

```ts
import { lastEditedByPlugin } from './plugins/lastEditedBy'

export default buildConfig({
  // ...
  plugins: [
    lastEditedByPlugin({
      collections: ['posts', 'pages'],
    }),
  ],
})
```

### 5c. Understand the plugin pattern

This is the same pattern every Payload plugin uses:

```
myPlugin(options)          → returns a Plugin function
  Plugin(incomingConfig)   → returns modified Config
    map collections        → add fields, hooks
    return config
```

Your AI SEO plugin will follow this exact shape:

```ts
const aiSeoPlugin = (options: AISeoOptions): Plugin =>
  (incomingConfig: Config): Config => {
    // Add SEO analysis fields to target collections
    // Add afterChange hook that triggers AI analysis
    // Maybe add a new collection for storing SEO reports
    // Maybe add admin components for the SEO dashboard
    return modifiedConfig
  }
```

### 5d. Generate types

```bash
pnpm generate:types
```

Check `payload-types.ts` — `Post` and `Page` interfaces now have
`lastEditedBy` field. The plugin injected it without you touching
the collection files.

---

## 6. Verify

- [ ] Dev server starts without errors
- [ ] Edit a Post → `lastEditedBy` field appears in the sidebar (read-only)
- [ ] Save the post → `lastEditedBy` auto-fills with the current user
- [ ] Edit a Page → same field appears and auto-fills
- [ ] Categories and Tags do NOT have the field (only targeted collections)
- [ ] Existing hooks still work (slugify, autoPublishedDate)
- [ ] `payload-types.ts` has `lastEditedBy` on Post and Page

---

## 7. Commit

```bash
git add src/plugins/lastEditedBy.ts src/payload.config.ts src/payload-types.ts
git commit -m "step 12.2 — custom lastEditedBy plugin"
```

---

## 8. Unlocks

- **Step 13+** — Your AI SEO plugin (`payload-plugin-ai-seo`)
- You now understand both sides of the plugin system: consuming
  third-party plugins and writing your own.
- **Interview connection:** "Have you written a Payload plugin?" →
  Yes — the pattern is `(options) => (config) => modifiedConfig`.
  Walk through how you map collections, inject fields, preserve
  existing hooks. Then mention the AI SEO plugin you're building.

---

## Step 12 Summary

| Sub-step | What we built |
|---|---|
| 12.1 | Installed + configured SEO plugin (consumer side) |
| 12.2 | Wrote a custom plugin from scratch (author side) |

**The plugin signature to remember:**

```ts
const myPlugin = (options: Options): Plugin =>
  (incomingConfig: Config): Config => {
    // map collections, add fields/hooks
    return config
  }
```

---

| Nav | |
|---|---|
| ← Previous | [Step 12.1 — using plugins](12-1-using-plugins.md) |
| → Next | Your AI SEO plugin journey begins |
