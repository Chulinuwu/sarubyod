import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { BillComputed } from "@/lib/bill/types";
import { TH, MIN_PREVIEW_ROWS } from "@/lib/bill/constants";
import { formatThaiDate, formatMoney } from "@/lib/bill/format";
import { styles, COL } from "./styles";
import { pt } from "./text";

function MetaRow({
  label,
  value,
  label2,
  value2,
  top,
}: {
  label: string;
  value: string;
  label2: string;
  value2: string;
  top?: boolean;
}) {
  return (
    <View style={[styles.metaRow, top ? styles.rowBorderTop : {}]}>
      <Text style={styles.metaLabel}>{pt(label)}</Text>
      <Text style={styles.metaValue}>{pt(value)}</Text>
      <Text style={styles.metaLabel}>{pt(label2)}</Text>
      <Text style={styles.metaValueLast}>{pt(value2)}</Text>
    </View>
  );
}

export function BillDocument({ bill }: { bill: BillComputed }) {
  const filler = Math.max(0, MIN_PREVIEW_ROWS - bill.items.length);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{pt(TH.title)}</Text>

        <View style={styles.metaTable}>
          <MetaRow
            label={TH.date}
            value={formatThaiDate(bill.billDate)}
            label2={TH.billNo}
            value2={bill.billNo}
          />
          <MetaRow
            top
            label={TH.shop}
            value={bill.shopName}
            label2={TH.consignor}
            value2={bill.consignor}
          />
          <MetaRow
            top
            label={TH.receiver}
            value={bill.receiver}
            label2={TH.phone}
            value2={bill.phone}
          />
        </View>

        <View style={styles.table}>
          <View style={styles.tHead}>
            <Text style={[styles.cell, styles.center, styles.bold, styles.headText, { width: COL.seq }]}>{pt(TH.seq)}</Text>
            <Text style={[styles.cell, styles.center, styles.bold, styles.headText, { width: COL.name }]}>{pt(TH.itemName)}</Text>
            <Text style={[styles.cell, styles.center, styles.bold, styles.headText, { width: COL.basePrice }]}>{pt(TH.basePrice)}</Text>
            <Text style={[styles.cell, styles.center, styles.bold, styles.headText, { width: COL.salePrice }]}>{pt(TH.salePrice)}</Text>
            <Text style={[styles.cell, styles.center, styles.bold, styles.headText, { width: COL.qty }]}>{pt(TH.qty)}</Text>
            <Text style={[styles.cellLast, styles.center, styles.bold, styles.headText, { width: COL.lineTotal }]}>{pt(TH.lineTotal)}</Text>
          </View>

          {bill.items.map((it) => (
            <View style={styles.tRow} key={it.seq}>
              <Text style={[styles.cell, styles.center, { width: COL.seq }]}>{it.seq}</Text>
              <Text style={[styles.cell, { width: COL.name }]}>{pt(it.name)}</Text>
              <Text style={[styles.cell, styles.center, { width: COL.basePrice }]}>{formatMoney(it.basePrice)}</Text>
              <Text style={[styles.cell, styles.center, { width: COL.salePrice }]}>{formatMoney(it.salePrice)}</Text>
              <Text style={[styles.cell, styles.center, { width: COL.qty }]}>{it.qty}</Text>
              <Text style={[styles.cellLast, styles.right, { width: COL.lineTotal }]}>{formatMoney(it.lineTotal)}</Text>
            </View>
          ))}

          {Array.from({ length: filler }).map((_, i) => (
            <View style={styles.tRow} key={`f-${i}`}>
              <Text style={[styles.cell, { width: COL.seq }]}> </Text>
              <Text style={[styles.cell, { width: COL.name }]}> </Text>
              <Text style={[styles.cell, { width: COL.basePrice }]}> </Text>
              <Text style={[styles.cell, { width: COL.salePrice }]}> </Text>
              <Text style={[styles.cell, { width: COL.qty }]}> </Text>
              <Text style={[styles.cellLast, { width: COL.lineTotal }]}> </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={[styles.cell, { width: COL.seq }]}> </Text>
            <Text style={[styles.cell, { width: COL.name }]}> </Text>
            <Text style={[styles.cell, { width: COL.basePrice }]}> </Text>
            <Text style={[styles.cell, { width: COL.salePrice }]}> </Text>
            <Text style={[styles.cell, styles.center, styles.bold, { width: COL.qty }]}>{pt(TH.grandTotal)}</Text>
            <Text style={[styles.cellLast, styles.right, styles.bold, { width: COL.lineTotal }]}>
              {TH.baht}  {formatMoney(bill.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryHead}>{pt(TH.summary)}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{pt(TH.totalSales)}</Text>
            <Text style={styles.summaryValue}>{formatMoney(bill.totalAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{pt(TH.commission)}</Text>
            <Text style={styles.summaryValue}>{TH.baht}  {formatMoney(bill.commission)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{pt(TH.netTransfer)}</Text>
            <Text style={[styles.summaryValue, styles.bold, styles.brand]}>{TH.baht}  {formatMoney(bill.netTransfer)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{pt(TH.note)}</Text>
            <Text style={[styles.summaryValue, styles.accent]}>{pt(bill.note)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
