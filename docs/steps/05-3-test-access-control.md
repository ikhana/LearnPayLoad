# Step 05.3 — Function types + test access control

Learn the function types TS lesson, generate types, and test the full
access control setup end-to-end.

---

## 1. The story

Access control is wired up. Time to understand the TypeScript behind
it (function types) and verify everything works by testing different
scenarios.

---

## 2. What you'll learn — Payload

> **Official docs:** [Access Control](https://payloadcms.com/docs/access-control/overview)

**Testing access control:**

- Use the REST API with and without auth tokens
- Check that unauthenticated requests only see published content
- Verify that role-based restrictions work

**Getting an auth token for testing:**

```
POST http://localhost:3000/api/users/login
Content-Type: application/json

{ "email": "your@email.com", "password": "yourpassword" }
```

The response includes a `token`. Use it in subsequent requests:

```
GET http://localhost:3000/api/posts
Authorization: Bearer <token>
```

---

## 3. What you'll learn — TypeScript

> **TS Lesson:** [05-4 — Function types](../ts-lessons/05-generics/05-4-function-types.md)
>
> Read the lesson and do the exercise. This teaches you how to type
> standalone functions, arrow functions, and callback parameters.

The `Access` type you've been using is a function type:

```ts
type Access = (args: {
  req: PayloadRequest
  id?: string | number
  data?: Record<string, unknown>
}) => boolean | Where | Promise<boolean | Where>
```

When you write `export const isAdmin: Access = ...`, you're saying
"this variable holds a function that matches this shape." TypeScript
enforces the parameter types and return type.

---

## 4. Builds on

- **Steps 05.1–05.2** — access control is fully wired up.
- **Step 01.10** — `generate:types` pattern.

---

## 5. Steps

### 5.1 — Do the function types TS lesson

Read [05-4 — Function types](../ts-lessons/05-generics/05-4-function-types.md)
and complete the exercise before continuing.

### 5.2 — Generate types

```bash
pnpm generate:types
```

Open `src/payload-types.ts`. Find the `User` interface. You should see
the `roles` field — it'll be typed as an array of the literal union:
`('admin' | 'editor')[]`.

### 5.3 — Test access control scenarios

With `pnpm dev` running, test these scenarios:

**Scenario 1: Unauthenticated read**
```
GET http://localhost:3000/api/posts
```
→ Only published posts (or empty if all drafts)

**Scenario 2: Authenticated read**
Log in via admin, hit the same endpoint → All posts including drafts

**Scenario 3: Unauthenticated global read**
```
GET http://localhost:3000/api/globals/header
```
→ Returns header data (public read)

**Scenario 4: Unauthenticated global update**
```
POST http://localhost:3000/api/globals/header
```
→ Should be denied (401 or 403)

### 5.4 — Explore: hover over your access functions

Open `src/access/isAdmin.ts`. Hover over the function — notice the
`Access` type annotation. TypeScript knows:

- The function receives `{ req: { user } }`
- It must return `boolean | Where`
- If you try to return a string, you get a red squiggle

This is the function type at work.

---

## 6. Verify

- [ ] Function types TS lesson completed with exercise
- [ ] `pnpm generate:types` shows `roles` on User interface
- [ ] Unauthenticated requests only return published posts
- [ ] Unauthenticated requests can read globals but not update
- [ ] You understand `Access` as a function type
- [ ] You can explain the difference between returning `true` and
      returning a where query in access control

Commit:

```bash
git add .
git commit -m "step 05.3 — function types lesson, test access control"
```

---

## 7. Unlocks

- **Step 06** — Hooks. Now that you control *who* can do things,
  hooks control *what happens* when they do — auto-slug, audit logs,
  timestamps.
- Access control + hooks together form the security and business logic
  layer of any Payload project.
