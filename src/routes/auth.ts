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
