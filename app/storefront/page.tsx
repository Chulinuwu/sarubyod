import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { listActiveStockOptions } from "@/lib/stock/repo";
import type { StockOption } from "@/lib/stock/types";
import { StorefrontClient } from "@/components/bill/StorefrontClient";

export default async function StorefrontPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const profile = getProfile(session.role);

  let stockOptions: StockOption[] = [];
  try {
    stockOptions = await listActiveStockOptions();
  } catch {
    stockOptions = [];
  }

  return (
    <StorefrontClient
      displayName={profile?.displayName ?? session.username}
      defaults={profile?.defaults ?? {}}
      stockOptions={stockOptions}
      isAdmin={session.role === "admin"}
    />
  );
}
