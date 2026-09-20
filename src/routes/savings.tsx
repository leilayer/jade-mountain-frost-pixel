import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import {
  asCurrency,
  currencyMeta,
  formatMoney,
  type CurrencyCode,
} from "@/lib/finance/currency";
import { formatShortDay, todayIso } from "@/lib/finance/format";
import { monthsRemaining, planBalance } from "@/lib/finance/selectors";
import { useFinanceStore } from "@/lib/finance/store";
import type { SavingsPlan } from "@/lib/finance/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/savings")({ component: SavingsPage });

function SavingsPage() {
  const plans = useFinanceStore((s) => s.plans);
  const addPlan = useFinanceStore((s) => s.addPlan);
  const deletePlan = useFinanceStore((s) => s.deletePlan);
  const contribute = useFinanceStore((s) => s.contribute);
  const [createOpen, setCreateOpen] = useState(false);
  const [active, setActive] = useState<SavingsPlan | null>(null);
  const [mode, setMode] = useState<"in" | "out">("in");

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            储蓄计划
          </h1>
          <p className="mt-1 text-sm text-muted">
            独立于日常收支，每个计划用自己的币种盯目标。
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>新建计划</Button>
      </header>

      {plans.length === 0 ? (
        <p className="rounded-xl bg-surface px-4 py-12 text-center text-sm text-muted shadow-[var(--shadow-border)]">
          还没有储蓄计划。比如应急储备、旅行基金，都可以单独追踪。
        </p>
      ) : (
        <ul className="grid gap-3">
          {plans.map((plan) => {
            const code = asCurrency(plan.currency);
            const current = planBalance(plan);
            const ratio = plan.target > 0 ? current / plan.target : 0;
            const left = Math.max(0, plan.target - current);
            const months = monthsRemaining(plan.deadline);
            const perMonth = months > 0 ? left / months : left;
            return (
              <li
                key={plan.id}
                className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-medium">
                      {plan.name}
                      <span className="ml-2 font-sans text-xs font-normal text-subtle">
                        {code} · {currencyMeta(code).name}
                      </span>
                    </h2>
                    {plan.note ? (
                      <p className="text-sm text-muted">{plan.note}</p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 text-muted hover:text-expense"
                    aria-label={`删除${plan.name}`}
                    onClick={() => {
                      deletePlan(plan.id);
                      toast.success("已删除计划");
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <p className="mt-3 font-display text-2xl tabular-nums tracking-tight">
                  {formatMoney(current, code)}
                  <span className="ml-1 text-base text-muted">
                    / {formatMoney(plan.target, code)}
                  </span>
                </p>
                <Progress
                  className="mt-3"
                  value={Math.min(100, ratio * 100)}
                  indicatorClassName={ratio >= 1 ? "bg-income" : undefined}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
                  <span>
                    {ratio >= 1
                      ? "已达成目标"
                      : `还差 ${formatMoney(left, code)}`}
                  </span>
                  {plan.deadline ? (
                    <span>
                      截止 {formatShortDay(plan.deadline)}
                      {months > 0 && left > 0
                        ? ` · 每月约 ${formatMoney(perMonth, code)}`
                        : null}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setActive(plan);
                      setMode("in");
                    }}
                  >
                    存入
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setActive(plan);
                      setMode("out");
                    }}
                  >
                    取出
                  </Button>
                </div>
                {plan.contributions.length > 0 ? (
                  <ul className="mt-4 divide-y divide-border border-t border-border">
                    {plan.contributions.slice(0, 4).map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <span className="text-muted">
                          {formatShortDay(c.date)}
                          {c.note ? ` · ${c.note}` : ""}
                        </span>
                        <span
                          className={cn(
                            "tabular-nums",
                            c.amount >= 0 ? "text-income" : "text-expense",
                          )}
                        >
                          {c.amount >= 0 ? "+" : ""}
                          {formatMoney(c.amount, code)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <PlanDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={addPlan} />
      <ContributeDialog
        plan={active}
        mode={mode}
        onClose={() => setActive(null)}
        onSubmit={(amount, date, note) => {
          if (!active) return;
          contribute(active.id, mode === "out" ? -amount : amount, date, note);
          toast.success(mode === "out" ? "已取出" : "已存入");
          setActive(null);
        }}
      />
    </div>
  );
}

function PlanDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (input: {
    name: string;
    target: number;
    currency: CurrencyCode;
    deadline: string | null;
    note: string;
  }) => void;
}) {
  const baseCurrency = useFinanceStore((s) => s.baseCurrency);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(baseCurrency);
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setCurrency(baseCurrency);
  }, [open, baseCurrency]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(target);
    if (!name.trim()) {
      toast.error("请填写计划名称");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("请填写目标金额");
      return;
    }
    onSubmit({
      name: name.trim(),
      target: Math.round(value * 100) / 100,
      currency,
      deadline: deadline || null,
      note: note.trim(),
    });
    toast.success("已创建储蓄计划");
    onOpenChange(false);
    setName("");
    setTarget("");
    setCurrency(baseCurrency);
    setDeadline("");
    setNote("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,40rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新建储蓄计划</DialogTitle>
          <DialogDescription>给一笔钱起个名字，用选定币种盯着目标往前攒。</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="plan-name">名称</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="应急储备"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>币种</Label>
            <CurrencyChips value={currency} onChange={setCurrency} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="plan-target">
              目标金额（{currencyMeta(currency).name}）
            </Label>
            <Input
              id="plan-target"
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="20000"
              className="font-display text-xl tabular-nums"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="plan-deadline">截止日期（可选）</Label>
            <Input
              id="plan-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="plan-note">备注</Label>
            <Input
              id="plan-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="可选"
            />
          </div>
          <Button type="submit" className="w-full">
            创建计划
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContributeDialog({
  plan,
  mode,
  onClose,
  onSubmit,
}: {
  plan: SavingsPlan | null;
  mode: "in" | "out";
  onClose: () => void;
  onSubmit: (amount: number, date: string, note: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso());
  const [note, setNote] = useState("");
  const code = asCurrency(plan?.currency);
  const meta = currencyMeta(code);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("请输入金额");
      return;
    }
    onSubmit(Math.round(value * 100) / 100, date || todayIso(), note.trim());
    setAmount("");
    setNote("");
  }

  return (
    <Dialog open={!!plan} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "in" ? "存入" : "取出"}
            {plan ? ` · ${plan.name}` : ""}
          </DialogTitle>
          <DialogDescription>
            {mode === "in"
              ? `把一笔${meta.name}放进这个目标。`
              : `从目标中取出一部分${meta.name}。`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ct-amount">金额</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-display text-lg text-muted">
                {meta.suffix ? meta.code : meta.symbol}
              </span>
              <Input
                id="ct-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 pl-12 font-display text-xl tabular-nums"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ct-date">日期</Label>
            <Input
              id="ct-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ct-note">备注</Label>
            <Input
              id="ct-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="可选"
            />
          </div>
          <Button
            type="submit"
            variant={mode === "out" ? "expense" : "default"}
            className="w-full"
          >
            确认
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
