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
