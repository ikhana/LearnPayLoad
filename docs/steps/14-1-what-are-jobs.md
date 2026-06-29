# Step 14.1 — What are Payload Jobs and why they matter

Understand the Jobs Queue architecture before writing any code.
Concept-only step — no code changes.

---

## 1. The story

Your client's site needs to send a welcome email when a user signs up,
generate a PDF invoice after a purchase, sync data to a CRM every night,
and publish scheduled posts at future dates. If you do all this inside
hooks, the admin panel freezes while it waits for the email API, the PDF
generator, and the CRM sync. The user stares at a spinner.

Payload Jobs solve this by **offloading work to a background queue**.
The hook fires, queues a job, and returns immediately. A separate
runner picks up the job and processes it — the admin stays fast.

This is the same concept as BullMQ, Celery, or Sidekiq — but built
into Payload with no extra infrastructure.

---

## 2. What you'll learn — Payload

> **Official docs:** [Jobs Queue Overview](https://payloadcms.com/docs/jobs-queue/overview)

### The four components

| Component | What it is | Analogy |
|---|---|---|
| **Task** | A function that does one thing (send email, generate PDF) | A recipe |
| **Workflow** | Multiple tasks chained together with retry | A meal plan |
| **Job** | One instance of a task/workflow queued for execution | An order |
| **Queue** | A named group of jobs (e.g., "emails", "nightly") | A kitchen station |

### How it flows

```
Your code calls payload.jobs.queue()
    ↓
Job is saved to the `payload-jobs` collection (database)
    ↓
A runner picks it up (autoRun, bin script, or API call)
    ↓
Task handler executes
    ↓
Success → output stored, job marked complete
Failure → retry up to N times → then mark as failed
```

### Two types of jobs

**1. Event-driven (triggered by something happening)**

```ts
// In an afterChange hook:
await req.payload.jobs.queue({
  task: 'sendWelcomeEmail',
  input: { userId: doc.id },
})
```

Use cases:
- Send email on user signup
- Sync to CRM on document update
- Generate PDF on order creation

**2. Scheduled (cron-based, runs on a timer)**

```ts
// In task config:
schedule: [{ cron: '0 8 * * *', queue: 'daily' }]
```

Use cases:
- Publish posts with future dates
- Send daily digest emails
- Sync third-party data overnight

### Running jobs: three approaches

| Approach | Best for | How |
|---|---|---|
| **autoRun** | Development + simple deployments | Config option, runs inside Next.js process |
| **Bin script** | Production dedicated servers | `pnpm payload jobs:run --cron "* * * * *"` |
| **API endpoint** | Serverless (Vercel, Lambda) | `GET /api/payload-jobs/run?queue=emails` |

For our learning project, we'll use **autoRun** — simplest to set up.

### The `payload-jobs` collection

Jobs are stored in a real Payload collection called `payload-jobs`.
By default it's hidden in the admin, but you can make it visible for
debugging:

```ts
jobs: {
  jobsCollectionOverrides: ({ defaultJobsCollection }) => {
    defaultJobsCollection.admin = { hidden: false }
    return defaultJobsCollection
  },
}
```

### Tasks are typed

Every task has:
- `inputSchema` — Payload fields defining what the task accepts
- `outputSchema` — Payload fields defining what the task returns
- `handler` — the async function that does the work

TypeScript generates types for both input and output, so you get
full autocomplete when queuing jobs.

### Retries and idempotency

Tasks can retry on failure:

```ts
{
  slug: 'sendEmail',
  retries: 3,  // try 3 more times if it fails
  handler: async ({ input }) => { ... }
}
```

**Idempotency rule**: tasks should produce the same result if run
multiple times with the same input. Because retries can re-run a
task, you don't want to send duplicate emails or charge twice.

---

## 3. What you'll learn — TypeScript

- No new TypeScript concepts in this step
- Next steps introduce `TaskConfig` typing and `inputSchema`/`outputSchema`

---

## 4. Builds on

- [Step 06.1 — Hooks](06-1-before-change-slug.md) (jobs are often queued from hooks)
- [Step 12.2 — Writing plugins](12-2-writing-a-plugin.md) (jobs config follows similar pattern)

---

## 5. Steps

### 5a. Read the official docs

1. [Jobs Queue Overview](https://payloadcms.com/docs/jobs-queue/overview)
2. [Tasks](https://payloadcms.com/docs/jobs-queue/tasks)

### 5b. Answer these questions

1. **What's the difference between a Task and a Job?**
   (Answer: Task is the function definition. Job is one instance
   of that task queued for execution.)

2. **Why not just do everything in hooks?**
   (Answer: hooks block the request — the admin freezes until the
   hook finishes. Jobs run in the background.)

3. **What happens if a task fails?**
   (Answer: it retries up to the configured `retries` count, then
   marks the job as failed.)

4. **What does "idempotent" mean and why does it matter for jobs?**
   (Answer: running the same task twice with the same input produces
   the same result. Important because retries can re-run tasks.)

5. **What are the three ways to run jobs?**
   (Answer: autoRun config, bin script, API endpoint)

---

## 6. Verify

- [ ] I can explain Task vs Job vs Workflow vs Queue
- [ ] I understand why background processing beats doing everything in hooks
- [ ] I know what idempotency means and why it matters
- [ ] I've read both official docs pages

---

## 7. Commit

No code changes — no commit needed.

---

## 8. Unlocks

- **Step 14.2** — Define your first task and queue it

---

| Nav | |
|---|---|
| <- Previous | [Step 13.6 — test Live Preview](13-6-test-full-loop.md) |
| -> Next | [Step 14.2 — your first task](14-2-first-task.md) |
