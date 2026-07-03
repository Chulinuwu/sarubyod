import { cookies } from "next/headers";
import { z } from "zod";
import { findCredential, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/config";
import { createSessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const cred = findCredential(parsed.data.username, parsed.data.password);
  if (!cred) {
    return Response.json({ error: "credentials" }, { status: 401 });
  }

  const token = await createSessionToken({
    role: cred.role,
    username: cred.username,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return Response.json({ role: cred.role });
}
