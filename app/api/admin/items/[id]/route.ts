import { requireAdmin } from "@/lib/auth/guard";
import { dbErrorResponse } from "@/lib/api/dbError";
import { stockItemSchema } from "@/lib/stock/schema";
import { updateItem, deleteItem } from "@/lib/stock/repo";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  const parsed = stockItemSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  try {
    await updateItem((await params).id, parsed.data);
    return Response.json({ ok: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  try {
    await deleteItem((await params).id);
    return Response.json({ ok: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}
