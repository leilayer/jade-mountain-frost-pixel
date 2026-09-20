export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;
  const run = () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* 预览或无 SW 环境忽略 */
    });
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}
