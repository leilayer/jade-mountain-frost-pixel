import type { CurrencyCode } from "./currency";
import type { Budget, SavingsPlan, Transaction, TxType } from "./types";
import { monthKey, pad2 } from "./format";

type TxDraft = {
  day: number;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  currency?: CurrencyCode;
};

const TX_TEMPLATE: TxDraft[] = [
  { day: 1, type: "expense", amount: 2800, category: "住房", note: "本月房租" },
  { day: 1, type: "expense", amount: 126.8, category: "餐饮", note: "周末超市采购" },
  { day: 2, type: "expense", amount: 50, category: "交通", note: "公交月票" },
  { day: 2, type: "expense", amount: 32, category: "餐饮", note: "午餐" },
  { day: 3, type: "expense", amount: 18, category: "餐饮", note: "食堂午餐", currency: "PLN" },
  { day: 3, type: "expense", amount: 68, category: "购物", note: "日用品" },
  { day: 4, type: "expense", amount: 45, category: "餐饮", note: "晚饭" },
  { day: 5, type: "income", amount: 12800, category: "工资", note: "本月工资" },
  { day: 5, type: "expense", amount: 22, category: "餐饮", note: "早餐" },
  { day: 6, type: "expense", amount: 36, category: "餐饮", note: "午餐" },
  { day: 6, type: "expense", amount: 80, category: "娱乐", note: "电影票" },
  { day: 7, type: "expense", amount: 158, category: "餐饮", note: "朋友聚餐" },
  { day: 8, type: "expense", amount: 4.6, category: "交通", note: "有轨电车", currency: "PLN" },
  { day: 8, type: "expense", amount: 41, category: "餐饮", note: "午餐" },
  { day: 9, type: "expense", amount: 126, category: "医疗", note: "药店" },
  { day: 10, type: "expense", amount: 39, category: "餐饮", note: "午餐" },
  { day: 10, type: "expense", amount: 239, category: "购物", note: "换季衣服" },
  { day: 11, type: "expense", amount: 33, category: "餐饮", note: "午餐" },
  { day: 12, type: "expense", amount: 99, category: "教育", note: "在线课程" },
  { day: 13, type: "expense", amount: 48, category: "餐饮", note: "晚饭" },
  { day: 14, type: "expense", amount: 26, category: "娱乐", note: "周末咖啡", currency: "EUR" },
  { day: 15, type: "income", amount: 800, category: "兼职", note: "周末翻译" },
  { day: 15, type: "expense", amount: 35, category: "娱乐", note: "咖啡店" },
  { day: 16, type: "expense", amount: 29, category: "餐饮", note: "午餐" },
  { day: 17, type: "expense", amount: 44, category: "餐饮", note: "晚饭" },
  { day: 18, type: "expense", amount: 12, category: "交通", note: "公交" },
  { day: 18, type: "expense", amount: 31, category: "餐饮", note: "午餐" },
  { day: 19, type: "expense", amount: 24.9, category: "购物", note: "书店", currency: "PLN" },
  { day: 20, type: "expense", amount: 27, category: "餐饮", note: "早餐" },
  { day: 21, type: "expense", amount: 62, category: "餐饮", note: "晚饭" },
  { day: 22, type: "expense", amount: 12.5, category: "餐饮", note: "欧元区午餐", currency: "EUR" },
  { day: 22, type: "expense", amount: 120, category: "娱乐", note: "展览门票" },
  { day: 23, type: "expense", amount: 28, category: "餐饮", note: "早餐" },
  { day: 23, type: "expense", amount: 46, category: "餐饮", note: "午餐" },
  { day: 23, type: "expense", amount: 16, category: "餐饮", note: "咖啡" },
  { day: 24, type: "expense", amount: 41, category: "餐饮", note: "午餐" },
  { day: 25, type: "expense", amount: 88, category: "购物", note: "水果零食" },
  { day: 26, type: "expense", amount: 34, category: "餐饮", note: "午餐" },
  { day: 27, type: "expense", amount: 19, category: "交通", note: "打车" },
  { day: 28, type: "expense", amount: 210, category: "餐饮", note: "家庭晚饭" },
];

