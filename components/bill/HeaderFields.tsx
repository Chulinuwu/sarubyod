import type { BillInput } from "@/lib/bill/types";
import { TH } from "@/lib/bill/constants";
import { TextField } from "@/components/ui/TextField";
import { DateField } from "@/components/ui/DateField";

type Props = {
  input: BillInput;
  setField: <K extends keyof BillInput>(key: K, value: BillInput[K]) => void;
  errors: Partial<Record<keyof BillInput, string>>;
};

export function HeaderFields({ input, setField, errors }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <DateField
        label={`${TH.date} *`}
        value={input.billDate}
        error={errors.billDate}
        onChange={(iso) => setField("billDate", iso)}
      />
      <TextField
        label={`${TH.billNo} *`}
        placeholder="เช่น Lot 2 กค 69"
        hint="เลขอ้างอิงบิลของรอบนี้"
        value={input.billNo}
        error={errors.billNo}
        onChange={(e) => setField("billNo", e.target.value)}
      />
      <TextField
        label={`${TH.shop} *`}
        placeholder="ชื่อร้านที่รับฝากขาย"
        value={input.shopName}
        error={errors.shopName}
        onChange={(e) => setField("shopName", e.target.value)}
      />
      <TextField
        label={`${TH.consignor} *`}
        placeholder="ชื่อร้าน/แบรนด์ที่เอาของมาฝากขาย"
        value={input.consignor}
        error={errors.consignor}
        onChange={(e) => setField("consignor", e.target.value)}
      />
      <TextField
        label={TH.receiver}
        placeholder="ชื่อผู้รับของมาขาย"
        hint="ไม่บังคับ"
        value={input.receiver}
        onChange={(e) => setField("receiver", e.target.value)}
      />
      <TextField
        label={TH.phone}
        inputMode="tel"
        placeholder="0xx-xxx-xxxx"
        hint="ไม่บังคับ"
        value={input.phone}
        onChange={(e) => setField("phone", e.target.value)}
      />
    </div>
  );
}
