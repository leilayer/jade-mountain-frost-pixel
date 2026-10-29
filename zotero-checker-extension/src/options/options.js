import { getSettings, saveSettings } from "../lib/settings.js";
import { ZoteroClient } from "../lib/zotero-api.js";

const $ = (sel) => document.querySelector(sel);
const send = (msg) => chrome.runtime.sendMessage(msg);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

function renderKeyInfo(settings) {
  if (settings.userId && settings.apiKey) {
    $("#keyInfo").innerHTML = `<span class="ok-text">✓ 已验证：${esc(settings.username || "用户")}（ID ${esc(settings.userId)}）</span>`;
  }
}

function renderStatus(st) {
  const box = $("#statusBox");
  box.className = "status-box";
  if (!st) {
    box.textContent = "无法连接扩展后台";
    return;
  }
  if (st.syncing) {
    const p = st.progress;
    box.textContent = p ? `正在同步「${p.library}」：${p.done}${p.total ? " / " + p.total : ""} 条…` : "正在同步…";
    return;
  }
  if (st.error) {
    box.classList.add("err");
    box.innerHTML = esc(st.error.message) + (st.total ? `<div class="small">仍可使用上次缓存的 ${st.total} 条记录。</div>` : "");
    return;
  }
  if (!st.lastSync) {
    box.textContent = "尚未同步。";
    return;
  }
  box.classList.add("ok");
  box.innerHTML = `✓ 已连接，共 ${st.total.toLocaleString()} 条文献（${new Date(st.lastSync).toLocaleString()} 同步）
    <ul>${st.libraries.map((l) => `<li>${esc(l.name)}：${l.count.toLocaleString()} 条</li>`).join("")}</ul>`;
}

async function init() {
  const s = await getSettings();
  for (const r of document.querySelectorAll('input[name="source"]')) r.checked = r.value === s.source;
  $("#apiKey").value = s.apiKey;
  for (const id of ["includeGroups", "showBanner", "showNotFound", "annotateLinks"]) $("#" + id).checked = s[id];
  $("#fuzzyThreshold").value = s.fuzzyThreshold;
  $("#fuzzyValue").textContent = `${Math.round(s.fuzzyThreshold * 100)}%`;
  $("#showNotFound").disabled = !s.showBanner;
  renderKeyInfo(s);
  renderStatus(await send({ type: "getStatus" }));
}

for (const r of document.querySelectorAll('input[name="source"]')) {
  r.addEventListener("change", async () => {
    await saveSettings({ source: r.value });
    toast(r.value === "web" ? "已切换为网页 API" : "已切换为本地 Zotero");
  });
}

for (const id of ["includeGroups", "showBanner", "showNotFound", "annotateLinks"]) {
  $("#" + id).addEventListener("change", async (e) => {
    await saveSettings({ [id]: e.target.checked });
    if (id === "showBanner") $("#showNotFound").disabled = !e.target.checked;
    toast("已保存");
  });
}

$("#fuzzyThreshold").addEventListener("input", (e) => {
  $("#fuzzyValue").textContent = `${Math.round(Number(e.target.value) * 100)}%`;
});
$("#fuzzyThreshold").addEventListener("change", async (e) => {
  await saveSettings({ fuzzyThreshold: Number(e.target.value) });
  toast("已保存");
});

$("#verifyBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const key = $("#apiKey").value.trim();
  if (!key) return toast("请先粘贴 API Key");
  $("#verifyBtn").disabled = true;
  $("#keyInfo").textContent = "正在验证…";
  try {
    const info = await ZoteroClient.verifyKey(key);
    const s = await saveSettings({ source: "web", apiKey: key, userId: String(info.userID), username: info.username || "" });
    for (const r of document.querySelectorAll('input[name="source"]')) r.checked = r.value === "web";
    renderKeyInfo(s);
    if (!info.access?.user?.library) {
      $("#keyInfo").innerHTML += `<div class="err-text">这个 Key 没有“个人文库读取”权限，请在 zotero.org 修改。</div>`;
    }
    toast("API Key 已保存，正在同步…");
  } catch (err) {
    $("#keyInfo").innerHTML = `<span class="err-text">${esc(err.message)}</span>`;
  } finally {
    $("#verifyBtn").disabled = false;
  }
});

$("#syncBtn").addEventListener("click", async () => {
  $("#syncBtn").disabled = true;
  renderStatus({ syncing: true });
  try {
    renderStatus(await send({ type: "sync" }));
  } finally {
    $("#syncBtn").disabled = false;
  }
});

$("#clearBtn").addEventListener("click", async () => {
  $("#clearBtn").disabled = true;
  renderStatus({ syncing: true });
  try {
    renderStatus(await send({ type: "clearCache" }));
  } finally {
    $("#clearBtn").disabled = false;
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "statusChanged") renderStatus(msg.status);
});

init();
