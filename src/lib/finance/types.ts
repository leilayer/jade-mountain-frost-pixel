import type { CurrencyCode } from "./currency";

export type TxType = "income" | "expense";
export type TxSource = "manual" | "receipt";

export interface ReceiptItem {
  name: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  currency: CurrencyCode;
  category: string;
  date: string;
  note: string;
  merchant?: string;
  items?: ReceiptItem[];
  source?: TxSource;
  mapTo?: CurrencyCode;
  createdAt: number;
}

export interface Budget {
  id: string;
  month: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
}

export interface SavingsContribution {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export interface SavingsPlan {
  id: string;
  name: string;
  target: number;
  currency: CurrencyCode;
  deadline: string | null;
  note: string;
  createdAt: number;
  contributions: SavingsContribution[];
}