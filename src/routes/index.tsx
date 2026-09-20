import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PiePanel } from "@/components/finance/pie-panel";
import { TransactionList } from "@/components/finance/transaction-list";
import { Button } from "@/components/ui/button";
import {
  formatMoney,
  monthHeading,
  monthKey,
  todayIso,
} from "@/lib/finance/format";
import {
  categorySlices,
  netOf,
  sumByType,
  txsInMonth,
  txsOnDay,
} from "@/lib/finance/selectors";
import { useFinanceStore, useFx, useUiStore } from "@/lib/finance/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const transactions = useFinanceStore((s) => s.transactions);
  const isDemo = useFinanceStore((s) => s.isDemo);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const clearAll = useFinanceStore((s) => s.clearAll);
  const loadSeed = useFinanceStore((s) => s.loadSeed);
  const openCreate = useUiStore((s) => s.openCreate);
  const openScan = useUiStore((s) => s.openScan);
  const fx = useFx();

  const today = todayIso();
  const month = monthKey(today);
  const monthTx = txsInMonth(transactions, month);
  const todayTx = txsOnDay(transactions, today);
  const income = sumByType(monthTx, "income", fx);
  const expense = sumByType(monthTx, "expense", fx);
  const net = netOf(monthTx, fx);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest text-subtle uppercase">
            {monthHeading(month)}
          </p>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            本月结余
          </h1>
        </div>
        {isDemo ? (
          <p className="text-xs text-subtle">示例账本，改动后会变成你的记录</p>
        ) : null}
      </header>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p
          className={cn(
            "font-display text-4xl tabular-nums tracking-tight sm:text-5xl",
            net < 0 ? "text-expense" : "text-fg",
          )}
        >
          {formatMoney(net, fx.base, { signed: true })}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat
            label="收入"
            value={formatMoney(income, fx.base)}
            tone="income"
          />
          <Stat
            label="支出"
            value={formatMoney(expense, fx.base)}
            tone="expense"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() => openScan()}
        className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)] transition-colors duration-150 hover:bg-surface-2/40"
      >
        <span className="font-medium">扫描收据入账</span>
        <span className="text-sm font-medium text-primary">去拍照</span>
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <PiePanel
          title="今日分类"
          subtitle="按当天自动汇总"
          currency={fx.base}
          expense={categorySlices(todayTx, "expense", fx)}
          income={categorySlices(todayTx, "income", fx)}
        />
        <PiePanel
          title="本月分类"
          subtitle="整月收支构成"
          currency={fx.base}
          expense={categorySlices(monthTx, "expense", fx)}
          income={categorySlices(monthTx, "income", fx)}
        />
      </div>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium">最近记账</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => openScan()}>
              扫收据
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openCreate()}>
              记一笔
            </Button>
          </div>
        </div>
        <TransactionList
          items={[...transactions]
            .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
            .slice(0, 12)}
          onDelete={(id) => {
            deleteTransaction(id);
            toast.success("已删除");
          }}
          empty="还没有记账。点右上角记一笔，扇形图会跟着生成。"
        />
      </section>

      <div className="flex flex-wrap items-center gap-2 pb-2 text-xs text-subtle">
        {isDemo ? (
          <button
            type="button"
            className="underline-offset-2 hover:text-fg hover:underline"
            onClick={() => {
              clearAll();
              toast.success("已清空，开始自己记账");
            }}
          >
            清空示例，开始自己记账
          </button>
        ) : (
          <button
            type="button"
            className="underline-offset-2 hover:text-fg hover:underline"
            onClick={() => {
              loadSeed();
              toast.success("已恢复示例账本");
            }}
          >
            恢复示例账本
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "income" | "expense";
}) {
  return (
    <div className="rounded-lg bg-surface-2/70 px-3 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={cn(
          "font-display text-xl tabular-nums tracking-tight",
          tone === "income" ? "text-income" : "text-expense",
        )}
      >
        {value}
      </p>
    </div>
  );
}
