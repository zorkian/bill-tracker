import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  verifyUser,
  getAdminCount,
} from "../../src/services/users";

describe("user CRUD service", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("creates a user and returns it without password_hash", async () => {
    const user = await createUser(env.DB, {
      username: "newuser",
      email: "new@example.com",
      password: "password123",
      role: "user",
    });
    expect(user.id).toBeDefined();
    expect(user.username).toBe("newuser");
    expect(user.email).toBe("new@example.com");
    expect(user.role).toBe("user");
    expect("password_hash" in user).toBe(false);
  });

  it("gets all users sorted by username", async () => {
    await createUser(env.DB, { username: "zeta", password: "password123", role: "user" });
    await createUser(env.DB, { username: "alpha", password: "password123", role: "admin" });
    const users = await getAllUsers(env.DB);
    expect(users.length).toBeGreaterThanOrEqual(2);
    expect(users[0].username.localeCompare(users[1].username)).toBeLessThan(0);
    expect("password_hash" in users[0]).toBe(false);
  });

  it("gets a user by id without password_hash", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "password123", role: "user" });
    const user = await getUserById(env.DB, created.id);
    expect(user).not.toBeNull();
    expect(user!.username).toBe("testuser");
    expect("password_hash" in user!).toBe(false);
  });

  it("returns null for nonexistent user id", async () => {
    const user = await getUserById(env.DB, 99999);
    expect(user).toBeNull();
  });

  it("updates user fields", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "password123", role: "user" });
    await updateUser(env.DB, created.id, { email: "updated@example.com", role: "admin" });
    const user = await getUserById(env.DB, created.id);
    expect(user!.email).toBe("updated@example.com");
    expect(user!.role).toBe("admin");
  });

  it("updates password when provided", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "oldpass12", role: "user" });
    await updateUser(env.DB, created.id, { password: "newpass12" });
    const verified = await verifyUser(env.DB, "testuser", "newpass12");
    expect(verified).not.toBeNull();
  });

  it("does not change password when not provided", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "password123", role: "user" });
    await updateUser(env.DB, created.id, { email: "new@example.com" });
    const verified = await verifyUser(env.DB, "testuser", "password123");
    expect(verified).not.toBeNull();
  });

  it("deletes a user", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "password123", role: "user" });
    await deleteUser(env.DB, created.id);
    const user = await getUserById(env.DB, created.id);
    expect(user).toBeNull();
  });

  it("enforces unique username", async () => {
    await createUser(env.DB, { username: "taken", password: "password123", role: "user" });
    await expect(
      createUser(env.DB, { username: "taken", password: "password123", role: "user" })
    ).rejects.toThrow();
  });

  it("changes password with valid current password", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "oldpass12", role: "user" });
    const result = await changePassword(env.DB, created.id, "oldpass12", "newpass12");
    expect(result).toBe(true);
    const verified = await verifyUser(env.DB, "testuser", "newpass12");
    expect(verified).not.toBeNull();
  });

  it("rejects password change with wrong current password", async () => {
    const created = await createUser(env.DB, { username: "testuser", password: "oldpass12", role: "user" });
    const result = await changePassword(env.DB, created.id, "wrongpass", "newpass12");
    expect(result).toBe(false);
    const verified = await verifyUser(env.DB, "testuser", "oldpass12");
    expect(verified).not.toBeNull();
  });

  it("counts admins correctly", async () => {
    await createUser(env.DB, { username: "admin1", password: "password123", role: "admin" });
    await createUser(env.DB, { username: "admin2", password: "password123", role: "admin" });
    const count = await getAdminCount(env.DB);
    expect(count).toBe(2);
  });
});
