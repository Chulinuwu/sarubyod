import { renderToBuffer } from "@react-pdf/renderer";
import type { BillComputed } from "@/lib/bill/types";
import { registerFonts } from "./fonts";
import { BillDocument } from "./BillDocument";

export async function renderBillPdf(bill: BillComputed): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<BillDocument bill={bill} />);
}
