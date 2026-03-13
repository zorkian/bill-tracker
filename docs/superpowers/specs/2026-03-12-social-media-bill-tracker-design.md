# Social Media Bill Tracker — Design Spec

## Overview

A public-facing website that tracks US state and federal legislation targeting social media platforms. Built on Cloudflare Workers with a simple admin interface for data entry and Legiscan API integration for automated status updates.

**Target audience:** Platform operators, advocates, journalists, and the general public tracking social media legislation.

**Non-goals:** This is not branded to any specific platform. A small footer link back to Dreamwidth Advocacy is included, but the tracker itself is agnostic.

## Architecture

**Stack:** Cloudflare Workers + Hono (web framework) + D1 (SQLite database) + KV (session storage)

**Deployment:** Single `wrangler deploy` command. No build step beyond what Wrangler provides.

**Approach:** Server-rendered HTML with minimal client-side JavaScript for filtering/sorting. No SPA framework. Progressive enhancement — the page works without JS, filtering is a JS enhancement on top of the full dataset rendered inline.

## Data Model

### Bills

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PRIMARY KEY | Auto-increment |
| `state` | TEXT NOT NULL | Two-letter code (e.g., "AZ") or "US" for federal |
| `bill_number` | TEXT NOT NULL | e.g., "HB 2991" |
| `title` | TEXT | Bill title (from Legiscan or manual entry) |
| `legiscan_bill_id` | INTEGER | Legiscan's internal bill ID, used for API polling |
| `legiscan_url` | TEXT | Link to Legiscan page |
| `status_simple` | TEXT NOT NULL | One of: Introduced, Passed One Chamber, Passed Both Chambers, Signed Into Law, Vetoed, Failed |
| `status_detail` | TEXT | Full Legiscan status string for granular detail |
| `date_introduced` | TEXT | ISO 8601 date |
| `last_action_date` | TEXT | ISO 8601 date |
| `last_action_description` | TEXT | Description of last legislative action |
| `session_end_date` | TEXT | ISO 8601 date — when the legislative session ends. Populated from Legiscan session data during initial lookup if available, otherwise entered manually. Not updated by cron polling. |
| `social_media_definition` | TEXT | The specific definition of "social media" used in this bill |
| `notes` | TEXT | Free-text editorial/analysis content |
| `created_at` | TEXT NOT NULL | ISO 8601 timestamp |
| `updated_at` | TEXT NOT NULL | ISO 8601 timestamp — shown on public cards |

**Unique constraint:** `(state, bill_number)` — prevents duplicate entries.

### Categories

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PRIMARY KEY | Auto-increment |
| `name` | TEXT NOT NULL UNIQUE | Display name, e.g., "Age Verification (Gov't ID)" |
| `slug` | TEXT NOT NULL UNIQUE | URL-safe identifier, e.g., "age-verification" |
| `sort_order` | INTEGER NOT NULL DEFAULT 0 | Controls display order |

**Initial categories (seeded on first deploy):**

