import { i as __toESM } from "../_runtime.mjs";
import { a as asCurrency, c as convert, u as formatMoney } from "./categories-CV4ddcfc.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as Pencil, i as Trash2 } from "../_libs/lucide-react.mjs";
import { _ as useFinanceStore, d as cn, p as formatShortDay, u as Button, y as useUiStore } from "./router-BdC77IrE.mjs";
import { a as Tooltip, i as ResponsiveContainer, n as Pie, r as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transaction-list-CI-O1J_-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-11 items-center justify-center rounded-lg bg-surface-2 p-1 text-muted", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-[var(--shadow-border)]", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-3 focus-visible:outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function ChartTooltip({ active, payload, currency }) {
	if (!active || !payload?.[0]) return null;
	const item = payload[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface px-3 py-2 text-sm shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted",
			children: item.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tabular-nums font-medium",
			children: formatMoney(item.value, currency)
		})]
	});
}
function Donut({ data, currency }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const total = data.reduce((acc, d) => acc + d.value, 0);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto size-40 rounded-full bg-surface-2" });
	if (total <= 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-40 flex-col items-center justify-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-24 rounded-full border border-dashed border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: "暂无记录"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto h-40 w-full max-w-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data,
				dataKey: "value",
				nameKey: "name",
				cx: "50%",
				cy: "50%",
				innerRadius: 46,
				outerRadius: 68,
				paddingAngle: 2,
				stroke: "none",
				children: data.map((slice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: slice.color }, slice.name))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
				active: props.active,
				payload: props.payload,
				currency
			}) })] })
		})
	});
}
function PiePanel({ title, subtitle, income, expense, currency, className }) {
	const [type, setType] = (0, import_react.useState)("expense");
	const data = type === "expense" ? expense : income;
	const total = data.reduce((acc, d) => acc + d.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-medium tracking-tight",
					children: title
				}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: subtitle
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: type,
					onValueChange: (v) => setType(v),
					className: "w-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "h-9",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "expense",
							className: "h-7 px-2.5 text-xs",
							children: "支出"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "income",
							className: "h-7 px-2.5 text-xs",
							children: "收入"
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
				data,
				currency
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center font-display text-lg tabular-nums tracking-tight",
				children: total > 0 ? formatMoney(total, currency) : "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1.5",
				children: data.slice(0, 5).map((slice) => {
					const pct = total > 0 ? Math.round(slice.value / total * 100) : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-2.5 shrink-0 rounded-full",
								style: { background: slice.color },
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-muted",
								children: slice.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-subtle",
								children: [pct, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-28 text-right tabular-nums",
								children: formatMoney(slice.value, currency)
							})
						]
					}, slice.name);
				})
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-surface-2 text-muted",
		income: "bg-income-soft text-income",
		expense: "bg-expense-soft text-expense",
		primary: "bg-primary/10 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function TransactionList({ items, onDelete, empty, showDate = true }) {
	const openEdit = useUiStore((s) => s.openEdit);
	const rates = useFinanceStore((s) => s.rates);
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-lg bg-surface-2/60 px-4 py-8 text-center text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: items.map((tx) => {
			const code = asCurrency(tx.currency);
			const original = formatMoney(tx.amount, code);
			const mapTo = tx.mapTo && asCurrency(tx.mapTo) !== code ? asCurrency(tx.mapTo) : null;
			const mapped = mapTo != null ? formatMoney(convert(tx.amount, code, mapTo, rates), mapTo) : null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 px-3 py-2.5 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("size-2 shrink-0 rounded-full", tx.type === "income" ? "bg-income" : "bg-expense"),
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-medium",
									children: tx.note || tx.merchant || tx.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: tx.type === "income" ? "income" : "expense",
									children: tx.category
								}),
								tx.source === "receipt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "primary",
									children: "收据"
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [showDate ? `${formatShortDay(tx.date)} · ` : "", code]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("shrink-0 text-right font-display text-sm tabular-nums", tx.type === "income" ? "text-income" : "text-expense"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [tx.type === "income" ? "+" : "−", original] }), mapped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-sans font-normal text-subtle",
							children: mapped
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-10",
							"aria-label": "编辑",
							onClick: () => openEdit(tx.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-10 text-muted hover:text-expense",
							"aria-label": "删除",
							onClick: () => onDelete(tx.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					})
				]
			}, tx.id);
		})
	});
}
//#endregion
export { TransactionList as n, PiePanel as t };
