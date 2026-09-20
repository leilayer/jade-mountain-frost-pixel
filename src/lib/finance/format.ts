import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

const CN_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const CN_MONTHS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

export function todayIso(now = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

export function monthKey(isoOrDate: string | Date): string {
  if (typeof isoOrDate === "string") return isoOrDate.slice(0, 7);
  return format(isoOrDate, "yyyy-MM");
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function yearToCn(year: number): string {
  return String(year)
    .split("")
    .map((d) => CN_DIGITS[Number(d)] ?? d)
    .join("");
}

export function monthHeading(isoMonth: string): string {
  const [ys, ms] = isoMonth.split("-");
  const y = Number(ys);
  const m = Number(ms) - 1;
  return `${yearToCn(y)}年${CN_MONTHS[m] ?? `${m + 1}月`}`;
}

export { formatMoney } from "./currency";

export function formatDayLabel(iso: string): string {
  return format(parseISO(iso), "M月d日 EEEE", { locale: zhCN });
}

export function formatShortDay(iso: string): string {
  return format(parseISO(iso), "M月d日", { locale: zhCN });
}

export function clampDay(year: number, monthIndex: number, day: number): string {
  const last = new Date(year, monthIndex + 1, 0).getDate();
  const d = Math.min(Math.max(1, day), last);
  return `${year}-${pad2(monthIndex + 1)}-${pad2(d)}`;
}
