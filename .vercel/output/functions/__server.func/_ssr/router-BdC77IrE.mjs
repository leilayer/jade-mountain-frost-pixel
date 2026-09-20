import { i as __toESM } from "../_runtime.mjs";
import { a as asCurrency, c as convert, d as mergeRates, l as currencyMeta, n as DEFAULT_RATES, o as categoriesFor, t as CURRENCIES, u as formatMoney } from "./categories-CV4ddcfc.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as parseISO, r as format, t as zhCN } from "../_libs/date-fns.mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as ScanLine, d as ImagePlus, h as CalendarDays, l as LoaderCircle, m as Camera, n as Wallet, o as Plus, r as TriangleAlert, s as PiggyBank, t as X, u as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-Co2ufK-m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var CN_DIGITS = [
	"〇",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九"
];
var CN_MONTHS = [
	"一月",
	"二月",
	"三月",
	"四月",
	"五月",
	"六月",
	"七月",
	"八月",
	"九月",
	"十月",
	"十一月",
	"十二月"
];
function todayIso(now = /* @__PURE__ */ new Date()) {
	return format(now, "yyyy-MM-dd");
}
function monthKey(isoOrDate) {
	if (typeof isoOrDate === "string") return isoOrDate.slice(0, 7);
	return format(isoOrDate, "yyyy-MM");
}
function pad2(n) {
	return String(n).padStart(2, "0");
}
function yearToCn(year) {
	return String(year).split("").map((d) => CN_DIGITS[Number(d)] ?? d).join("");
}
function monthHeading(isoMonth) {
	const [ys, ms] = isoMonth.split("-");
	const y = Number(ys);
	const m = Number(ms) - 1;
	return `${yearToCn(y)}年${CN_MONTHS[m] ?? `${m + 1}月`}`;
}
function formatDayLabel(iso) {
	return format(parseISO(iso), "M月d日 EEEE", { locale: zhCN });
}
function formatShortDay(iso) {
	return format(parseISO(iso), "M月d日", { locale: zhCN });
}
var TX_TEMPLATE = [
	{
		day: 1,
		type: "expense",
		amount: 2800,
		category: "住房",
		note: "本月房租"
	},
	{
		day: 1,
		type: "expense",
		amount: 126.8,
		category: "餐饮",
		note: "周末超市采购"
	},
	{
		day: 2,
		type: "expense",
		amount: 50,
		category: "交通",
		note: "公交月票"
	},
	{
		day: 2,
		type: "expense",
		amount: 32,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 3,
		type: "expense",
		amount: 18,
		category: "餐饮",
		note: "食堂午餐",
		currency: "PLN"
	},
	{
		day: 3,
		type: "expense",
		amount: 68,
		category: "购物",
		note: "日用品"
	},
	{
		day: 4,
		type: "expense",
		amount: 45,
		category: "餐饮",
		note: "晚饭"
	},
	{
		day: 5,
		type: "income",
		amount: 12800,
		category: "工资",
		note: "本月工资"
	},
	{
		day: 5,
		type: "expense",
		amount: 22,
		category: "餐饮",
		note: "早餐"
	},
	{
		day: 6,
		type: "expense",
		amount: 36,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 6,
		type: "expense",
		amount: 80,
		category: "娱乐",
		note: "电影票"
	},
	{
		day: 7,
		type: "expense",
		amount: 158,
		category: "餐饮",
		note: "朋友聚餐"
	},
	{
		day: 8,
		type: "expense",
		amount: 4.6,
		category: "交通",
		note: "有轨电车",
		currency: "PLN"
	},
	{
		day: 8,
		type: "expense",
		amount: 41,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 9,
		type: "expense",
		amount: 126,
		category: "医疗",
		note: "药店"
	},
	{
		day: 10,
		type: "expense",
		amount: 39,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 10,
		type: "expense",
		amount: 239,
		category: "购物",
		note: "换季衣服"
	},
	{
		day: 11,
		type: "expense",
		amount: 33,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 12,
		type: "expense",
		amount: 99,
		category: "教育",
		note: "在线课程"
	},
	{
		day: 13,
		type: "expense",
		amount: 48,
		category: "餐饮",
		note: "晚饭"
	},
	{
		day: 14,
		type: "expense",
		amount: 26,
		category: "娱乐",
		note: "周末咖啡",
		currency: "EUR"
	},
	{
		day: 15,
		type: "income",
		amount: 800,
		category: "兼职",
		note: "周末翻译"
	},
	{
		day: 15,
		type: "expense",
		amount: 35,
		category: "娱乐",
		note: "咖啡店"
	},
	{
		day: 16,
		type: "expense",
		amount: 29,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 17,
		type: "expense",
		amount: 44,
		category: "餐饮",
		note: "晚饭"
	},
	{
		day: 18,
		type: "expense",
		amount: 12,
		category: "交通",
		note: "公交"
	},
	{
		day: 18,
		type: "expense",
		amount: 31,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 19,
		type: "expense",
		amount: 24.9,
		category: "购物",
		note: "书店",
		currency: "PLN"
	},
	{
		day: 20,
		type: "expense",
		amount: 27,
		category: "餐饮",
		note: "早餐"
	},
	{
		day: 21,
		type: "expense",
		amount: 62,
		category: "餐饮",
		note: "晚饭"
	},
	{
		day: 22,
		type: "expense",
		amount: 12.5,
		category: "餐饮",
		note: "欧元区午餐",
		currency: "EUR"
	},
	{
		day: 22,
		type: "expense",
		amount: 120,
		category: "娱乐",
		note: "展览门票"
	},
	{
		day: 23,
		type: "expense",
		amount: 28,
		category: "餐饮",
		note: "早餐"
	},
	{
		day: 23,
		type: "expense",
		amount: 46,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 23,
		type: "expense",
		amount: 16,
		category: "餐饮",
		note: "咖啡"
	},
	{
		day: 24,
		type: "expense",
		amount: 41,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 25,
		type: "expense",
		amount: 88,
		category: "购物",
		note: "水果零食"
	},
	{
		day: 26,
		type: "expense",
		amount: 34,
		category: "餐饮",
		note: "午餐"
	},
	{
		day: 27,
		type: "expense",
		amount: 19,
		category: "交通",
		note: "打车"
	},
	{
		day: 28,
		type: "expense",
		amount: 210,
		category: "餐饮",
		note: "家庭晚饭"
	}
];
function dateOf(year, monthIndex, day) {
	return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}
