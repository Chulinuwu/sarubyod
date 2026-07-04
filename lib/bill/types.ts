export type BillHeader = {
  billDate: string;
  billNo: string;
  shopName: string;
  consignor: string;
  receiver: string;
  phone: string;
};

export type BillItemInput = {
  stockItemId: string | null;
  name: string;
  basePrice: number;
  salePrice: number;
  qty: number;
};

export type BillItem = BillItemInput & {
  seq: number;
  lineTotal: number;
  baseTotal: number;
  commission: number;
};

export type BillInput = BillHeader & {
  items: BillItemInput[];
  note: string;
};

export type BillComputed = BillHeader & {
  items: BillItem[];
  note: string;
  totalAmount: number;
  commission: number;
  netTransfer: number;
};

export type BillSummary = {
  id: string;
  billNo: string;
  billDate: string;
  shopName: string;
  consignor: string;
  commission: number;
  totalAmount: number;
  netTransfer: number;
  createdBy: string;
  createdAt: string;
};

export type BillRecord = BillComputed & {
  id: string;
  createdBy: string;
  createdAt: string;
};
