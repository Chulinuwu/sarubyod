import { getSession } from "./current";
import type { SessionPayload } from "./session";

export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getSession();
  return session && session.role === "admin" ? session : null;
}
