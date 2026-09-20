import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarMonth } from "@/components/finance/calendar-month";
import { PiePanel } from "@/components/finance/pie-panel";
import { TransactionList } from "@/components/finance/transaction-list";
import { Button } from "@/components/ui/button";
import { currencyMeta } from "@/lib/finance/currency";
import { formatDayLabel, formatMoney, todayIso } from "@/lib/finance/format";
import {
  categorySlices,
  dayTotals,
  sumByType,
  txsOnDay,
} from "@/lib/finance/selectors";
import { useFinanceStore, useFx, useUiStore } from "@/lib/finance/store";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

function CalendarPage() {
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const openCreate = useUiStore((s) => s.openCreate);
  const fx = useFx();
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(todayIso);

  const totals = useMemo(
    () => dayTotals(transactions, fx),
    [transactions, fx],
  );
  const dayTx = txsOnDay(transactions, selected);
  const income = sumByType(dayTx, "income", fx);
  const expense = sumByType(dayTx, "expense", fx);
  const baseName = currencyMeta(fx.base).name;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">日历</h1>
        <p className="mt-1 text-sm text-muted">
          每天的收支映射成柱高（{baseName}），点选日期会自动生成扇形图。
        </p>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <CalendarMonth
          month={month}
          onMonthChange={(d) => setMonth(d)}
          selected={selected}
          onSelect={setSelected}
          totals={totals}
        />
        <div className="grid gap-4">
          <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-medium">
                  {formatDayLabel(selected)}
                </h2>
                <p className="text-sm text-muted">
                  收入 {formatMoney(income, fx.base)} · 支出{" "}
                  {formatMoney(expense, fx.base)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openCreate({ date: selected })}
              >
                记这天
              </Button>
            </div>
          </section>
          <PiePanel
            title="当日构成"
            subtitle="随记账即时更新"
            currency={fx.base}
            expense={categorySlices(dayTx, "expense", fx)}
            income={categorySlices(dayTx, "income", fx)}
          />
        </div>
      </div>

      <section className="grid gap-3">
        <h2 className="font-display text-lg font-medium">当日明细</h2>
        <TransactionList
          items={[...dayTx].sort((a, b) => b.createdAt - a.createdAt)}
          showDate={false}
          onDelete={(id) => {
            deleteTransaction(id);
            toast.success("已删除");
          }}
          empty="这一天还是空白。记一笔后，日历柱高和扇形图会马上出现。"
        />
      </section>
    </div>
  );
}
