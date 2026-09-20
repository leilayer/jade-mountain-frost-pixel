import { i as __toESM } from "../_runtime.mjs";
import { a as asCurrency, l as currencyMeta, u as formatMoney } from "./categories-CV4ddcfc.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as useFinanceStore, a as Dialog, c as DialogHeader, d as cn, g as todayIso, i as Input, l as DialogTitle, n as CurrencyChips, o as DialogContent, p as formatShortDay, r as Label, s as DialogDescription, u as Button } from "./router-BdC77IrE.mjs";
import { t as Progress } from "./progress-Cvxg30WZ.mjs";
import { i as monthsRemaining, s as planBalance } from "./selectors-lZD-dVug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/savings-CA0hYLZS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SavingsPage() {
	const plans = useFinanceStore((s) => s.plans);
	const addPlan = useFinanceStore((s) => s.addPlan);
	const deletePlan = useFinanceStore((s) => s.deletePlan);
	const contribute = useFinanceStore((s) => s.contribute);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("in");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "储蓄计划"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "独立于日常收支，每个计划用自己的币种盯目标。"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setCreateOpen(true),
					children: "新建计划"
				})]
			}),
			plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-surface px-4 py-12 text-center text-sm text-muted shadow-[var(--shadow-border)]",
				children: "还没有储蓄计划。比如应急储备、旅行基金，都可以单独追踪。"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: plans.map((plan) => {
					const code = asCurrency(plan.currency);
					const current = planBalance(plan);
					const ratio = plan.target > 0 ? current / plan.target : 0;
					const left = Math.max(0, plan.target - current);
					const months = monthsRemaining(plan.deadline);
					const perMonth = months > 0 ? left / months : left;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-xl font-medium",
									children: [plan.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 font-sans text-xs font-normal text-subtle",
										children: [
											code,
											" · ",
											currencyMeta(code).name
										]
									})]
								}), plan.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: plan.note
								}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-10 text-muted hover:text-expense",
									"aria-label": `删除${plan.name}`,
									onClick: () => {
										deletePlan(plan.id);
										toast.success("已删除计划");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-2xl tabular-nums tracking-tight",
								children: [formatMoney(current, code), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-base text-muted",
									children: ["/ ", formatMoney(plan.target, code)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-3",
								value: Math.min(100, ratio * 100),
								indicatorClassName: ratio >= 1 ? "bg-income" : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ratio >= 1 ? "已达成目标" : `还差 ${formatMoney(left, code)}` }), plan.deadline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"截止 ",
									formatShortDay(plan.deadline),
									months > 0 && left > 0 ? ` · 每月约 ${formatMoney(perMonth, code)}` : null
								] }) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "flex-1",
									onClick: () => {
										setActive(plan);
										setMode("in");
									},
									children: "存入"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1",
									onClick: () => {
										setActive(plan);
										setMode("out");
									},
									children: "取出"
								})]
							}),
							plan.contributions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 divide-y divide-border border-t border-border",
								children: plan.contributions.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [formatShortDay(c.date), c.note ? ` · ${c.note}` : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("tabular-nums", c.amount >= 0 ? "text-income" : "text-expense"),
										children: [c.amount >= 0 ? "+" : "", formatMoney(c.amount, code)]
									})]
								}, c.id))
							}) : null
						]
					}, plan.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanDialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				onSubmit: addPlan
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContributeDialog, {
				plan: active,
				mode,
				onClose: () => setActive(null),
				onSubmit: (amount, date, note) => {
					if (!active) return;
					contribute(active.id, mode === "out" ? -amount : amount, date, note);
					toast.success(mode === "out" ? "已取出" : "已存入");
					setActive(null);
				}
			})
		]
	});
}
function PlanDialog({ open, onOpenChange, onSubmit }) {
	const baseCurrency = useFinanceStore((s) => s.baseCurrency);
	const [name, setName] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)(baseCurrency);
	const [deadline, setDeadline] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) setCurrency(baseCurrency);
	}, [open, baseCurrency]);
	function submit(e) {
		e.preventDefault();
		const value = Number(target);
		if (!name.trim()) {
			toast.error("请填写计划名称");
			return;
		}
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("请填写目标金额");
			return;
		}
		onSubmit({
			name: name.trim(),
			target: Math.round(value * 100) / 100,
			currency,
			deadline: deadline || null,
			note: note.trim()
		});
		toast.success("已创建储蓄计划");
		onOpenChange(false);
		setName("");
		setTarget("");
		setCurrency(baseCurrency);
		setDeadline("");
		setNote("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[min(90dvh,40rem)] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "新建储蓄计划" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "给一笔钱起个名字，用选定币种盯着目标往前攒。" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "plan-name",
							children: "名称"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "plan-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "应急储备"
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
							htmlFor: "plan-target",
							children: [
								"目标金额（",
								currencyMeta(currency).name,
								"）"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "plan-target",
							inputMode: "decimal",
							value: target,
							onChange: (e) => setTarget(e.target.value),
							placeholder: "20000",
							className: "font-display text-xl tabular-nums"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "plan-deadline",
							children: "截止日期（可选）"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "plan-deadline",
							type: "date",
							value: deadline,
							onChange: (e) => setDeadline(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "plan-note",
							children: "备注"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "plan-note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "可选"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "创建计划"
					})
				]
			})]
		})
	});
}
function ContributeDialog({ plan, mode, onClose, onSubmit }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(todayIso());
	const [note, setNote] = (0, import_react.useState)("");
	const code = asCurrency(plan?.currency);
	const meta = currencyMeta(code);
	function submit(e) {
		e.preventDefault();
		const value = Number(amount);
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("请输入金额");
			return;
		}
		onSubmit(Math.round(value * 100) / 100, date || todayIso(), note.trim());
		setAmount("");
		setNote("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!plan,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [mode === "in" ? "存入" : "取出", plan ? ` · ${plan.name}` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: mode === "in" ? `把一笔${meta.name}放进这个目标。` : `从目标中取出一部分${meta.name}。` })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ct-amount",
						children: "金额"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-display text-lg text-muted",
							children: meta.suffix ? meta.code : meta.symbol
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ct-amount",
							inputMode: "decimal",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "h-12 pl-12 font-display text-xl tabular-nums"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ct-date",
						children: "日期"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ct-date",
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ct-note",
						children: "备注"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ct-note",
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "可选"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: mode === "out" ? "expense" : "default",
					className: "w-full",
					children: "确认"
				})
			]
		})] })
	});
}
//#endregion
export { SavingsPage as component };
