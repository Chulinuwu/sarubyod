import { z } from "zod";

export const stockLotSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อ lot"),
  lotDate: z.string().nullable().default(null),
  consignor: z.string().trim().default("twentytoys"),
  note: z.string().default(""),
  isActive: z.boolean().default(true),
});

export const stockItemSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อสินค้า"),
  basePrice: z.number().nonnegative(),
  profitCeiling: z.number().nonnegative(),
  qtySent: z.number().int().nonnegative().nullable().default(null),
});

export type StockLotParsed = z.infer<typeof stockLotSchema>;
export type StockItemParsed = z.infer<typeof stockItemSchema>;
