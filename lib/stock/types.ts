export type StockLot = {
  id: string;
  name: string;
  lotDate: string | null;
  consignor: string;
  note: string;
  isActive: boolean;
  createdAt: string;
};

export type StockItem = {
  id: string;
  lotId: string;
  name: string;
  basePrice: number;
  profitCeiling: number;
  qtySent: number | null;
  createdAt: string;
};

export type StockLotWithItems = StockLot & { items: StockItem[] };

export type StockLotSummary = StockLot & { itemCount: number };

export type StockLotForm = {
  name: string;
  lotDate: string | null;
  consignor: string;
  note: string;
  isActive: boolean;
};

export type StockItemForm = {
  name: string;
  basePrice: number;
  profitCeiling: number;
  qtySent: number | null;
};

// Flat option used by the storefront picker.
export type StockOption = {
  id: string;
  name: string;
  basePrice: number;
  profitCeiling: number;
  lotName: string;
};
