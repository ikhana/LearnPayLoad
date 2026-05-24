# Step 00 — Setup

Scaffold a fresh Payload + Next.js project, get the admin panel running, and
create our first admin user.

---

## 1. The story

You want to learn Payload. The first thing is to get a working app on your
machine that you can poke at. Without a running project there's nothing to
add a collection *to*, nothing to log into, nothing concrete to talk about.

This step is the boring-but-required foundation. After it we have one Payload
project at the repo root, a dev server running on `localhost:3000`, and an
admin UI we can log into. Every step after this one is "add or change one
thing in this project."

---

## 2. What you'll learn — Payload

> **Official docs for this step:** [Payload Installation](https://payloadcms.com/docs/getting-started/installation). This section annotates that page; the official page wins on any conflict.

- **What Payload is.** A code-first headless CMS that runs as a Next.js app.
  Your collections (data shapes) are TypeScript files. The admin UI is
  generated from those files — you don't write forms by hand. The API
  (REST + GraphQL) is generated too. You own the code; there's no SaaS
  console to log into.
- **What `pnpm create payload-app` scaffolds.** A Next.js project with Payload
  wired in. Both the admin UI and your frontend live in the same app, under
  different route groups (`(payload)` for admin, `(frontend)` for your site).
- **The folder convention** you'll see in every Payload project:
  - `src/payload.config.ts` — the brain. Lists collections, globals, plugins,
    database adapter, email adapter. Everything runs through this file.
  - `src/collections/` — one file per collection (data shape).
  - `src/app/(payload)/` — the admin UI routes (don't usually touch these).
  - `src/app/(frontend)/` — your customer-facing frontend pages.
  - `.env` — secrets and the DB connection string.
- **Database choices.** Payload supports Postgres, MongoDB, and SQLite via
  separate adapters. For pure learning, SQLite is the lowest-friction (zero
  external setup). For learning that mirrors production, Postgres.

---

## 3. What you'll learn — TypeScript

This curriculum uses TypeScript everywhere. If you're new to TS, the 30-second
framing:

- **TypeScript = JavaScript + type annotations** the compiler checks at build
  time. The annotations are erased before the code runs — no runtime overhead.
- **You catch bugs before shipping** that would otherwise blow up at runtime
  ("Cannot read property `x` of undefined", calling a function with the wrong
  argument shape, etc.).
- Payload is **TS-first**: collection definitions, hook callbacks, field
  configs, and the generated client all rely on TS types to give you
  autocomplete and compile-time safety.

The scaffolded project includes `tsconfig.json` with `"strict": true`. That
flag turns on every safety check Payload expects. Don't disable it — most of
Payload's type guarantees fall over without it.

**Look at:** `tsconfig.json` in the scaffolded project. The important lines:

- `"strict": true` — enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and others as a set.
- `"moduleResolution": "Bundler"` (or `"NodeNext"`) — matches what Next.js expects.
- `"paths": { "@/*": ["./src/*"] }` — lets you write `import X from "@/lib/x"` instead of `"../../../lib/x"`.

You don't need to understand every option yet. This file is the single switch
board for how TS checks your code; every later step assumes `strict` is on.

**One thing you may hit immediately:** the scaffolded `tsconfig.json` ships with `"baseUrl": "."`. TypeScript 5+ shows a deprecation warning on this — `baseUrl` will be removed in TS 7.0. The reason it exists historically is that older TS resolved `paths` relative to `baseUrl`. Modern TS resolves `paths` relative to the `tsconfig.json` file's own directory, so `baseUrl` is redundant when your paths are already explicit (e.g., `"@/*": ["./src/*"]`). The fix is to delete the `"baseUrl": "."` line. Already done in this repo.

---

## 4. Builds on

Nothing. This is step 00.

---

## 5. Steps

> **Follow the [official installation page](https://payloadcms.com/docs/getting-started/installation) alongside this section.** When in doubt, the official docs win — this section annotates them.

### 5.1 — Verify prerequisites

The official docs require:

- **Node.js 20.9.0 or higher.** Check with `node --version`.
- **A supported package manager.** pnpm is preferred. npm and yarn 2+ also work; yarn 1.x is not supported. Check pnpm with `pnpm --version`.
- **A supported Next.js version** (handled automatically when you scaffold via `create-payload-app`).

If Node or pnpm is missing, install before continuing.

### 5.2 — Pick a database

Payload supports MongoDB, Postgres, and SQLite via separate adapter packages:

- MongoDB → `@payloadcms/db-mongodb`
- Postgres → `@payloadcms/db-postgres`
- SQLite → `@payloadcms/db-sqlite`

The scaffolding CLI installs the right adapter when you pick at the prompt.

For this curriculum we'll use **SQLite** — zero external setup, a file on
disk. You can swap to Postgres or MongoDB later by changing the adapter in
`payload.config.ts`; Payload's collection definitions are database-agnostic.

### 5.3 — Scaffold the project

From the LearnPayLoad repo root, run the command from the official docs:

```bash
npx create-payload-app
```

If you have pnpm installed, the equivalent works too — `pnpm create payload-app` is sugar for `pnpm dlx create-payload-app`, which downloads and runs the same package as `npx create-payload-app`. Same prompts either way.

The official docs say to "just follow the prompts." Do that. When you hit
each prompt, choose:

- **Project name** — point at the current directory if the CLI allows (often `.`), or a subfolder name if not. If you go with a subfolder, run all later commands from inside it.
- **Template** — **blank**. (Other templates have opinions we'd rather learn ourselves.)
- **Database** — **sqlite**.
- **Package manager** — **pnpm** if asked.

When the CLI finishes, the project files are on disk and dependencies are installed.

> **Document what you saw.** If the prompts differ from the list above (Payload moves fast), capture the actual options as a note at the bottom of this step doc so the next reader sees reality, not stale instructions.

### 5.4 — Verify environment

`create-payload-app` already created `.env` for you with both values populated:

- `DATABASE_URL` — defaults to `file:./.db` (a hidden file at the project root)
- `PAYLOAD_SECRET` — auto-generated random hex string used to sign auth tokens

Open `.env` to confirm both lines are present. If you ever need to rotate the secret, replace its value with any 32+ char random string (`openssl rand -hex 32` works).

The CLI ships both `.env.example` (committed to git as a template) and `.env` (in `.gitignore` — your real secrets stay local).

**One gotcha to fix before your first commit:** the default `.gitignore` does NOT exclude the SQLite database file. Without the fix, your `.db` file (and its journal/WAL files) would land in git alongside code, bloating the repo and leaking any user data. Add to `.gitignore`:

```gitignore
# SQLite (DATABASE_URL=file:./.db lives at the repo root)
*.db
*.db-*
```

### 5.5 — Run the dev server

```bash
pnpm dev
```

Wait for the "ready" line saying the server is listening on port 3000.

### 5.6 — Create the first admin user

Open `http://localhost:3000/admin`. On first run Payload shows a one-time
"create your first user" form. Fill in an email + password. This account
becomes your only user until you add more.

You're in. The sidebar shows the default collections (`Users` and likely `Media`).

---

## 6. Verify

- [ ] `pnpm dev` starts the server with no errors in the terminal
- [ ] `localhost:3000` returns *something* (the blank template's default page)
- [ ] `localhost:3000/admin` loads the admin shell
- [ ] You can log in with the user you just created
- [ ] The sidebar shows the `Users` collection at minimum
- [ ] `src/payload.config.ts` exists and imports the user/media collection(s)
- [ ] `tsconfig.json` exists with `"strict": true`
- [ ] You opened `tsconfig.json` and read the three lines called out in section 3

Commit:

```bash
git add .
git commit -m "step 00 — scaffold Payload with sqlite, first admin user"
```

---

## 7. Unlocks

- **Step 01** — your first custom collection. You'll add a `Posts` collection
  with a handful of fields and watch Payload generate the admin UI from your
  config alone. The TS lesson in 01 builds on the `strict` mode you saw here:
  you'll write your first `CollectionConfig`-typed object.
- Once Posts exists, **Step 02** can introduce relationships (Posts → Categories).
- The `src/payload.config.ts` file you'll edit in every later step exists now.
- The admin UI is the surface you'll watch every collection-change reflect into.
