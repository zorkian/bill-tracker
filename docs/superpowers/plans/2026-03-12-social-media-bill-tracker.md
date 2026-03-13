# Social Media Bill Tracker Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Cloudflare Workers-based website that tracks US state and federal social media legislation, with a public filterable view and an authenticated admin interface for data entry, integrated with the Legiscan API for automated status updates.

**Architecture:** Server-rendered HTML via Hono on Cloudflare Workers. D1 (SQLite) for persistent storage, KV for session tokens. Minimal client-side JS for filtering. Daily Cron Trigger for Legiscan status polling.

**Tech Stack:** TypeScript, Hono, Cloudflare Workers, D1, KV, Wrangler, Vitest

---

## File Structure

```
tracker/
├── src/
│   ├── index.ts                    # Hono app entry, route mounting, cron handler
│   ├── types.ts                    # Shared TypeScript types (Bindings, Bill, Category, User)
│   ├── constants.ts                # Shared constants (STATUS_COLORS, STATE_NAMES)
│   ├── routes/
│   │   ├── public.ts               # GET / and GET /bill/:id
│   │   ├── auth.ts                 # GET/POST /login, POST /logout
│   │   └── admin.ts                # All /admin/* CRUD routes + legiscan lookup
│   ├── middleware/
│   │   └── auth.ts                 # Session validation middleware for /admin/*
│   ├── services/
│   │   ├── bills.ts                # Bill CRUD operations (D1 queries)
│   │   ├── categories.ts           # Category queries (D1)
│   │   ├── users.ts                # User lookup + password verification
│   │   ├── sessions.ts             # Session create/get/delete (KV)
│   │   └── legiscan.ts             # Legiscan API client (search, getBill, status mapping)
│   ├── cron/
│   │   └── poll-statuses.ts        # Cron handler: poll Legiscan for status updates
│   ├── db/
│   │   ├── schema.sql              # CREATE TABLE statements
│   │   └── seed.sql                # Initial categories + admin user
│   └── templates/
│       ├── layout.ts               # Base HTML shell (head, header, footer)
│       ├── public/
│       │   ├── index.ts            # Public bill list page
│       │   └── bill-detail.ts      # Individual bill detail page
│       ├── admin/
│       │   ├── bill-list.ts        # Admin bill table
│       │   ├── bill-form.ts        # Add/edit bill form
│       │   └── bill-delete.ts      # Delete confirmation page
│       └── auth/
│           └── login.ts            # Login form
├── public/
│   └── static/
│       └── filter.js               # Client-side filtering/sorting
├── test/
│   ├── services/
│   │   ├── bills.test.ts           # Bill CRUD tests
│   │   ├── categories.test.ts      # Category query tests
│   │   ├── users.test.ts           # User/password tests
│   │   ├── sessions.test.ts        # Session KV tests
│   │   └── legiscan.test.ts        # Legiscan API client tests
│   ├── routes/
│   │   ├── public.test.ts          # Public route tests
│   │   ├── auth.test.ts            # Auth route tests
│   │   └── admin.test.ts           # Admin route tests
│   ├── cron/
│   │   └── poll-statuses.test.ts   # Cron handler tests
│   └── helpers/
│       └── setup.ts                # Test helpers (mock D1, mock KV, app factory)
├── wrangler.toml
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Chunk 1: Project Setup + Database + Core Services

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `wrangler.toml`
- Create: `vitest.config.ts`
- Create: `src/index.ts`
- Create: `src/types.ts`
- Create: `src/constants.ts`
- Create: `.gitignore`

- [ ] **Step 1: Initialize the project**

```bash
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install hono
npm install -D wrangler typescript vitest @cloudflare/vitest-pool-workers @cloudflare/workers-types
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "lib": ["ESNext"],
    "types": ["@cloudflare/workers-types/2023-07-01"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "test/**/*"]
}
```

- [ ] **Step 4: Write `wrangler.toml`**

```toml
name = "sm-bill-tracker"
main = "src/index.ts"
compatibility_date = "2024-12-01"

assets = { directory = "public" }

[[d1_databases]]
binding = "DB"
database_name = "sm-bill-tracker"
database_id = "local"

[[kv_namespaces]]
binding = "SESSIONS"
id = "local"

[triggers]
crons = ["0 6 * * *"]

```

Note: `database_id` and KV `id` will be replaced with real IDs after `wrangler d1 create` and `wrangler kv namespace create`. The `LEGISCAN_API_KEY` must be set via `wrangler secret put LEGISCAN_API_KEY` (never in `wrangler.toml` — it's a secret). For local dev, create a `.dev.vars` file with `LEGISCAN_API_KEY=your_key_here`.

- [ ] **Step 5: Write `vitest.config.ts`**

```typescript
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml" },
      },
    },
  },
});
```

- [ ] **Step 6: Write `src/types.ts`**

```typescript
export interface Bindings {
  DB: D1Database;
  SESSIONS: KVNamespace;
  LEGISCAN_API_KEY: string;
}

