# Step 05.1 — Roles on Users + basic access control

Add a `roles` field to Users, then add access control to Posts — who
can create, read, update, delete.

---

## 1. The story

Right now anyone who's logged in can do anything — create, edit, delete
any post. That's fine for a solo dev, but a real CMS has different users:
admins, editors, viewers. An editor shouldn't delete posts. A visitor
shouldn't see drafts.

Payload doesn't have a built-in roles system — you build it yourself
with a `select` field. That's intentional: every project's permissions
are different.

---

## 2. What you'll learn — Payload

> **Official docs:** [Access Control](https://payloadcms.com/docs/access-control/overview)
> **Skill reference:** `.claude/skills/payload/reference/ACCESS-CONTROL.md`

**Access control basics:**

- Each collection has an `access` object with keys: `create`, `read`,
  `update`, `delete`
- Each key is a **function** that receives `{ req }` (the request,
  including the logged-in user) and returns:
  - `true` — allow the operation
  - `false` — deny the operation
  - A **where query** — allow, but only for matching documents (row-level)

**The `saveToJWT` trick:** When you add `saveToJWT: true` to a field,
Payload includes that field's value in the JWT token. This means access
control functions can check roles **without hitting the database** every
request.

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [05-1-function-types.md](../ts-lessons/05-generics/05-4-function-types.md)
>
> Access control functions are typed as `Access` — a function type.
> Read the lesson to understand function types in TypeScript.

The `Access` type is roughly:

```ts
type Access = (args: { req: PayloadRequest }) => boolean | Where
```

It's a function that takes args and returns a boolean or a query. When
you type `access: { read: ... }`, TypeScript expects a function matching
this shape.

---

## 4. Builds on

- **Step 00** — Users collection exists with `auth: true`.
- **Step 01.8** — `select` field pattern for status.
- **Step 02.6** — admin polish patterns.

---

## 5. Steps

### 5.1 — Add roles to Users

Open `src/collections/Users.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      saveToJWT: true,
      admin: {
        description: 'Admins can do everything. Editors can create and edit content.',
      },
    },
  ],
}
```

**Key points:**

- `hasMany: true` — a user can have multiple roles
- `defaultValue: ['editor']` — new users are editors by default
- `saveToJWT: true` — roles are included in the JWT, so access checks
  don't need a database query
- The admin user you create first should manually get the `admin` role

### 5.2 — Add access control to Posts

Open `src/collections/Posts.ts` and add the `access` object:

```ts
access: {
  // Anyone can read published posts, logged-in users see all
  read: ({ req: { user } }) => {
    if (user) return true
    return { status: { equals: 'published' } }
  },

  // Only logged-in users can create
  create: ({ req: { user } }) => Boolean(user),

  // Only admins and editors can update
  update: ({ req: { user } }) => {
    if (!user) return false
    return Boolean(
      (user.roles as string[])?.some((role) =>
        ['admin', 'editor'].includes(role),
      ),
    )
  },

  // Only admins can delete
  delete: ({ req: { user } }) => {
    if (!user) return false
    return Boolean((user.roles as string[])?.includes('admin'))
  },
},
```

Place the `access` block after `admin` and before `fields`.

**What each does:**

- `read` — returns a **where query** for unauthenticated users. They
  only see published posts. Logged-in users see everything.
- `create` — boolean check. Must be logged in.
- `update` — must have `admin` or `editor` role.
- `delete` — admins only. Editors can create and edit but not delete.

### 5.3 — Restart and test

1. Restart `pnpm dev`
2. Go to `/admin` → Users → edit your user → add the `admin` role
3. Create a test post with status "draft"
4. Open an incognito window and hit
   `http://localhost:3000/api/posts` — you should only see published
   posts (or none, if all are drafts)
5. In the logged-in window, you see all posts including drafts

### 5.4 — Break it: understand the where query return

The `read` access function returns `{ status: { equals: 'published' } }`
for unauthenticated users. This isn't just true/false — Payload adds
this as a **database filter**. It's the same as writing a `where` clause
in `payload.find()`.

This is powerful: instead of fetching all posts and filtering in code,
Payload filters at the database level. Efficient and secure.

---

## 6. Verify

- [ ] Users collection has a `roles` select field with `saveToJWT: true`
- [ ] Your admin user has the `admin` role
- [ ] Posts have `access` with create, read, update, delete functions
- [ ] Unauthenticated API requests only return published posts
- [ ] Authenticated requests return all posts
- [ ] You understand the difference between returning `true` and
      returning a where query

Commit:

```bash
git add src/collections/Users.ts src/collections/Posts.ts
git commit -m "step 05.1 — roles on Users, access control on Posts"
```

---

## 7. Unlocks

- **Step 05.2** — Access control on globals + reusable access functions.
- **Step 05.3** — Function types TS lesson + testing access control.
- The SEO plugin will need to check `read` access to determine which
  posts are public for SEO analysis.
