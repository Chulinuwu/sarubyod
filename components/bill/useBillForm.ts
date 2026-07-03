import { useCallback, useMemo, useState } from "react";
import type { BillInput, BillItemInput } from "@/lib/bill/types";
import { computeBill } from "@/lib/bill/calc";
import { todayISO } from "@/lib/date";

const emptyItem: BillItemInput = {
  name: "",
  basePrice: 0,
  salePrice: 0,
  qty: 0,
};

export type BillDefaults = {
  shopName?: string;
  consignor?: string;
  receiver?: string;
};

function makeInitial(defaults?: BillDefaults): BillInput {
  return {
    billDate: todayISO(),
    billNo: "",
    shopName: defaults?.shopName ?? "",
    consignor: defaults?.consignor ?? "",
    receiver: defaults?.receiver ?? "",
    phone: "",
    items: [{ ...emptyItem }],
    note: "",
  };
}

export function useBillForm(defaults?: BillDefaults) {
  const [input, setInput] = useState<BillInput>(() => makeInitial(defaults));

  const setField = useCallback(
    <K extends keyof BillInput>(key: K, value: BillInput[K]) => {
      setInput((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const updateItem = useCallback(
    (index: number, patch: Partial<BillItemInput>) => {
      setInput((p) => ({
        ...p,
        items: p.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
      }));
    },
    [],
  );

  const addItem = useCallback(() => {
    setInput((p) => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInput((p) => ({
      ...p,
      items:
        p.items.length > 1 ? p.items.filter((_, i) => i !== index) : p.items,
    }));
  }, []);

  const reset = useCallback(() => setInput(makeInitial(defaults)), [defaults]);

  const computed = useMemo(() => computeBill(input), [input]);

  return { input, computed, setField, updateItem, addItem, removeItem, reset };
}
