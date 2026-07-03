import type { BillComputed } from "@/lib/bill/types";
import { renderBillPdf } from "./render";

function safeFilename(billNo: string): string {
  const ascii = billNo.replace(/[^\x20-\x7E]/g, "").trim() || "bill";
  const encoded = encodeURIComponent(`${billNo}.pdf`);
  return `attachment; filename="${ascii}.pdf"; filename*=UTF-8''${encoded}`;
}

export async function pdfResponse(bill: BillComputed): Promise<Response> {
  const buffer = await renderBillPdf(bill);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": safeFilename(bill.billNo),
    },
  });
}
