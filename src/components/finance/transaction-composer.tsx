import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CurrencyChips, MapCurrencyChips } from "@/components/finance/currency-bar";
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
import { categoriesFor } from "@/lib/finance/categories";
import {
  convert,
  currencyMeta,
  formatMoney,
  type CurrencyCode,
} from "@/lib/finance/currency";
import { todayIso } from "@/lib/finance/format";
import { useFinanceStore, useUiStore } from "@/lib/finance/store";
import type { TxType } from "@/lib/finance/types";
import { cn } from "@/lib/utils";

export function TransactionComposer() {
  const { composerOpen, editingId, defaultDate, defaultType, closeComposer, openScan } =
    useUiStore();
  const transactions = useFinanceStore((s) => s.transactions);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const baseCurrency = useFinanceStore((s) => s.baseCurrency);
  const rates = useFinanceStore((s) => s.rates);

  const editing = useMemo(
    () => transactions.find((t) => t.id === editingId) ?? null,
    [transactions, editingId],
  );

  const [type, setType] = useState<TxType>(defaultType);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(baseCurrency);
  const [mapTo, setMapTo] = useState<CurrencyCode | null>(null);
  const [category, setCategory] = useState(categoriesFor(defaultType)[0]);
  const [date, setDate] = useState(defaultDate);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!composerOpen) return;
    if (editing) {
      setType(editing.type);
      setAmount(String(editing.amount));
      setCurrency(editing.currency);
      setMapTo(
        editing.mapTo && editing.mapTo !== editing.currency
          ? editing.mapTo
          : null,
      );
      setCategory(editing.category);
      setDate(editing.date);
      setNote(editing.note);
      return;
    }
    setType(defaultType);
    setAmount("");
    setCurrency(baseCurrency);
    setMapTo(baseCurrency === "CNY" ? null : "CNY");
    setCategory(categoriesFor(defaultType)[0]);
    setDate(defaultDate || todayIso());
    setNote("");
  }, [composerOpen, editing, defaultDate, defaultType, baseCurrency]);

  useEffect(() => {
    const list = categoriesFor(type);
    if (!list.includes(category as (typeof list)[number])) {
      setCategory(list[0]);
    }
  }, [type, category]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("请输入大于 0 的金额");
      return;
    }
    const payload = {
      type,
      amount: Math.round(value * 100) / 100,
      currency,
      mapTo: mapTo && mapTo !== currency ? mapTo : undefined,
      category,
      date: date || todayIso(),
      note: note.trim(),
    };
    if (editing) {
      updateTransaction(editing.id, payload);
      toast.success("已更新记账");
    } else {
      addTransaction(payload);
      toast.success(type === "expense" ? "已记下支出" : "已记下收入");
    }
    closeComposer();
  }

  const cats = categoriesFor(type);
  const meta = currencyMeta(currency);
  const parsed = Number(amount);
  const converted =
    Number.isFinite(parsed) && parsed > 0 && mapTo && mapTo !== currency
      ? convert(parsed, currency, mapTo, rates)
      : null;

  return (
    <Dialog open={composerOpen} onOpenChange={(o) => !o && closeComposer()}>
      <DialogContent className="max-h-[min(90dvh,40rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "编辑记账" : "记一笔"}</DialogTitle>
          <DialogDescription>
            {editing ? "修改金额、币种、分类或备注。" : "记下今天的一笔收入或支出。"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {editing ? null : (
            <button
              type="button"
              onClick={() => openScan()}
              className="h-11 rounded-lg bg-surface-2 px-3 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2/80"
            >
              拍小票或选截图，自动识别入账
            </button>
          )}
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors duration-150",
                type === "expense"
                  ? "bg-surface text-expense shadow-[var(--shadow-border)]"
                  : "text-muted",
              )}
            >
              支出
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors duration-150",
                type === "income"
                  ? "bg-surface text-income shadow-[var(--shadow-border)]"
                  : "text-muted",
              )}
            >
              收入
            </button>
          </div>
          <div className="grid gap-1.5">
            <Label>币种</Label>
            <CurrencyChips
              value={currency}
              onChange={(code) => {
                setCurrency(code);
                setMapTo((prev) => {
                  if (prev === code) return code === "CNY" ? null : "CNY";
                  if (code !== "CNY" && prev == null) return "CNY";
                  if (code === "CNY" && prev === "CNY") return null;
                  return prev;
                });
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>映射货币</Label>
            <MapCurrencyChips
              payment={currency}
              value={mapTo}
              onChange={setMapTo}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="amount">金额</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-display text-lg text-muted">
                {meta.suffix ? meta.code : meta.symbol}
              </span>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-14 pl-12 font-display text-2xl tabular-nums"
                autoFocus
              />
            </div>
            {converted != null && mapTo ? (
              <p className="text-xs text-muted">
                约合 {formatMoney(converted, mapTo)}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label>分类</Label>
            <div className="flex flex-wrap gap-1.5">
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "h-9 rounded-full px-3 text-sm transition-colors duration-150",
                    category === c
                      ? "bg-primary text-primary-fg"
                      : "bg-surface-2 text-muted hover:text-fg",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="date">日期</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="note">备注</Label>
            <Input
              id="note"
              placeholder="可选，例如午餐、房租"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={40}
            />
          </div>
          <Button
            type="submit"
            variant={type === "expense" ? "expense" : "income"}
            className="mt-1 w-full"
          >
            {editing ? "保存修改" : "记入账本"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
