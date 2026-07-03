import { getSession } from "@/lib/auth/current";
import { getBill } from "@/lib/bill/repo";
import { pdfResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return new Response("unauthorized", { status: 401 });

  const { id } = await params;
  const bill = await getBill(id);
  if (!bill) return new Response("not found", { status: 404 });

  return pdfResponse(bill);
}
