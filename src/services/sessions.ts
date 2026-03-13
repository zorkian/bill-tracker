export interface SessionData {
  user_id: number;
  username: string;
  role: string;
}

export async function createSession(kv: KVNamespace, data: SessionData): Promise<string> {
  const token = crypto.randomUUID();
  await kv.put(token, JSON.stringify(data), { expirationTtl: 7 * 24 * 60 * 60 });
  return token;
}

export async function getSession(kv: KVNamespace, token: string): Promise<SessionData | null> {
  const data = await kv.get(token);
  if (!data) return null;
  return JSON.parse(data) as SessionData;
}

export async function deleteSession(kv: KVNamespace, token: string): Promise<void> {
  await kv.delete(token);
}
