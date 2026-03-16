import { Hono } from "hono";
import type { Bindings } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/auth";
import {
  createBill,
  getBillById,
  getAllBillsWithCategories,
  updateBill,
  deleteBill,
} from "../services/bills";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../services/categories";
import { adminBillListPage } from "../templates/admin/bill-list";
import { adminBillFormPage } from "../templates/admin/bill-form";
import { adminBillDeletePage } from "../templates/admin/bill-delete";
import { searchBill, getBillDetails, parseLegiscanUrl } from "../services/legiscan";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getAdminCount,
} from "../services/users";
import { adminUserListPage } from "../templates/admin/user-list";
import { adminUserFormPage } from "../templates/admin/user-form";
import { adminPasswordFormPage } from "../templates/admin/password-form";
import { adminCategoryListPage } from "../templates/admin/category-list";
import { syncBillFromLegiscan, getSyncLogForBill, logSync } from "../services/sync";
import { fetchBillText } from "../services/bill-text";
import { analyzeBillText } from "../services/analyze";

const admin = new Hono<{ Bindings: Bindings }>();

admin.use("/admin/*", requireAuth);
admin.use("/admin", requireAuth);
admin.use("/admin/users/*", requireAdmin);
admin.use("/admin/users", requireAdmin);

admin.get("/admin", async (c) => {
  const bills = await getAllBillsWithCategories(c.env.DB);
  const session = c.get("session");
  return c.html(adminBillListPage(bills, session.role));
});

admin.get("/admin/bills/new", async (c) => {
  const categories = await getAllCategories(c.env.DB);
  const session = c.get("session");
  return c.html(adminBillFormPage({ categories, role: session.role }));
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
  let legiscanBillId = legiscanBillIdRaw ? Number(legiscanBillIdRaw) : undefined;
  if (legiscanBillId && isNaN(legiscanBillId)) legiscanBillId = undefined;
  const legiscanUrl = (body.legiscan_url as string) || undefined;

  // If a LegiScan URL is provided but no bill ID, resolve it and load all data
  let lsData: import("../services/legiscan").LegiscanBillResult | null = null;
  if (legiscanUrl && !legiscanBillId && c.env.LEGISCAN_API_KEY) {
    const parsed = parseLegiscanUrl(legiscanUrl);
    if (!parsed) {
      const categories = await getAllCategories(c.env.DB);
      const session = c.get("session");
      return c.html(adminBillFormPage({ categories, role: session.role, error: "Could not parse LegiScan URL. Expected format: https://legiscan.com/STATE/bill/BILLNUMBER/YEAR" }));
    }
    lsData = await searchBill(c.env.LEGISCAN_API_KEY, parsed.state, parsed.billNumber, parsed.year);
    if (!lsData) {
      const categories = await getAllCategories(c.env.DB);
      const session = c.get("session");
      return c.html(adminBillFormPage({ categories, role: session.role, error: "Could not find this bill on LegiScan. Check the URL and try again." }));
    }
    legiscanBillId = lsData.legiscan_bill_id;
  } else if (legiscanBillId && c.env.LEGISCAN_API_KEY) {
    try {
      lsData = await getBillDetails(c.env.LEGISCAN_API_KEY, legiscanBillId);
    } catch { /* non-critical */ }
  }

  // Admin form values take priority; LegiScan fills in blanks
  await createBill(c.env.DB, {
    state: body.state as string,
    bill_number: body.bill_number as string,
    title: lsData?.title ?? ((body.title as string) || undefined),
    legiscan_bill_id: legiscanBillId,
    legiscan_url: legiscanUrl,
    status_simple: lsData?.status_simple ?? (body.status_simple as string),
    status_detail: lsData?.status_detail ?? ((body.status_detail as string) || undefined),
    date_introduced: lsData?.date_introduced ?? ((body.date_introduced as string) || undefined),
    last_action_date: lsData?.last_action_date ?? ((body.last_action_date as string) || undefined),
    last_action_description: lsData?.last_action_description ?? ((body.last_action_description as string) || undefined),
    session_end_date: lsData?.session_end_date ?? ((body.session_end_date as string) || undefined),
    social_media_definition: (body.social_media_definition as string) || undefined,
    notes: (body.notes as string) || undefined,
    change_hash: lsData?.change_hash ?? null,
    legiscan_session_id: lsData?.session_id ?? null,
    urgent: body.urgent ? 1 : 0,
    enforcement_status: (body.enforcement_status as string) || undefined,
    lawsuit_citation: (body.lawsuit_citation as string) || undefined,
    recap_docket_url: (body.recap_docket_url as string) || undefined,
    category_ids: categoryIds,
  });

  return c.redirect("/admin");
});

