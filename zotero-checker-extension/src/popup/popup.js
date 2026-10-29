const $ = (sel) => document.querySelector(sel);
const send = (msg) => chrome.runtime.sendMessage(msg);

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let activeTab = null;

function timeAgo(ts) {
  if (!ts) return "尚未同步";
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return "刚刚同步";
  if (s < 3600) return `${Math.round(s / 60)} 分钟前同步`;
  if (s < 86400) return `${Math.round(s / 3600)} 小时前同步`;
  return `${Math.round(s / 86400)} 天前同步`;
}

function renderStatus(st) {
  const el = $("#status");
  const textEl = $("#statusText");
  el.className = "status";
  el.querySelector("a")?.remove();
  $("#syncBtn").classList.toggle("spin", Boolean(st?.syncing));
  if (!st) {
    textEl.textContent = "无法连接扩展后台";
    el.classList.add("err");
    return;
  }
  const source = st.source === "web" ? "Zotero 网页 API" : "本地 Zotero";
  if (st.syncing && st.progress) {
    const { library, done, total } = st.progress;
    textEl.textContent = `正在同步「${library}」${done}${total ? " / " + total : ""} 条…`;
    el.classList.add("warn");
  } else if (st.error && st.total) {
    textEl.textContent = `${source}暂时无法连接，使用缓存（${st.total.toLocaleString()} 条）`;
    textEl.title = st.error.message;
    el.classList.add("warn");
  } else if (st.error) {
    textEl.textContent = st.error.message;
    el.classList.add("err");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "去设置";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
    el.appendChild(a);
  } else if (st.syncing) {
    textEl.textContent = "正在同步文库…";
    el.classList.add("warn");
  } else {
    const libs = st.libraries.length > 1 ? `（${st.libraries.length} 个文库）` : "";
    textEl.textContent = `${source} · ${st.total.toLocaleString()} 条${libs} · ${timeAgo(st.lastSync)}`;
    textEl.title = st.libraries.map((l) => `${l.name}：${l.count} 条`).join("\n");
    el.classList.add("ok");
  }
}

function matchHtml(m) {
  const sub = [m.creators, m.year, m.publication].filter(Boolean).map(esc).join(" · ");
  const reason = m.reason === "相似标题" ? `相似度 ${Math.round(m.score * 100)}%` : `匹配：${m.reason}`;
  return `<div class="match">
    <div class="mtitle">${esc(m.title)}</div>
    <div class="msub">${sub ? `<span>${sub}</span>` : ""}<span class="tag">${esc(m.library)}</span><span class="tag">${esc(reason)}</span></div>
    <div class="actions">
      <button class="btn small primary" data-open="${esc(m.selectUrl)}">在 Zotero 中打开</button>
      ${m.webUrl ? `<button class="btn small" data-web="${esc(m.webUrl)}">网页版</button>` : ""}
    </div>
  </div>`;
}

const VERDICT = {
  found: ["✓", "已在 Zotero 库中"],
  possible: ["?", "可能已有相似条目，请核对"],
  notFound: ["+", "不在 Zotero 库中，可以添加"],
  error: ["!", "无法读取 Zotero 文库"],
};

function renderPage(info, result) {
  const el = $("#page");
  if (!info || !info.paper) {
    el.className = "page-card muted";
    el.textContent = "这个页面没有识别到文献信息。可以在下方手动粘贴 DOI 或标题查询。";
    if (!result || result.status !== "found") return;
  }
  el.className = "page-card";
  const ids = [];
  if (info?.doi) ids.push(`DOI ${shortDoi(info.doi)}`);
  if (info?.arxiv) ids.push(`arXiv ${info.arxiv.replace(/^.*\//, "")}`);
  if (info?.pmid) ids.push(`PMID ${info.pmid}`);
  const detected = info?.paper
    ? `<div class="detected">${info.title ? `<div class="ptitle">${esc(info.title)}</div>` : ""}${
        ids.length ? `<div>${ids.map(esc).join(" · ")}</div>` : ""
      }</div>`
    : "";
  if (!result) {
    el.innerHTML = `${detected}<div class="muted">正在检查…</div>`;
    return;
  }
  const v = VERDICT[result.status] || VERDICT.notFound;
  const extra = result.status === "error" ? `<div class="muted" style="margin-top:6px">${esc(result.index?.error?.message || "")}</div>` : "";
  el.innerHTML = `${detected}
    <div class="verdict ${esc(result.status)}"><span class="ico">${v[0]}</span>${v[1]}${
      result.matches.length > 1 ? `<small>${result.matches.length} 条</small>` : ""
    }</div>${extra}
    ${result.matches.map(matchHtml).join("")}`;
}

