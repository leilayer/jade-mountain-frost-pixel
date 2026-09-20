import { i as __toESM } from "../_runtime.mjs";
import { l as currencyMeta, u as formatMoney } from "./categories-CV4ddcfc.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as addMonths, i as startOfMonth, r as format, t as zhCN } from "../_libs/date-fns.mjs";
import { f as ChevronRight, p as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFinanceStore, d as cn, f as formatDayLabel, g as todayIso, u as Button, v as useFx, y as useUiStore } from "./router-BdC77IrE.mjs";
import { f as txsOnDay, n as categorySlices, r as dayTotals, u as sumByType } from "./selectors-lZD-dVug.mjs";
import { n as TransactionList, t as PiePanel } from "./transaction-list-CI-O1J_-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-BjwqxVxx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEEKDAYS = [
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"日"
];
function startOfGrid(monthDate) {
	const start = startOfMonth(monthDate);
	const dow = (start.getDay() + 6) % 7;
	const grid = new Date(start);
	grid.setDate(start.getDate() - dow);
	grid.setHours(0, 0, 0, 0);
	return grid;
}
function CalendarMonth({ month, onMonthChange, selected, onSelect, totals }) {
	const today = todayIso();
	const cells = [];
	const cursor = startOfGrid(month);
	for (let i = 0; i < 42; i++) {
		cells.push(new Date(cursor));
		cursor.setDate(cursor.getDate() + 1);
	}
	let max = 0;
	for (const v of totals.values()) max = Math.max(max, v.income, v.expense);
	const monthIndex = month.getMonth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "size-10",
						"aria-label": "上个月",
						onClick: () => onMonthChange(addMonths(month, -1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium tracking-tight",
						children: format(month, "yyyy年M月", { locale: zhCN })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "size-10",
						"aria-label": "下个月",
						onClick: () => onMonthChange(addMonths(month, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1 text-center text-xs text-subtle",
				children: WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-1",
					children: d
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1",
				children: cells.map((day) => {
					const iso = format(day, "yyyy-MM-dd");
					const inMonth = day.getMonth() === monthIndex;
					const money = totals.get(iso) ?? {
						income: 0,
						expense: 0
					};
					const has = money.income > 0 || money.expense > 0;
					const incH = money.income > 0 && max > 0 ? 30 + Math.log(1 + money.income) / Math.log(1 + max) * 70 : 0;
					const expH = money.expense > 0 && max > 0 ? 30 + Math.log(1 + money.expense) / Math.log(1 + max) * 70 : 0;
					const isSelected = iso === selected;
					const isToday = iso === today;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect(iso),
						"aria-label": `${format(day, "M月d日")} 收入${money.income} 支出${money.expense}`,
						"aria-pressed": isSelected,
						className: cn("flex min-h-16 flex-col items-center rounded-md px-0.5 py-1 transition-colors duration-150 sm:min-h-20", inMonth ? "text-fg" : "text-subtle/50", isSelected && "bg-primary/10 text-fg", !isSelected && inMonth && "hover:bg-surface-2", isToday && !isSelected && "ring-1 ring-primary/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-xs tabular-nums", isToday && "font-semibold text-primary"),
							children: day.getDate()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 flex h-7 w-full items-end justify-center gap-0.5 sm:h-8",
							children: has ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-2 rounded-sm bg-income/85",
								style: { height: `${incH}%` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-2 rounded-sm bg-expense/85",
								style: { height: `${expH}%` }
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-3 rounded-full bg-border" })
						})]
					}, iso);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-center gap-4 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-1.5 rounded-sm bg-income/80" }), "收入"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-1.5 rounded-sm bg-expense/80" }), "支出"]
				})]
			})
		]
	});
}
function CalendarPage() {
	const transactions = useFinanceStore((s) => s.transactions);
	const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
	const openCreate = useUiStore((s) => s.openCreate);
	const fx = useFx();
	const [month, setMonth] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [selected, setSelected] = (0, import_react.useState)(todayIso);
	const totals = (0, import_react.useMemo)(() => dayTotals(transactions, fx), [transactions, fx]);
	const dayTx = txsOnDay(transactions, selected);
	const income = sumByType(dayTx, "income", fx);
	const expense = sumByType(dayTx, "expense", fx);
	const baseName = currencyMeta(fx.base).name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "日历"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					"每天的收支映射成柱高（",
					baseName,
					"），点选日期会自动生成扇形图。"
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarMonth, {
					month,
					onMonthChange: (d) => setMonth(d),
					selected,
					onSelect: setSelected,
					totals
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-medium",
								children: formatDayLabel(selected)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"收入 ",
									formatMoney(income, fx.base),
									" · 支出",
									" ",
									formatMoney(expense, fx.base)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => openCreate({ date: selected }),
								children: "记这天"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiePanel, {
						title: "当日构成",
						subtitle: "随记账即时更新",
						currency: fx.base,
						expense: categorySlices(dayTx, "expense", fx),
						income: categorySlices(dayTx, "income", fx)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-medium",
					children: "当日明细"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionList, {
					items: [...dayTx].sort((a, b) => b.createdAt - a.createdAt),
					showDate: false,
					onDelete: (id) => {
						deleteTransaction(id);
						toast.success("已删除");
					},
					empty: "这一天还是空白。记一笔后，日历柱高和扇形图会马上出现。"
				})]
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
