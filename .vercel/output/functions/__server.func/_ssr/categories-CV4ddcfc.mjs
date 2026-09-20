//#region node_modules/.nitro/vite/services/ssr/assets/categories-CV4ddcfc.js
var CURRENCIES = [
	{
		code: "CNY",
		name: "人民币",
		symbol: "¥",
		suffix: false,
		digits: 2
	},
	{
		code: "PLN",
		name: "兹罗提",
		symbol: "zł",
		suffix: true,
		digits: 2
	},
	{
		code: "EUR",
		name: "欧元",
		symbol: "€",
		suffix: false,
		digits: 2
	},
	{
		code: "USD",
		name: "美元",
		symbol: "$",
		suffix: false,
		digits: 2
	},
	{
		code: "GBP",
		name: "英镑",
		symbol: "£",
		suffix: false,
		digits: 2
	},
	{
		code: "JPY",
		name: "日元",
		symbol: "¥",
		suffix: false,
		digits: 0
	},
	{
		code: "HKD",
		name: "港币",
		symbol: "HK$",
		suffix: false,
		digits: 2
	}
];
/** 1 单位该币 = 多少人民币，可在账本里改。 */
var DEFAULT_RATES = {
	CNY: 1,
	PLN: 1.85,
	EUR: 8.2,
	USD: 7.25,
	GBP: 9.7,
	JPY: .049,
	HKD: .93
};
function isCurrency(value) {
	return CURRENCIES.some((c) => c.code === value);
}
function asCurrency(value) {
	return isCurrency(value) ? value : "CNY";
}
function currencyMeta(code) {
	return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}
function convert(amount, from, to, rates = DEFAULT_RATES) {
	if (from === to) return amount;
	const a = rates[from] ?? DEFAULT_RATES[from];
	const b = rates[to] ?? DEFAULT_RATES[to];
	if (!b) return 0;
	return amount * a / b;
}
function formatMoney(amount, currency = "CNY", opts) {
	const meta = currencyMeta(currency);
	const sign = amount < 0 ? "-" : opts?.signed && amount > 0 ? "+" : "";
	const body = Math.abs(amount).toLocaleString("zh-CN", {
		minimumFractionDigits: meta.digits,
		maximumFractionDigits: meta.digits
	});
	if (meta.suffix) return `${sign}${body} ${meta.symbol}`;
	return `${sign}${meta.symbol}${body}`;
}
function mergeRates(input) {
	return {
		...DEFAULT_RATES,
		...input ?? {}
	};
}
var EXPENSE_CATEGORIES = [
	"餐饮",
	"交通",
	"住房",
	"购物",
	"娱乐",
	"医疗",
	"教育",
	"储蓄",
	"其他"
];
var INCOME_CATEGORIES = [
	"工资",
	"奖金",
	"投资",
	"兼职",
	"礼金",
	"其他"
];
var CATEGORY_COLOR_VARS = {
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
	礼金: "var(--color-cat-gift)"
};
function categoriesFor(type) {
	return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
function categoryColor(name) {
	return CATEGORY_COLOR_VARS[name] ?? "var(--color-cat-other)";
}
//#endregion
export { asCurrency as a, convert as c, mergeRates as d, INCOME_CATEGORIES as i, currencyMeta as l, DEFAULT_RATES as n, categoriesFor as o, EXPENSE_CATEGORIES as r, categoryColor as s, CURRENCIES as t, formatMoney as u };
