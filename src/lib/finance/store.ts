import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  asCurrency,
  DEFAULT_RATES,
  mergeRates,
  type CurrencyCode,
  type RateTable,
} from "./currency";
import { buildSeed } from "./seed";
import { todayIso } from "./format";
import type { Fx } from "./selectors";
import type { Budget, ReceiptItem, SavingsPlan, Transaction, TxSource, TxType } from "./types";

function uid(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

const initialSeed = buildSeed(new Date());

type TxInput = {
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
};

type PlanInput = {
  name: string;
  target: number;
  currency: CurrencyCode;
  deadline: string | null;
  note: string;
};

interface FinanceState {
  hasHydrated: boolean;
  initialized: boolean;
  isDemo: boolean;
  baseCurrency: CurrencyCode;
  rates: RateTable;
  transactions: Transaction[];
  budgets: Budget[];
  plans: SavingsPlan[];
  setHasHydrated: (v: boolean) => void;
  setBaseCurrency: (code: CurrencyCode) => void;
  setRate: (code: CurrencyCode, valueInCny: number) => void;
  addTransaction: (input: TxInput) => void;
  updateTransaction: (id: string, input: TxInput) => void;
  deleteTransaction: (id: string) => void;
  upsertBudget: (
    month: string,
    category: string,
    amount: number,
    currency: CurrencyCode,
  ) => void;
  deleteBudget: (id: string) => void;
  addPlan: (input: PlanInput) => void;
  updatePlan: (id: string, input: PlanInput) => void;
  deletePlan: (id: string) => void;
  contribute: (
    planId: string,
    amount: number,
    date: string,
    note: string,
  ) => void;
  loadSeed: () => void;
  clearAll: () => void;
}

type Persisted = {
  initialized?: boolean;
  isDemo?: boolean;
  baseCurrency?: string;
  rates?: Partial<RateTable>;
  transactions?: Array<Partial<Transaction> & Transaction>;
  budgets?: Array<Partial<Budget> & Budget>;
  plans?: Array<Partial<SavingsPlan> & SavingsPlan>;
};

function migrateLedger(raw: unknown): Partial<FinanceState> {
  const s = (raw ?? {}) as Persisted;
  return {
    initialized: s.initialized ?? true,
    isDemo: s.isDemo ?? true,
    baseCurrency: asCurrency(s.baseCurrency),
    rates: mergeRates(s.rates),
    transactions: (s.transactions ?? []).map((t) => ({
      ...t,
      currency: asCurrency(t.currency),
      mapTo:
        t.mapTo && asCurrency(t.mapTo) !== asCurrency(t.currency)
          ? asCurrency(t.mapTo)
          : !t.mapTo && asCurrency(t.currency) !== "CNY"
            ? "CNY"
            : undefined,
    })),
    budgets: (s.budgets ?? []).map((b) => ({
      ...b,
      currency: asCurrency(b.currency),
    })),
    plans: (s.plans ?? []).map((p) => ({
      ...p,
      currency: asCurrency(p.currency),
    })),
  };
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      hasHydrated: true,
      initialized: true,
      isDemo: true,
      baseCurrency: "CNY",
      rates: DEFAULT_RATES,
      transactions: initialSeed.transactions,
      budgets: initialSeed.budgets,
      plans: initialSeed.plans,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setBaseCurrency: (code) => set({ baseCurrency: code }),
      setRate: (code, valueInCny) => {
        if (code === "CNY") return;
        if (!Number.isFinite(valueInCny) || valueInCny <= 0) return;
        set({
          rates: { ...get().rates, [code]: valueInCny },
        });
      },
      addTransaction: (input) => {
        const tx: Transaction = {
          id: uid("tx"),
          ...input,
          source: input.source ?? "manual",
          createdAt: Date.now(),
        };
        set({
          transactions: [tx, ...get().transactions],
          isDemo: false,
        });
      },
      updateTransaction: (id, input) => {
        set({
          transactions: get().transactions.map((tx) =>
            tx.id === id ? { ...tx, ...input } : tx,
          ),
          isDemo: false,
        });
      },
      deleteTransaction: (id) => {
        set({
          transactions: get().transactions.filter((tx) => tx.id !== id),
        });
      },
      upsertBudget: (month, category, amount, currency) => {
        const existing = get().budgets.find(
          (b) => b.month === month && b.category === category,
        );
        if (existing) {
          set({
            budgets: get().budgets.map((b) =>
              b.id === existing.id ? { ...b, amount, currency } : b,
            ),
            isDemo: false,
          });
          return;
        }
        set({
          budgets: [
            ...get().budgets,
            { id: uid("bd"), month, category, amount, currency },
          ],
          isDemo: false,
        });
      },
      deleteBudget: (id) => {
        set({
          budgets: get().budgets.filter((b) => b.id !== id),
          isDemo: false,
        });
      },
      addPlan: (input) => {
        const plan: SavingsPlan = {
          id: uid("pl"),
          ...input,
          createdAt: Date.now(),
          contributions: [],
        };
        set({ plans: [plan, ...get().plans], isDemo: false });
      },
      updatePlan: (id, input) => {
        set({
          plans: get().plans.map((p) => (p.id === id ? { ...p, ...input } : p)),
          isDemo: false,
        });
      },
      deletePlan: (id) => {
        set({
          plans: get().plans.filter((p) => p.id !== id),
          isDemo: false,
        });
      },
      contribute: (planId, amount, date, note) => {
        set({
          plans: get().plans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  contributions: [
                    {
                      id: uid("ct"),
                      amount,
                      date: date || todayIso(),
                      note,
                    },
                    ...p.contributions,
                  ],
                }
              : p,
          ),
          isDemo: false,
        });
      },
      loadSeed: () => {
        const seed = buildSeed(new Date());
        set({
          ...seed,
          baseCurrency: "CNY",
          rates: DEFAULT_RATES,
          initialized: true,
          isDemo: true,
        });
      },
      clearAll: () => {
        set({
          transactions: [],
          budgets: [],
          plans: [],
          initialized: true,
          isDemo: false,
        });
      },
    }),
    {
      name: "chengzhang-ledger-v1",
      version: 3,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        initialized: state.initialized,
        isDemo: state.isDemo,
        baseCurrency: state.baseCurrency,
        rates: state.rates,
        transactions: state.transactions,
        budgets: state.budgets,
        plans: state.plans,
      }),
      migrate: (persisted) => migrateLedger(persisted),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          useFinanceStore.setState({ hasHydrated: true });
          return;
        }
        if (!state.initialized) {
          state.loadSeed();
        }
        state.setHasHydrated(true);
      },
    },
  ),
);

export function useFx(): Fx {
  const base = useFinanceStore((s) => s.baseCurrency);
  const rates = useFinanceStore((s) => s.rates);
  return useMemo(() => ({ base, rates }), [base, rates]);
}

export const useUiStore = create<{
  composerOpen: boolean;
  scanOpen: boolean;
  editingId: string | null;
  defaultDate: string;
  defaultType: TxType;
  openCreate: (opts?: { date?: string; type?: TxType }) => void;
  openEdit: (id: string) => void;
  openScan: () => void;
  closeComposer: () => void;
  closeScan: () => void;
}>((set) => ({
  composerOpen: false,
  scanOpen: false,
  editingId: null,
  defaultDate: todayIso(),
  defaultType: "expense",
  openCreate: (opts) =>
    set({
      composerOpen: true,
      scanOpen: false,
      editingId: null,
      defaultDate: opts?.date ?? todayIso(),
      defaultType: opts?.type ?? "expense",
    }),
  openEdit: (id) =>
    set({ composerOpen: true, scanOpen: false, editingId: id }),
  openScan: () =>
    set({ scanOpen: true, composerOpen: false, editingId: null }),
  closeComposer: () => set({ composerOpen: false }),
  closeScan: () => set({ scanOpen: false }),
}));
