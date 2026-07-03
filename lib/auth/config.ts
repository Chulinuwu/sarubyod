export const ROLES = ["storefront", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const SESSION_COOKIE = "sarubyod_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

type Credential = { username: string; password: string; role: Role };

const ENV_KEYS: Record<Role, { user: string; pass: string }> = {
  storefront: { user: "STOREFRONT_USERNAME", pass: "STOREFRONT_PASSWORD" },
  admin: { user: "ADMIN_USERNAME", pass: "ADMIN_PASSWORD" },
};

export function findCredential(
  username: string,
  password: string,
): Credential | null {
  for (const role of ROLES) {
    const keys = ENV_KEYS[role];
    const u = process.env[keys.user];
    const p = process.env[keys.pass];
    if (u && p && username === u && password === p) {
      return { username: u, password: p, role };
    }
  }
  return null;
}