1. Age Verification (Gov't ID)
2. Age Estimation (non-ID)
3. Minimum Age Ban
4. Parental Consent for Account Creation
5. Parental Access to Account/Activity
6. Parental Control over Settings
7. Account Termination on Parental Request
8. Default Restrictive Privacy for Minors
9. Block Adult-Minor Contact
10. Notification Time Restrictions
11. School-Hours Restrictions
12. Restrict Algorithmic/Personalized Feeds
13. Time Tracking / Usage Limits
14. State-Mandated Warning Displays
15. Prohibit "Dark Patterns"
16. Prohibit "Addictive Design Features"
17. Restrict Targeted Advertising to Minors
18. Easy Account Deletion for Minors
19. Data Protection Impact Assessments
20. Mandatory Third-Party Audits
21. Duty of Care Provisions
22. Content-Specific Restrictions
23. Disable Logged-Out Viewing

### Bill-Categories (join table)

| Column | Type | Description |
|---|---|---|
| `bill_id` | INTEGER NOT NULL | FK → bills.id |
| `category_id` | INTEGER NOT NULL | FK → categories.id |

**Primary key:** `(bill_id, category_id)`

### Users

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PRIMARY KEY | Auto-increment |
| `username` | TEXT NOT NULL UNIQUE | Login username |
| `password_hash` | TEXT NOT NULL | bcrypt hash |
| `created_at` | TEXT NOT NULL | ISO 8601 timestamp |

### Sessions (KV)

- **Key:** Random session token (crypto.randomUUID())
- **Value:** JSON `{ "user_id": 1, "username": "admin" }`
- **TTL:** 7 days (KV expiration)

## Routes

### Public

| Method | Path | Description |
|---|---|---|
| GET | `/` | Main bill tracker page — all bills rendered inline, JS filtering |
| GET | `/bill/:id` | Individual bill detail page — standalone page with full bill info |

### Authentication

| Method | Path | Description |
|---|---|---|
| GET | `/login` | Login form — hidden URL, no link from public pages |
| POST | `/login` | Authenticate, set session cookie, redirect to /admin |
| POST | `/logout` | Clear session cookie and KV entry, redirect to / |

### Admin (all require valid session cookie)

| Method | Path | Description |
|---|---|---|
| GET | `/admin` | Bill list — table with edit/delete links, sorted by updated_at desc |
| GET | `/admin/bills/new` | Add bill form with Legiscan lookup |
| POST | `/admin/bills` | Create bill |
| GET | `/admin/bills/:id/edit` | Edit bill form |
| POST | `/admin/bills/:id` | Update bill |
| GET | `/admin/bills/:id/delete` | Delete confirmation page |
| POST | `/admin/bills/:id/delete` | Execute bill deletion |

### API (internal, used by admin JS)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/legiscan-lookup` | Query params: `state`, `bill_number`. Returns Legiscan data as JSON |

## Public UI Design

### Layout

Card-based layout with each bill as a card. No table — cards work better on mobile and accommodate variable-length content (notes, definitions).

### Card anatomy

Each bill card includes:
- **Header:** State + bill number (bold), status badge (color-coded pill)
- **Subheader:** Last action description + date. Session end date if still active.
- **Category pills:** Gray pills showing all categories that apply
- **Social media definition:** Shown in a light gray box if present
- **Notes:** Shown in an amber callout box if present
- **Footer:** "Last updated [date]" + "View on Legiscan →" link
- **Left border:** Color-coded by status:
  - Green (#16a34a): Signed Into Law
  - Blue (#2563eb): Introduced, Passed One Chamber, Passed Both Chambers
  - Red (#dc2626): Failed, Vetoed

### Filter bar

Sits above the bill cards. All filtering is instant, client-side JavaScript operating on the full dataset already in the page.

- **State dropdown:** All states/federal, with "All States" default
- **Status dropdown:** All statuses, with "All Statuses" default
- **Category dropdown:** All categories, with "All Categories" default
- **Text search:** Searches bill number, title, notes, definition

### Default sort order

Bills are sorted by `last_action_date` descending (most recent activity first). Failed/Vetoed bills are sorted to the bottom.

### Stats bar

Below the filter bar, shows counts: total bills, signed into law, in progress, failed. Updates dynamically as filters change.

### Responsive design

- Filter bar wraps on mobile (dropdowns stack vertically)
- Cards are full-width on all screen sizes
- Readable on phones without horizontal scrolling

### Header/Footer

- **Header:** Dark (#1e293b), site name "Social Media Bill Tracker", subtitle "Tracking state legislation affecting social media platforms"
- **Footer:** Small text with link back to Dreamwidth Advocacy, last data update timestamp

## Admin UI Design

### Bill list page (`/admin`)

Simple table: State, Bill Number, Title, Status, Updated. Each row links to edit. "Add Bill" button at top.

### Add/Edit bill form

- **Legiscan Quick Add** box at top: state dropdown + bill number input + "Look Up" button. On success, populates form fields from Legiscan API response.
- **Form fields:** State (dropdown including "Federal"), bill number, title, status (dropdown), date introduced, session end date, Legiscan URL
- **Category checkboxes:** Two-column grid of all categories
- **Social media definition:** Textarea
- **Notes:** Textarea
- **Save / Cancel buttons**

### Admin nav

Simple top bar: site name + "Admin" badge, links to Bills list, View Site, Logout.

## Legiscan Integration

### Initial lookup (admin action)

When an admin enters a state + bill number and clicks "Look Up":
1. Call Legiscan `search` API with state + bill number to find the bill
2. Use the returned `bill_id` to call `getBill` for full details
3. Parse `getBill` response for: title, status, status_detail, dates (intro date, last action date), Legiscan URL, bill ID, and session info (including session end date if available)
4. Return as JSON to the admin form, populating all fields that have data
5. Admin reviews, fills in remaining fields (categories, definition, notes), saves

### Automated status polling (Cron Trigger)

A Cloudflare Cron Trigger runs daily:
1. Query all bills where `status_simple` is NOT in (Signed Into Law, Vetoed, Failed) AND `legiscan_bill_id` is NOT NULL
2. For each, call Legiscan `getBill` API with stored `legiscan_bill_id`
3. Update `status_detail`, `last_action_date`, `last_action_description`
4. If the Legiscan status maps to a different `status_simple`, update that too
5. Check action history for governor signature (action type 28 = "Signed by Governor") — if found, set `status_simple` to "Signed Into Law"
6. Update `updated_at` timestamp

**Error handling:** If the Legiscan API returns an error or is unreachable for a specific bill, skip that bill and continue with the rest. Errors are logged via `console.error` (visible in Workers logs). The bill's data remains unchanged and will be retried on the next daily run.

**Rate limiting:** Legiscan allows 30,000 queries/month. With ~50-100 active bills polled daily, that's ~1,500-3,000 queries/month — well within limits.

### Status mapping

Legiscan provides numeric status codes. Mapping to simplified statuses:

| Legiscan Status | Simple Status |
|---|---|
| 1 (Introduced) | Introduced |
| 2 (Engrossed) | Passed One Chamber |
| 3 (Enrolled) | Passed Both Chambers |
| 4 (Passed) | Passed Both Chambers |
| 5 (Vetoed) | Vetoed |
| 6 (Failed) | Failed |
| Action type 28 (Signed by Governor) | Signed Into Law |

Note: "Signed Into Law" is detected from the bill's action history rather than the top-level status code, since Legiscan's status codes don't have a distinct value for it.

## Authentication

### Login flow

1. User navigates to `/login` (no link from public pages — you have to know the URL)
2. Submits username + password
3. Server verifies password against bcrypt hash in D1
4. On success: generates session token (crypto.randomUUID()), stores in KV with 7-day TTL, sets HttpOnly/Secure/SameSite=Strict cookie
5. Redirects to `/admin`

### Session validation

Hono middleware on all `/admin/*` routes:
1. Read session token from cookie
2. Look up in KV
3. If missing/expired → redirect to `/login`
4. If valid → attach user info to request context, proceed

### CSRF protection

All POST routes use Hono's built-in CSRF middleware (Origin header validation). No hidden form tokens needed — Origin checking is sufficient.

### User management

Phase 1: Users are created via a CLI seed script. The seed script includes a pre-generated bcrypt hash. To create a new admin user, generate a hash with `npx bcryptjs <password>` (or similar tool) and add an INSERT to `seed.sql`, then run `wrangler d1 execute`. No self-registration, no admin UI for user management.

### Delete confirmation

Bill deletion requires a confirmation step — the delete button submits to a confirmation page showing the bill details before final deletion.

## Phase 2 Features (out of scope for phase 1)

- **US map visualization** — interactive map with color-coded states
- **Category CRUD in admin** — add/edit/delete categories through the web UI
- **Claude-assisted bill parsing** — use Anthropic API to read bill text and suggest categories, definitions, notes
- **User management in admin** — add/remove admin users through the web UI

## Project Structure

```
tracker/
├── src/
│   ├── index.ts              # Hono app entry point, route registration
│   ├── routes/
│   │   ├── public.ts          # Public routes (/, /bill/:id)
│   │   ├── auth.ts            # Login/logout routes
│   │   └── admin.ts           # Admin routes (CRUD, legiscan lookup)
│   ├── middleware/
│   │   └── auth.ts            # Session validation middleware
│   ├── services/
│   │   ├── legiscan.ts        # Legiscan API client
│   │   └── cron.ts            # Cron trigger handler for status polling
│   ├── db/
│   │   ├── schema.sql         # D1 schema (CREATE TABLE statements)
│   │   └── seed.sql           # Initial categories + admin user
│   └── templates/
│       ├── layout.ts          # Base HTML layout (head, header, footer)
│       ├── public/
│       │   ├── index.ts       # Public bill tracker page template
│       │   └── bill-detail.ts # Individual bill detail page template
│       ├── admin/
│       │   ├── bills-list.ts  # Admin bill list template
│       │   └── bill-form.ts   # Admin add/edit bill template
│       └── auth/
│           └── login.ts       # Login form template
├── public/
│   └── static/
│       └── filter.js          # Client-side filtering/sorting JS
├── wrangler.toml              # Cloudflare Workers config
├── package.json
└── tsconfig.json
```

## Deployment

1. `npm install`
2. Create D1 database: `wrangler d1 create sm-bill-tracker`
3. Create KV namespace: `wrangler kv namespace create SESSIONS`
4. Apply schema: `wrangler d1 execute sm-bill-tracker --file=src/db/schema.sql`
5. Seed data: `wrangler d1 execute sm-bill-tracker --file=src/db/seed.sql`
6. Set Legiscan API key: `wrangler secret put LEGISCAN_API_KEY`
7. Deploy: `wrangler deploy`
