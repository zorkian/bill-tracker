import bcrypt from "bcryptjs";
import type { User } from "../types";

export async function verifyUser(
  db: D1Database,
  username: string,
  password: string
): Promise<Omit<User, "password_hash"> | null> {
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
