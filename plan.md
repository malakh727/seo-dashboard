# SEO Dashboard — Full Improvement & Feature Plan

## Status Key
- [ ] Not started
- [~] In progress
- [x] Done

---

## Already Completed (from previous sessions)

- [x] Fix hardcoded backend URL → Angular environment variables
- [x] Rate limiting on backend (20 req/min)
- [x] Request timeout handling (10s Axios + user-friendly error)
- [x] Skeleton loading UI
- [x] Analysis history (localStorage, 10 entries, collapsible panel)
- [x] Expanded SEO metrics (OG tags, canonical URL, images, word count)
- [x] Score trend / delta vs last run
- [x] Copy results + Download JSON
- [x] Backend input sanitization (SSRF / private IP block)
- [x] Error retry button
- [x] Frontend design upgrade (gradient header, score ring, progress bars, animations)
- [x] README accuracy fix

---

## Phase 1 — Main Page Animations & Motion

> Goal: Make the existing results page feel alive and polished.

- [x] **Score counter animation** — count up from 0 to final score on result load
  - File: `frontend/src/app/components/score-card/score-card.ts`
  - Use `setInterval` ticking a `displayScore` signal from 0 → score over ~600ms

- [x] **Staggered card entrance** — result cards slide+fade in with increasing delay
  - File: `frontend/src/styles.css`
  - Add `animation-delay` utility classes (`delay-[100ms]`, `delay-[200ms]` …)
  - File: `frontend/src/app/app.html`
  - Apply stagger to score card, meta cards, checklist, OG card, heading cards

- [x] **Checklist items staggered reveal** — items animate in one-by-one like a checklist being ticked
  - File: `frontend/src/app/components/seo-checklist/seo-checklist.html`
  - Use `@for` index to compute inline `animation-delay`

- [x] **Fix Tailwind v4 class warnings**
  - Replace `bg-gradient-to-r` → `bg-linear-to-r` in all component files

---

## Phase 2 — Main Page Content Enhancements

> Goal: Add smarter, more useful content to the results without adding new routes.

- [x] **Score interpretation callout** — a dynamic sentence below the score card
  - Example: *"Missing meta description (−25 pts) and multiple H1 tags (−15 pts). Fix these to reach 85+."*
  - File: `frontend/src/app/app.ts` — compute `topIssues()` from `scoreBreakdown`
  - File: `frontend/src/app/app.html` — show below the top grid

- [x] **Quick-fix summary box** — shows only failed checklist items as action items
  - File: `frontend/src/app/app.html` — collapsible "Improve Your Score" card
  - One-line advice per failed check (e.g. "Add a `<meta name='description'>` tag")

- [x] **Domain favicon** — show the site's favicon next to the analyzed URL in the results header
  - Source: `https://www.google.com/s2/favicons?domain=<hostname>&sz=32`
  - File: `frontend/src/app/app.html` — results toolbar row

---

## Phase 3 — Angular Routing Setup

> Goal: Enable multi-page navigation. Required before adding any new pages.

- [x] **Enable Angular Router**
  - File: `frontend/src/app/app.routes.ts` — define routes for `/`, `/history`, `/compare`, `/tips`, `/report`
  - File: `frontend/src/app/app.config.ts` — confirm `provideRouter` is configured
  - File: `frontend/src/app/app.html` — add `<router-outlet>` and a top nav bar

- [x] **Shared nav bar component**
  - New file: `frontend/src/app/components/nav-bar/nav-bar.ts`
  - Links: Home · History · Compare · Tips
  - Active link highlight using `routerLinkActive`

---

## Phase 4 — `/history` Page

> Goal: Full-page history view replacing the limited dropdown panel.

- [x] **History page component**
  - New file: `frontend/src/app/pages/history/history.ts + .html`
  - Table view: URL · Score badge · Date · Re-analyze button · Delete button
  - Sortable by score or date
  - Score-over-time SVG sparkline chart per domain (with colored dots + reference lines)
  - Bulk-clear button

- [x] **Update history service** to store domain grouping metadata
  - File: `frontend/src/app/services/history.service.ts`
  - Added `fullHistory` signal (50 entries, keeps all runs including repeats)
  - Added `deleteEntry(analyzedAt)` method

- [x] **Remove the dropdown history panel** from the main page
  - Replaced with compact "N recent analyses → View all" bar linking to /history

---

## Phase 5 — `/compare` Page

> Goal: Side-by-side SEO comparison of two URLs.

- [x] **Compare page component**
  - New file: `frontend/src/app/pages/compare/compare.ts + .html`
  - Two URL inputs side-by-side (indigo/purple themed), each independently analyzed
  - Winner banner: trophy + score vs score + metric win count
  - Per-row win ✓ / lose ✗ / tie = indicators with green highlight on winning cell
  - 11-metric comparison table with hint text per row
  - Headings cards for both sides at the bottom

- [x] **Reuse existing components** — ScoreCard, HeadingsCard, LoadingSkeleton reused directly
- [x] **Extracted** `calculateScore` to `utils/seo-score.util.ts` shared by Home + Compare

---

## Phase 6 — `/report` Page

> Goal: A clean, shareable, print-friendly single-analysis report.

- [x] **Report page component**
  - New file: `frontend/src/app/pages/report/report.ts + .html`
  - URL param: `/report?data=<base64-encoded-result>` (no backend needed)
  - OG image banner at top (if present)
  - Large score gauge front-and-center
  - Full checklist breakdown, all cards in single-column layout
  - Print stylesheet (`@media print`) for clean PDF export

- [x] **"Share Report" button** on main page results toolbar
  - Encodes current result as base64 in URL → copies link to clipboard
  - File: `frontend/src/app/pages/home/home.html` + `home.ts`

---

## Phase 7 — `/tips` Page

> Goal: Static educational content that adds depth and SEO value to the app itself.

- [x] **Tips page component**
  - New file: `frontend/src/app/pages/tips/tips.ts + .html`
  - Accordion-style sections, one per SEO metric checked
  - Each section: what it is, why it matters, how to fix it, link to further reading
  - Topics: Page Title · Meta Description · H1/H2 Structure · Open Graph · Canonical URL · Alt Text · Word Count

- [x] **Link from checklist** — each checklist item gets a small "?" icon linking to its tips section
  - File: `frontend/src/app/components/seo-checklist/seo-checklist.html`

---

## Phase 8 — Production & Portfolio Polish

> (From original plan — deferred until features are complete)

- [ ] Docker Compose setup (`docker-compose.yml`, `Dockerfile` × 2)
- [ ] Swagger/OpenAPI docs at `/api/docs`
- [ ] Accessibility pass (aria-labels, keyboard nav, color-independent indicators)
- [ ] Unit tests — fill in `app.spec.ts`, `seo.spec.ts`, backend Jest tests

---

## Implementation Order

| Phase | Focus | Effort |
|---|---|---|
| 1 | Main page animations & motion | Low |
| 2 | Main page content enhancements | Low |
| 3 | Angular routing setup | Low |
| 4 | /history page | Medium |
| 5 | /compare page | Medium |
| 6 | /report page | Medium |
| 7 | /tips page | Low |
| 8 | Production polish | High |
