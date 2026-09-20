import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { addMonths, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CurrencyChips } from "@/components/finance/currency-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { EXPENSE_CATEGORIES } from "@/lib/finance/categories";
import {
  asCurrency,
  currencyMeta,
  formatMoney,
  type CurrencyCode,
} from "@/lib/finance/currency";
import { monthKey } from "@/lib/finance/format";
import {
  categoryBudgets,
  overallBudget,
  spentAgainstBudget,
  spentInCategory,
} from "@/lib/finance/selectors";
import { useFinanceStore } from "@/lib/finance/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budget")({ component: BudgetPage });

function BudgetPage() {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const month = monthKey(monthDate);
  const transactions = useFinanceStore((s) => s.transactions);
  const budgets = useFinanceStore((s) => s.budgets);
  const rates = useFinanceStore((s) => s.rates);
  const baseCurrency = useFinanceStore((s) => s.baseCurrency);
  const upsertBudget = useFinanceStore((s) => s.upsertBudget);
  const deleteBudget = useFinanceStore((s) => s.deleteBudget);

  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(baseCurrency);

  const overall = overallBudget(budgets, month);
  const cats = categoryBudgets(budgets, month);
  const overallCode = asCurrency(overall?.currency ?? baseCurrency);
  const spentAll = overall
    ? spentAgainstBudget(transactions, overall, rates)
    : spentInCategory(transactions, month, "", {
        base: baseCurrency,
        rates,
      });
  const overallLimit = overall?.amount ?? 0;

  const rows = useMemo(() => {
    return cats
      .map((b) => {
        const spent = spentAgainstBudget(transactions, b, rates);
        return { ...b, spent, ratio: b.amount > 0 ? spent / b.amount : 0 };
      })
      .sort((a, b) => b.ratio - a.ratio);
  }, [cats, transactions, month, rates]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("请输入有效预算金额");
      return;
    }
    upsertBudget(month, cat, Math.round(value * 100) / 100, currency);
    toast.success(cat ? `已设置${cat}预算` : "已设置总预算");
    setOpen(false);
    setAmount("");
  }

  const overallRatio = overallLimit > 0 ? spentAll / overallLimit : 0;

  function openEditor(nextCat: string, existingAmount?: number, existingCurrency?: CurrencyCode) {
    setCat(nextCat);
    setAmount(existingAmount ? String(existingAmount) : "");
    setCurrency(existingCurrency ?? baseCurrency);
    setOpen(true);
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            预算
          </h1>
          <p className="mt-1 text-sm text-muted">
            每条预算可自选币种，支出会折算后对照进度。
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="上个月"
            onClick={() => setMonthDate(addMonths(monthDate, -1))}
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-24 text-center font-medium">
            {format(monthDate, "yyyy年M月", { locale: zhCN })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="下个月"
            onClick={() => setMonthDate(addMonths(monthDate, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </header>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">
              本月总预算
              {overall ? ` · ${currencyMeta(overallCode).name}` : ""}
            </p>
            <p className="font-display text-3xl tabular-nums tracking-tight">
              {overallLimit > 0 ? formatMoney(overallLimit, overallCode) : "未设置"}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              openEditor("", overall?.amount, overall?.currency)
            }
          >
            {overall ? "调整总预算" : "设置总预算"}
          </Button>
        </div>
        {overallLimit > 0 ? (
          <div className="mt-4 grid gap-2">
            <Progress
              value={Math.min(100, overallRatio * 100)}
              indicatorClassName={overallRatio > 1 ? "bg-expense" : "bg-primary"}
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                已用 {formatMoney(spentAll, overallCode)}
              </span>
              <span className={cn(overallRatio > 1 ? "text-expense" : "text-fg")}>
                {overallRatio > 1
                  ? `超支 ${formatMoney(spentAll - overallLimit, overallCode)}`
                  : `剩余 ${formatMoney(overallLimit - spentAll, overallCode)}`}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            设一个总限额，日常支出会自动对照进度。
          </p>
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium">分类预算</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditor("餐饮")}
          >
            添加分类
          </Button>
        </div>
        {rows.length === 0 ? (
          <p className="rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted shadow-[var(--shadow-border)]">
            还没有分类预算。可以为餐饮、交通等分别设限额。
          </p>
        ) : (
          <ul className="grid gap-2">
            {rows.map((row) => (
              <li
                key={row.id}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => openEditor(row.category, row.amount, row.currency)}
                  >
                    <p className="font-medium">
                      {row.category}
                      <span className="ml-2 text-xs font-normal text-subtle">
                        {asCurrency(row.currency)}
                      </span>
                    </p>
                    <p className="text-xs text-muted">
                      {formatMoney(row.spent, asCurrency(row.currency))} /{" "}
                      {formatMoney(row.amount, asCurrency(row.currency))}
                    </p>
                  </button>
                  <div className="flex items-center gap-1">
                    <span
                      className={cn(
                        "text-sm tabular-nums",
                        row.ratio > 1 ? "text-expense" : "text-muted",
                      )}
                    >
                      {Math.round(row.ratio * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 text-muted hover:text-expense"
                      aria-label={`删除${row.category}预算`}
                      onClick={() => {
                        deleteBudget(row.id);
                        toast.success("已删除预算");
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <Progress
                  className="mt-3"
                  value={Math.min(100, row.ratio * 100)}
                  indicatorClassName={row.ratio > 1 ? "bg-expense" : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>设置预算</DialogTitle>
            <DialogDescription>
              总预算留空分类；分类预算只统计该类别的支出，并折算到所选币种。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>范围</Label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCat("")}
                  className={cn(
                    "h-9 rounded-full px-3 text-sm",
                    cat === ""
                      ? "bg-primary text-primary-fg"
                      : "bg-surface-2 text-muted",
                  )}
                >
                  总预算
                </button>
                {EXPENSE_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={cn(
                      "h-9 rounded-full px-3 text-sm",
                      cat === c
                        ? "bg-primary text-primary-fg"
                        : "bg-surface-2 text-muted",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>币种</Label>
              <CurrencyChips value={currency} onChange={setCurrency} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="budget-amount">
                金额（{currencyMeta(currency).name}）
              </Label>
              <Input
                id="budget-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="例如 1800"
                className="h-12 font-display text-xl tabular-nums"
              />
            </div>
            <Button type="submit" className="w-full">
              保存预算
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