function dateOf(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

export function buildSeed(now = new Date()): {
  transactions: Transaction[];
  budgets: Budget[];
  plans: SavingsPlan[];
} {
  const year = now.getFullYear();
  const monthIndex = now.getMonth();
  const today = now.getDate();
  const mk = monthKey(now);
  const last = new Date(year, monthIndex + 1, 0).getDate();

  const transactions: Transaction[] = TX_TEMPLATE.filter(
    (row) => row.day <= today && row.day <= last,
  ).map((row, i) => ({
    id: `seed-tx-${i + 1}`,
    type: row.type,
    amount: row.amount,
    currency: row.currency ?? "CNY",
    mapTo: row.currency && row.currency !== "CNY" ? "CNY" : undefined,
    category: row.category,
    date: dateOf(year, monthIndex, row.day),
    note: row.note,
    createdAt: Date.UTC(year, monthIndex, row.day, 8, i),
  }));

  const budgets: Budget[] = [
    { id: "seed-b-all", month: mk, category: "", amount: 7000, currency: "CNY" },
    { id: "seed-b-food", month: mk, category: "餐饮", amount: 1800, currency: "CNY" },
    { id: "seed-b-transit", month: mk, category: "交通", amount: 400, currency: "CNY" },
    { id: "seed-b-home", month: mk, category: "住房", amount: 2800, currency: "CNY" },
    { id: "seed-b-shop", month: mk, category: "购物", amount: 800, currency: "CNY" },
    { id: "seed-b-play", month: mk, category: "娱乐", amount: 400, currency: "CNY" },
    { id: "seed-b-med", month: mk, category: "医疗", amount: 200, currency: "CNY" },
    { id: "seed-b-edu", month: mk, category: "教育", amount: 150, currency: "CNY" },
  ];

  const deadlineYear = monthIndex >= 8 ? year + 1 : year;
  const plans: SavingsPlan[] = [
    {
      id: "seed-plan-emergency",
      name: "应急储备",
      target: 20000,
      currency: "CNY",
      deadline: `${deadlineYear}-12-31`,
      note: "至少覆盖三个月开销",
      createdAt: Date.UTC(year, 0, 8),
      contributions: [
        {
          id: "seed-c1",
          amount: 2000,
          date: dateOf(year, Math.max(0, monthIndex - 2), 8),
          note: "开户转入",
        },
        {
          id: "seed-c2",
          amount: 1500,
          date: dateOf(year, Math.max(0, monthIndex - 1), 10),
          note: "月度存入",
        },
        {
          id: "seed-c3",
          amount: 2000,
          date: dateOf(year, monthIndex, Math.min(5, today)),
          note: "工资日存入",
        },
        {
          id: "seed-c4",
          amount: 1000,
          date: dateOf(year, monthIndex, Math.min(15, today)),
          note: "兼职结余",
        },
      ],
    },
    {
      id: "seed-plan-trip",
      name: "冬季旅行",
      target: 1500,
      currency: "EUR",
      deadline: `${deadlineYear}-12-15`,
      note: "机票与住宿",
      createdAt: Date.UTC(year, Math.max(0, monthIndex - 3), 1),
      contributions: [
        {
          id: "seed-t1",
          amount: 200,
          date: dateOf(year, Math.max(0, monthIndex - 2), 20),
          note: "",
        },
        {
          id: "seed-t2",
          amount: 200,
          date: dateOf(year, Math.max(0, monthIndex - 1), 20),
          note: "",
        },
        {
          id: "seed-t3",
          amount: 200,
          date: dateOf(year, monthIndex, Math.min(20, today)),
          note: "",
        },
      ],
    },
  ];

  return { transactions, budgets, plans };
}
