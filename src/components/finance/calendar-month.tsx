import { addMonths, format, startOfMonth } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { todayIso } from "@/lib/finance/format";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function startOfGrid(monthDate: Date): Date {
  const start = startOfMonth(monthDate);
  const dow = (start.getDay() + 6) % 7;
  const grid = new Date(start);
  grid.setDate(start.getDate() - dow);
  grid.setHours(0, 0, 0, 0);
  return grid;
}

export type DayMoney = { income: number; expense: number };

export function CalendarMonth({
  month,
  onMonthChange,
  selected,
  onSelect,
  totals,
}: {
  month: Date;
  onMonthChange: (d: Date) => void;
  selected: string;
  onSelect: (iso: string) => void;
  totals: Map<string, DayMoney>;
}) {
  const today = todayIso();
  const cells: Date[] = [];
  const cursor = startOfGrid(month);
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  let max = 0;
  for (const v of totals.values()) {
    max = Math.max(max, v.income, v.expense);
  }

  const monthIndex = month.getMonth();

  return (
    <section className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          aria-label="上个月"
          onClick={() => onMonthChange(addMonths(month, -1))}
        >
          <ChevronLeft />
        </Button>
        <h2 className="font-display text-lg font-medium tracking-tight">
          {format(month, "yyyy年M月", { locale: zhCN })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          aria-label="下个月"
          onClick={() => onMonthChange(addMonths(month, 1))}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-subtle">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const inMonth = day.getMonth() === monthIndex;
          const money = totals.get(iso) ?? { income: 0, expense: 0 };
          const has = money.income > 0 || money.expense > 0;
          const incH =
            money.income > 0 && max > 0
              ? 30 + (Math.log(1 + money.income) / Math.log(1 + max)) * 70
              : 0;
          const expH =
            money.expense > 0 && max > 0
              ? 30 + (Math.log(1 + money.expense) / Math.log(1 + max)) * 70
              : 0;
          const isSelected = iso === selected;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              aria-label={`${format(day, "M月d日")} 收入${money.income} 支出${money.expense}`}
              aria-pressed={isSelected}
              className={cn(
                "flex min-h-16 flex-col items-center rounded-md px-0.5 py-1 transition-colors duration-150 sm:min-h-20",
                inMonth ? "text-fg" : "text-subtle/50",
                isSelected && "bg-primary/10 text-fg",
                !isSelected && inMonth && "hover:bg-surface-2",
                isToday && !isSelected && "ring-1 ring-primary/40",
              )}
            >
              <span
                className={cn(
                  "text-xs tabular-nums",
                  isToday && "font-semibold text-primary",
                )}
              >
                {day.getDate()}
              </span>
              <div className="mt-0.5 flex h-7 w-full items-end justify-center gap-0.5 sm:h-8">
                {has ? (
                  <>
                    <span
                      className="w-2 rounded-sm bg-income/85"
                      style={{ height: `${incH}%` }}
                    />
                    <span
                      className="w-2 rounded-sm bg-expense/85"
                      style={{ height: `${expH}%` }}
                    />
                  </>
                ) : (
                  <span className="h-0.5 w-3 rounded-full bg-border" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-1.5 rounded-sm bg-income/80" />
          收入
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-1.5 rounded-sm bg-expense/80" />
          支出
        </span>
      </div>
    </section>
  );
}