function buildSeed(now = /* @__PURE__ */ new Date()) {
	const year = now.getFullYear();
	const monthIndex = now.getMonth();
	const today = now.getDate();
	const mk = monthKey(now);
	const last = new Date(year, monthIndex + 1, 0).getDate();
	const transactions = TX_TEMPLATE.filter((row) => row.day <= today && row.day <= last).map((row, i) => ({
		id: `seed-tx-${i + 1}`,
		type: row.type,
		amount: row.amount,
		currency: row.currency ?? "CNY",
		mapTo: row.currency && row.currency !== "CNY" ? "CNY" : void 0,
		category: row.category,
		date: dateOf(year, monthIndex, row.day),
		note: row.note,
		createdAt: Date.UTC(year, monthIndex, row.day, 8, i)
	}));
	const budgets = [
		{
			id: "seed-b-all",
			month: mk,
			category: "",
			amount: 7e3,
			currency: "CNY"
		},
		{
			id: "seed-b-food",
			month: mk,
			category: "餐饮",
			amount: 1800,
			currency: "CNY"
		},
		{
			id: "seed-b-transit",
			month: mk,
			category: "交通",
			amount: 400,
			currency: "CNY"
		},
		{
			id: "seed-b-home",
			month: mk,
			category: "住房",
			amount: 2800,
			currency: "CNY"
		},
		{
			id: "seed-b-shop",
			month: mk,
			category: "购物",
			amount: 800,
			currency: "CNY"
		},
		{
			id: "seed-b-play",
			month: mk,
			category: "娱乐",
			amount: 400,
			currency: "CNY"
		},
		{
			id: "seed-b-med",
			month: mk,
			category: "医疗",
			amount: 200,
			currency: "CNY"
		},
		{
			id: "seed-b-edu",
			month: mk,
			category: "教育",
			amount: 150,
			currency: "CNY"
		}
	];
	const deadlineYear = monthIndex >= 8 ? year + 1 : year;
	return {
		transactions,
		budgets,
		plans: [{
			id: "seed-plan-emergency",
			name: "应急储备",
			target: 2e4,
			currency: "CNY",
			deadline: `${deadlineYear}-12-31`,
			note: "至少覆盖三个月开销",
			createdAt: Date.UTC(year, 0, 8),
			contributions: [
				{
					id: "seed-c1",
					amount: 2e3,
					date: dateOf(year, Math.max(0, monthIndex - 2), 8),
					note: "开户转入"
				},
				{
					id: "seed-c2",
					amount: 1500,
					date: dateOf(year, Math.max(0, monthIndex - 1), 10),
					note: "月度存入"
				},
				{
					id: "seed-c3",
					amount: 2e3,
					date: dateOf(year, monthIndex, Math.min(5, today)),
					note: "工资日存入"
				},
				{
					id: "seed-c4",
					amount: 1e3,
					date: dateOf(year, monthIndex, Math.min(15, today)),
					note: "兼职结余"
				}
			]
		}, {
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
					note: ""
				},
				{
					id: "seed-t2",
					amount: 200,
					date: dateOf(year, Math.max(0, monthIndex - 1), 20),
					note: ""
				},
				{
					id: "seed-t3",
					amount: 200,
					date: dateOf(year, monthIndex, Math.min(20, today)),
					note: ""
				}
			]
		}]
	};
}
function uid(prefix) {
	return `${prefix}-${crypto.randomUUID()}`;
}
var initialSeed = buildSeed(/* @__PURE__ */ new Date());
function migrateLedger(raw) {
	const s = raw ?? {};
	return {
		initialized: s.initialized ?? true,
		isDemo: s.isDemo ?? true,
		baseCurrency: asCurrency(s.baseCurrency),
		rates: mergeRates(s.rates),
		transactions: (s.transactions ?? []).map((t) => ({
			...t,
			currency: asCurrency(t.currency),
			mapTo: t.mapTo && asCurrency(t.mapTo) !== asCurrency(t.currency) ? asCurrency(t.mapTo) : !t.mapTo && asCurrency(t.currency) !== "CNY" ? "CNY" : void 0
		})),
		budgets: (s.budgets ?? []).map((b) => ({
			...b,
			currency: asCurrency(b.currency)
		})),
		plans: (s.plans ?? []).map((p) => ({
			...p,
			currency: asCurrency(p.currency)
		}))
	};
}
var useFinanceStore = create()(persist((set, get) => ({
	hasHydrated: true,
	initialized: true,
	isDemo: true,
	baseCurrency: "CNY",
	rates: DEFAULT_RATES,
	transactions: initialSeed.transactions,
	budgets: initialSeed.budgets,
	plans: initialSeed.plans,
	setHasHydrated: (v) => set({ hasHydrated: v }),
	setBaseCurrency: (code) => set({ baseCurrency: code }),
	setRate: (code, valueInCny) => {
		if (code === "CNY") return;
		if (!Number.isFinite(valueInCny) || valueInCny <= 0) return;
		set({ rates: {
			...get().rates,
			[code]: valueInCny
		} });
	},
	addTransaction: (input) => {
		set({
			transactions: [{
				id: uid("tx"),
				...input,
				source: input.source ?? "manual",
				createdAt: Date.now()
			}, ...get().transactions],
			isDemo: false
		});
	},
	updateTransaction: (id, input) => {
		set({
			transactions: get().transactions.map((tx) => tx.id === id ? {
				...tx,
				...input
			} : tx),
			isDemo: false
		});
	},
	deleteTransaction: (id) => {
		set({ transactions: get().transactions.filter((tx) => tx.id !== id) });
	},
	upsertBudget: (month, category, amount, currency) => {
		const existing = get().budgets.find((b) => b.month === month && b.category === category);
		if (existing) {
			set({
				budgets: get().budgets.map((b) => b.id === existing.id ? {
					...b,
					amount,
					currency
				} : b),
				isDemo: false
			});
			return;
		}
		set({
			budgets: [...get().budgets, {
				id: uid("bd"),
				month,
				category,
				amount,
				currency
			}],
			isDemo: false
		});
	},
	deleteBudget: (id) => {
		set({
			budgets: get().budgets.filter((b) => b.id !== id),
			isDemo: false
		});
	},
	addPlan: (input) => {
		set({
			plans: [{
				id: uid("pl"),
				...input,
				createdAt: Date.now(),
				contributions: []
			}, ...get().plans],
			isDemo: false
		});
	},
	updatePlan: (id, input) => {
		set({
			plans: get().plans.map((p) => p.id === id ? {
				...p,
				...input
			} : p),
			isDemo: false
		});
	},
	deletePlan: (id) => {
		set({
			plans: get().plans.filter((p) => p.id !== id),
			isDemo: false
		});
	},
	contribute: (planId, amount, date, note) => {
		set({
			plans: get().plans.map((p) => p.id === planId ? {
				...p,
				contributions: [{
					id: uid("ct"),
					amount,
					date: date || todayIso(),
					note
				}, ...p.contributions]
			} : p),
			isDemo: false
		});
	},
	loadSeed: () => {
		set({
			...buildSeed(/* @__PURE__ */ new Date()),
			baseCurrency: "CNY",
			rates: DEFAULT_RATES,
			initialized: true,
			isDemo: true
		});
	},
	clearAll: () => {
		set({
			transactions: [],
			budgets: [],
			plans: [],
			initialized: true,
			isDemo: false
		});
	}
}), {
	name: "chengzhang-ledger-v1",
	version: 3,
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	partialize: (state) => ({
		initialized: state.initialized,
		isDemo: state.isDemo,
		baseCurrency: state.baseCurrency,
		rates: state.rates,
		transactions: state.transactions,
		budgets: state.budgets,
		plans: state.plans
	}),
	migrate: (persisted) => migrateLedger(persisted),
	onRehydrateStorage: () => (state) => {
		if (!state) {
			useFinanceStore.setState({ hasHydrated: true });
			return;
		}
		if (!state.initialized) state.loadSeed();
		state.setHasHydrated(true);
	}
}));
function useFx() {
	const base = useFinanceStore((s) => s.baseCurrency);
	const rates = useFinanceStore((s) => s.rates);
	return (0, import_react.useMemo)(() => ({
		base,
		rates
	}), [base, rates]);
}
var useUiStore = create((set) => ({
	composerOpen: false,
	scanOpen: false,
	editingId: null,
	defaultDate: todayIso(),
	defaultType: "expense",
	openCreate: (opts) => set({
		composerOpen: true,
		scanOpen: false,
		editingId: null,
		defaultDate: opts?.date ?? todayIso(),
		defaultType: opts?.type ?? "expense"
	}),
	openEdit: (id) => set({
		composerOpen: true,
		scanOpen: false,
		editingId: id
	}),
	openScan: () => set({
		scanOpen: true,
		composerOpen: false,
		editingId: null
	}),
	closeComposer: () => set({ composerOpen: false }),
	closeScan: () => set({ scanOpen: false })
}));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/90",
			expense: "bg-expense text-primary-fg hover:bg-expense/90",
			income: "bg-income text-primary-fg hover:bg-income/90",
			outline: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-fg hover:bg-surface-2",
			subtle: "bg-surface-2 text-fg hover:bg-surface-2/80"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BdC77IrE.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 rounded-sm p-2 text-muted opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "关闭"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8 text-left", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-lg font-medium tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-surface px-3 text-base text-fg shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-sm font-medium text-muted leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Root.displayName;
