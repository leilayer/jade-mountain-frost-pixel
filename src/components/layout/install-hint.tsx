import { Download, Monitor, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useInstallPrompt, type InstallPlatform } from "@/lib/pwa/install";
import { cn } from "@/lib/utils";

const COPY: Record<
  InstallPlatform,
  { title: string; body: string; cta: string }
> = {
  android: {
    title: "安装到 Android",
    body: "用 Chrome 打开本页，点安装后会出现在主屏幕，全屏使用，数据仍保存在这台手机上。",
    cta: "安装到主屏幕",
  },
  windows: {
    title: "安装到 Windows",
    body: "用 Edge 或 Chrome 打开，点安装后会出现在开始菜单，像普通软件一样独立窗口运行。",
    cta: "安装到电脑",
  },
  other: {
    title: "安装到手机或电脑",
    body: "Android 请用 Chrome；Windows 请用 Edge 或 Chrome。打开本页后即可安装到主屏幕或开始菜单。",
    cta: "安装应用",
  },
};

export function InstallHint({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const prompt = useInstallPrompt();
  if (!prompt.visible) return null;
  const copy = COPY[prompt.platform];
  const Icon =
    prompt.platform === "windows"
      ? Monitor
      : prompt.platform === "android"
        ? Smartphone
        : Download;

  async function onInstall() {
    if (prompt.canPrompt) {
      const ok = await prompt.install();
      if (ok) toast.success("已安装澄账");
      return;
    }
    toast.message(
      prompt.platform === "windows"
        ? "请看地址栏右侧的安装图标，或打开浏览器菜单里的「安装应用」。"
        : "请打开 Chrome 菜单，选择「安装应用」或「添加到主屏幕」。",
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onInstall}
        className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-surface-2 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2/80"
      >
        <Icon className="size-4" />
        {copy.cta}
      </button>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-fg">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-medium tracking-tight">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{copy.body}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 text-muted"
          aria-label="关闭安装提示"
          onClick={prompt.dismiss}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className={cn("mt-3 flex flex-wrap gap-2")}>
        <Button className="flex-1" onClick={onInstall}>
          <Download className="size-4" />
          {copy.cta}
        </Button>
        <Button variant="outline" onClick={prompt.dismiss}>
          稍后再说
        </Button>
      </div>
    </section>
  );
}