admin.get("/admin/bills/:id/edit", async (c) => {
  const id = Number(c.req.param("id"));
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();
  const [categories, syncLog] = await Promise.all([
    getAllCategories(c.env.DB),
    getSyncLogForBill(c.env.DB, id),
  ]);
  const session = c.get("session");
  const syncMessage = c.req.query("sync");
  return c.html(adminBillFormPage({ bill, categories, role: session.role, syncLog, syncMessage }));
});

admin.post("/admin/bills/:id/sync", async (c) => {
  const id = Number(c.req.param("id"));
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();

  const apiKey = c.env.LEGISCAN_API_KEY;
  if (!apiKey) {
    return c.redirect(`/admin/bills/${id}/edit?sync=no_api_key`);
  }

  const body = await c.req.parseBody();
  const force = body.force === "1";
  const result = await syncBillFromLegiscan(c.env.DB, apiKey, bill, "admin", { force });
  return c.redirect(`/admin/bills/${id}/edit?sync=${result.outcome}`);
});

admin.post("/admin/bills/:id/analyze", async (c) => {
  const id = Number(c.req.param("id"));
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();

  const [categories, syncLog] = await Promise.all([
    getAllCategories(c.env.DB),
    getSyncLogForBill(c.env.DB, id),
  ]);
  const session = c.get("session");

  if (!bill.legiscan_bill_id) {
    return c.html(adminBillFormPage({ bill, categories, role: session.role, syncLog, error: "Bill must be linked to LegiScan before analyzing." }));
  }

  if (!c.env.LEGISCAN_API_KEY || !c.env.ANTHROPIC_API_KEY) {
    return c.html(adminBillFormPage({ bill, categories, role: session.role, syncLog, error: "LegiScan and Anthropic API keys must be configured." }));
  }

  try {
    const textResult = await fetchBillText(c.env.BILL_TEXTS, c.env.LEGISCAN_API_KEY, bill.legiscan_bill_id);
    if (!textResult) {
      return c.html(adminBillFormPage({ bill, categories, role: session.role, syncLog, error: "Could not fetch bill text from LegiScan. No text versions available." }));
    }

    const analysis = await analyzeBillText(
      c.env.ANTHROPIC_API_KEY,
      textResult.text,
      categories,
      bill.title ?? bill.bill_number,
      bill.state
    );

    const sourceNote = textResult.source === "r2" ? "cached" : "fetched from LegiScan";
    return c.html(adminBillFormPage({
      bill,
      categories,
      role: session.role,
      syncLog,
      analysis,
      analysisMessage: `Bill text analyzed (${textResult.type} version, ${sourceNote}).`,
    }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return c.html(adminBillFormPage({ bill, categories, role: session.role, syncLog, error: `Analysis failed: ${msg}` }));
  }
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

  const existingBill = await getBillById(c.env.DB, id);
  const legiscanUrl = (body.legiscan_url as string) || undefined;
  const legiscanBillIdRaw = body.legiscan_bill_id as string;
  let legiscanBillId = legiscanBillIdRaw ? Number(legiscanBillIdRaw) : existingBill?.legiscan_bill_id ?? undefined;
  if (legiscanBillId && isNaN(legiscanBillId)) legiscanBillId = undefined;

  // If LegiScan URL changed or is newly set, resolve it and load all data
  let lsData: import("../services/legiscan").LegiscanBillResult | null = null;
  const urlChanged = legiscanUrl && legiscanUrl !== existingBill?.legiscan_url;
  const needsResolve = legiscanUrl && (!existingBill?.legiscan_bill_id || urlChanged);

  if (needsResolve && c.env.LEGISCAN_API_KEY) {
    const parsed = parseLegiscanUrl(legiscanUrl);
    if (!parsed) {
      const [categories, syncLog] = await Promise.all([
        getAllCategories(c.env.DB),
        getSyncLogForBill(c.env.DB, id),
      ]);
      const session = c.get("session");
      return c.html(adminBillFormPage({ bill: existingBill!, categories, role: session.role, syncLog, error: "Could not parse LegiScan URL. Expected format: https://legiscan.com/STATE/bill/BILLNUMBER/YEAR" }));
    }
    lsData = await searchBill(c.env.LEGISCAN_API_KEY, parsed.state, parsed.billNumber, parsed.year);
    if (!lsData) {
      const [categories, syncLog] = await Promise.all([
        getAllCategories(c.env.DB),
        getSyncLogForBill(c.env.DB, id),
      ]);
      const session = c.get("session");
      return c.html(adminBillFormPage({ bill: existingBill!, categories, role: session.role, syncLog, error: "Could not find this bill on LegiScan. Check the URL and try again." }));
    }
    legiscanBillId = lsData.legiscan_bill_id;
  }

  // When re-linking (lsData set), LegiScan data replaces all LegiScan-managed fields.
  // For normal edits, use form values.
  await updateBill(c.env.DB, id, {
    state: lsData?.state ?? (body.state as string),
    bill_number: lsData?.bill_number ?? (body.bill_number as string),
    title: lsData?.title ?? ((body.title as string) || undefined),
    legiscan_bill_id: legiscanBillId,
    legiscan_url: legiscanUrl,
    status_simple: lsData?.status_simple ?? (body.status_simple as string),
    status_detail: lsData?.status_detail ?? ((body.status_detail as string) || undefined),
    date_introduced: lsData?.date_introduced ?? ((body.date_introduced as string) || undefined),
    last_action_date: lsData?.last_action_date ?? ((body.last_action_date as string) || undefined),
    last_action_description: lsData?.last_action_description ?? ((body.last_action_description as string) || undefined),
    session_end_date: lsData?.session_end_date ?? ((body.session_end_date as string) || undefined),
    social_media_definition: (body.social_media_definition as string) || undefined,
    notes: (body.notes as string) || undefined,
    ...(lsData ? { change_hash: lsData.change_hash ?? null } : {}),
    ...(lsData ? { legiscan_session_id: lsData.session_id ?? null } : {}),
    urgent: body.urgent ? 1 : 0,
    enforcement_status: (body.enforcement_status as string) || undefined,
    lawsuit_citation: (body.lawsuit_citation as string) || undefined,
    recap_docket_url: (body.recap_docket_url as string) || undefined,
    category_ids: categoryIds,
  });

  if (lsData) {
    await logSync(c.env.DB, id, "admin-relink", "updated", existingBill?.change_hash ?? null, lsData.change_hash ?? null,
      JSON.stringify({ legiscan_bill_id: { old: existingBill?.legiscan_bill_id, new: lsData.legiscan_bill_id } }), null);
  }

  return c.redirect(`/admin/bills/${id}/edit`);
});

admin.get("/admin/bills/:id/delete", async (c) => {
  const id = Number(c.req.param("id"));
  const bill = await getBillById(c.env.DB, id);
  if (!bill) return c.notFound();
  const session = c.get("session");
  return c.html(adminBillDeletePage(bill, session.role));
});

admin.post("/admin/bills/:id/delete", async (c) => {
  const id = Number(c.req.param("id"));
  await deleteBill(c.env.DB, id);
  return c.redirect("/admin");
});

// User management (admin only)
admin.get("/admin/users", async (c) => {
  const users = await getAllUsers(c.env.DB);
  const session = c.get("session");
  return c.html(adminUserListPage(users, session.user_id, session.role));
});

admin.get("/admin/users/new", async (c) => {
  const session = c.get("session");
  return c.html(adminUserFormPage({ role: session.role }));
});

admin.post("/admin/users", async (c) => {
  const session = c.get("session");
  const body = await c.req.parseBody();
  const username = (body.username as string || "").trim();
  const email = (body.email as string || "").trim();
  const password = body.password as string || "";
  const userRole = body.role as string || "user";

  if (!username || !password) {
    return c.html(adminUserFormPage({ error: "Username and password are required.", role: session.role }));
  }
  if (password.length < 8) {
    return c.html(adminUserFormPage({ error: "Password must be at least 8 characters.", role: session.role }));
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return c.html(adminUserFormPage({ error: "Username must contain only letters, numbers, and underscores.", role: session.role }));
  }

  try {
    await createUser(c.env.DB, { username, email: email || undefined, password, role: userRole });
  } catch (e) {
    return c.html(adminUserFormPage({ error: "Username already taken.", role: session.role }));
  }
  return c.redirect("/admin/users");
});

admin.get("/admin/users/:id/edit", async (c) => {
  const id = Number(c.req.param("id"));
  const user = await getUserById(c.env.DB, id);
  if (!user) return c.notFound();
  const session = c.get("session");
  return c.html(adminUserFormPage({ user, role: session.role }));
});

admin.post("/admin/users/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const session = c.get("session");
  const body = await c.req.parseBody();
  const username = (body.username as string || "").trim();
  const email = (body.email as string || "").trim();
  const password = body.password as string || "";
  const userRole = body.role as string || "user";

  const existingUser = await getUserById(c.env.DB, id);
  if (!existingUser) return c.notFound();

  if (password && password.length < 8) {
    return c.html(adminUserFormPage({ user: existingUser, error: "Password must be at least 8 characters.", role: session.role }));
  }
  if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
    return c.html(adminUserFormPage({ user: existingUser, error: "Username must contain only letters, numbers, and underscores.", role: session.role }));
  }

  // Prevent demoting the last admin
  if (existingUser.role === "admin" && userRole !== "admin") {
    const adminCount = await getAdminCount(c.env.DB);
    if (adminCount <= 1) {
      return c.html(adminUserFormPage({ user: existingUser, error: "Cannot demote the last admin.", role: session.role }));
    }
  }

  try {
    await updateUser(c.env.DB, id, {
      username: username || undefined,
      email,
      password: password || undefined,
      role: userRole,
    });
  } catch (e) {
    return c.html(adminUserFormPage({ user: existingUser, error: "Username already taken.", role: session.role }));
  }
  return c.redirect("/admin/users");
});