export interface Bill {
  id: number;
  state: string;
  bill_number: string;
  title: string | null;
  legiscan_bill_id: number | null;
  legiscan_url: string | null;
  status_simple: string;
  status_detail: string | null;
  date_introduced: string | null;
  last_action_date: string | null;
  last_action_description: string | null;
  session_end_date: string | null;
  social_media_definition: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillWithCategories extends Bill {
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export type StatusSimple =
  | "Introduced"
  | "Passed One Chamber"
  | "Passed Both Chambers"
  | "Signed Into Law"
  | "Vetoed"
  | "Failed";

// STATUS_COLORS lives in src/constants.ts (not here) to keep types.ts purely type definitions.
```

Create `src/constants.ts`:

```typescript
import type { StatusSimple } from "./types";

export const STATUS_COLORS: Record<StatusSimple, { bg: string; text: string; border: string }> = {
  "Introduced": { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  "Passed One Chamber": { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  "Passed Both Chambers": { bg: "#dbeafe", text: "#1d4ed8", border: "#2563eb" },
  "Signed Into Law": { bg: "#dcfce7", text: "#15803d", border: "#16a34a" },
  "Vetoed": { bg: "#fee2e2", text: "#dc2626", border: "#dc2626" },
  "Failed": { bg: "#fee2e2", text: "#dc2626", border: "#dc2626" },
};

export const STATE_NAMES: Record<string, string> = {
  US: "Federal", AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin",
  WY: "Wyoming",
};

export const STATES = ["US", ...Object.keys(STATE_NAMES).filter(s => s !== "US").sort()];

export const STATUSES = [
  "Introduced", "Passed One Chamber", "Passed Both Chambers",
  "Signed Into Law", "Vetoed", "Failed",
] as const;
```

- [ ] **Step 7: Write `src/index.ts` (minimal)**

```typescript
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", csrf());

app.get("/", (c) => c.text("Social Media Bill Tracker - coming soon"));

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    // Cron handler will be implemented in Task 14
  },
};
```

- [ ] **Step 8: Write `.gitignore`**

```
node_modules/
dist/
.wrangler/
.dev.vars
.superpowers/
```

- [ ] **Step 9: Verify the dev server starts**

Run: `npx wrangler dev --local`
Expected: Server starts on localhost, returns "coming soon" text.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json wrangler.toml vitest.config.ts src/index.ts src/types.ts src/constants.ts .gitignore
git commit -m "feat: project scaffolding with Hono, D1, KV, and Vitest config"
```

---

### Task 2: Database Schema and Seed Data

**Files:**
- Create: `src/db/schema.sql`
- Create: `src/db/seed.sql`

- [ ] **Step 1: Write `src/db/schema.sql`**

```sql
CREATE TABLE IF NOT EXISTS bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT NOT NULL,
  bill_number TEXT NOT NULL,
  title TEXT,
  legiscan_bill_id INTEGER,
  legiscan_url TEXT,
  status_simple TEXT NOT NULL DEFAULT 'Introduced',
  status_detail TEXT,
  date_introduced TEXT,
  last_action_date TEXT,
  last_action_description TEXT,
  session_end_date TEXT,
  social_media_definition TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(state, bill_number)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bill_categories (
  bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (bill_id, category_id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

- [ ] **Step 2: Write `src/db/seed.sql`**

```sql
INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES
  ('Age Verification (Gov''t ID)', 'age-verification', 1),
  ('Age Estimation (non-ID)', 'age-estimation', 2),
  ('Minimum Age Ban', 'minimum-age-ban', 3),
  ('Parental Consent for Account Creation', 'parental-consent', 4),
  ('Parental Access to Account/Activity', 'parental-access', 5),
  ('Parental Control over Settings', 'parental-control-settings', 6),
  ('Account Termination on Parental Request', 'parental-termination', 7),
  ('Default Restrictive Privacy for Minors', 'default-privacy', 8),
  ('Block Adult-Minor Contact', 'block-adult-minor-contact', 9),
  ('Notification Time Restrictions', 'notification-restrictions', 10),
  ('School-Hours Restrictions', 'school-hours-restrictions', 11),
  ('Restrict Algorithmic/Personalized Feeds', 'restrict-algorithmic-feeds', 12),
  ('Time Tracking / Usage Limits', 'time-tracking', 13),
  ('State-Mandated Warning Displays', 'mandated-warnings', 14),
  ('Prohibit "Dark Patterns"', 'prohibit-dark-patterns', 15),
  ('Prohibit "Addictive Design Features"', 'prohibit-addictive-design', 16),
  ('Restrict Targeted Advertising to Minors', 'restrict-targeted-ads', 17),
  ('Easy Account Deletion for Minors', 'easy-deletion', 18),
  ('Data Protection Impact Assessments', 'data-protection-assessments', 19),
  ('Mandatory Third-Party Audits', 'mandatory-audits', 20),
  ('Duty of Care Provisions', 'duty-of-care', 21),
  ('Content-Specific Restrictions', 'content-restrictions', 22),
  ('Disable Logged-Out Viewing', 'disable-logged-out', 23);

-- Default admin user. Password hash is for "changeme" - CHANGE THIS before deploying.
-- Generate a new hash: node -e "import('bcryptjs').then(b=>b.hash('yourpassword',10).then(h=>console.log(h)))"
INSERT OR IGNORE INTO users (username, password_hash) VALUES
  ('admin', '$2a$10$placeholder_hash_replace_before_deploy');
```

- [ ] **Step 3: Generate a real bcrypt hash for the admin password**

Run: `node -e "import('bcryptjs').then(b=>b.default.hash('changeme',10).then(h=>console.log(h)))"`

Copy the output hash and replace `$2a$10$placeholder_hash_replace_before_deploy` in `src/db/seed.sql` with it.

- [ ] **Step 4: Apply schema locally**

Run: `npx wrangler d1 execute sm-bill-tracker --local --file=src/db/schema.sql`
Expected: Schema created successfully.

- [ ] **Step 5: Apply seed data locally**

Run: `npx wrangler d1 execute sm-bill-tracker --local --file=src/db/seed.sql`
Expected: 23 categories and 1 user inserted.

- [ ] **Step 6: Commit**

```bash
git add src/db/schema.sql src/db/seed.sql
git commit -m "feat: database schema and seed data for categories and admin user"
```

---

### Task 3: Test Helpers

**Files:**
- Create: `test/helpers/setup.ts`

- [ ] **Step 1: Write test helpers**

`test/helpers/setup.ts`:

```typescript
import { env } from "cloudflare:test";

export async function setupTestDb() {
  const db = env.DB;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state TEXT NOT NULL,
      bill_number TEXT NOT NULL,
      title TEXT,
      legiscan_bill_id INTEGER,
      legiscan_url TEXT,
      status_simple TEXT NOT NULL DEFAULT 'Introduced',
      status_detail TEXT,
      date_introduced TEXT,
      last_action_date TEXT,
      last_action_description TEXT,
      session_end_date TEXT,
      social_media_definition TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(state, bill_number)
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bill_categories (
      bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      PRIMARY KEY (bill_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await db.exec(`
    INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES
      ('Age Verification', 'age-verification', 1),
      ('Parental Consent', 'parental-consent', 2),
      ('Minimum Age Ban', 'minimum-age-ban', 3);
  `);

  return db;
}
```

- [ ] **Step 2: Commit**

```bash
git add test/helpers/setup.ts
git commit -m "feat: test helpers with D1 setup for Vitest Workers pool"
```

---

### Task 4: Bills Service

**Files:**
- Create: `src/services/bills.ts`
- Create: `test/services/bills.test.ts`

- [ ] **Step 1: Write failing tests for bill CRUD**

`test/services/bills.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { createBill, getBillById, getAllBillsWithCategories, updateBill, deleteBill } from "../../src/services/bills";

describe("bills service", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("creates a bill and returns it with id", async () => {
    const bill = await createBill(env.DB, {
      state: "AZ",
      bill_number: "HB 2991",
      title: "Social media age verification",
      status_simple: "Introduced",
      category_ids: [1, 2],
    });
    expect(bill.id).toBeDefined();
    expect(bill.state).toBe("AZ");
    expect(bill.bill_number).toBe("HB 2991");
  });

  it("gets a bill by id with categories", async () => {
    const created = await createBill(env.DB, {
      state: "CA",
      bill_number: "AB 1709",
      title: "Minimum age for social media",
      status_simple: "Introduced",
      category_ids: [1, 3],
    });
    const bill = await getBillById(env.DB, created.id);
    expect(bill).not.toBeNull();
    expect(bill!.categories).toHaveLength(2);
    expect(bill!.categories.map((c) => c.slug)).toContain("age-verification");
    expect(bill!.categories.map((c) => c.slug)).toContain("minimum-age-ban");
  });

  it("gets all bills with categories", async () => {
    await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [1] });
    await createBill(env.DB, { state: "CA", bill_number: "AB 1709", status_simple: "Introduced", category_ids: [2] });
    const bills = await getAllBillsWithCategories(env.DB);
    expect(bills).toHaveLength(2);
    expect(bills[0].categories.length).toBeGreaterThanOrEqual(1);
  });

  it("updates a bill", async () => {
    const bill = await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] });
    await updateBill(env.DB, bill.id, { status_simple: "Passed One Chamber", notes: "Passed the House", category_ids: [1, 2] });
    const updated = await getBillById(env.DB, bill.id);
    expect(updated!.status_simple).toBe("Passed One Chamber");
    expect(updated!.notes).toBe("Passed the House");
    expect(updated!.categories).toHaveLength(2);
  });

  it("deletes a bill", async () => {
    const bill = await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] });
    await deleteBill(env.DB, bill.id);
    const deleted = await getBillById(env.DB, bill.id);
    expect(deleted).toBeNull();
  });

  it("enforces unique state+bill_number", async () => {
    await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] });
    await expect(
      createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] })
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/services/bills.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Implement `src/services/bills.ts`**

