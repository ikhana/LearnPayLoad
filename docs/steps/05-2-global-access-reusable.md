# Step 05.2 — Global access + reusable access functions

Add access control to globals and extract reusable access functions into
their own file.

---

## 1. The story

You wrote access functions inline on Posts. It worked, but now you need
the same "admin only" check on globals. Copy-pasting the same function
everywhere is messy — time to extract.

Payload projects typically have an `access/` directory with reusable
functions like `isAdmin`, `isAuthenticated`, `isAdminOrEditor`. You
import them wherever needed.

---

## 2. What you'll learn — Payload

> **Official docs:** [Global Access Control](https://payloadcms.com/docs/access-control/globals)

**Global access is simpler than collections:**

- Only two operations: `read` and `update`
- No `create` or `delete` — globals always exist (one instance)
- Same function signature: `({ req }) => boolean | Where`

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [05-4 — Function types](../ts-lessons/05-generics/05-4-function-types.md)
>
> Extracting access functions teaches you how function types work —
> the `Access` type annotation on a standalone function.

When you extract a function:

```ts
import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  // ...
}
```

The `: Access` annotation ensures the function matches Payload's expected
shape. If you get the parameters wrong, TypeScript catches it.

---

## 4. Builds on

- **Step 05.1** — inline access control on Posts. Now you extract and
  reuse.

---

## 5. Steps

### 5.1 — Create the access directory

Create `src/access/` with these files:

**`src/access/isAuthenticated.ts`:**

```ts
import type { Access } from 'payload'

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)
```

**`src/access/isAdmin.ts`:**

```ts
import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return Boolean((user.roles as string[])?.includes('admin'))
}
```

**`src/access/isAdminOrEditor.ts`:**

```ts
import type { Access } from 'payload'

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  if (!user) return false
  return Boolean(
    (user.roles as string[])?.some((role) =>
      ['admin', 'editor'].includes(role),
    ),
  )
}
```

**`src/access/authenticatedOrPublished.ts`:**

```ts
import type { Access } from 'payload'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' } }
}
```

### 5.2 — Refactor Posts to use reusable functions

Open `src/collections/Posts.ts`. Replace the inline functions:

```ts
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { isAuthenticated } from '../access/isAuthenticated'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { isAdmin } from '../access/isAdmin'
```

```ts
access: {
  read: authenticatedOrPublished,
  create: isAuthenticated,
  update: isAdminOrEditor,
  delete: isAdmin,
},
```

Same behavior, much cleaner. Each function is importable and testable
on its own.

### 5.3 — Add access control to globals

Open each global and add access:

**`src/globals/Header.ts`:**

```ts
import { isAdmin } from '../access/isAdmin'

// Add to the config:
access: {
  read: () => true,
  update: isAdmin,
},
```

**`src/globals/Footer.ts`** — same pattern:

```ts
import { isAdmin } from '../access/isAdmin'

access: {
  read: () => true,
  update: isAdmin,
},
```

**`src/globals/SiteSettings.ts`** — same:

```ts
import { isAdmin } from '../access/isAdmin'

access: {
  read: () => true,
  update: isAdmin,
},
```

Everyone can **read** globals (the frontend needs them). Only admins can
**update** them.

### 5.4 — Restart and test

1. Restart `pnpm dev`
2. As admin, you can edit all globals — normal
3. Hit `http://localhost:3000/api/globals/header` in incognito — you
   can read it (public read)
4. Try `POST http://localhost:3000/api/globals/header` without auth —
   should be denied

---

## 6. Verify

- [ ] `src/access/` directory exists with 4 reusable functions
- [ ] Each function has the `Access` type annotation
- [ ] Posts uses imported access functions (not inline)
- [ ] All three globals have `read: () => true` and `update: isAdmin`
- [ ] Unauthenticated users can read globals but not update them
- [ ] Code is DRY — same access logic isn't duplicated

Commit:

```bash
git add src/access/ src/collections/Posts.ts src/globals/
git commit -m "step 05.2 — reusable access functions, global access control"
```

---

## 7. Unlocks

- **Step 05.3** — Function types TS lesson + test the full access
  control setup.
- The `access/` directory pattern is what real Payload projects use.
  During the interview, you can point to this as your security pattern.
