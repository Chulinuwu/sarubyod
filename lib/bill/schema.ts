import { z } from "zod";

export const billItemSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อสินค้า"),
  basePrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative(),
  qty: z.number().int().nonnegative(),
});

export const billInputSchema = z.object({
  billDate: z.string().min(1, "เลือกวันที่"),
  billNo: z.string().trim().min(1, "กรอกเลขที่บิล"),
  shopName: z.string().trim().min(1, "กรอกร้านค้า"),
  consignor: z.string().trim().min(1, "กรอกผู้ฝากขาย"),
  receiver: z.string().trim().default(""),
  phone: z.string().trim().default(""),
  items: z.array(billItemSchema).min(1, "ต้องมีอย่างน้อย 1 รายการ"),
  note: z.string().default(""),
});

export type BillInputParsed = z.infer<typeof billInputSchema>;
