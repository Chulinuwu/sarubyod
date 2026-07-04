import { requireAdmin } from "@/lib/auth/guard";
import { dbErrorResponse } from "@/lib/api/dbError";
import { stockLotSchema } from "@/lib/stock/schema";
import { getLotWithItems, updateLot, deleteLot } from "@/lib/stock/repo";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  try {
    const lot = await getLotWithItems((await params).id);
    if (!lot) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ lot });
  } catch {
    return Response.json({ error: "load_failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  const parsed = stockLotSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  try {
    await updateLot((await params).id, parsed.data);
    return Response.json({ ok: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  try {
    await deleteLot((await params).id);
    return Response.json({ ok: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}
