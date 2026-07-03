import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { getProfile } from "@/lib/auth/profiles";
import { StorefrontClient } from "@/components/bill/StorefrontClient";

export default async function StorefrontPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const profile = getProfile(session.role);
  return (
    <StorefrontClient
      displayName={profile?.displayName ?? session.username}
      defaults={profile?.defaults ?? {}}
    />
  );
}
