import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import type { Bindings } from "../types";
import { getAllBillsWithCategories, getBillById } from "../services/bills";
import { getAllCategories } from "../services/categories";
import { getSession } from "../services/sessions";
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

  const token = getCookie(c, "session");
  const session = token ? await getSession(c.env.SESSIONS, token) : null;

  return c.html(billDetailPage(bill, { isAdmin: session?.role === "admin" }));
});

export { pub };
