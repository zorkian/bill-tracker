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