admin.post("/admin/users/:id/delete", async (c) => {
  const id = Number(c.req.param("id"));
  const session = c.get("session");

  // Block self-deletion
  if (session.user_id === id) {
    return c.redirect("/admin/users");
  }

  // Prevent deleting the last admin
  const user = await getUserById(c.env.DB, id);
  if (user?.role === "admin") {
    const adminCount = await getAdminCount(c.env.DB);
    if (adminCount <= 1) {
      return c.redirect("/admin/users");
    }
  }

  await deleteUser(c.env.DB, id);
  return c.redirect("/admin/users");
});

// Password change (any authenticated user)
admin.get("/admin/password", async (c) => {
  const session = c.get("session");
  return c.html(adminPasswordFormPage({ role: session.role }));
});

admin.post("/admin/password", async (c) => {
  const session = c.get("session");
  const body = await c.req.parseBody();
  const currentPassword = body.current_password as string || "";
  const newPassword = body.new_password as string || "";
  const confirmPassword = body.confirm_password as string || "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return c.html(adminPasswordFormPage({ error: "All fields are required.", role: session.role }));
  }
  if (newPassword.length < 8) {
    return c.html(adminPasswordFormPage({ error: "New password must be at least 8 characters.", role: session.role }));
  }
  if (newPassword !== confirmPassword) {
    return c.html(adminPasswordFormPage({ error: "New passwords do not match.", role: session.role }));
  }

  const changed = await changePassword(c.env.DB, session.user_id, currentPassword, newPassword);
  if (!changed) {
    return c.html(adminPasswordFormPage({ error: "Current password is incorrect.", role: session.role }));
  }

  return c.html(adminPasswordFormPage({ success: "Password changed successfully.", role: session.role }));
});

