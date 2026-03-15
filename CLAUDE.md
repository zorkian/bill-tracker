# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Social media bill tracker (bill-of-wrongs.com) — a Cloudflare Workers app that tracks US state and federal legislation related to social media regulation. Built with Hono + D1 (SQLite) + KV for sessions. Server-rendered HTML templates (Hono JSX), no frontend framework.

## Commands

- `npm run dev` — local dev server via wrangler
- `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" && TMPDIR="${TMPDIR:-/tmp}" npm test` — run all tests (requires nvm for Node 20+, and TMPDIR so miniflare writes to sandbox-writable temp)
- `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" && TMPDIR="${TMPDIR:-/tmp}" npx vitest run test/services/bills.test.ts` — run a single test file
- `npm run deploy` — deploy to Cloudflare Workers
- `npm run db:schema` — apply schema to local D1
- `npm run db:seed` — seed local D1 with sample data

## Architecture

**Runtime:** Cloudflare Workers with D1 (SQLite) database and KV namespace for sessions.

**Routing:** Hono app with three route groups mounted in `src/index.ts`:
- `routes/auth.ts` — login/logout, session management
- `routes/admin.ts` — CRUD for bills/users (behind `requireAuth`/`requireAdmin` middleware)
- `routes/public.ts` — public bill listing and detail pages

**Services layer** (`src/services/`): All database queries live here — `bills.ts`, `categories.ts`, `users.ts`, `sessions.ts`, `legiscan.ts`. Routes call services, never query D1 directly.

**Templates** (`src/templates/`): Server-rendered HTML using Hono JSX. Organized by `admin/`, `public/`, `auth/`, plus shared `layout.ts`.

**Cron:** `src/cron/poll-statuses.ts` runs daily (0 6 * * *) to update bill statuses from LegiScan API.

**Static assets:** `public/static/` — `filter.js` (client-side filtering) and `us-map.js` (interactive SVG map).

**Database schema:** `src/db/schema.sql` — four tables: `bills`, `categories`, `bill_categories` (junction), `users`. Bills have a `UNIQUE(state, bill_number)` constraint. States stored as 2-letter codes.

**Bindings** (defined in `src/types.ts`): `DB` (D1Database), `SESSIONS` (KVNamespace), `LEGISCAN_API_KEY` (string secret).

## Database Management

**This is a live production database with hand-curated bill analysis. Treat all data as irreplaceable.**

### Migrations

Migrations live in `src/db/migrations/` as numbered SQL files (e.g., `002-add-legiscan-hashes.sql`). There is no automated migration runner or tracking table — migrations are applied manually.

**Rules for writing migrations:**
- **Only additive operations**: `ALTER TABLE ADD COLUMN`, `CREATE TABLE`, `CREATE INDEX`. Never `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, or `DELETE FROM` without a WHERE clause.
- New columns must be nullable (no `NOT NULL` without a `DEFAULT`) so existing rows aren't affected.
- Use `IF NOT EXISTS` / `OR IGNORE` where possible to make migrations re-runnable.
- Keep `src/db/schema.sql` in sync — it represents the full current schema for fresh local installs.
- Update `test/helpers/setup.ts` to match any schema changes.

**Applying migrations to production:**
1. Back up first: `wrangler d1 export sm-bill-tracker --remote --output=backups/pre-migration-$(date +%Y%m%d).sql`
2. Apply: `wrangler d1 execute sm-bill-tracker --remote --file=src/db/migrations/NNN-name.sql`
3. Verify with a spot-check query: `wrangler d1 execute sm-bill-tracker --remote --command="SELECT count(*) FROM bills"`

### Backups

- **Before every deploy or migration**: `npm run db:backup` (exports remote D1 to `backups/`)
- D1 also provides automatic Time Travel (point-in-time recovery) for the last 30 days on paid plans — but don't rely on it as the only backup.
- The `backups/` directory is gitignored; keep copies somewhere safe.

### What to never do

- Never run `DELETE FROM <table>` without a `WHERE` clause against production
- Never `DROP` a table or column in production — columns can be left unused if deprecated
- Never run `db:schema` or `db:seed` against production (they're for local dev only)
- Never use `wrangler d1 execute --remote` without backing up first

## LegiScan API Rules

Public API key: 30,000 queries/month. Every query counts. Key rules:

- **Always use `change_hash`** to avoid re-fetching unchanged data. Store hashes in D1 and compare before calling `getBillDetails`. The guidelines explicitly warn that failure to use hashes for datasets will result in suspended access.
- **Work loop pattern:** Use `getMasterListRaw` (or `getSearchRaw`) to check for changes across a session, then only fetch individual bills whose `change_hash` differs from what we have stored. Do not call `getBillDetails` for every bill unconditionally.
- **Always check `status` field** in JSON responses for `"OK"` or `"ERROR"`.
- **CC BY 4.0 attribution required** — all data from LegiScan must include attribution per Creative Commons Attribution 4.0.
- **No scraping** legiscan.com — API only.
- **No multiple API keys** — one public key only.
- **Cache responses locally** to minimize query spend and enable replay.

## Testing

Tests use `@cloudflare/vitest-pool-workers` which runs tests inside the Workers runtime. Test helper `test/helpers/setup.ts` creates tables and seeds categories — call `setupTestDb()` in `beforeEach`. Tests access bindings via `import { env } from "cloudflare:test"`.
