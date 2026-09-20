import { a as asCurrency, i as INCOME_CATEGORIES, r as EXPENSE_CATEGORIES } from "./categories-CV4ddcfc.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-receipt-Gv31XhrH.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SCAN_PROMPT = `你是个人账本助手。识别图中是否为收银小票、机打发票、手写账单，或电子收据截图（微信、支付宝、银行、邮件、超市小票、餐厅账单等）。

只输出一个 JSON 对象，不要 markdown、不要解释。

字段：
- isReceipt: 布尔。不是收据则为 false
- reason: isReceipt 为 false 时，用一句中文说明原因
- type: "expense" 或 "income"（退款/转入视为 income，消费为 expense）
- merchant: 商户或付款对象，没有则空字符串
- amount: 应付合计数字（含税；不要把小费再加一遍，除非小票合计已含）
- currency: CNY | PLN | EUR | USD | GBP | JPY | HKD。¥/元→CNY；zł/PLN→PLN；€→EUR；$ 在美国语境→USD，香港→HKD
- date: YYYY-MM-DD，看不清则 null
- category: 必须是下列之一。支出：餐饮、交通、住房、购物、娱乐、医疗、教育、储蓄、其他。收入：工资、奖金、投资、兼职、礼金、其他。按商品和服务判断，超市食品偏餐饮或购物，药店→医疗，地铁/滴滴/油费→交通
- note: 一句中文摘要，含商户和关键商品
- items: 最多 12 条 { "name": string, "amount": number }，无法拆行则空数组

若看不清金额，isReceipt 仍可为 true，但 amount 填 0。`;
function extractJson(text) {
	const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("模型没有返回可解析结果");
	return JSON.parse(trimmed.slice(start, end + 1));
}
function asFiniteNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const n = Number(value.replace(",", ".").replace(/[^\d.-]/g, ""));
		if (Number.isFinite(n)) return n;
	}
	return 0;
}
function normalizeDraft(raw) {
	if (!raw || typeof raw !== "object") return {
		ok: false,
		error: "无法理解这张图，请换一张更清楚的小票"
	};
	const row = raw;
	if (row.isReceipt === false) return {
		ok: false,
		error: typeof row.reason === "string" && row.reason.trim() ? row.reason.trim() : "这张图看起来不是收据"
	};
	const type = row.type === "income" ? "income" : "expense";
	const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
	const categoryRaw = typeof row.category === "string" ? row.category.trim() : "";
	const category = cats.includes(categoryRaw) ? categoryRaw : "其他";
	const amount = Math.abs(asFiniteNumber(row.amount));
	if (amount <= 0) return {
		ok: false,
		error: "看不清金额，请拍清楚合计后再试"
	};
	const items = (Array.isArray(row.items) ? row.items : []).slice(0, 12).map((item) => {
		if (!item || typeof item !== "object") return null;
		const rec = item;
		const name = typeof rec.name === "string" ? rec.name.trim() : "";
		const itemAmount = Math.abs(asFiniteNumber(rec.amount));
		if (!name) return null;
		return {
			name: name.slice(0, 40),
			amount: Math.round(itemAmount * 100) / 100
		};
	}).filter((x) => x != null);
	const merchant = typeof row.merchant === "string" ? row.merchant.trim().slice(0, 40) : "";
	const noteRaw = typeof row.note === "string" ? row.note.trim() : "";
	const dateRaw = typeof row.date === "string" ? row.date.trim() : "";
	const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : null;
	return {
		ok: true,
		draft: {
			isReceipt: true,
			type,
			merchant,
			amount: Math.round(amount * 100) / 100,
			currency: asCurrency(typeof row.currency === "string" ? row.currency : "CNY"),
			date,
			category,
			note: (noteRaw || merchant).slice(0, 40),
			items
		}
	};
}
async function completeVision(apiKey, content) {
	const payload = {
		model: "grok-4.5",
		temperature: 0,
		max_tokens: 700,
		response_format: { type: "json_object" },
		messages: [{
			role: "user",
			content
		}]
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		signal: AbortSignal.timeout(45e3),
		body: JSON.stringify(payload)
	});
	const body = await res.text();
	if (!res.ok) return {
		ok: false,
		status: res.status,
		body
	};
	return {
		ok: true,
		text: JSON.parse(body).choices?.[0]?.message?.content ?? ""
	};
}
var scanReceipt_createServerFn_handler = createServerRpc({
	id: "b24e52bd99937342d81617dfb5d70b0001898fdc43518bfea85aee64d9c055d8",
	name: "scanReceipt",
	filename: "src/lib/finance/scan-receipt.ts"
}, (opts) => scanReceipt.__executeServer(opts));
var scanReceipt = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("缺少图片");
	const imageDataUrl = input.imageDataUrl;
	if (typeof imageDataUrl !== "string") throw new Error("缺少图片");
	if (!imageDataUrl.startsWith("data:image/jpeg") && !imageDataUrl.startsWith("data:image/png")) throw new Error("只支持 JPG 或 PNG");
	if (imageDataUrl.length > 14e5) throw new Error("图片过大");
	return { imageDataUrl };
}).handler(scanReceipt_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "识别功能暂时不可用"
	};
	let result = await completeVision(apiKey, [{
		type: "input_image",
		image_url: data.imageDataUrl,
		detail: "high"
	}, {
		type: "input_text",
		text: SCAN_PROMPT
	}]);
	if (!result.ok) result = await completeVision(apiKey, [{
		type: "image_url",
		image_url: { url: data.imageDataUrl },
		detail: "high"
	}, {
		type: "text",
		text: SCAN_PROMPT
	}]);
	if (!result.ok) return {
		ok: false,
		error: "识别服务忙，请稍后再试"
	};
	if (!result.text.trim()) return {
		ok: false,
		error: "没有读出内容，请换一张更清楚的图"
	};
	try {
		return normalizeDraft(extractJson(result.text));
	} catch {
		return {
			ok: false,
			error: "识别结果无法解读，请再拍一次"
		};
	}
});
//#endregion
export { scanReceipt_createServerFn_handler };
