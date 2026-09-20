import { type ReactNode, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  Camera,
  LayoutDashboard,
  PiggyBank,
  Plus,
  Wallet,
} from "lucide-react";
import { CurrencyBar } from "@/components/finance/currency-bar";
import { ReceiptScanner } from "@/components/finance/receipt-scanner";
import { TransactionComposer } from "@/components/finance/transaction-composer";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/lib/finance/store";
import { registerServiceWorker } from "@/lib/pwa/register-sw";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "总览", icon: LayoutDashboard },
  { to: "/calendar", label: "日历", icon: CalendarDays },
  { to: "/budget", label: "预算", icon: Wallet },
  { to: "/savings", label: "储蓄", icon: PiggyBank },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const openCreate = useUiStore((s) => s.openCreate);
  const openScan = useUiStore((s) => s.openScan);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <div id="app" className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-52 shrink-0 flex-col border-r border-border px-4 py-6 md:flex">
          <Brand />
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-primary text-primary-fg"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <CurrencyBar className="mb-3 w-full" />
          <Button
            variant="outline"
            className="mb-2 w-full"
            onClick={() => openScan()}
          >
            <Camera className="size-4" />
            扫收据
          </Button>
          <Button className="w-full" onClick={() => openCreate()}>
            <Plus className="size-4" />
            记一笔
          </Button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-bg/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-sm md:hidden">
            <Brand compact />
            <div className="flex items-center gap-2">
              <CurrencyBar compact />
              <Button
                size="icon"
                variant="outline"
                className="size-10"
                aria-label="扫描收据"
                onClick={() => openScan()}
              >
                <Camera className="size-4" />
              </Button>
              <Button size="sm" onClick={() => openCreate()}>
                <Plus className="size-4" />
                记一笔
              </Button>
            </div>
          </header>
          <main className="flex-1 px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-10">
            {children}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium",
                    active ? "text-primary" : "text-subtle",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <TransactionComposer />
      <ReceiptScanner />
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-fg">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path d="M12 12 L12 5 A7 7 0 0 1 18.1 15.5 Z" fill="currentColor" />
        </svg>
      </span>
      <div className="leading-tight">
        <p className="font-display text-lg font-medium tracking-tight">澄账</p>
        {compact ? null : (
          <p className="text-xs text-subtle">把每一笔看清楚</p>
        )}
      </div>
    </div>
  );
}
