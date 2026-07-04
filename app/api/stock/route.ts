import { getSession } from "@/lib/auth/current";
import { listActiveStockOptions } from "@/lib/stock/repo";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    return Response.json({ items: await listActiveStockOptions() });
  } catch {
    return Response.json({ error: "load_failed" }, { status: 500 });
  }
}
