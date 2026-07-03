import { StyleSheet } from "@react-pdf/renderer";
import { PDF_COLORS } from "@/lib/bill/constants";

export const COL = {
  seq: "7%",
  name: "37%",
  basePrice: "15%",
  salePrice: "15%",
  qty: "10%",
  lineTotal: "16%",
} as const;

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    fontSize: 11,
    color: PDF_COLORS.text,
    paddingVertical: 28,
    paddingHorizontal: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: PDF_COLORS.text,
    marginBottom: 14,
  },
  headText: { fontSize: 9 },
  metaTable: { borderWidth: 1, borderColor: PDF_COLORS.border, marginBottom: 14 },
  metaRow: { flexDirection: "row" },
  metaLabel: {
    width: "18%",
    padding: 5,
    backgroundColor: PDF_COLORS.headerFill,
    color: PDF_COLORS.body,
    borderRightWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  metaValue: {
    width: "32%",
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: PDF_COLORS.border,
    fontWeight: "bold",
  },
  metaValueLast: {
    width: "32%",
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  rowBorderTop: { borderTopWidth: 1, borderColor: PDF_COLORS.border },
  table: { borderWidth: 1, borderColor: PDF_COLORS.border },
  tHead: { flexDirection: "row", backgroundColor: PDF_COLORS.headerFill },
  tRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  cellLast: { padding: 5 },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  bold: { fontWeight: "bold" },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: PDF_COLORS.border,
    backgroundColor: PDF_COLORS.headerFill,
  },
  summary: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  summaryHead: {
    padding: 6,
    textAlign: "center",
    backgroundColor: PDF_COLORS.headerFill,
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  summaryLabel: {
    width: "40%",
    padding: 6,
    color: PDF_COLORS.body,
    borderRightWidth: 1,
    borderColor: PDF_COLORS.border,
  },
  summaryValue: { width: "60%", padding: 6 },
  brand: { color: PDF_COLORS.brand },
  accent: { color: PDF_COLORS.accent },
});
