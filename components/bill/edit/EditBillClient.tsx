"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillInput } from "@/lib/bill/types";
import { validateBill, emptyErrors, type FieldErrors } from "@/lib/bill/validation";
import { updateBill, deleteBill } from "@/lib/bill/client";
import { useBillForm } from "@/components/bill/useBillForm";
import { HeaderFields } from "@/components/bill/HeaderFields";
import { SummaryInputs } from "@/components/bill/SummaryInputs";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StatusBanner, type Status } from "@/components/bill/StatusBanner";
import { FreeItemsEditor } from "./FreeItemsEditor";

type Props = { billId: string; initial: BillInput };

export function EditBillClient({ billId, initial }: Props) {
  const router = useRouter();
  const form = useBillForm(undefined, initial);
  const [errors, setErrors] = useState<FieldErrors>(emptyErrors);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const busy = saving || deleting;

  async function onSave() {
    const { ok, errors: next } = validateBill(form.input);
    setErrors(next);
    if (!ok) {
      setStatus({ type: "error", text: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      return;
    }
    setSaving(true);
    setStatus(null);
    const result = await updateBill(billId, form.input);
    if (result.ok) {
      router.push(`/storefront/bills/${billId}`);
      router.refresh();
    } else {
      setStatus({ type: "error", text: result.error });
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("ลบบิลนี้ถาวร ยืนยันไหม?")) return;
    setDeleting(true);
    setStatus(null);
    const result = await deleteBill(billId);
    if (result.ok) {
      router.push("/storefront/bills");
      router.refresh();
    } else {
      setStatus({ type: "error", text: result.error ?? "ลบไม่สำเร็จ" });
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {status ? <StatusBanner status={status} /> : null}

      <Section title="ข้อมูลบิล" step={1}>
        <HeaderFields
          input={form.input}
          setField={form.setField}
          errors={errors.fields}
        />
      </Section>
      <Section title="รายการสินค้า" step={2}>
        <FreeItemsEditor
          items={form.input.items}
          computed={form.computed}
          itemErrors={errors.items}
          onChange={form.updateItem}
          onAdd={form.addItem}
          onRemove={form.removeItem}
        />
      </Section>
      <Section title="สรุปรายการ" step={3}>
        <SummaryInputs
          input={form.input}
          computed={form.computed}
          setField={form.setField}
        />
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onSave} disabled={busy} className="sm:px-8">
          {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push(`/storefront/bills/${billId}`)}
          disabled={busy}
        >
          ยกเลิก
        </Button>
        <Button variant="danger" onClick={onDelete} disabled={busy} className="ml-auto">
          {deleting ? "กำลังลบ..." : "ลบบิลนี้"}
        </Button>
      </div>
    </div>
  );
}
