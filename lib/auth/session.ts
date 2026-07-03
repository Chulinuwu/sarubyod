import { SignJWT, jwtVerify } from "jose";
import { ROLES, SESSION_MAX_AGE, type Role } from "./config";

const secretKey = (): Uint8Array => {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
};

export type SessionPayload = { role: Role; username: string };

export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ role: payload.role, username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const role = payload.role;
    const username = payload.username;
    if (
      typeof role !== "string" ||
      !ROLES.includes(role as Role) ||
      typeof username !== "string"
    ) {
      return null;
    }
    return { role: role as Role, username };
  } catch {
    return null;
  }
}
