import { requireAdmin } from "@/lib/auth/guard";
import { dbErrorResponse } from "@/lib/api/dbError";
import { stockLotSchema } from "@/lib/stock/schema";
import { listLots, createLot } from "@/lib/stock/repo";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  try {
    return Response.json({ lots: await listLots() });
  } catch {
    return Response.json({ error: "load_failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  const parsed = stockLotSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  try {
    return Response.json({ lot: await createLot(parsed.data) });
  } catch (e) {
    return dbErrorResponse(e);
  }
}
