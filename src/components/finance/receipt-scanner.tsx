import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, ImagePlus, LoaderCircle, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { CurrencyChips, MapCurrencyChips } from "@/components/finance/currency-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoriesFor } from "@/lib/finance/categories";
import { compressReceiptImage } from "@/lib/finance/compress-image";
import {
  convert,
  currencyMeta,
  formatMoney,
  type CurrencyCode,
} from "@/lib/finance/currency";
import { todayIso } from "@/lib/finance/format";
import { scanReceipt, type ReceiptDraft } from "@/lib/finance/scan-receipt";
import { useFinanceStore, useUiStore } from "@/lib/finance/store";
import type { TxType } from "@/lib/finance/types";
import { cn } from "@/lib/utils";

const QUOTA_KEY = "chengzhang-scan-quota";
const QUOTA_MAX = 20;

function takeQuota(): boolean {
  const day = todayIso();
  try {
    const raw = window.localStorage.getItem(QUOTA_KEY);
    const data = raw ? (JSON.parse(raw) as { day?: string; n?: number }) : {};
    const n = data.day === day ? data.n ?? 0 : 0;
    if (n >= QUOTA_MAX) return false;
    window.localStorage.setItem(QUOTA_KEY, JSON.stringify({ day, n: n + 1 }));
    return true;
  } catch {
    return true;
  }
}

function refundQuota() {
  const day = todayIso();
  try {
    const raw = window.localStorage.getItem(QUOTA_KEY);
    const data = raw ? (JSON.parse(raw) as { day?: string; n?: number }) : {};
    if (data.day !== day) return;
    window.localStorage.setItem(
      QUOTA_KEY,
      JSON.stringify({ day, n: Math.max(0, (data.n ?? 1) - 1) }),
    );
  } catch {
    /* ignore */
  }
}

