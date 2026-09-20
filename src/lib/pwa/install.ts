import { useEffect, useState } from "react";

const DISMISS_KEY = "chengzhang-install-dismissed";
const DISMISS_EVENT = "chengzhang-install-dismiss";

export type InstallPlatform = "android" | "windows" | "other";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function detectPlatform(ua = ""): InstallPlatform {
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  return "other";
}

export function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [platform, setPlatform] = useState<InstallPlatform>("other");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStandalone(isStandaloneMode());
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    setPlatform(detectPlatform(window.navigator.userAgent));
    setReady(true);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const onDismiss = () => setDismissed(true);
    window.addEventListener(DISMISS_EVENT, onDismiss);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener(DISMISS_EVENT, onDismiss);
    };
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }

  async function install() {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === "accepted") setStandalone(true);
    return choice.outcome === "accepted";
  }

  return {
    ready,
    deferred,
    standalone,
    dismissed,
    platform,
    visible: ready && !standalone && !dismissed,
    canPrompt: Boolean(deferred),
    dismiss,
    install,
  };
}
