"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/bill/format";
import { validateBill, emptyErrors, type FieldErrors } from "@/lib/bill/validation";
import { exportBillPdf, saveBill } from "@/lib/bill/client";
import { useBillForm } from "./useBillForm";
import { FormPanel } from "./FormPanel";
import { BillPreview } from "./BillPreview";
import { MobileTabs } from "./MobileTabs";
import { ActionBar } from "./ActionBar";
import { TopBar } from "./TopBar";
import { StatusBanner, type Status } from "./StatusBanner";
import type { Tab } from "./tabs";
import type { BillDefaults } from "./useBillForm";

type Props = {
  displayName: string;
  defaults: BillDefaults;
};

export function StorefrontClient({ displayName, defaults }: Props) {
  const form = useBillForm(defaults);
  const [tab, setTab] = useState<Tab>("form");
  const [errors, setErrors] = useState<FieldErrors>(emptyErrors);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  function checkValid(): boolean {
    const { ok, errors: next } = validateBill(form.input);
    setErrors(next);
    if (!ok) {
      setStatus({ type: "error", text: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      setTab("form");
    }
    return ok;
  }

  async function onExport() {
    if (!checkValid()) return;
    setExporting(true);
    setStatus(null);
    try {
      await exportBillPdf(form.input);
    } catch {
      setStatus({ type: "error", text: "สร้าง PDF ไม่สำเร็จ" });
    } finally {
      setExporting(false);
    }
  }

  async function onSave() {
    if (!checkValid()) return;
    setSaving(true);
    setStatus(null);
    const result = await saveBill(form.input);
    if (result.ok) {
      setStatus({ type: "success", text: "บันทึกบิลเรียบร้อยแล้ว" });
      form.reset();
    } else {
      setStatus({ type: "error", text: result.error });
    }
    setSaving(false);
  }

  return (
    <div className="flex min-h-full flex-col">
      <TopBar displayName={displayName} active="create" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5">
        <MobileTabs tab={tab} onChange={setTab} />
        {status ? (
          <div className="mt-4">
            <StatusBanner status={status} />
          </div>
        ) : null}
        <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-start">
          <div className={cn(tab === "form" ? "block" : "hidden", "md:block")}>
            <FormPanel errors={errors} {...form} />
            <p className="mt-6 text-xs text-muted">จัดทำโดย {displayName}</p>
          </div>
          <div
            className={cn(
              tab === "preview" ? "block" : "hidden",
              "md:sticky md:top-20 md:block",
            )}
          >
            <BillPreview bill={form.computed} />
          </div>
        </div>
      </main>
      <ActionBar
        onSave={onSave}
        onExport={onExport}
        saving={saving}
        exporting={exporting}
        net={formatMoney(form.computed.netTransfer)}
      />
    </div>
  );
}
