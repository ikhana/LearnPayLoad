# Step 03.4 — Globals admin polish + `as const`

Organize all three globals under a "Settings" group in the sidebar.
Then learn `as const` — a TypeScript feature that makes literal types
stick.

---

## 1. The story

Right now the sidebar is getting cluttered. Header, Footer, Site Settings
are mixed in with Posts, Categories, Tags. Time to organize: group the
globals under "Settings" and the collections under "Content" — same
`admin.group` trick you used in Step 02.6.

---

## 2. What you'll learn — Payload

> **Official docs:** [Globals — Admin](https://payloadcms.com/docs/configuration/globals#admin-options)

Nothing new. You're applying `admin.group` to globals — same string-
matching trick from Step 02.6. Same string = same sidebar group.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [03.4 — `as const`](../ts-lessons/03-restricting-values/03-4-as-const.md)
>
> Read the lesson and do the exercise before continuing. `as const`
> freezes values as literal types and makes them `readonly`.

The short version: `as const` tells TypeScript "remember these exact
values, don't widen them to `string`." This matters in Payload when
you define select options or role lists outside the field config and
want to reuse them as both runtime values and TypeScript types.

---

## 4. Builds on

- **Step 02.6** — `admin.group` on collections. Same approach for globals.
- **Step 01.8** — select field options. `as const` makes those options
  type-safe at the definition level.

---

## 5. Steps

### 5.1 — Add `admin.group` to all three globals

Open each global file and add `admin.group: 'Settings'`:

**`src/globals/Header.ts`** — add inside the config:

```ts
admin: {
  group: 'Settings',
},
```

**`src/globals/Footer.ts`** — same:

```ts
admin: {
  group: 'Settings',
},
```

**`src/globals/SiteSettings.ts`** — same:

```ts
admin: {
  group: 'Settings',
},
```

### 5.2 — Restart and check the sidebar

Restart `pnpm dev`. The sidebar should now show:

```
Content
  Posts
  Categories
  Tags

Settings
  Header
  Footer
  Site Settings
```

Clean separation between content (what editors create) and settings
(what admins configure once).

### 5.3 — Try `as const` in a scratch file

Create a temporary file `src/scratch-as-const.ts` (we'll delete it
after):

```ts
// Without as const
const platforms = ['twitter', 'github', 'linkedin']
// Hover: string[]

// With as const
const platformsConst = ['twitter', 'github', 'linkedin'] as const
// Hover: readonly ['twitter', 'github', 'linkedin']

// Extract a union type from the const array
type Platform = typeof platformsConst[number]
// Hover: 'twitter' | 'github' | 'linkedin'

// This is useful when you want to reuse the same values
// for both runtime code and TypeScript types

// Try pushing — it won't work:
platformsConst.push('youtube') // ❌ red squiggle
```

Hover over each variable. See the difference between `string[]` and
`readonly ['twitter', 'github', 'linkedin']`. Then delete the file.

---

## 6. Verify

- [ ] All three globals have `admin.group: 'Settings'`
- [ ] Sidebar shows "Settings" group with Header, Footer, Site Settings
- [ ] Sidebar shows "Content" group with Posts, Categories, Tags
- [ ] You understand `as const`: freezes values as literal types
- [ ] You saw the red squiggle on `.push()` with `as const`
- [ ] You can explain `typeof ARRAY[number]` — extracts a union from a
      const array

Commit:

```bash
git add src/globals/
git commit -m "step 03.4 — globals admin polish, sidebar grouping"
```

(Delete `src/scratch-as-const.ts` before committing — it was just for
learning.)

---

## 7. Unlocks

- **Step 03.5** — Generate types and test all globals end-to-end.
- `as const` becomes useful in Steps 05+ when defining access control
  roles and hook configurations.