export function ReceiptScanner() {
  const scanOpen = useUiStore((s) => s.scanOpen);
  const closeScan = useUiStore((s) => s.closeScan);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const baseCurrency = useFinanceStore((s) => s.baseCurrency);
  const rates = useFinanceStore((s) => s.rates);

  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<ReceiptDraft | null>(null);

  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(baseCurrency);
  const [mapTo, setMapTo] = useState<CurrencyCode | null>(null);
  const [category, setCategory] = useState(categoriesFor("expense")[0]);
  const [date, setDate] = useState(todayIso());
  const [note, setNote] = useState("");
  const [merchant, setMerchant] = useState("");

  useEffect(() => {
    if (!scanOpen) {
      setPreview(null);
      setDraft(null);
      setBusy(false);
    }
  }, [scanOpen]);

  useEffect(() => {
    const list = categoriesFor(type);
    if (!list.includes(category as (typeof list)[number])) {
      setCategory(list[0]);
    }
  }, [type, category]);

  function applyDraft(next: ReceiptDraft) {
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

  async function onFile(file: File | undefined) {
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

  function submit(e: FormEvent) {
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
      mapTo: mapTo && mapTo !== currency ? mapTo : undefined,
      category,
      date: date || todayIso(),
      note: note.trim() || merchant.trim() || category,
      merchant: merchant.trim() || undefined,
      items: draft?.items,
      source: "receipt",
    });
    toast.success(type === "income" ? "已从收据记下收入" : "已从收据记下支出");
    closeScan();
  }

  const cats = categoriesFor(type);
  const parsed = Number(amount);
  const converted =
    Number.isFinite(parsed) && parsed > 0 && mapTo && mapTo !== currency
      ? convert(parsed, currency, mapTo, rates)
      : null;

  return (
    <Dialog open={scanOpen} onOpenChange={(o) => !o && closeScan()}>
      <DialogContent className="max-h-[min(90dvh,42rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>扫描收据</DialogTitle>
          <DialogDescription>
            拍收银小票或选电子收据截图，识别后请再核对一眼再入账。
          </DialogDescription>
        </DialogHeader>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <input
          ref={albumRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {!draft ? (
          <div className="grid gap-3">
            <button
              type="button"
              disabled={busy}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                void onFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => albumRef.current?.click()}
              className="grid min-h-40 place-items-center rounded-xl border border-dashed border-border bg-surface-2/60 px-4 py-6 text-center"
            >
              {busy ? (
                <div className="grid justify-items-center gap-2 text-muted">
                  <LoaderCircle className="size-6 animate-spin" />
                  <p className="text-sm">正在识别小票…</p>
                </div>
              ) : preview ? (
                <img
                  src={preview}
                  alt="待识别的收据"
                  className="max-h-48 rounded-md object-contain"
                />
              ) : (
                <div className="grid justify-items-center gap-2">
                  <ScanLine className="size-8 text-primary" />
                  <p className="text-sm font-medium">把小票照片拖到这里，或点此从相册选</p>
                  <p className="text-xs text-subtle">
                    支持超市小票、餐厅账单、微信 / 支付宝截图
                  </p>
                </div>
              )}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => cameraRef.current?.click()}
              >
                <Camera className="size-4" />
                拍照
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => albumRef.current?.click()}
              >
                <ImagePlus className="size-4" />
                相册
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            {preview ? (
              <img
                src={preview}
                alt="已识别的收据"
                className="mx-auto max-h-28 rounded-md object-contain"
              />
            ) : null}
            {merchant ? (
              <p className="text-center font-display text-lg font-medium">
                {merchant}
              </p>
            ) : null}
            {draft.items.length > 0 ? (
              <ul className="max-h-28 overflow-y-auto rounded-lg bg-surface-2/70 px-3 py-2 text-sm">
                {draft.items.map((item, i) => (
                  <li key={`${item.name}-${i}`} className="flex justify-between gap-3 py-1">
                    <span className="truncate text-muted">{item.name}</span>
                    <span className="tabular-nums">
                      {formatMoney(item.amount, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={cn(
                  "h-10 rounded-md text-sm font-medium",
                  type === "expense"
                    ? "bg-surface text-expense shadow-[var(--shadow-border)]"
                    : "text-muted",
                )}
              >
                支出
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={cn(
                  "h-10 rounded-md text-sm font-medium",
                  type === "income"
                    ? "bg-surface text-income shadow-[var(--shadow-border)]"
                    : "text-muted",
                )}
              >
                收入
              </button>
            </div>

            <div className="grid gap-1.5">
              <Label>币种</Label>
              <CurrencyChips
                value={currency}
                onChange={(code) => {
                  setCurrency(code);
                  setMapTo((prev) => {
                    if (prev === code) return code === "CNY" ? null : "CNY";
                    if (code !== "CNY" && prev == null) return "CNY";
                    if (code === "CNY" && prev === "CNY") return null;
                    return prev;
                  });
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>映射货币</Label>
              <MapCurrencyChips
                payment={currency}
                value={mapTo}
                onChange={setMapTo}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="scan-amount">金额</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-display text-lg text-muted">
                  {currencyMeta(currency).suffix
                    ? currencyMeta(currency).code
                    : currencyMeta(currency).symbol}
                </span>
                <Input
                  id="scan-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 pl-12 font-display text-2xl tabular-nums"
                />
              </div>
              {converted != null && mapTo ? (
                <p className="text-xs text-muted">
                  约合 {formatMoney(converted, mapTo)}
                </p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label>分类（已自动判断，可改）</Label>
              <div className="flex flex-wrap gap-1.5">
                {cats.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      "h-9 rounded-full px-3 text-sm",
                      category === c
                        ? "bg-primary text-primary-fg"
                        : "bg-surface-2 text-muted hover:text-fg",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="scan-merchant">商户</Label>
              <Input
                id="scan-merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                maxLength={40}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="scan-date">日期</Label>
              <Input
                id="scan-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="scan-note">备注</Label>
              <Input
                id="scan-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={40}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDraft(null);
                  setPreview(null);
                }}
              >
                换一张
              </Button>
              <Button type="submit" variant={type === "expense" ? "expense" : "income"}>
                记入账本
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
