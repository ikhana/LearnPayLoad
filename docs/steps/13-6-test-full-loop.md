# Step 13.6 — Test the full Live Preview loop

Run through every scenario end-to-end. This step is testing and
verification only — no new code.

---

## 1. The story

You've added the config, enabled drafts + autosave, created the
`RefreshRouteOnSave` component, and built a dynamic URL. Now you
test every scenario to make sure the full loop works before
committing the final state.

This is the step where you break things on purpose to understand
the boundaries.

---

## 2. What you'll learn — Payload

> **Official docs:** [Live Preview Overview](https://payloadcms.com/docs/live-preview/overview)

### Content Security Policy (CSP)

If your frontend has strict CSP headers, the admin iframe might be
blocked. You'd need to whitelist the admin domain:

```
frame-ancestors: "self" localhost:* https://your-domain.com;
```

For local development this isn't usually an issue, but it will bite
you in production.

### Cross-origin considerations

If your frontend runs on a different port or domain than Payload
(e.g., Payload on `:3000`, frontend on `:3001`), you need CORS and
CSRF config:

```ts
// payload.config.ts
cors: ['http://localhost:3001'],
csrf: ['http://localhost:3001'],
```

In our setup, Payload and Next.js run on the same port (`:3000`),
so this doesn't apply. But it's critical to know for production
deployments where admin and frontend are on separate domains.

### Performance tuning

If Live Preview feels slow, the autosave interval is the main knob:

| Interval | Feel | DB load |
|---|---|---|
| 375ms | Near real-time | Higher — many writes |
| 1000ms | Slight delay | Moderate |
| 5000ms | Noticeable lag | Low |

For demos and client presentations, use 375ms. For daily editing,
1000-2000ms might be a better balance.

### Pop-out preview

The Live Preview toolbar has a button to **open the preview in a
new window**. This is useful for:

- Dual-monitor setups (admin on one screen, preview on another)
- Presenting to clients (show the preview full-screen)
- Testing at actual device dimensions

The postMessage communication still works across windows — changes
in the admin still refresh the popped-out preview.

---

## 3. What you'll learn — TypeScript

No new TypeScript concepts. This step is pure testing.

---

## 4. Builds on

- All previous Step 13 sub-steps

---

## 5. Steps

### 5a. Test: basic editing flow

1. Open Admin → Pages → "Home" → click **Live Preview**
2. Change the page title → wait for autosave
3. **Expected**: iframe refreshes, new title appears
4. Change a block's content (e.g., Hero heading) → wait for autosave
5. **Expected**: iframe refreshes, new heading appears

### 5b. Test: add a new block

1. In Live Preview mode, scroll down in the form
2. Click "Add Block" → select "Content" → type some text
3. Wait for autosave
4. **Expected**: iframe refreshes, new Content block appears at the
   bottom of the page

### 5c. Test: remove a block

1. In Live Preview mode, delete a block (click the trash icon)
2. Wait for autosave
3. **Expected**: iframe refreshes, the block is gone

### 5d. Test: reorder blocks

1. Drag a block to a different position
2. Wait for autosave
3. **Expected**: iframe refreshes, blocks appear in the new order

### 5e. Test: draft vs published

1. Make a change in Live Preview → wait for autosave
2. Open a new browser tab → go to `http://localhost:3000/home`
3. **Expected**: the public page shows the **old** content (published
   version), NOT the draft changes you just made
4. Go back to admin → click **"Publish"**
5. Refresh the public page → now you see the new content

This confirms that Live Preview shows drafts, but the public
frontend only shows published content.

### 5f. Test: breakpoints

1. In Live Preview, click the breakpoint dropdown
2. Select **"Mobile"** → iframe resizes to 375×667
3. **Expected**: your page renders in a narrow viewport
4. Select **"Tablet"** → 768×1024
5. Select **"Desktop"** → 1440×900
6. Select **"Responsive"** → fills available space
7. Try manual dimensions in the toolbar inputs (e.g., 500×800)

### 5g. Test: pop-out window

1. In Live Preview, click the **pop-out button** (usually an
   external link icon in the toolbar)
2. **Expected**: preview opens in a new browser window
3. Make a change in the admin → autosave
4. **Expected**: the popped-out window also refreshes

### 5h. Test: different pages

1. Go to Admin → Pages → "About" → Live Preview
2. **Expected**: iframe loads `/about`, not `/home`
3. Make a change → autosave
4. **Expected**: the About page updates in the iframe

### 5i. Test: creating a brand new page

1. Go to Admin → Pages → Create
2. Title: "Contact", Slug: "contact"
3. Add a Hero block → type a heading
4. Click **"Save Draft"** (first save)
5. Click **Live Preview**
6. **Expected**: iframe loads `/contact` and shows your content
7. Make more changes → autosave
8. **Expected**: iframe updates

---

## 6. Verify — Full checklist

### Core functionality
- [ ] Live Preview button appears on Pages
- [ ] Clicking it opens split view with iframe
- [ ] Editing text → autosave → iframe refreshes with new content
- [ ] Adding a block → appears in iframe
- [ ] Removing a block → disappears from iframe
- [ ] Reordering blocks → order updates in iframe

### URL routing
- [ ] Home page → iframe loads `/`
- [ ] About page → iframe loads `/about`
- [ ] New page with slug → iframe loads `/{slug}`

### Draft isolation
- [ ] Draft changes visible in Live Preview iframe
- [ ] Draft changes NOT visible on public frontend
- [ ] Publishing makes changes visible on public frontend

### Breakpoints
- [ ] Mobile breakpoint resizes iframe correctly
- [ ] Tablet breakpoint resizes iframe correctly
- [ ] Desktop breakpoint resizes iframe correctly
- [ ] Responsive mode fills available space
- [ ] Manual dimension inputs work

### Pop-out
- [ ] Preview opens in new window
- [ ] Changes in admin still refresh the popped-out preview

---

## 7. Commit

If any code tweaks were needed during testing, commit them:

```bash
git add -A
git commit -m "step 13.6 — verify Live Preview end-to-end"
```

If nothing changed, no commit needed.

---

## 8. Unlocks

Congratulations — you now have full Live Preview working. This unlocks:

- **Client demos**: show real-time editing that no HighLevel agency can
- **Better editor experience**: editors see exactly what visitors will see
- **Production readiness**: the draft/publish + autosave + preview flow
  is the professional CMS workflow

### What could come next (Step 14+)

- **Auth strategies** — API keys, OAuth, custom auth
- **Custom admin views** — full custom pages in the admin dashboard
- **Payload Jobs** — scheduled tasks and background processing
- **Form Builder** — contact forms, lead capture with the formBuilder plugin
- **Search plugin** — full-text search across collections

---

| Nav | |
|---|---|
| <- Previous | [Step 13.5 — dynamic preview URL](13-5-dynamic-preview-url.md) |
| -> Next | Step 14 (TBD) |
