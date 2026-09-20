import { a as asCurrency, c as convert, s as categoryColor } from "./categories-CV4ddcfc.mjs";
import { h as monthKey } from "./router-BdC77IrE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/selectors-lZD-dVug.js
function txAmount(tx, fx) {
	return convert(tx.amount, asCurrency(tx.currency), fx.base, fx.rates);
}
function txsOnDay(txs, iso) {
	return txs.filter((t) => t.date === iso);
}
function txsInMonth(txs, month) {
	return txs.filter((t) => monthKey(t.date) === month);
}
function sumByType(txs, type, fx) {
	return txs.filter((t) => t.type === type).reduce((acc, t) => acc + txAmount(t, fx), 0);
}
function netOf(txs, fx) {
	return sumByType(txs, "income", fx) - sumByType(txs, "expense", fx);
}
function categorySlices(txs, type, fx) {
	const map = /* @__PURE__ */ new Map();
	for (const t of txs) {
		if (t.type !== type) continue;
		map.set(t.category, (map.get(t.category) ?? 0) + txAmount(t, fx));
	}
	return [...map.entries()].map(([name, value]) => ({
		name,
		value,
		color: categoryColor(name)
	})).sort((a, b) => b.value - a.value);
}
function dayTotals(txs, fx) {
	const map = /* @__PURE__ */ new Map();
	for (const t of txs) {
		const cur = map.get(t.date) ?? {
			income: 0,
			expense: 0
		};
		const value = txAmount(t, fx);
		if (t.type === "income") cur.income += value;
		else cur.expense += value;
		map.set(t.date, cur);
	}
	return map;
}
function overallBudget(budgets, month) {
	return budgets.find((b) => b.month === month && b.category === "");
}
function categoryBudgets(budgets, month) {
	return budgets.filter((b) => b.month === month && b.category !== "");
}
function spentInCategory(txs, month, category, fx) {
	return txs.filter((t) => t.type === "expense" && monthKey(t.date) === month && (category === "" || t.category === category)).reduce((acc, t) => acc + txAmount(t, fx), 0);
}
function spentAgainstBudget(txs, budget, rates) {
	return spentInCategory(txs, budget.month, budget.category, {
		base: asCurrency(budget.currency),
		rates
	});
}
function planBalance(plan) {
	return plan.contributions.reduce((acc, c) => acc + c.amount, 0);
}
function monthsRemaining(deadline, now = /* @__PURE__ */ new Date()) {
	if (!deadline) return 0;
	const end = /* @__PURE__ */ new Date(`${deadline}T00:00:00`);
	const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()) + (end.getDate() >= now.getDate() ? 0 : -1);
	return Math.max(0, months);
}
//#endregion
export { netOf as a, spentAgainstBudget as c, txsInMonth as d, txsOnDay as f, monthsRemaining as i, spentInCategory as l, categorySlices as n, overallBudget as o, dayTotals as r, planBalance as s, categoryBudgets as t, sumByType as u };
