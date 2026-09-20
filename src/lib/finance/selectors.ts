import type { Budget, SavingsPlan, Transaction, TxType } from "./types";
import { categoryColor } from "./categories";
import { asCurrency, convert, type CurrencyCode, type RateTable } from "./currency";
import { monthKey } from "./format";

export interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

export type Fx = {
  base: CurrencyCode;
  rates: RateTable;
};

export function txAmount(tx: Pick<Transaction, "amount" | "currency">, fx: Fx): number {
  return convert(tx.amount, asCurrency(tx.currency), fx.base, fx.rates);
}

export function txsOnDay(txs: Transaction[], iso: string): Transaction[] {
  return txs.filter((t) => t.date === iso);
}

export function txsInMonth(txs: Transaction[], month: string): Transaction[] {
  return txs.filter((t) => monthKey(t.date) === month);
}

export function sumByType(txs: Transaction[], type: TxType, fx: Fx): number {
  return txs
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + txAmount(t, fx), 0);
}

export function netOf(txs: Transaction[], fx: Fx): number {
  return sumByType(txs, "income", fx) - sumByType(txs, "expense", fx);
}

export function categorySlices(
  txs: Transaction[],
  type: TxType,
  fx: Fx,
): CategorySlice[] {
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== type) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + txAmount(t, fx));
  }
  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
      color: categoryColor(name),
    }))
    .sort((a, b) => b.value - a.value);
}

export function dayTotals(
  txs: Transaction[],
  fx: Fx,
): Map<string, { income: number; expense: number }> {
  const map = new Map<string, { income: number; expense: number }>();
  for (const t of txs) {
    const cur = map.get(t.date) ?? { income: 0, expense: 0 };
    const value = txAmount(t, fx);
    if (t.type === "income") cur.income += value;
    else cur.expense += value;
    map.set(t.date, cur);
  }
  return map;
}

export function overallBudget(budgets: Budget[], month: string): Budget | undefined {
  return budgets.find((b) => b.month === month && b.category === "");
}

export function categoryBudgets(budgets: Budget[], month: string): Budget[] {
  return budgets.filter((b) => b.month === month && b.category !== "");
}

export function spentInCategory(
  txs: Transaction[],
  month: string,
  category: string,
  fx: Fx,
): number {
  return txs
    .filter(
      (t) =>
        t.type === "expense" &&
        monthKey(t.date) === month &&
        (category === "" || t.category === category),
    )
    .reduce((acc, t) => acc + txAmount(t, fx), 0);
}

export function budgetInBase(budget: Budget, fx: Fx): number {
  return convert(budget.amount, asCurrency(budget.currency), fx.base, fx.rates);
}

export function spentAgainstBudget(
  txs: Transaction[],
  budget: Budget,
  rates: RateTable,
): number {
  return spentInCategory(txs, budget.month, budget.category, {
    base: asCurrency(budget.currency),
    rates,
  });
}

export function planBalance(plan: SavingsPlan): number {
  return plan.contributions.reduce((acc, c) => acc + c.amount, 0);
}

export function monthsRemaining(deadline: string | null, now = new Date()): number {
  if (!deadline) return 0;
  const end = new Date(`${deadline}T00:00:00`);
  const months =
    (end.getFullYear() - now.getFullYear()) * 12 +
    (end.getMonth() - now.getMonth()) +
    (end.getDate() >= now.getDate() ? 0 : -1);
  return Math.max(0, months);
}
