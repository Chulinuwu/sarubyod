import type { Role } from "./config";

export type Profile = {
  displayName: string;
  defaults: { shopName: string; consignor: string; receiver: string };
};

const PROFILES: Partial<Record<Role, Profile>> = {
  storefront: {
    displayName: "ปทิตตา",
    defaults: {
      shopName: "puffymellow",
      consignor: "twentytoys",
      receiver: "punch",
    },
  },
};

export function getProfile(role: Role): Profile | null {
  return PROFILES[role] ?? null;
}
