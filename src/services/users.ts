import bcrypt from "bcryptjs";
import type { User } from "../types";

type SafeUser = Omit<User, "password_hash">;

export interface CreateUserInput {
  username: string;
  email?: string;
  password: string;
  role: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export async function verifyUser(
  db: D1Database,
  username: string,
  password: string
): Promise<SafeUser | null> {
  const user = await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first<User>();

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export async function getAllUsers(db: D1Database): Promise<SafeUser[]> {
  const result = await db
    .prepare("SELECT id, username, email, role, created_at FROM users ORDER BY username")
    .all<SafeUser>();
  return result.results;
}

export async function getUserById(db: D1Database, id: number): Promise<SafeUser | null> {
  return db
    .prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?")
    .bind(id)
    .first<SafeUser>();
}

export async function createUser(db: D1Database, input: CreateUserInput): Promise<SafeUser> {
  const hash = await bcrypt.hash(input.password, 10);
  const result = await db
    .prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)")
    .bind(input.username, input.email ?? null, hash, input.role)
    .run();

  const user = await db
    .prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first<SafeUser>();
  return user!;
}

export async function updateUser(db: D1Database, id: number, input: UpdateUserInput): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.username !== undefined) {
    fields.push("username = ?");
    values.push(input.username);
  }
  if (input.email !== undefined) {
    fields.push("email = ?");
    values.push(input.email || null);
  }
  if (input.role !== undefined) {
    fields.push("role = ?");
    values.push(input.role);
  }
  if (input.password !== undefined && input.password !== "") {
    const hash = await bcrypt.hash(input.password, 10);
    fields.push("password_hash = ?");
    values.push(hash);
  }

  if (fields.length === 0) return;

  values.push(id);
  await db
    .prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function deleteUser(db: D1Database, id: number): Promise<void> {
  await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
}

export async function changePassword(
  db: D1Database,
  id: number,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const user = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<User>();
  if (!user) return false;

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return false;

  const hash = await bcrypt.hash(newPassword, 10);
  await db
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .bind(hash, id)
    .run();
  return true;
}

export async function getAdminCount(db: D1Database): Promise<number> {
  const row = await db
    .prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'")
    .first<{ count: number }>();
  return row?.count ?? 0;
}