```typescript
import type { Bill, BillWithCategories, Category } from "../types";

export interface CreateBillInput {
  state: string;
  bill_number: string;
  title?: string;
  legiscan_bill_id?: number;
  legiscan_url?: string;
  status_simple: string;
  status_detail?: string;
  date_introduced?: string;
  last_action_date?: string;
  last_action_description?: string;
  session_end_date?: string;
  social_media_definition?: string;
  notes?: string;
  category_ids: number[];
}

export type UpdateBillInput = Partial<CreateBillInput>;

export async function createBill(db: D1Database, input: CreateBillInput): Promise<Bill> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO bills (state, bill_number, title, legiscan_bill_id, legiscan_url,
        status_simple, status_detail, date_introduced, last_action_date,
        last_action_description, session_end_date, social_media_definition, notes,
        created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.state, input.bill_number, input.title ?? null,
      input.legiscan_bill_id ?? null, input.legiscan_url ?? null,
      input.status_simple, input.status_detail ?? null,
      input.date_introduced ?? null, input.last_action_date ?? null,
      input.last_action_description ?? null, input.session_end_date ?? null,
      input.social_media_definition ?? null, input.notes ?? null,
      now, now
    )
    .run();

  const billId = result.meta.last_row_id;

  if (input.category_ids.length > 0) {
    const stmt = db.prepare("INSERT INTO bill_categories (bill_id, category_id) VALUES (?, ?)");
    await db.batch(input.category_ids.map((catId) => stmt.bind(billId, catId)));
  }

  const bill = await db.prepare("SELECT * FROM bills WHERE id = ?").bind(billId).first<Bill>();
  return bill!;
}

export async function getBillById(db: D1Database, id: number): Promise<BillWithCategories | null> {
  const bill = await db.prepare("SELECT * FROM bills WHERE id = ?").bind(id).first<Bill>();
  if (!bill) return null;

  const categories = await db
    .prepare(
      `SELECT c.* FROM categories c
       JOIN bill_categories bc ON bc.category_id = c.id
       WHERE bc.bill_id = ?
       ORDER BY c.sort_order`
    )
    .bind(id)
    .all<Category>();

  return { ...bill, categories: categories.results };
}

export async function getAllBillsWithCategories(db: D1Database): Promise<BillWithCategories[]> {
  const bills = await db
    .prepare("SELECT * FROM bills ORDER BY last_action_date DESC, updated_at DESC")
    .all<Bill>();

  const allBillCats = await db
    .prepare(
      `SELECT bc.bill_id, c.* FROM categories c
       JOIN bill_categories bc ON bc.category_id = c.id
       ORDER BY c.sort_order`
    )
    .all<Category & { bill_id: number }>();

  const catsByBill = new Map<number, Category[]>();
  for (const row of allBillCats.results) {
    const { bill_id, ...cat } = row;
    if (!catsByBill.has(bill_id)) catsByBill.set(bill_id, []);
    catsByBill.get(bill_id)!.push(cat);
  }

  return bills.results.map((bill) => ({
    ...bill,
    categories: catsByBill.get(bill.id) ?? [],
  }));
}

export async function updateBill(db: D1Database, id: number, input: UpdateBillInput): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  const settable: (keyof Omit<UpdateBillInput, "category_ids">)[] = [
    "state", "bill_number", "title", "legiscan_bill_id", "legiscan_url",
    "status_simple", "status_detail", "date_introduced", "last_action_date",
    "last_action_description", "session_end_date", "social_media_definition", "notes",
  ];

  for (const key of settable) {
    if (key in input) {
      fields.push(`${key} = ?`);
      values.push(input[key] ?? null);
    }
  }

  fields.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(id);

  await db.prepare(`UPDATE bills SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();

  if (input.category_ids !== undefined) {
    await db.prepare("DELETE FROM bill_categories WHERE bill_id = ?").bind(id).run();
    if (input.category_ids.length > 0) {
      const stmt = db.prepare("INSERT INTO bill_categories (bill_id, category_id) VALUES (?, ?)");
      await db.batch(input.category_ids.map((catId) => stmt.bind(id, catId)));
    }
  }
}

