import { Wordmark } from "@/components/ui/Wordmark";
import { LedgerMotif } from "./LedgerMotif";

export function LoginAside() {
  return (
    <aside className="flex flex-col justify-between bg-ink px-6 pb-8 pt-7 text-white md:px-12 md:py-14">
      <Wordmark tone="inverse" />
      <div className="mt-6 md:mt-0">
        <h1 className="max-w-sm text-2xl font-bold leading-snug md:text-[2rem]">
          บิลสรุปยอดการฝากขาย ประจำวัน
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
          กรอกรายการ ดูตัวอย่างบิล และออกไฟล์ PDF ได้ในที่เดียว
        </p>
        <LedgerMotif />
      </div>
      <p className="mt-8 hidden text-xs text-white/35 md:block">
        ฝั่งหน้าร้าน
      </p>
    </aside>
  );
}
