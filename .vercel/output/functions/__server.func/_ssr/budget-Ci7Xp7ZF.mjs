import { i as __toESM } from "../_runtime.mjs";
import { a as asCurrency, l as currencyMeta, r as EXPENSE_CATEGORIES, u as formatMoney } from "./categories-CV4ddcfc.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as addMonths, r as format, t as zhCN } from "../_libs/date-fns.mjs";
import { f as ChevronRight, i as Trash2, p as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFinanceStore, a as Dialog, c as DialogHeader, d as cn, h as monthKey, i as Input, l as DialogTitle, n as CurrencyChips, o as DialogContent, r as Label, s as DialogDescription, u as Button } from "./router-BdC77IrE.mjs";
import { t as Progress } from "./progress-Cvxg30WZ.mjs";
import { c as spentAgainstBudget, l as spentInCategory, o as overallBudget, t as categoryBudgets } from "./selectors-lZD-dVug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/budget-Ci7Xp7ZF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BudgetPage() {
	const [monthDate, setMonthDate] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const month = monthKey(monthDate);
	const transactions = useFinanceStore((s) => s.transactions);
	const budgets = useFinanceStore((s) => s.budgets);
	const rates = useFinanceStore((s) => s.rates);
	const baseCurrency = useFinanceStore((s) => s.baseCurrency);
	const upsertBudget = useFinanceStore((s) => s.upsertBudget);
	const deleteBudget = useFinanceStore((s) => s.deleteBudget);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [cat, setCat] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)(baseCurrency);
	const overall = overallBudget(budgets, month);
	const cats = categoryBudgets(budgets, month);
	const overallCode = asCurrency(overall?.currency ?? baseCurrency);
	const spentAll = overall ? spentAgainstBudget(transactions, overall, rates) : spentInCategory(transactions, month, "", {
		base: baseCurrency,
		rates
	});
	const overallLimit = overall?.amount ?? 0;
	const rows = (0, import_react.useMemo)(() => {
		return cats.map((b) => {
			const spent = spentAgainstBudget(transactions, b, rates);
			return {
				...b,
				spent,
				ratio: b.amount > 0 ? spent / b.amount : 0
			};
		}).sort((a, b) => b.ratio - a.ratio);
	}, [
		cats,
		transactions,
		month,
		rates
	]);
	function submit(e) {
		e.preventDefault();
		const value = Number(amount);
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("请输入有效预算金额");
			return;
		}
		upsertBudget(month, cat, Math.round(value * 100) / 100, currency);
		toast.success(cat ? `已设置${cat}预算` : "已设置总预算");
		setOpen(false);
		setAmount("");
	}
	const overallRatio = overallLimit > 0 ? spentAll / overallLimit : 0;
	function openEditor(nextCat, existingAmount, existingCurrency) {
		setCat(nextCat);
		setAmount(existingAmount ? String(existingAmount) : "");
		setCurrency(existingCurrency ?? baseCurrency);
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "预算"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "每条预算可自选币种，支出会折算后对照进度。"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "上个月",
							onClick: () => setMonthDate(addMonths(monthDate, -1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-24 text-center font-medium",
							children: format(monthDate, "yyyy年M月", { locale: zhCN })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "下个月",
							onClick: () => setMonthDate(addMonths(monthDate, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["本月总预算", overall ? ` · ${currencyMeta(overallCode).name}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums tracking-tight",
						children: overallLimit > 0 ? formatMoney(overallLimit, overallCode) : "未设置"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => openEditor("", overall?.amount, overall?.currency),
						children: overall ? "调整总预算" : "设置总预算"
					})]
				}), overallLimit > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: Math.min(100, overallRatio * 100),
						indicatorClassName: overallRatio > 1 ? "bg-expense" : "bg-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: ["已用 ", formatMoney(spentAll, overallCode)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(overallRatio > 1 ? "text-expense" : "text-fg"),
							children: overallRatio > 1 ? `超支 ${formatMoney(spentAll - overallLimit, overallCode)}` : `剩余 ${formatMoney(overallLimit - spentAll, overallCode)}`
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "设一个总限额，日常支出会自动对照进度。"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: "分类预算"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => openEditor("餐饮"),
						children: "添加分类"
					})]
				}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted shadow-[var(--shadow-border)]",
					children: "还没有分类预算。可以为餐饮、交通等分别设限额。"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-w-0 flex-1 text-left",
								onClick: () => openEditor(row.category, row.amount, row.currency),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [row.category, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-xs font-normal text-subtle",
										children: asCurrency(row.currency)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										formatMoney(row.spent, asCurrency(row.currency)),
										" /",
										" ",
										formatMoney(row.amount, asCurrency(row.currency))
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("text-sm tabular-nums", row.ratio > 1 ? "text-expense" : "text-muted"),
									children: [Math.round(row.ratio * 100), "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-10 text-muted hover:text-expense",
									"aria-label": `删除${row.category}预算`,
									onClick: () => {
										deleteBudget(row.id);
										toast.success("已删除预算");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							className: "mt-3",
							value: Math.min(100, row.ratio * 100),
							indicatorClassName: row.ratio > 1 ? "bg-expense" : void 0
						})]
					}, row.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "设置预算" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "总预算留空分类；分类预算只统计该类别的支出，并折算到所选币种。" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "范围" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCat(""),
									className: cn("h-9 rounded-full px-3 text-sm", cat === "" ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted"),
									children: "总预算"
								}), EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCat(c),
									className: cn("h-9 rounded-full px-3 text-sm", cat === c ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted"),
									children: c
								}, c))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "币种" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyChips, {
								value: currency,
								onChange: setCurrency
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "budget-amount",
								children: [
									"金额（",
									currencyMeta(currency).name,
									"）"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "budget-amount",
								inputMode: "decimal",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: "例如 1800",
								className: "h-12 font-display text-xl tabular-nums"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "保存预算"
						})
					]
				})] })
			})
		]
	});
}
//#endregion
export { BudgetPage as component };