// Category management (admin only)
admin.use("/admin/categories/*", requireAdmin);
admin.use("/admin/categories", requireAdmin);

admin.get("/admin/categories", async (c) => {
  const categories = await getAllCategories(c.env.DB);
  const session = c.get("session");
  return c.html(adminCategoryListPage(categories, { role: session.role }));
});

admin.post("/admin/categories", async (c) => {
  const session = c.get("session");
  const body = await c.req.parseBody();
  const name = (body.name as string || "").trim();

  if (!name) {
    const categories = await getAllCategories(c.env.DB);
    return c.html(adminCategoryListPage(categories, { error: "Name is required.", role: session.role }));
  }

  try {
    await createCategory(c.env.DB, name);
  } catch {
    const categories = await getAllCategories(c.env.DB);
    return c.html(adminCategoryListPage(categories, { error: "A category with that name already exists.", role: session.role }));
  }
  return c.redirect("/admin/categories");
});

admin.post("/admin/categories/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.parseBody();
  const name = (body.name as string || "").trim();

  if (name) {
    try {
      await updateCategory(c.env.DB, id, name);
    } catch { /* name conflict — ignore */ }
  }
  return c.redirect("/admin/categories");
});

admin.post("/admin/categories/:id/delete", async (c) => {
  const id = Number(c.req.param("id"));
  await deleteCategory(c.env.DB, id);
  return c.redirect("/admin/categories");
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
