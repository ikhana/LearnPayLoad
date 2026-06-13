# Step 03.2 — Footer global

Create a Footer global with social links and copyright text. Same
pattern as Header — this is a speed round.

---

## 1. The story

Every site has a footer. Social media links, a copyright line, maybe
some quick links. Like the header, there's only one footer — it's a
global.

This step is fast because you already know the pattern. The goal is
**speed through familiarity**, not new concepts.

---

## 2. What you'll learn — Payload

> **Official docs:** [Globals](https://payloadcms.com/docs/configuration/globals)

Nothing new. You're reinforcing:

- Creating a global file
- Registering it in config
- Using `array` fields for repeatable groups
- Using `select` fields for constrained choices

---

## 3. What you'll learn — TypeScript

> **TS Lessons:** [03.2 — Union types](../ts-lessons/03-restricting-values/03-2-union-types.md)
>
> The `select` field for social platform uses a union of literal strings
> under the hood — same concept as `'draft' | 'published'` from the
> status field in Step 01.8.

No new TS. Repetition is the point.

---

## 4. Builds on

- **Step 03.1** — Header global. Same pattern, different fields.

---

## 5. Steps

### 5.1 — Create the Footer global

Create `src/globals/Footer.ts`:

```ts
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  fields: [
    {
      name: 'copyright',
      type: 'text',
      required: true,
      defaultValue: '© 2026 My Site. All rights reserved.',
      admin: {
        description: 'The copyright line shown at the bottom of every page.',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      maxRows: 6,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
```

**What's reinforced here:**

- `defaultValue` — pre-fills the field when the global is first opened
- `admin.description` — helper text below the field in the admin UI
- `select` with object options — `{ label, value }` format you saw in
  Step 01.8

### 5.2 — Register in payload.config.ts

Add the import:

```ts
import { Footer } from './globals/Footer'
```

Update the globals array:

```ts
globals: [Header, Footer],
```

### 5.3 — Restart and test

Restart `pnpm dev`. Open `/admin`. Footer should appear in the sidebar.
Click it — you'll see the copyright field pre-filled and the social links
array. Add a couple of links and save.

---

## 6. Verify

- [ ] `src/globals/Footer.ts` exists with social links and copyright
- [ ] `payload.config.ts` has `globals: [Header, Footer]`
- [ ] Footer appears in sidebar and opens directly (no list view)
- [ ] Copyright field has the default value pre-filled
- [ ] You can add social links with platform dropdown and URL

Commit:

```bash
git add src/globals/Footer.ts src/payload.config.ts
git commit -m "step 03.2 — Footer global with social links"
```

---

## 7. Unlocks

- **Step 03.3** — Site Settings global. The big one — site name,
  description, default SEO settings that the plugin will read.
