import type { TxType } from "./types";

export const EXPENSE_CATEGORIES = [
  "餐饮",
  "交通",
  "住房",
  "购物",
  "娱乐",
  "医疗",
  "教育",
  "储蓄",
  "其他",
] as const;

export const INCOME_CATEGORIES = [
  "工资",
  "奖金",
  "投资",
  "兼职",
  "礼金",
  "其他",
] as const;

export const CATEGORY_COLOR_VARS: Record<string, string> = {
  餐饮: "var(--color-cat-food)",
  交通: "var(--color-cat-transit)",
  住房: "var(--color-cat-home)",
  购物: "var(--color-cat-shop)",
  娱乐: "var(--color-cat-play)",
  医疗: "var(--color-cat-med)",
  教育: "var(--color-cat-edu)",
  储蓄: "var(--color-cat-save)",
  其他: "var(--color-cat-other)",
  工资: "var(--color-cat-salary)",
  奖金: "var(--color-cat-bonus)",
  投资: "var(--color-cat-invest)",
  兼职: "var(--color-cat-side)",
  礼金: "var(--color-cat-gift)",
};

export function categoriesFor(type: TxType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function categoryColor(name: string): string {
  return CATEGORY_COLOR_VARS[name] ?? "var(--color-cat-other)";
}
