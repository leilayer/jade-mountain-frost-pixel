import { chromium } from "playwright";

const UA = {
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
};

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

async function shot(name, { ua, viewport }) {
  const context = await browser.newContext({
    userAgent: ua,
    viewport,
    locale: "zh-CN",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const text = await page.locator("body").innerText();
  await page.screenshot({ path: `/workspace/screenshots/${name}.png` });
  const manifests = await page.locator('link[rel="manifest"]').evaluateAll((els) =>
    els.map((e) => e.getAttribute("href")),
  );
  await context.close();
  return {
    name,
    hasAndroid: /安装到 Android|主屏幕/.test(text),
    hasWindows: /安装到 Windows|开始菜单/.test(text),
    hasGeneric: /安装到手机或电脑|安装应用/.test(text),
    manifests,
    snippet: text.replace(/\s+/g, " ").slice(0, 420),
  };
}

const android = await shot("qa-install-android", {
  ua: UA.android,
  viewport: { width: 390, height: 844 },
});
const windows = await shot("qa-install-windows", {
  ua: UA.windows,
  viewport: { width: 1280, height: 800 },
});

console.log(JSON.stringify({ errors, android, windows }, null, 2));
await browser.close();