export async function deleteBill(db: D1Database, id: number): Promise<void> {
  await db.prepare("DELETE FROM bill_categories WHERE bill_id = ?").bind(id).run();
  await db.prepare("DELETE FROM bills WHERE id = ?").bind(id).run();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run test/services/bills.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/bills.ts test/services/bills.test.ts
git commit -m "feat: bill CRUD service with D1 queries and tests"
```

---

### Task 5: Categories Service

**Files:**
- Create: `src/services/categories.ts`
- Create: `test/services/categories.test.ts`

- [ ] **Step 1: Write failing tests**

`test/services/categories.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { getAllCategories } from "../../src/services/categories";

describe("categories service", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("returns all categories sorted by sort_order", async () => {
    const categories = await getAllCategories(env.DB);
    expect(categories.length).toBeGreaterThanOrEqual(3);
    expect(categories[0].sort_order).toBeLessThanOrEqual(categories[1].sort_order);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/services/categories.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/services/categories.ts`**

```typescript
import type { Category } from "../types";

export async function getAllCategories(db: D1Database): Promise<Category[]> {
  const result = await db.prepare("SELECT * FROM categories ORDER BY sort_order").all<Category>();
  return result.results;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/services/categories.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/categories.ts test/services/categories.test.ts
git commit -m "feat: categories service with tests"
```

---

### Task 6: Users and Sessions Services

**Files:**
- Create: `src/services/users.ts`
- Create: `src/services/sessions.ts`
- Create: `test/services/users.test.ts`
- Create: `test/services/sessions.test.ts`

- [ ] **Step 1: Install bcryptjs**

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Write failing tests for users service**

`test/services/users.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import bcrypt from "bcryptjs";
import { setupTestDb } from "../helpers/setup";
import { verifyUser } from "../../src/services/users";

describe("users service", () => {
  beforeEach(async () => {
    const db = await setupTestDb();
    const hash = await bcrypt.hash("testpassword", 10);
    await db.prepare("INSERT OR REPLACE INTO users (username, password_hash) VALUES (?, ?)").bind("testadmin", hash).run();
  });

  it("returns user on valid credentials", async () => {
    const user = await verifyUser(env.DB, "testadmin", "testpassword");
    expect(user).not.toBeNull();
    expect(user!.username).toBe("testadmin");
  });

  it("returns null on wrong password", async () => {
    const user = await verifyUser(env.DB, "testadmin", "wrongpassword");
    expect(user).toBeNull();
  });

  it("returns null on unknown username", async () => {
    const user = await verifyUser(env.DB, "nobody", "testpassword");
    expect(user).toBeNull();
  });
});
```

- [ ] **Step 3: Write failing tests for sessions service**

`test/services/sessions.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";
import { createSession, getSession, deleteSession } from "../../src/services/sessions";

describe("sessions service", () => {
  it("creates a session and retrieves it", async () => {
    const token = await createSession(env.SESSIONS, { user_id: 1, username: "admin" });
    expect(token).toBeTruthy();
    const session = await getSession(env.SESSIONS, token);
    expect(session).not.toBeNull();
    expect(session!.username).toBe("admin");
  });

  it("returns null for unknown token", async () => {
    const session = await getSession(env.SESSIONS, "nonexistent-token");
    expect(session).toBeNull();
  });

  it("deletes a session", async () => {
    const token = await createSession(env.SESSIONS, { user_id: 1, username: "admin" });
    await deleteSession(env.SESSIONS, token);
    const session = await getSession(env.SESSIONS, token);
    expect(session).toBeNull();
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npx vitest run test/services/users.test.ts test/services/sessions.test.ts`
Expected: FAIL

- [ ] **Step 5: Implement `src/services/users.ts`**

```typescript
import bcrypt from "bcryptjs";
import type { User } from "../types";

export async function verifyUser(
  db: D1Database,
  username: string,
  password: string
): Promise<Omit<User, "password_hash"> | null> {
  const user = await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first<User>();

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  const { password_hash, ...safeUser } = user;
  return safeUser;
}
```

- [ ] **Step 6: Implement `src/services/sessions.ts`**

```typescript
export interface SessionData {
  user_id: number;
  username: string;
}

export async function createSession(kv: KVNamespace, data: SessionData): Promise<string> {
  const token = crypto.randomUUID();
  await kv.put(token, JSON.stringify(data), { expirationTtl: 7 * 24 * 60 * 60 });
  return token;
}

export async function getSession(kv: KVNamespace, token: string): Promise<SessionData | null> {
  const data = await kv.get(token);
  if (!data) return null;
  return JSON.parse(data) as SessionData;
}

export async function deleteSession(kv: KVNamespace, token: string): Promise<void> {
  await kv.delete(token);
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run test/services/users.test.ts test/services/sessions.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 8: Commit**

```bash
git add src/services/users.ts src/services/sessions.ts test/services/users.test.ts test/services/sessions.test.ts
git commit -m "feat: user authentication and session management services with tests"
```

---

## Chunk 2: Auth Middleware + Routes (Auth, Admin, Public)

### Task 7: Auth Middleware

**Files:**
- Create: `src/middleware/auth.ts`

- [ ] **Step 1: Implement auth middleware**

```typescript
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type { Bindings } from "../types";
import { getSession, type SessionData } from "../services/sessions";

type Env = {
  Bindings: Bindings;
  Variables: { session: SessionData };
};

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const token = getCookie(c, "session");

  if (!token) {
    return c.redirect("/login");
  }

  const session = await getSession(c.env.SESSIONS, token);
  if (!session) {
    return c.redirect("/login");
  }

  c.set("session", session);
  await next();
});
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware/auth.ts
git commit -m "feat: auth middleware for admin route protection"
```

---

### Task 8: HTML Templates

**Files:**
- Create: `src/templates/layout.ts`
- Create: `src/templates/auth/login.ts`
- Create: `src/templates/public/index.ts`
- Create: `src/templates/public/bill-detail.ts`
- Create: `src/templates/admin/bill-list.ts`
- Create: `src/templates/admin/bill-form.ts`
- Create: `src/templates/admin/bill-delete.ts`

- [ ] **Step 1: Write base layout template**

`src/templates/layout.ts` - Base HTML shell with all CSS, header/footer. Takes `title`, `content` string, and `isAdmin` boolean. Contains all shared styles: card styles, filter bar, stats bar, form elements, admin table, responsive breakpoints.

- [ ] **Step 2: Write login template**

`src/templates/auth/login.ts` - Simple form with username/password fields, error message display. Uses `layout()`.

- [ ] **Step 3: Write public index template**

`src/templates/public/index.ts` - Renders filter bar (state/status/category dropdowns + search), stats bar, and all bill cards. Each card includes `data-*` attributes for client-side filtering. Cards show: state name + bill number, status badge, last action, category pills, definition box, notes callout, "last updated" footer, Legiscan link.

- [ ] **Step 4: Write bill detail template**

`src/templates/public/bill-detail.ts` - Full bill detail page with back link. Shows all bill fields in a clean layout.

- [ ] **Step 5: Write admin bill list template**

`src/templates/admin/bill-list.ts` - Table with State, Bill, Title, Status, Updated columns. "Add Bill" button. Uses `layout()` with `isAdmin=true`.

- [ ] **Step 6: Write admin bill form template**

`src/templates/admin/bill-form.ts` - Full add/edit form. Includes Legiscan Quick Add box (on add only) with inline JS for the lookup AJAX call. State dropdown (includes "Federal"/US), bill number, title, status, dates, Legiscan URL, hidden fields for Legiscan data, category checkbox grid, definition textarea, notes textarea, save/cancel/delete buttons.

- [ ] **Step 7: Write admin delete confirmation template**

`src/templates/admin/bill-delete.ts` - Warning box showing bill details, cancel + confirm delete buttons.

- [ ] **Step 8: Commit**

```bash
git add src/templates/
git commit -m "feat: HTML templates for layout, public pages, admin pages, and auth"
```

**Key architectural points for all templates:**
- All templates are pure functions returning HTML strings (no JSX)
- `layout(title, content, isAdmin?)` wraps content in full HTML document with all CSS inline
- Extract a shared `STATE_NAMES` map to `src/constants.ts` (used in public index, bill-detail, admin bill-list, admin bill-form, admin bill-delete)
- CSS in layout.ts includes: card styles (`.bill-card` with left border color by status), filter bar, stats bar, form elements, admin table, status badge colors, category pills, definition/notes callout boxes, responsive breakpoints at 768px
- The `data-search` attribute on bill cards should contain a lowercased concatenation of: state code, state name, bill number, title, notes, and social media definition — this powers the client-side text search
- Each template file should be ~50-150 lines. Layout.ts will be the largest (~200 lines including all CSS)
- Templates import `STATE_NAMES`, `STATES`, and `STATUSES` from `../constants` (or `../../constants` depending on depth)

---

### Task 9: Auth Routes

**Files:**
- Create: `src/routes/auth.ts`
- Create: `test/routes/auth.test.ts`

- [ ] **Step 1: Write failing tests**

`test/routes/auth.test.ts` - Tests:
- `GET /login` returns 200 with login form HTML
- `POST /login` with valid credentials sets session cookie and redirects to `/admin`
- `POST /login` with wrong password returns page with "Invalid username or password"

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/routes/auth.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/routes/auth.ts`**

```typescript
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import type { Bindings } from "../types";
import { verifyUser } from "../services/users";
import { createSession, deleteSession } from "../services/sessions";
import { loginPage } from "../templates/auth/login";

const auth = new Hono<{ Bindings: Bindings }>();

auth.get("/login", (c) => {
  return c.html(loginPage());
});

auth.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const username = body.username as string;
  const password = body.password as string;

  if (!username || !password) {
    return c.html(loginPage("Username and password are required."), 400);
  }

  const user = await verifyUser(c.env.DB, username, password);
  if (!user) {
    return c.html(loginPage("Invalid username or password."), 200);
  }

  const token = await createSession(c.env.SESSIONS, {
    user_id: user.id,
    username: user.username,
  });

  c.header("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
  return c.redirect("/admin");
});

auth.post("/logout", async (c) => {
  const token = getCookie(c, "session");
  if (token) {
    await deleteSession(c.env.SESSIONS, token);
  }
  c.header("Set-Cookie", "session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0");
  return c.redirect("/");
});

export { auth };
```

- [ ] **Step 4: Update `src/index.ts` to mount auth routes**

Mount auth routes on the app. Auth is mounted first so `/login` and `/logout` are always accessible.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/routes/auth.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/routes/auth.ts test/routes/auth.test.ts src/index.ts
git commit -m "feat: auth routes with login/logout and session management"
```

---

### Task 10: Public Routes + Client-Side Filtering

**Files:**
- Create: `src/routes/public.ts`
- Create: `public/static/filter.js`
- Create: `test/routes/public.test.ts`

- [ ] **Step 1: Write failing tests**

`test/routes/public.test.ts` - Tests:
- `GET /` returns 200 with bill tracker page containing bill data
- `GET /bill/:id` returns 200 with bill detail
- `GET /bill/999` returns 404

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/routes/public.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/routes/public.ts`**

```typescript
import { Hono } from "hono";
import type { Bindings } from "../types";
import { getAllBillsWithCategories, getBillById } from "../services/bills";
import { getAllCategories } from "../services/categories";
import { publicIndexPage } from "../templates/public/index";
import { billDetailPage } from "../templates/public/bill-detail";

const pub = new Hono<{ Bindings: Bindings }>();

pub.get("/", async (c) => {
  const [bills, categories] = await Promise.all([
    getAllBillsWithCategories(c.env.DB),
    getAllCategories(c.env.DB),
  ]);
  return c.html(publicIndexPage(bills, categories));
});

pub.get("/bill/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.notFound();
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();
  return c.html(billDetailPage(bill));
});

export { pub };
```

- [ ] **Step 4: Write `public/static/filter.js`**

Client-side filtering script. Reads `data-state`, `data-status`, `data-categories`, `data-search` attributes from `.bill-card` elements. Listens to change/input events on filter dropdowns and search input. Shows/hides cards and updates stat counters. Shows "No bills match" message when all cards are hidden.

```javascript
(function () {
  var stateFilter = document.getElementById("filter-state");
  var statusFilter = document.getElementById("filter-status");
  var categoryFilter = document.getElementById("filter-category");
  var searchFilter = document.getElementById("filter-search");
  var billList = document.getElementById("bill-list");
  var noResults = document.getElementById("no-results");

  if (!stateFilter || !billList) return;

  function applyFilters() {
    var state = stateFilter.value;
    var status = statusFilter.value;
    var category = categoryFilter.value;
    var search = searchFilter.value.toLowerCase();
    var cards = billList.querySelectorAll(".bill-card");
    var visible = 0, signed = 0, active = 0, failed = 0;

    cards.forEach(function (card) {
      var show = (!state || card.dataset.state === state)
        && (!status || card.dataset.status === status)
        && (!category || (card.dataset.categories || "").split(",").indexOf(category) !== -1)
        && (!search || (card.dataset.search || "").indexOf(search) !== -1);
      card.style.display = show ? "" : "none";
      if (show) {
        visible++;
        if (card.dataset.status === "Signed Into Law") signed++;
        else if (card.dataset.status === "Vetoed" || card.dataset.status === "Failed") failed++;
        else active++;
      }
    });

    noResults.style.display = visible === 0 ? "" : "none";
    var el;
    el = document.getElementById("stat-total"); if (el) el.textContent = visible;
    el = document.getElementById("stat-signed"); if (el) el.textContent = signed;
    el = document.getElementById("stat-active"); if (el) el.textContent = active;
    el = document.getElementById("stat-failed"); if (el) el.textContent = failed;
  }

  stateFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  searchFilter.addEventListener("input", applyFilters);
})();
```

- [ ] **Step 5: Update `src/index.ts` to mount public routes**

Mount public routes after auth routes. (Admin routes will be inserted before public in Task 11.)

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run test/routes/public.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/routes/public.ts public/static/filter.js test/routes/public.test.ts src/index.ts
git commit -m "feat: public bill listing and detail pages with client-side filtering"
```

---

### Task 11: Admin Routes

**Files:**
- Create: `src/routes/admin.ts`
- Create: `test/routes/admin.test.ts`

- [ ] **Step 1: Write failing tests**

`test/routes/admin.test.ts` - Tests:
- `GET /admin` redirects to `/login` without session
- `GET /admin` shows bill list when authenticated
- `GET /admin/bills/new` shows add form with categories
- `POST /admin/bills` creates a bill and redirects
- `POST /admin/bills/:id` updates a bill
- `GET /admin/bills/:id/delete` shows confirmation page
- `POST /admin/bills/:id/delete` deletes and redirects

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/routes/admin.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/routes/admin.ts`**

Admin route handler with:
- `requireAuth` middleware on all `/admin/*` routes
- `GET /admin` - bill list page
- `GET /admin/bills/new` - add form
- `POST /admin/bills` - create bill (parses form body, handles `category_ids` as array)
- `GET /admin/bills/:id/edit` - edit form
- `POST /admin/bills/:id` - update bill
- `GET /admin/bills/:id/delete` - delete confirmation
- `POST /admin/bills/:id/delete` - execute deletion
- `GET /admin/legiscan-lookup` - stub returning 501 (wired up in Task 13)

- [ ] **Step 4: Update `src/index.ts` to mount admin routes**

Mount admin before public. Final route order: auth, admin, public.

```typescript
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import type { Bindings } from "./types";
import { auth } from "./routes/auth";
import { pub } from "./routes/public";
import { admin } from "./routes/admin";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", csrf());
app.route("/", auth);
app.route("/", admin);
app.route("/", pub);

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    // Cron handler - Task 14
  },
};
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/routes/admin.test.ts`
Expected: All 7 tests PASS

- [ ] **Step 6: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/routes/admin.ts test/routes/admin.test.ts src/index.ts
git commit -m "feat: admin routes with CRUD, auth middleware, and Legiscan lookup stub"
```

---

## Chunk 3: Legiscan Integration + Cron + Final Wiring

### Task 12: Legiscan API Client

**Files:**
- Create: `src/services/legiscan.ts`
- Create: `test/services/legiscan.test.ts`

- [ ] **Step 1: Write failing tests**

`test/services/legiscan.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { searchBill, mapLegiscanStatus } from "../../src/services/legiscan";

describe("legiscan service", () => {
  it("maps legiscan status codes to simple statuses", () => {
    expect(mapLegiscanStatus(1)).toBe("Introduced");
    expect(mapLegiscanStatus(2)).toBe("Passed One Chamber");
    expect(mapLegiscanStatus(3)).toBe("Passed Both Chambers");
    expect(mapLegiscanStatus(4)).toBe("Passed Both Chambers");
    expect(mapLegiscanStatus(5)).toBe("Vetoed");
    expect(mapLegiscanStatus(6)).toBe("Failed");
    expect(mapLegiscanStatus(0)).toBeNull();
    expect(mapLegiscanStatus(99)).toBeNull();
  });

  it("searchBill parses Legiscan API response", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: "OK",
        searchresult: {
          summary: { count: 1 },
          "0": { bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test Bill" },
        },
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: "OK",
        bill: {
          bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test Bill",
          status: 1, status_desc: "Introduced",
          url: "https://legiscan.com/AZ/bill/HB2991/2026",
          history: [{ date: "2026-01-15", action: "Introduced", importance: 1 }],
          session: {},
        },
      })));
    vi.stubGlobal("fetch", mockFetch);

    const result = await searchBill("test-api-key", "AZ", "HB 2991");
    expect(result).not.toBeNull();
    expect(result!.legiscan_bill_id).toBe(12345);
    expect(result!.status_simple).toBe("Introduced");

    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/services/legiscan.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/services/legiscan.ts`**

```typescript
const LEGISCAN_BASE = "https://api.legiscan.com/";

export interface LegiscanBillResult {
  legiscan_bill_id: number;
  state: string;
  bill_number: string;
  title: string;
  status_simple: string;
  status_detail: string;
  date_introduced: string | null;
  last_action_date: string | null;
  last_action_description: string | null;
  legiscan_url: string | null;
  session_end_date: string | null;
}

const STATUS_MAP: Record<number, string> = {
  1: "Introduced",
  2: "Passed One Chamber",
  3: "Passed Both Chambers",
  4: "Passed Both Chambers",
  5: "Vetoed",
  6: "Failed",
};

export function mapLegiscanStatus(code: number): string | null {
  return STATUS_MAP[code] ?? null;
}

export async function searchBill(
  apiKey: string,
  state: string,
  billNumber: string
): Promise<LegiscanBillResult | null> {
  const normalizedBill = billNumber.replace(/\s+/g, "");

  const searchUrl = `${LEGISCAN_BASE}?key=${apiKey}&op=search&state=${state}&bill=${normalizedBill}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json() as Record<string, unknown>;

  if (searchData.status !== "OK") return null;

  const searchResult = searchData.searchresult as Record<string, unknown>;
  const summary = searchResult.summary as { count: number } | undefined;
  if (!summary || summary.count === 0) return null;

  const firstResult = searchResult["0"] as { bill_id: number } | undefined;
  if (!firstResult) return null;

  return await getBillDetails(apiKey, firstResult.bill_id);
}

export async function getBillDetails(
  apiKey: string,
  billId: number
): Promise<LegiscanBillResult | null> {
  const url = `${LEGISCAN_BASE}?key=${apiKey}&op=getBill&id=${billId}`;
  const res = await fetch(url);
  const data = await res.json() as Record<string, unknown>;

  if (data.status !== "OK") return null;

  const bill = data.bill as {
    bill_id: number;
    state: string;
    bill_number: string;
    title: string;
    status: number;
    status_desc: string;
    url?: string;
    history?: Array<{ date: string; action: string; importance: number; type_id?: number }>;
    session?: { session_title?: string; sine_die?: string; end_date?: string };
  };

  const signed = bill.history?.some((h) => h.type_id === 28);
  const statusSimple = signed ? "Signed Into Law" : (mapLegiscanStatus(bill.status) ?? "Introduced");

  const lastAction = bill.history?.length ? bill.history[bill.history.length - 1] : null;
  const introDate = bill.history?.length ? bill.history[0].date : null;

  // Legiscan session object may include sine_die (adjournment date) or end_date
  const sessionEndDate = bill.session?.sine_die ?? bill.session?.end_date ?? null;

  return {
    legiscan_bill_id: bill.bill_id,
    state: bill.state,
    bill_number: bill.bill_number,
    title: bill.title,
    status_simple: statusSimple,
    status_detail: bill.status_desc,
    date_introduced: introDate,
    last_action_date: lastAction?.date ?? null,
    last_action_description: lastAction?.action ?? null,
    legiscan_url: bill.url ?? null,
    session_end_date: sessionEndDate,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run test/services/legiscan.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/legiscan.ts test/services/legiscan.test.ts
git commit -m "feat: Legiscan API client with search, getBill, and status mapping"
```

---

### Task 13: Wire Legiscan Lookup into Admin Route

**Files:**
- Modify: `src/routes/admin.ts` (replace the legiscan-lookup stub)

- [ ] **Step 1: Add test for legiscan-lookup endpoint**

Add to `test/routes/admin.test.ts`:

```typescript
it("GET /admin/legiscan-lookup returns 400 without params", async () => {
  const cookie = await authCookie();
  const res = await app.request("/admin/legiscan-lookup", { headers: { Cookie: cookie } }, env);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.error).toBeDefined();
});
```

- [ ] **Step 2: Update the legiscan-lookup endpoint**

Replace the 501 stub with a real implementation that calls `searchBill` from the legiscan service, using `c.env.LEGISCAN_API_KEY`. Return errors as JSON `{ error: "message" }` with appropriate status codes (400 for missing params, 404 for not found, 500 for API key missing or lookup failure).

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/routes/admin.ts test/routes/admin.test.ts
git commit -m "feat: wire Legiscan lookup into admin route"
```

---

### Task 14: Cron Status Polling

**Files:**
- Create: `src/cron/poll-statuses.ts`
- Create: `test/cron/poll-statuses.test.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Write failing tests**

`test/cron/poll-statuses.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { createBill } from "../../src/services/bills";
import { pollStatuses } from "../../src/cron/poll-statuses";

describe("cron poll-statuses", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("updates active bills from Legiscan", async () => {
    await createBill(env.DB, {
      state: "AZ", bill_number: "HB 2991", status_simple: "Introduced",
      legiscan_bill_id: 12345, category_ids: [],
    });

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        status: "OK",
        bill: {
          bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test",
          status: 2, status_desc: "Engrossed",
          history: [
            { date: "2026-01-15", action: "Introduced", importance: 1 },
            { date: "2026-03-05", action: "Passed House", importance: 1 },
          ],
          session: {},
        },
      }))
    );
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    const bill = await env.DB.prepare("SELECT * FROM bills WHERE id = 1").first();
    expect(bill!.status_simple).toBe("Passed One Chamber");
    expect(bill!.last_action_description).toBe("Passed House");
    vi.unstubAllGlobals();
  });

  it("skips bills without legiscan_bill_id", async () => {
    await createBill(env.DB, { state: "CA", bill_number: "AB 1709", status_simple: "Introduced", category_ids: [] });
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    expect(mockFetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("skips terminal-status bills", async () => {
    await createBill(env.DB, {
      state: "IN", bill_number: "HB 1408", status_simple: "Signed Into Law",
      legiscan_bill_id: 99999, category_ids: [],
    });
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    expect(mockFetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/cron/poll-statuses.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/cron/poll-statuses.ts`**

```typescript
import { getBillDetails } from "../services/legiscan";
import type { Bill } from "../types";

const TERMINAL_STATUSES = ["Signed Into Law", "Vetoed", "Failed"];

export async function pollStatuses(db: D1Database, apiKey: string): Promise<void> {
  const bills = await db
    .prepare(
      `SELECT * FROM bills
       WHERE legiscan_bill_id IS NOT NULL
       AND status_simple NOT IN (${TERMINAL_STATUSES.map(() => "?").join(",")})`,
    )
    .bind(...TERMINAL_STATUSES)
    .all<Bill>();

  for (const bill of bills.results) {
    try {
      const result = await getBillDetails(apiKey, bill.legiscan_bill_id!);
      if (!result) {
        console.error(`Legiscan returned no data for bill ${bill.id} (legiscan_bill_id=${bill.legiscan_bill_id})`);
        continue;
      }

      await db
        .prepare(
          `UPDATE bills SET
            status_simple = ?,
            status_detail = ?,
            last_action_date = ?,
            last_action_description = ?,
            updated_at = ?
           WHERE id = ?`
        )
        .bind(
          result.status_simple,
          result.status_detail,
          result.last_action_date,
          result.last_action_description,
          new Date().toISOString(),
          bill.id
        )
        .run();
    } catch (e) {
      console.error(`Failed to poll status for bill ${bill.id}:`, e);
    }
  }
}
```

- [ ] **Step 4: Update `src/index.ts` to wire up the cron handler**

```typescript
import { pollStatuses } from "./cron/poll-statuses";

// In the export default:
async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
  ctx.waitUntil(pollStatuses(env.DB, env.LEGISCAN_API_KEY));
},
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run test/cron/poll-statuses.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 6: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/cron/poll-statuses.ts test/cron/poll-statuses.test.ts src/index.ts
git commit -m "feat: daily cron handler to poll Legiscan for bill status updates"
```

---

### Task 15: Final Wiring and Smoke Test

**Files:**
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Add npm scripts to `package.json`**

Add to `scripts`:
```json
{
  "dev": "wrangler dev --local",
  "test": "vitest run",
  "deploy": "wrangler deploy",
  "db:schema": "wrangler d1 execute sm-bill-tracker --local --file=src/db/schema.sql",
  "db:seed": "wrangler d1 execute sm-bill-tracker --local --file=src/db/seed.sql"
}
```

- [ ] **Step 2: Run all tests**

Run: `npm test`
Expected: All tests PASS

- [ ] **Step 3: Initialize local DB and run dev server**

Run: `npm run db:schema && npm run db:seed && npm run dev`
Then:
1. Visit `http://localhost:8787` - should see empty bill tracker page with filters
2. Visit `http://localhost:8787/login` - should see login form
3. Verify filter dropdowns are present and responsive layout works

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add npm scripts for dev, test, deploy, and database management"
```

- [ ] **Step 5: Run final full test suite**

Run: `npm test`
Expected: All tests PASS - project is ready for deployment
