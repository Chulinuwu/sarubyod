import { billInputSchema } from "@/lib/bill/schema";
import { computeBill } from "@/lib/bill/calc";
import { pdfResponse } from "@/lib/pdf/response";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = billInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  return pdfResponse(computeBill(parsed.data));
}
