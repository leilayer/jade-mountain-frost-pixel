import { u as formatMoney } from "./categories-CV4ddcfc.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFinanceStore, d as cn, g as todayIso, h as monthKey, m as monthHeading, u as Button, v as useFx, y as useUiStore } from "./router-BdC77IrE.mjs";
import { a as netOf, d as txsInMonth, f as txsOnDay, n as categorySlices, u as sumByType } from "./selectors-lZD-dVug.mjs";
import { n as TransactionList, t as PiePanel } from "./transaction-list-CI-O1J_-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CdWauhhk.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const transactions = useFinanceStore((s) => s.transactions);
	const isDemo = useFinanceStore((s) => s.isDemo);
	const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
	const clearAll = useFinanceStore((s) => s.clearAll);
	const loadSeed = useFinanceStore((s) => s.loadSeed);
	const openCreate = useUiStore((s) => s.openCreate);
	const openScan = useUiStore((s) => s.openScan);
	const fx = useFx();
	const today = todayIso();
	const month = monthKey(today);
	const monthTx = txsInMonth(transactions, month);
	const todayTx = txsOnDay(transactions, today);
	const income = sumByType(monthTx, "income", fx);
	const expense = sumByType(monthTx, "expense", fx);
	const net = netOf(monthTx, fx);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-widest text-subtle uppercase",
					children: monthHeading(month)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "本月结余"
				})] }), isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "示例账本，改动后会变成你的记录"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("font-display text-4xl tabular-nums tracking-tight sm:text-5xl", net < 0 ? "text-expense" : "text-fg"),
					children: formatMoney(net, fx.base, { signed: true })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "收入",
						value: formatMoney(income, fx.base),
						tone: "income"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "支出",
						value: formatMoney(expense, fx.base),
						tone: "expense"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => openScan(),
				className: "flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)] transition-colors duration-150 hover:bg-surface-2/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "扫描收据入账"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-primary",
					children: "去拍照"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiePanel, {
					title: "今日分类",
					subtitle: "按当天自动汇总",
					currency: fx.base,
					expense: categorySlices(todayTx, "expense", fx),
					income: categorySlices(todayTx, "income", fx)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiePanel, {
					title: "本月分类",
					subtitle: "整月收支构成",
					currency: fx.base,
					expense: categorySlices(monthTx, "expense", fx),
					income: categorySlices(monthTx, "income", fx)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: "最近记账"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => openScan(),
							children: "扫收据"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => openCreate(),
							children: "记一笔"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionList, {
					items: [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).slice(0, 12),
					onDelete: (id) => {
						deleteTransaction(id);
						toast.success("已删除");
					},
					empty: "还没有记账。点右上角记一笔，扇形图会跟着生成。"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2 pb-2 text-xs text-subtle",
				children: isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "underline-offset-2 hover:text-fg hover:underline",
					onClick: () => {
						clearAll();
						toast.success("已清空，开始自己记账");
					},
					children: "清空示例，开始自己记账"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "underline-offset-2 hover:text-fg hover:underline",
					onClick: () => {
						loadSeed();
						toast.success("已恢复示例账本");
					},
					children: "恢复示例账本"
				})
			})
		]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface-2/70 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-display text-xl tabular-nums tracking-tight", tone === "income" ? "text-income" : "text-expense"),
			children: value
		})]
	});
}
//#endregion
export { Home as component };
