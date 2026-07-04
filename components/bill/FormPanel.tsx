import type { BillComputed, BillInput, BillItemInput } from "@/lib/bill/types";
import type { FieldErrors } from "@/lib/bill/validation";
import type { StockOption } from "@/lib/stock/types";
import { Section } from "@/components/ui/Section";
import { HeaderFields } from "./HeaderFields";
import { ItemsEditor } from "./ItemsEditor";
import { SummaryInputs } from "./SummaryInputs";

type Props = {
  input: BillInput;
  computed: BillComputed;
  errors: FieldErrors;
  stockOptions: StockOption[];
  setField: <K extends keyof BillInput>(key: K, value: BillInput[K]) => void;
  updateItem: (index: number, patch: Partial<BillItemInput>) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
};

export function FormPanel({
  input,
  computed,
  errors,
  stockOptions,
  setField,
  updateItem,
  addItem,
  removeItem,
}: Props) {
  return (
    <div>
      <Section title="ข้อมูลบิล" step={1} hint="หัวบิลและผู้เกี่ยวข้อง">
        <HeaderFields input={input} setField={setField} errors={errors.fields} />
      </Section>
      <Section title="รายการสินค้า" step={2} hint="สินค้าที่ขายได้แต่ละรายการ">
        <ItemsEditor
          items={input.items}
          computed={computed}
          stockOptions={stockOptions}
          itemErrors={errors.items}
          onChange={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
        />
      </Section>
      <Section title="สรุปรายการ" step={3} hint="ยอดเงินและค่าคอมมิชชั่น">
        <SummaryInputs input={input} computed={computed} setField={setField} />
      </Section>
    </div>
  );
}
