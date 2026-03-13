import { Hono } from "hono";
import { csrf } from "hono/csrf";
import type { Bindings } from "./types";
import { auth } from "./routes/auth";
import { admin } from "./routes/admin";
import { pub } from "./routes/public";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", csrf());

app.route("/", auth);
app.route("/", admin);
app.route("/", pub);

export { app };

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    // Cron handler will be implemented in Task 14
  },
};
