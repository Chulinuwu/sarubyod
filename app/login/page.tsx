import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/current";
import { LoginAside } from "@/components/auth/LoginAside";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/storefront");
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] md:grid-cols-[0.85fr_1fr] md:grid-rows-1">
      <LoginAside />
      <LoginForm />
    </div>
  );
}
