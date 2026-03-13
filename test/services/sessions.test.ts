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