function CurrencyChips({ value, onChange, named = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			title: c.name,
			onClick: () => onChange(c.code),
			className: cn("h-9 rounded-full px-3 text-sm tabular-nums transition-colors duration-150", value === c.code ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"),
			children: [c.code, named ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1 text-xs opacity-70",
				children: c.name
			}) : null]
		}, c.code))
	});
}
var CHIP = {
	on: "bg-primary text-primary-fg",
	off: "bg-surface-2 text-muted hover:text-fg"
};
function MapCurrencyChips({ payment, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(null),
			className: cn("h-9 rounded-full px-3 text-sm transition-colors duration-150", value == null ? CHIP.on : CHIP.off),
			children: "不映射"
		}), CURRENCIES.filter((c) => c.code !== payment).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			title: c.name,
			onClick: () => onChange(c.code),
			className: cn("h-9 rounded-full px-3 text-sm tabular-nums transition-colors duration-150", value === c.code ? CHIP.on : CHIP.off),
			children: c.code
		}, c.code))]
	});
}
function CurrencyBar({ compact = false, className }) {
	const base = useFinanceStore((s) => s.baseCurrency);
	const setBase = useFinanceStore((s) => s.setBaseCurrency);
	const [open, setOpen] = (0, import_react.useState)(false);
	const meta = currencyMeta(base);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn("h-11 rounded-full bg-surface-2 px-3 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2/80", compact && "min-w-11 px-2.5", className),
		"aria-label": "结算货币与汇率",
		children: [meta.code, compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-1.5 text-muted",
			children: meta.name
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[min(90dvh,36rem)] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "结算货币" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "总览、日历和扇形图按结算货币汇总。每笔记账仍保留原币种。" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyChips, {
					value: base,
					onChange: setBase,
					named: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatesForm, {})
			]
		})
	})] });
}
function RatesForm() {
	const base = useFinanceStore((s) => s.baseCurrency);
	const rates = useFinanceStore((s) => s.rates);
	const setRate = useFinanceStore((s) => s.setRate);
	const others = CURRENCIES.filter((c) => c.code !== base);
	const baseName = currencyMeta(base).name;
	const display = (0, import_react.useMemo)(() => {
		const map = {};
		for (const c of CURRENCIES) {
			if (c.code === base) continue;
			map[c.code] = formatRateInput(convert(1, c.code, base, rates));
		}
		return map;
	}, [base, rates]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: "参考汇率（可改）"
			}),
			others.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
					htmlFor: `rate-${c.code}`,
					children: [
						"1 ",
						c.name,
						" = ? ",
						baseName
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `rate-${c.code}`,
					inputMode: "decimal",
					defaultValue: display[c.code],
					onBlur: (e) => {
						const n = Number(e.target.value);
						if (!Number.isFinite(n) || n <= 0) return;
						const valueInCny = convert(n, base, "CNY", rates);
						setRate(c.code, valueInCny);
					},
					className: "tabular-nums"
				}, `${base}-${c.code}-${rates[c.code]}`)]
			}, c.code)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "汇率按 1 外币兑人民币换算存储，离线可用。切换结算货币时会自动折算显示。"
			})
		]
	});
}
function formatRateInput(n) {
	if (n >= 100) return n.toFixed(2);
	if (n >= 1) return n.toFixed(3);
	return n.toFixed(4);
}
var MAX_EDGE = 1280;
var MAX_CHARS = 9e5;
async function compressReceiptImage(file) {
	if (!file.type.startsWith("image/") && file.type !== "") throw new Error("请选择图片文件");
	if (file.size > 12582912) throw new Error("图片太大，请换一张更清晰的小票照片");
	let bitmap;
	try {
		bitmap = await createImageBitmap(file);
	} catch {
		throw new Error("无法读取这张图。请用 JPG / PNG，或先截图再选。");
	}
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("无法处理图片");
	}
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, width, height);
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	let quality = .78;
	let dataUrl = canvas.toDataURL("image/jpeg", quality);
	while (dataUrl.length > MAX_CHARS && quality > .42) {
		quality -= .08;
		dataUrl = canvas.toDataURL("image/jpeg", quality);
	}
	if (dataUrl.length > 12e5) throw new Error("压缩后仍太大，请靠近小票重新拍一张");
	return dataUrl;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var scanReceipt = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("缺少图片");
	const imageDataUrl = input.imageDataUrl;
	if (typeof imageDataUrl !== "string") throw new Error("缺少图片");
	if (!imageDataUrl.startsWith("data:image/jpeg") && !imageDataUrl.startsWith("data:image/png")) throw new Error("只支持 JPG 或 PNG");
	if (imageDataUrl.length > 14e5) throw new Error("图片过大");
	return { imageDataUrl };
}).handler(createSsrRpc("b24e52bd99937342d81617dfb5d70b0001898fdc43518bfea85aee64d9c055d8"));
var QUOTA_KEY = "chengzhang-scan-quota";
var QUOTA_MAX = 20;
function takeQuota() {
	const day = todayIso();
	try {
		const raw = window.localStorage.getItem(QUOTA_KEY);
		const data = raw ? JSON.parse(raw) : {};
		const n = data.day === day ? data.n ?? 0 : 0;
		if (n >= QUOTA_MAX) return false;
		window.localStorage.setItem(QUOTA_KEY, JSON.stringify({
			day,
			n: n + 1
		}));
		return true;
	} catch {
		return true;
	}
}
function refundQuota() {
	const day = todayIso();
	try {
		const raw = window.localStorage.getItem(QUOTA_KEY);
		const data = raw ? JSON.parse(raw) : {};
		if (data.day !== day) return;
		window.localStorage.setItem(QUOTA_KEY, JSON.stringify({
			day,
			n: Math.max(0, (data.n ?? 1) - 1)
		}));
	} catch {}
}
function ReceiptScanner() {
	const scanOpen = useUiStore((s) => s.scanOpen);
	const closeScan = useUiStore((s) => s.closeScan);
	const addTransaction = useFinanceStore((s) => s.addTransaction);
	const baseCurrency = useFinanceStore((s) => s.baseCurrency);
	const rates = useFinanceStore((s) => s.rates);
	const cameraRef = (0, import_react.useRef)(null);
	const albumRef = (0, import_react.useRef)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [type, setType] = (0, import_react.useState)("expense");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)(baseCurrency);
	const [mapTo, setMapTo] = (0, import_react.useState)(null);
	const [category, setCategory] = (0, import_react.useState)(categoriesFor("expense")[0]);
	const [date, setDate] = (0, import_react.useState)(todayIso());
	const [note, setNote] = (0, import_react.useState)("");
	const [merchant, setMerchant] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!scanOpen) {
			setPreview(null);
			setDraft(null);
			setBusy(false);
		}
	}, [scanOpen]);
	(0, import_react.useEffect)(() => {
		const list = categoriesFor(type);
		if (!list.includes(category)) setCategory(list[0]);
	}, [type, category]);
	function applyDraft(next) {
		setDraft(next);
		setType(next.type);
		setAmount(String(next.amount));
		setCurrency(next.currency);
		setMapTo(next.currency === "CNY" ? null : "CNY");
		setCategory(next.category);
		setDate(next.date || todayIso());
		setNote(next.note);
		setMerchant(next.merchant);
	}
	async function onFile(file) {
		if (!file) return;
		setDraft(null);
		setBusy(true);
		let usedQuota = false;
		try {
			const dataUrl = await compressReceiptImage(file);
			setPreview(dataUrl);
			if (!takeQuota()) {
				toast.error("今天识别次数已用完，明天再来，或手动记一笔");
				return;
			}
			usedQuota = true;
			const result = await scanReceipt({ data: { imageDataUrl: dataUrl } });
			if (!result.ok) {
				refundQuota();
				toast.error(result.error);
				return;
			}
			applyDraft(result.draft);
		} catch (err) {
			if (usedQuota) refundQuota();
			toast.error(err instanceof Error ? err.message : "识别失败");
		} finally {
			setBusy(false);
		}
	}
	function submit(e) {
		e.preventDefault();
		const value = Number(amount);
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("请核对金额");
			return;
		}
		addTransaction({
			type,
			amount: Math.round(value * 100) / 100,
			currency,
			mapTo: mapTo && mapTo !== currency ? mapTo : void 0,
			category,
			date: date || todayIso(),
			note: note.trim() || merchant.trim() || category,
			merchant: merchant.trim() || void 0,
			items: draft?.items,
			source: "receipt"
		});
		toast.success(type === "income" ? "已从收据记下收入" : "已从收据记下支出");
		closeScan();
	}
	const cats = categoriesFor(type);
	const parsed = Number(amount);
	const converted = Number.isFinite(parsed) && parsed > 0 && mapTo && mapTo !== currency ? convert(parsed, currency, mapTo, rates) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: scanOpen,
		onOpenChange: (o) => !o && closeScan(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[min(90dvh,42rem)] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "扫描收据" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "拍收银小票或选电子收据截图，识别后请再核对一眼再入账。" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: cameraRef,
					type: "file",
					accept: "image/*",
					capture: "environment",
					className: "sr-only",
					onChange: (e) => {
						onFile(e.target.files?.[0]);
						e.target.value = "";
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: albumRef,
					type: "file",
					accept: "image/*",
					className: "sr-only",
					onChange: (e) => {
						onFile(e.target.files?.[0]);
						e.target.value = "";
					}
				}),
				!draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onDragOver: (e) => {
							e.preventDefault();
							e.dataTransfer.dropEffect = "copy";
						},
						onDrop: (e) => {
							e.preventDefault();
							onFile(e.dataTransfer.files?.[0]);
						},
						onClick: () => albumRef.current?.click(),
						className: "grid min-h-40 place-items-center rounded-xl border border-dashed border-border bg-surface-2/60 px-4 py-6 text-center",
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid justify-items-center gap-2 text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "正在识别小票…"
							})]
						}) : preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: preview,
							alt: "待识别的收据",
							className: "max-h-48 rounded-md object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid justify-items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-8 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "把小票照片拖到这里，或点此从相册选"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: "支持超市小票、餐厅账单、微信 / 支付宝截图"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							disabled: busy,
							onClick: () => cameraRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "拍照"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							disabled: busy,
							onClick: () => albumRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), "相册"]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "grid gap-4",
					children: [
						preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: preview,
							alt: "已识别的收据",
							className: "mx-auto max-h-28 rounded-md object-contain"
						}) : null,
						merchant ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center font-display text-lg font-medium",
							children: merchant
						}) : null,
						draft.items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "max-h-28 overflow-y-auto rounded-lg bg-surface-2/70 px-3 py-2 text-sm",
							children: draft.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-muted",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: formatMoney(item.amount, currency)
								})]
							}, `${item.name}-${i}`))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setType("expense"),
								className: cn("h-10 rounded-md text-sm font-medium", type === "expense" ? "bg-surface text-expense shadow-[var(--shadow-border)]" : "text-muted"),
								children: "支出"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setType("income"),
								className: cn("h-10 rounded-md text-sm font-medium", type === "income" ? "bg-surface text-income shadow-[var(--shadow-border)]" : "text-muted"),
								children: "收入"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "币种" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyChips, {
								value: currency,
								onChange: (code) => {
									setCurrency(code);
									setMapTo((prev) => {
										if (prev === code) return code === "CNY" ? null : "CNY";
										if (code !== "CNY" && prev == null) return "CNY";
										if (code === "CNY" && prev === "CNY") return null;
										return prev;
									});
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "映射货币" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCurrencyChips, {
								payment: currency,
								value: mapTo,
								onChange: setMapTo
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "scan-amount",
									children: "金额"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-display text-lg text-muted",
										children: currencyMeta(currency).suffix ? currencyMeta(currency).code : currencyMeta(currency).symbol
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "scan-amount",
										inputMode: "decimal",
										value: amount,
										onChange: (e) => setAmount(e.target.value),
										className: "h-14 pl-12 font-display text-2xl tabular-nums"
									})]
								}),
								converted != null && mapTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: ["约合 ", formatMoney(converted, mapTo)]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "分类（已自动判断，可改）" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCategory(c),
									className: cn("h-9 rounded-full px-3 text-sm", category === c ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"),
									children: c
								}, c))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "scan-merchant",
								children: "商户"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "scan-merchant",
								value: merchant,
								onChange: (e) => setMerchant(e.target.value),
								maxLength: 40
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "scan-date",
								children: "日期"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "scan-date",
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "scan-note",
								children: "备注"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "scan-note",
								value: note,
								onChange: (e) => setNote(e.target.value),
								maxLength: 40
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									setDraft(null);
									setPreview(null);
								},
								children: "换一张"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: type === "expense" ? "expense" : "income",
								children: "记入账本"
							})]
						})
					]
				})
			]
		})
	});
}
function TransactionComposer() {
	const { composerOpen, editingId, defaultDate, defaultType, closeComposer, openScan } = useUiStore();
	const transactions = useFinanceStore((s) => s.transactions);
	const addTransaction = useFinanceStore((s) => s.addTransaction);
	const updateTransaction = useFinanceStore((s) => s.updateTransaction);
	const baseCurrency = useFinanceStore((s) => s.baseCurrency);
	const rates = useFinanceStore((s) => s.rates);
	const editing = (0, import_react.useMemo)(() => transactions.find((t) => t.id === editingId) ?? null, [transactions, editingId]);
	const [type, setType] = (0, import_react.useState)(defaultType);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)(baseCurrency);
	const [mapTo, setMapTo] = (0, import_react.useState)(null);
	const [category, setCategory] = (0, import_react.useState)(categoriesFor(defaultType)[0]);
	const [date, setDate] = (0, import_react.useState)(defaultDate);
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!composerOpen) return;
		if (editing) {
			setType(editing.type);
			setAmount(String(editing.amount));
			setCurrency(editing.currency);
			setMapTo(editing.mapTo && editing.mapTo !== editing.currency ? editing.mapTo : null);
			setCategory(editing.category);
			setDate(editing.date);
			setNote(editing.note);
			return;
		}
		setType(defaultType);
		setAmount("");
		setCurrency(baseCurrency);
		setMapTo(baseCurrency === "CNY" ? null : "CNY");
		setCategory(categoriesFor(defaultType)[0]);
		setDate(defaultDate || todayIso());
		setNote("");
	}, [
		composerOpen,
		editing,
		defaultDate,
		defaultType,
		baseCurrency
	]);
	(0, import_react.useEffect)(() => {
		const list = categoriesFor(type);
		if (!list.includes(category)) setCategory(list[0]);
	}, [type, category]);
	function submit(e) {
		e.preventDefault();
		const value = Number(amount);
		if (!Number.isFinite(value) || value <= 0) {
			toast.error("请输入大于 0 的金额");
			return;
		}
		const payload = {
			type,
			amount: Math.round(value * 100) / 100,
			currency,
			mapTo: mapTo && mapTo !== currency ? mapTo : void 0,
			category,
			date: date || todayIso(),
			note: note.trim()
		};
		if (editing) {
			updateTransaction(editing.id, payload);
			toast.success("已更新记账");
		} else {
			addTransaction(payload);
			toast.success(type === "expense" ? "已记下支出" : "已记下收入");
		}
		closeComposer();
	}
	const cats = categoriesFor(type);
	const meta = currencyMeta(currency);
	const parsed = Number(amount);
	const converted = Number.isFinite(parsed) && parsed > 0 && mapTo && mapTo !== currency ? convert(parsed, currency, mapTo, rates) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: composerOpen,
		onOpenChange: (o) => !o && closeComposer(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[min(90dvh,40rem)] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "编辑记账" : "记一笔" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: editing ? "修改金额、币种、分类或备注。" : "记下今天的一笔收入或支出。" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-4",
				children: [
					editing ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => openScan(),
						className: "h-11 rounded-lg bg-surface-2 px-3 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2/80",
						children: "拍小票或选截图，自动识别入账"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setType("expense"),
							className: cn("h-10 rounded-md text-sm font-medium transition-colors duration-150", type === "expense" ? "bg-surface text-expense shadow-[var(--shadow-border)]" : "text-muted"),
							children: "支出"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setType("income"),
							className: cn("h-10 rounded-md text-sm font-medium transition-colors duration-150", type === "income" ? "bg-surface text-income shadow-[var(--shadow-border)]" : "text-muted"),
							children: "收入"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "币种" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyChips, {
							value: currency,
							onChange: (code) => {
								setCurrency(code);
								setMapTo((prev) => {
									if (prev === code) return code === "CNY" ? null : "CNY";
									if (code !== "CNY" && prev == null) return "CNY";
									if (code === "CNY" && prev === "CNY") return null;
									return prev;
								});
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "映射货币" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCurrencyChips, {
							payment: currency,
							value: mapTo,
							onChange: setMapTo
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "amount",
								children: "金额"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-display text-lg text-muted",
									children: meta.suffix ? meta.code : meta.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "amount",
									inputMode: "decimal",
									placeholder: "0.00",
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									className: "h-14 pl-12 font-display text-2xl tabular-nums",
									autoFocus: true
								})]
							}),
							converted != null && mapTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: ["约合 ", formatMoney(converted, mapTo)]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "分类" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCategory(c),
								className: cn("h-9 rounded-full px-3 text-sm transition-colors duration-150", category === c ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted hover:text-fg"),
								children: c
							}, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "date",
							children: "日期"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "date",
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "备注"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "note",
							placeholder: "可选，例如午餐、房租",
							value: note,
							onChange: (e) => setNote(e.target.value),
							maxLength: 40
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: type === "expense" ? "expense" : "income",
						className: "mt-1 w-full",
						children: editing ? "保存修改" : "记入账本"
					})
				]
			})]
		})
	});
}
function registerServiceWorker() {
	if (typeof window === "undefined") return;
	if (!("serviceWorker" in navigator)) return;
	const run = () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	};
	if (document.readyState === "complete") run();
	else window.addEventListener("load", run, { once: true });
}
var NAV = [
	{
		to: "/",
		label: "总览",
		icon: LayoutDashboard
	},
	{
		to: "/calendar",
		label: "日历",
		icon: CalendarDays
	},
	{
		to: "/budget",
		label: "预算",
		icon: Wallet
	},
	{
		to: "/savings",
		label: "储蓄",
		icon: PiggyBank
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const openCreate = useUiStore((s) => s.openCreate);
	const openScan = useUiStore((s) => s.openScan);
	(0, import_react.useEffect)(() => {
		registerServiceWorker();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "app",
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex min-h-dvh max-w-6xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-0 hidden h-dvh w-52 shrink-0 flex-col border-r border-border px-4 py-6 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "mt-8 flex flex-1 flex-col gap-1",
							children: NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150", active ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, { className: "mb-3 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "mb-2 w-full",
							onClick: () => openScan(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "扫收据"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							onClick: () => openCreate(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "记一笔"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-bg/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-sm md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, { compact: true }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "outline",
									className: "size-10",
									"aria-label": "扫描收据",
									onClick: () => openScan(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => openCreate(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "记一笔"]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-10",
						children
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-lg grid-cols-4",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium", active ? "text-primary" : "text-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
						}) }, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionComposer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptScanner, {})
		]
	});
}
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-8 items-center justify-center rounded-md bg-primary text-primary-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "size-4",
				"aria-hidden": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "7",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2.4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 12 L12 5 A7 7 0 0 1 18.1 15.5 Z",
					fill: "currentColor"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg font-medium tracking-tight",
				children: "澄账"
			}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "把每一笔看清楚"
			})]
		})]
	});
}
var styles_default = "/assets/styles-tISLWhZP.css";
var APP_NAME = "澄账";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "日用账本：多币种收支、预算与储蓄。"
			},
			{
				name: "theme-color",
				content: "#f3efe6"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "zh-CN",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				toastOptions: { className: "font-sans" }
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$3 = () => import("./routes-CdWauhhk.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./budget-Ci7Xp7ZF.mjs");
var Route$2 = createFileRoute("/budget")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./calendar-BjwqxVxx.mjs");
var Route$1 = createFileRoute("/calendar")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./savings-CA0hYLZS.mjs");
var Route = createFileRoute("/savings")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	BudgetRoute: Route$2.update({
		id: "/budget",
		path: "/budget",
		getParentRoute: () => Route$4
	}),
	CalendarRoute: Route$1.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => Route$4
	}),
	SavingsRoute: Route.update({
		id: "/savings",
		path: "/savings",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useFinanceStore as _, Dialog as a, DialogHeader as c, cn as d, formatDayLabel as f, todayIso as g, monthKey as h, Input as i, DialogTitle as l, monthHeading as m, CurrencyChips as n, DialogContent as o, formatShortDay as p, Label as r, DialogDescription as s, router_exports as t, Button as u, useFx as v, useUiStore as y };
