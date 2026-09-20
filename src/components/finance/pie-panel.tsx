import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney, type CurrencyCode } from "@/lib/finance/currency";
import type { CategorySlice } from "@/lib/finance/selectors";
import type { TxType } from "@/lib/finance/types";
import { cn } from "@/lib/utils";

type TooltipPayload = {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  currency: CurrencyCode;
};

function ChartTooltip({ active, payload, currency }: TooltipPayload) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0];
  return (
    <div className="rounded-md bg-surface px-3 py-2 text-sm shadow-[var(--shadow-border)]">
      <div className="text-muted">{item.name}</div>
      <div className="tabular-nums font-medium">
        {formatMoney(item.value, currency)}
      </div>
    </div>
  );
}

function Donut({
  data,
  currency,
}: {
  data: CategorySlice[];
  currency: CurrencyCode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (!mounted) {
    return <div className="mx-auto size-40 rounded-full bg-surface-2" />;
  }

  if (total <= 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-1">
        <div className="size-24 rounded-full border border-dashed border-border" />
        <p className="text-xs text-subtle">暂无记录</p>
      </div>
    );
  }

  return (
    <div className="mx-auto h-40 w-full max-w-xs">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={46}
            outerRadius={68}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as TooltipPayload["payload"]}
                currency={currency}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PiePanel({
  title,
  subtitle,
  income,
  expense,
  currency,
  className,
}: {
  title: string;
  subtitle?: string;
  income: CategorySlice[];
  expense: CategorySlice[];
  currency: CurrencyCode;
  className?: string;
}) {
  const [type, setType] = useState<TxType>("expense");
  const data = type === "expense" ? expense : income;
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <section
      className={cn(
        "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-medium tracking-tight">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-xs text-muted">{subtitle}</p>
          ) : null}
        </div>
        <Tabs
          value={type}
          onValueChange={(v) => setType(v as TxType)}
          className="w-auto"
        >
          <TabsList className="h-9">
            <TabsTrigger value="expense" className="h-7 px-2.5 text-xs">
              支出
            </TabsTrigger>
            <TabsTrigger value="income" className="h-7 px-2.5 text-xs">
              收入
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Donut data={data} currency={currency} />
      <p className="mt-1 text-center font-display text-lg tabular-nums tracking-tight">
        {total > 0 ? formatMoney(total, currency) : "—"}
      </p>
      <ul className="mt-3 space-y-1.5">
        {data.slice(0, 5).map((slice) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <li
              key={slice.name}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: slice.color }}
                aria-hidden
              />
              <span className="flex-1 text-muted">{slice.name}</span>
              <span className="tabular-nums text-subtle">{pct}%</span>
              <span className="w-28 text-right tabular-nums">
                {formatMoney(slice.value, currency)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
