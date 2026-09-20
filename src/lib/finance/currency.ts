export const CURRENCIES = [
  { code: "CNY", name: "人民币", symbol: "¥", suffix: false, digits: 2 },
  { code: "PLN", name: "兹罗提", symbol: "zł", suffix: true, digits: 2 },
  { code: "EUR", name: "欧元", symbol: "€", suffix: false, digits: 2 },
  { code: "USD", name: "美元", symbol: "$", suffix: false, digits: 2 },
  { code: "GBP", name: "英镑", symbol: "£", suffix: false, digits: 2 },
  { code: "JPY", name: "日元", symbol: "¥", suffix: false, digits: 0 },
  { code: "HKD", name: "港币", symbol: "HK$", suffix: false, digits: 2 },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export type RateTable = Record<CurrencyCode, number>;

/** 1 单位该币 = 多少人民币，可在账本里改。 */
export const DEFAULT_RATES: RateTable = {
  CNY: 1,
  PLN: 1.85,
  EUR: 8.2,
  USD: 7.25,
  GBP: 9.7,
  JPY: 0.049,
  HKD: 0.93,
};

export function isCurrency(value: string | undefined): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value);
}

export function asCurrency(value: string | undefined): CurrencyCode {
  return isCurrency(value) ? value : "CNY";
}

export function currencyMeta(code: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Partial<RateTable> = DEFAULT_RATES,
): number {
  if (from === to) return amount;
  const a = rates[from] ?? DEFAULT_RATES[from];
  const b = rates[to] ?? DEFAULT_RATES[to];
  if (!b) return 0;
  return (amount * a) / b;
}

export function formatMoney(
  amount: number,
  currency: CurrencyCode = "CNY",
  opts?: { signed?: boolean },
): string {
  const meta = currencyMeta(currency);
  const sign = amount < 0 ? "-" : opts?.signed && amount > 0 ? "+" : "";
  const abs = Math.abs(amount);
  const body = abs.toLocaleString("zh-CN", {
    minimumFractionDigits: meta.digits,
    maximumFractionDigits: meta.digits,
  });
  if (meta.suffix) return `${sign}${body} ${meta.symbol}`;
  return `${sign}${meta.symbol}${body}`;
}

export function mergeRates(input?: Partial<RateTable> | null): RateTable {
  return { ...DEFAULT_RATES, ...(input ?? {}) };
}
