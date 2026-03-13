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

export const requireAdmin = createMiddleware<Env>(async (c, next) => {
  const session = c.get("session");
  if (session.role !== "admin") {
    return c.text("Forbidden", 403);
  }
  await next();
});
