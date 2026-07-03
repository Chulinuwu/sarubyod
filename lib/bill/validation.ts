import { billInputSchema } from "./schema";
import type { BillInput } from "./types";

export type FieldErrors = {
  fields: Partial<Record<keyof BillInput, string>>;
  items: Record<number, string>;
};

export const emptyErrors: FieldErrors = { fields: {}, items: {} };

export function validateBill(input: BillInput): {
  ok: boolean;
  errors: FieldErrors;
} {
  const res = billInputSchema.safeParse(input);
  if (res.success) return { ok: true, errors: emptyErrors };

  const errors: FieldErrors = { fields: {}, items: {} };
  for (const issue of res.error.issues) {
    const [head, idx, sub] = issue.path;
    if (head === "items" && typeof idx === "number") {
      if (sub === "name") errors.items[idx] = issue.message;
    } else if (typeof head === "string") {
      errors.fields[head as keyof BillInput] = issue.message;
    }
  }
  return { ok: false, errors };
}
