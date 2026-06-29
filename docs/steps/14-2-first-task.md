# Step 14.2 — Define your first task and queue it

Create a simple task, configure the jobs system, queue a job manually,
and see it execute.

---

## 1. The story

Before building anything complex, you need to see the full loop:
define a task → queue a job → watch it run → check the result.
We'll create a `seedHomepage` task that creates a Page document if
one doesn't exist. Simple, practical, and demonstrates every piece.

---

## 2. What you'll learn — Payload

> **Official docs:** [Tasks](https://payloadcms.com/docs/jobs-queue/tasks)

### Task config shape

```ts
{
  slug: 'myTask',           // unique identifier
  retries: 2,               // retry on failure
  inputSchema: [ ... ],     // Payload fields (what the task accepts)
  outputSchema: [ ... ],    // Payload fields (what the task returns)
  handler: async ({ input, req }) => {
    // do the work
    return { output: { ... } }
  },
}
```

### `inputSchema` and `outputSchema`

These use the same field types you already know from collections:

```ts
inputSchema: [
  { name: 'title', type: 'text', required: true },
  { name: 'slug', type: 'text', required: true },
],
outputSchema: [
  { name: 'pageId', type: 'number', required: true },
  { name: 'created', type: 'checkbox' },
],
```

### The handler function

Receives an object with:

| Property | What it is |
|---|---|
| `input` | Typed data matching `inputSchema` |
| `req` | Payload request — has `req.payload` for DB access |
| `job` | The job metadata (ID, status, timestamps) |

Must return `{ output: { ... } }` matching `outputSchema`.

### `autoRun` — running jobs automatically

For development, add `autoRun` to the jobs config:

```ts
jobs: {
  autoRun: [
    { cron: '* * * * *', queue: 'default' },
  ],
  tasks: [ ... ],
}
```

This checks for queued jobs every minute and runs them. The cron
runs inside the Next.js process — perfect for development.

### Queuing a job

```ts
await payload.jobs.queue({
  task: 'seedHomepage',
  input: { title: 'Home', slug: 'home' },
})
```

This creates a record in the `payload-jobs` collection. The runner
picks it up on the next cycle.

### Making the jobs collection visible

By default `payload-jobs` is hidden. Make it visible so you can
inspect jobs in the admin:

```ts
jobs: {
  jobsCollectionOverrides: ({ defaultJobsCollection }) => {
    defaultJobsCollection.admin = {
      ...defaultJobsCollection.admin,
      hidden: false,
    }
    return defaultJobsCollection
  },
}
```

---

## 3. What you'll learn — TypeScript

- **`TaskConfig<'slug'>` type assertion**: tells TypeScript the exact
  task slug for type inference on input/output
- **`inputSchema` / `outputSchema`**: same field definitions you use
  in collections, but for task I/O
- **`req.payload`**: accessing the Payload API inside a task handler
  (same pattern as hooks)

---

## 4. Builds on

- [Step 14.1 — What are Jobs](14-1-what-are-jobs.md)
- [Step 09.1 — Pages collection](09-1-first-block.md) (we'll create pages)

---

## 5. Steps

### 5a. Add the jobs config to payload.config.ts

Open `src/payload.config.ts`. Add the `jobs` config at the top level
of `buildConfig` (same level as `collections`, `plugins`, etc.):

```ts
export default buildConfig({
  // ... existing config (admin, collections, etc.)

  jobs: {
    autoRun: [
      { cron: '* * * * *', queue: 'default' },
    ],
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      defaultJobsCollection.admin = {
        ...defaultJobsCollection.admin,
        hidden: false,
      }
      return defaultJobsCollection
    },
    tasks: [
      {
        slug: 'seedHomepage',
        retries: 0,
        inputSchema: [
          { name: 'title', type: 'text', required: true },
          { name: 'slug', type: 'text', required: true },
        ],
        outputSchema: [
          { name: 'pageId', type: 'number', required: true },
          { name: 'created', type: 'checkbox' },
        ],
        handler: async ({ input, req }) => {
          const existing = await req.payload.find({
            collection: 'pages',
            where: { slug: { equals: input.slug } },
            limit: 1,
          })

          if (existing.docs.length > 0) {
            return {
              output: {
                pageId: existing.docs[0].id as number,
                created: false,
              },
            }
          }

          const page = await req.payload.create({
            collection: 'pages',
            data: {
              title: input.title,
              slug: input.slug,
            },
          })

          return {
            output: {
              pageId: page.id as number,
              created: true,
            },
          }
        },
      },
    ],
  },
})
```

### 5b. Restart the dev server

```bash
pnpm dev
```

Payload creates the `payload-jobs` collection on restart.

### 5c. Verify the jobs collection in admin

1. Go to `http://localhost:3000/admin`
2. You should see **"Payload Jobs"** in the sidebar
3. Click it — it should be empty (no jobs queued yet)

### 5d. Queue a job via the Local API

Open a new endpoint or use the Payload REST API. The easiest way is
to create a simple custom endpoint or use the `onInit` hook.

For quick testing, add this temporarily to your `payload.config.ts`
inside `buildConfig`:

```ts
onInit: async (payload) => {
  await payload.jobs.queue({
    task: 'seedHomepage',
    input: { title: 'Home', slug: 'home' },
  })
  payload.logger.info('Queued seedHomepage job')
},
```

This queues the job once when the server starts.

### 5e. Watch the job execute

1. Restart the dev server → the `onInit` hook queues the job
2. Check the terminal — you should see "Queued seedHomepage job"
3. Wait up to 1 minute (the `autoRun` cron is `* * * * *`)
4. Go to Admin → Payload Jobs → you should see a completed job
5. Click the job to see its input, output, and status
6. Go to Admin → Pages → a "Home" page should exist (if it didn't already)

### 5f. Check the job details

Click into the completed job. You'll see:

- **Task slug**: `seedHomepage`
- **Input**: `{ title: "Home", slug: "home" }`
- **Output**: `{ pageId: <id>, created: true/false }`
- **Status**: `completed`
- **Has Error**: false

### 5g. Clean up

Remove the `onInit` hook after testing — you don't want to queue
a job every time the server starts:

```ts
// Remove this:
onInit: async (payload) => {
  await payload.jobs.queue({ ... })
},
```

---

## 6. Verify

- [ ] `jobs` config is in `payload.config.ts` with `autoRun` and one task
- [ ] "Payload Jobs" collection is visible in admin sidebar
- [ ] A job was queued via `onInit`
- [ ] The job executed and shows as "completed" in the admin
- [ ] The job output shows `pageId` and `created` values
- [ ] The Page was created (or found as existing)
- [ ] `onInit` hook is removed after testing

---

## 7. Commit

```bash
git add src/payload.config.ts
git commit -m "step 14.2 — first Payload job task (seedHomepage)"
```

---

## 8. Unlocks

- **Step 14.3** — Queue jobs from hooks (event-driven)

---

| Nav | |
|---|---|
| <- Previous | [Step 14.1 — what are jobs](14-1-what-are-jobs.md) |
| -> Next | [Step 14.3 — event-driven jobs from hooks](14-3-jobs-from-hooks.md) |
