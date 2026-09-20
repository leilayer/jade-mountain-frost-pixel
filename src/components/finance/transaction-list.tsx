import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { asCurrency, convert, formatMoney } from "@/lib/finance/currency";
import { formatShortDay } from "@/lib/finance/format";
import type { Transaction } from "@/lib/finance/types";
import { useFinanceStore, useUiStore } from "@/lib/finance/store";
import { cn } from "@/lib/utils";

export function TransactionList({
  items,
  onDelete,
  empty,
  showDate = true,
}: {
  items: Transaction[];
  onDelete: (id: string) => void;
  empty: string;
  showDate?: boolean;
}) {
  const openEdit = useUiStore((s) => s.openEdit);
  const rates = useFinanceStore((s) => s.rates);

  if (items.length === 0) {
    return (
      <p className="rounded-lg bg-surface-2/60 px-4 py-8 text-center text-sm text-muted">
        {empty}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      {items.map((tx) => {
        const code = asCurrency(tx.currency);
        const original = formatMoney(tx.amount, code);
        const mapTo =
          tx.mapTo && asCurrency(tx.mapTo) !== code
            ? asCurrency(tx.mapTo)
            : null;
        const mapped =
          mapTo != null
            ? formatMoney(convert(tx.amount, code, mapTo, rates), mapTo)
            : null;
        return (
          <li
            key={tx.id}
            className="flex items-center gap-3 px-3 py-2.5 sm:px-4"
          >
            <div
              className={cn(
                "size-2 shrink-0 rounded-full",
                tx.type === "income" ? "bg-income" : "bg-expense",
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">
                  {tx.note || tx.merchant || tx.category}
                </span>
                <Badge variant={tx.type === "income" ? "income" : "expense"}>
                  {tx.category}
                </Badge>
                {tx.source === "receipt" ? (
                  <Badge variant="primary">收据</Badge>
                ) : null}
              </div>
              <p className="text-xs text-subtle">
                {showDate ? `${formatShortDay(tx.date)} · ` : ""}
                {code}
              </p>
            </div>
            <div
              className={cn(
                "shrink-0 text-right font-display text-sm tabular-nums",
                tx.type === "income" ? "text-income" : "text-expense",
              )}
            >
              <div>
                {tx.type === "income" ? "+" : "−"}
                {original}
              </div>
              {mapped ? (
                <div className="text-xs font-sans font-normal text-subtle">
                  {mapped}
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="size-10"
                aria-label="编辑"
                onClick={() => openEdit(tx.id)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 text-muted hover:text-expense"
                aria-label="删除"
                onClick={() => onDelete(tx.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
