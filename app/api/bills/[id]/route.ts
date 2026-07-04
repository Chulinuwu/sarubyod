import { getSession } from "@/lib/auth/current";
import { dbErrorResponse } from "@/lib/api/dbError";
import { billInputSchema } from "@/lib/bill/schema";
import { updateBill, deleteBill } from "@/lib/bill/repo";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const parsed = billInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  try {
    await updateBill((await params).id, parsed.data);
    return Response.json({ ok: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    await deleteBill((await params).id);
    return Response.json({ ok: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}
