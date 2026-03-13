import { Hono } from "hono";
import type { Bindings } from "../types";
import { requireAuth } from "../middleware/auth";
import {
  createBill,
  getBillById,
  getAllBillsWithCategories,
  updateBill,
  deleteBill,
} from "../services/bills";
import { getAllCategories } from "../services/categories";
import { adminBillListPage } from "../templates/admin/bill-list";
import { adminBillFormPage } from "../templates/admin/bill-form";
import { adminBillDeletePage } from "../templates/admin/bill-delete";
import { searchBill } from "../services/legiscan";

const admin = new Hono<{ Bindings: Bindings }>();

admin.use("/admin/*", requireAuth);
admin.use("/admin", requireAuth);

admin.get("/admin", async (c) => {
  const bills = await getAllBillsWithCategories(c.env.DB);
  return c.html(adminBillListPage(bills));
});

admin.get("/admin/bills/new", async (c) => {
  const categories = await getAllCategories(c.env.DB);
  return c.html(adminBillFormPage({ categories }));
});

admin.post("/admin/bills", async (c) => {
  const body = await c.req.parseBody({ all: true });

  const categoryIds = (
    Array.isArray(body.category_ids)
      ? body.category_ids
      : body.category_ids
      ? [body.category_ids]
      : []
  )
    .map(Number)
    .filter((n) => !isNaN(n));

  const legiscanBillIdRaw = body.legiscan_bill_id as string;
  const legiscanBillId = legiscanBillIdRaw ? Number(legiscanBillIdRaw) : undefined;

  await createBill(c.env.DB, {
    state: body.state as string,
    bill_number: body.bill_number as string,
    title: (body.title as string) || undefined,
    legiscan_bill_id: legiscanBillId && !isNaN(legiscanBillId) ? legiscanBillId : undefined,
    legiscan_url: (body.legiscan_url as string) || undefined,
    status_simple: body.status_simple as string,
    status_detail: (body.status_detail as string) || undefined,
    date_introduced: (body.date_introduced as string) || undefined,
    last_action_date: (body.last_action_date as string) || undefined,
    last_action_description: (body.last_action_description as string) || undefined,
    session_end_date: (body.session_end_date as string) || undefined,
    social_media_definition: (body.social_media_definition as string) || undefined,
    notes: (body.notes as string) || undefined,
    category_ids: categoryIds,
  });

  return c.redirect("/admin");
});

admin.get("/admin/bills/:id/edit", async (c) => {
  const id = Number(c.req.param("id"));
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();

  const categories = await getAllCategories(c.env.DB);
  return c.html(adminBillFormPage({ bill, categories }));
});

admin.post("/admin/bills/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.parseBody({ all: true });

  const categoryIds = (
    Array.isArray(body.category_ids)
      ? body.category_ids
      : body.category_ids
      ? [body.category_ids]
      : []
  )
    .map(Number)
    .filter((n) => !isNaN(n));

  const legiscanBillIdRaw = body.legiscan_bill_id as string;
  const legiscanBillId = legiscanBillIdRaw ? Number(legiscanBillIdRaw) : undefined;

  await updateBill(c.env.DB, id, {
    state: body.state as string,
    bill_number: body.bill_number as string,
    title: (body.title as string) || undefined,
    legiscan_bill_id: legiscanBillId && !isNaN(legiscanBillId) ? legiscanBillId : undefined,
    legiscan_url: (body.legiscan_url as string) || undefined,
    status_simple: body.status_simple as string,
    status_detail: (body.status_detail as string) || undefined,
    date_introduced: (body.date_introduced as string) || undefined,
    last_action_date: (body.last_action_date as string) || undefined,
    last_action_description: (body.last_action_description as string) || undefined,
    session_end_date: (body.session_end_date as string) || undefined,
    social_media_definition: (body.social_media_definition as string) || undefined,
    notes: (body.notes as string) || undefined,
    category_ids: categoryIds,
  });

  return c.redirect("/admin");
});

admin.get("/admin/bills/:id/delete", async (c) => {
  const id = Number(c.req.param("id"));
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();

  return c.html(adminBillDeletePage(bill));
});

admin.post("/admin/bills/:id/delete", async (c) => {
  const id = Number(c.req.param("id"));
  await deleteBill(c.env.DB, id);
  return c.redirect("/admin");
});

admin.get("/admin/legiscan-lookup", async (c) => {
  const state = c.req.query("state");
  const billNumber = c.req.query("bill_number");

  if (!state || !billNumber) {
    return c.json({ error: "state and bill_number are required" }, 400);
  }

  const apiKey = c.env.LEGISCAN_API_KEY;
  if (!apiKey) {
    return c.json({ error: "Legiscan API key not configured" }, 500);
  }

  try {
    const result = await searchBill(apiKey, state, billNumber);
    if (!result) {
      return c.json({ error: "Bill not found" }, 404);
    }
    return c.json(result);
  } catch (e) {
    console.error("Legiscan lookup failed:", e);
    return c.json({ error: "Lookup failed" }, 500);
  }
});

export { admin };
