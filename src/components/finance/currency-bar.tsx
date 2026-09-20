import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CURRENCIES,
  convert,
  currencyMeta,
  type CurrencyCode,
} from "@/lib/finance/currency";
import { useFinanceStore } from "@/lib/finance/store";
import { cn } from "@/lib/utils";

export function CurrencyChips({
  value,
  onChange,
  named = false,
}: {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  named?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          type="button"
          title={c.name}
          onClick={() => onChange(c.code)}
          className={cn(
            "h-9 rounded-full px-3 text-sm tabular-nums transition-colors duration-150",
            value === c.code
              ? "bg-primary text-primary-fg"
              : "bg-surface-2 text-muted hover:text-fg",
          )}
        >
          {c.code}
          {named ? <span className="ml-1 text-xs opacity-70">{c.name}</span> : null}
        </button>
      ))}
    </div>
  );
}

const CHIP = {
  on: "bg-primary text-primary-fg",
  off: "bg-surface-2 text-muted hover:text-fg",
};

export function MapCurrencyChips({
  payment,
  value,
  onChange,
}: {
  payment: CurrencyCode;
  value: CurrencyCode | null;
  onChange: (code: CurrencyCode | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "h-9 rounded-full px-3 text-sm transition-colors duration-150",
          value == null ? CHIP.on : CHIP.off,
        )}
      >
        不映射
      </button>
      {CURRENCIES.filter((c) => c.code !== payment).map((c) => (
        <button
          key={c.code}
          type="button"
          title={c.name}
          onClick={() => onChange(c.code)}
          className={cn(
            "h-9 rounded-full px-3 text-sm tabular-nums transition-colors duration-150",
            value === c.code ? CHIP.on : CHIP.off,
          )}
        >
          {c.code}
        </button>
      ))}
    </div>
  );
}

export function CurrencyBar({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const base = useFinanceStore((s) => s.baseCurrency);
  const setBase = useFinanceStore((s) => s.setBaseCurrency);
  const [open, setOpen] = useState(false);
  const meta = currencyMeta(base);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "h-11 rounded-full bg-surface-2 px-3 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2/80",
          compact && "min-w-11 px-2.5",
          className,
        )}
        aria-label="结算货币与汇率"
      >
        {meta.code}
        {compact ? null : <span className="ml-1.5 text-muted">{meta.name}</span>}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90dvh,36rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>结算货币</DialogTitle>
            <DialogDescription>
              总览、日历和扇形图按结算货币汇总。每笔记账仍保留原币种。
            </DialogDescription>
          </DialogHeader>
          <CurrencyChips value={base} onChange={setBase} named />
          <RatesForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

function RatesForm() {
  const base = useFinanceStore((s) => s.baseCurrency);
  const rates = useFinanceStore((s) => s.rates);
  const setRate = useFinanceStore((s) => s.setRate);
  const others = CURRENCIES.filter((c) => c.code !== base);
  const baseName = currencyMeta(base).name;

  const display = useMemo(() => {
    const map: Partial<Record<CurrencyCode, string>> = {};
    for (const c of CURRENCIES) {
      if (c.code === base) continue;
      map[c.code] = formatRateInput(convert(1, c.code, base, rates));
    }
    return map;
  }, [base, rates]);

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium text-muted">参考汇率（可改）</p>
      {others.map((c) => (
        <div key={c.code} className="grid gap-1.5">
          <Label htmlFor={`rate-${c.code}`}>
            1 {c.name} = ? {baseName}
          </Label>
          <Input
            id={`rate-${c.code}`}
            inputMode="decimal"
            defaultValue={display[c.code]}
            key={`${base}-${c.code}-${rates[c.code]}`}
            onBlur={(e) => {
              const n = Number(e.target.value);
              if (!Number.isFinite(n) || n <= 0) return;
              const valueInCny = convert(n, base, "CNY", rates);
              setRate(c.code, valueInCny);
            }}
            className="tabular-nums"
          />
        </div>
      ))}
      <p className="text-xs text-subtle">
        汇率按 1 外币兑人民币换算存储，离线可用。切换结算货币时会自动折算显示。
      </p>
    </div>
  );
}

function formatRateInput(n: number): string {
  if (n >= 100) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(4);
}
