import { requireAdmin } from "@/lib/auth/guard";
import { dbErrorResponse } from "@/lib/api/dbError";
import { stockItemSchema } from "@/lib/stock/schema";
import { addItem } from "@/lib/stock/repo";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });
  const parsed = stockItemSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  try {
    return Response.json({ item: await addItem((await params).id, parsed.data) });
  } catch (e) {
    return dbErrorResponse(e);
  }
}