function shortDoi(raw) {
  const m = decodeSafe(raw).match(/10\.\d{4,9}\/[^\s?#]+/);
  return m ? m[0] : raw;
}

function decodeSafe(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

async function pageInfoFromTab(tab) {
  if (!tab?.id) return null;
  try {
    const info = await chrome.tabs.sendMessage(tab.id, { type: "getPageInfo" });
    if (info) return info;
  } catch {
    // No content script: PDF viewer, chrome:// pages, or tabs opened before install.
  }
  if (!tab.url || !/^https?:/i.test(tab.url)) return null;
  const url = decodeSafe(tab.url);
  const paper = /10\.\d{4,9}\/|arxiv\.org\/(abs|pdf|html)\/|pubmed\.ncbi\.nlm\.nih\.gov\/\d/i.test(url);
  return { url: tab.url, doi: /10\.\d{4,9}\//.test(url) ? tab.url : "", paper };
}

async function checkCurrentPage() {
  [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const info = await pageInfoFromTab(activeTab);
  renderPage(info, null);
  if (!info) return;
  const result = await send({ type: "checkInfo", info, tabId: activeTab?.id });
  if (result?.index) renderStatus(result.index);
  if (result && !result.error) renderPage(info, result);
  // Keep the in-page card in sync with what the popup just found.
  if (activeTab?.id) chrome.tabs.sendMessage(activeTab.id, { type: "recheck" }).catch(() => {});
}

async function runQuery() {
  const lines = $("#query")
    .value.split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 200);
  const out = $("#queryResults");
  if (!lines.length) {
    out.innerHTML = "";
    return;
  }
  $("#queryBtn").disabled = true;
  out.innerHTML = `<div class="summary">正在查询…</div>`;
  try {
    const results = await send({ type: "checkText", lines });
    if (!Array.isArray(results)) throw new Error(results?.error || "查询失败");
    const count = (s) => results.filter((r) => r.status === s).length;
    const f = count("found");
    const p = count("possible");
    const n = results.length - f - p;
    const summary =
      results.length > 1
        ? `<div class="summary">共 ${results.length} 条：<b class="f">${f} 已收录</b> · <b class="p">${p} 可能重复</b> · ${n} 未收录</div>`
        : `<div class="summary"></div>`;
    const ICON = { found: "✓", possible: "?", notFound: "+", empty: "–", error: "!" };
    const LABEL = { found: "已收录", possible: "可能重复", notFound: "未收录", empty: "无法识别", error: "无法读取文库" };
    out.innerHTML =
      summary +
      results
        .map(
          (r) => `<div class="qr ${esc(r.status)}"><span class="ico">${ICON[r.status] || "+"}</span><div>
            <div class="line" title="${esc(r.line)}"><b>${LABEL[r.status] || ""}</b> · ${esc(r.line)}</div>
            ${r.matches.slice(0, r.status === "found" ? 1 : 2).map(matchHtml).join("")}
          </div></div>`,
        )
        .join("");
  } catch (e) {
    out.innerHTML = `<div class="summary">${esc(e.message || e)}</div>`;
  } finally {
    $("#queryBtn").disabled = false;
  }
}

document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) {
    send({ type: "openUrl", url: open.getAttribute("data-open"), tabId: activeTab?.id });
    return;
  }
  const web = e.target.closest("[data-web]");
  if (web) send({ type: "openUrl", url: web.getAttribute("data-web") });
});

$("#queryBtn").addEventListener("click", runQuery);
$("#query").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runQuery();
});
$("#optionsBtn").addEventListener("click", () => chrome.runtime.openOptionsPage());
$("#syncBtn").addEventListener("click", async () => {
  $("#syncBtn").classList.add("spin");
  renderStatus(await send({ type: "sync" }));
  checkCurrentPage();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "statusChanged") renderStatus(msg.status);
});

send({ type: "getStatus" }).then(renderStatus);
checkCurrentPage();
