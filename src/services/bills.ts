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
