// Content script: reads citation metadata from the page, asks the background
// worker whether the paper is in Zotero, and shows a small status card. On
// search-result pages (Google Scholar, PubMed, arXiv, CNKI …) and for DOI links
// it adds inline "in Zotero" badges.
(() => {
  if (window.top !== window || window.__zlcLoaded) return;
  window.__zlcLoaded = true;

  const DEFAULTS = { showBanner: true, showNotFound: true, annotateLinks: true };
  let settings = { ...DEFAULTS };
  let lastUrl = location.href;
  let lastResult = null;
  let lastResultSig = "";
  let dismissedSig = null;
  let alive = true;

  // ---------- messaging ----------
  function send(msg) {
    return new Promise((resolve) => {
      if (!alive) return resolve(null);
      try {
        chrome.runtime.sendMessage(msg, (res) => {
          if (chrome.runtime.lastError) resolve(null);
          else resolve(res);
        });
      } catch {
        // Extension was reloaded/removed: this script is orphaned.
        alive = false;
        resolve(null);
      }
    });
  }

  // ---------- metadata extraction ----------
  const DOI_RE = /10\.\d{4,9}\/[^\s"'<>]+/;

  function metaValues(name) {
    const out = [];
    for (const el of document.querySelectorAll(`meta[name="${name}" i], meta[property="${name}" i]`)) {
      const c = (el.getAttribute("content") || "").trim();
      if (c) out.push(c);
    }
    return out;
  }
  const meta = (...names) => {
    for (const n of names) {
      const v = metaValues(n)[0];
      if (v) return v;
    }
    return "";
  };
  const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");

  function findDoi() {
    const direct = meta("citation_doi", "prism.doi", "bepress_citation_doi", "dc.identifier.doi", "eprints.doi", "wkhealth_doi");
    if (direct) return direct;
    for (const v of [...metaValues("dc.identifier"), ...metaValues("citation_identifier")]) {
      if (DOI_RE.test(v)) return v;
    }
    const urlMatch = decodeURIComponentSafe(location.href).match(DOI_RE);
    if (urlMatch) return location.href; // background strips publisher path suffixes
    // ScienceDirect & co. show the article DOI as a link with class "doi".
    const link = document.querySelector('a.doi[href*="10."], a[class~="doi"][href*="doi.org"]');
    if (link && DOI_RE.test(link.href)) return link.href;
    const holder = document.querySelector("body[data-doi], article[data-doi], main[data-doi]");
    return holder ? holder.getAttribute("data-doi") : "";
  }

  function decodeURIComponentSafe(s) {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  }

  function cleanDocTitle(t) {
    const parts = String(t || "").split(/\s+[|–—-]\s+/);
    return (parts.sort((a, b) => b.length - a.length)[0] || "").trim();
  }

  function extractPageInfo() {
    const url = location.href;
    const host = location.hostname;
    const info = { url, doi: "", arxiv: "", pmid: "", isbn: "", title: "", authors: "", year: "", journal: "", paper: false };

    info.doi = findDoi();
    info.arxiv = meta("citation_arxiv_id") || ((url.match(/arxiv\.org\/(?:abs|pdf|html)\/([^?#]+)/i) || [])[1] || "");
    info.pmid = meta("citation_pmid") || ((url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i) || [])[1] || "");
    info.isbn = metaValues("citation_isbn").join(" ");
    info.title = meta("citation_title", "dc.title", "eprints.title", "bepress_citation_title", "wkhealth_title", "prism.title");

    // Sites without citation_* metadata.
    if (!info.title && /cnki\.(net|com)/.test(host)) info.title = text(document.querySelector(".wx-tit h1, .title h1, h1.title"));
    if (!info.title && /wanfangdata\.com\.cn/.test(host)) info.title = text(document.querySelector(".detailTitleCN, .detailTitle h1, h1"));
    if (!info.title && (info.doi || info.arxiv || info.pmid)) {
      info.title = meta("og:title") || cleanDocTitle(document.title);
    }

    info.authors = meta("citation_author", "dc.creator", "citation_authors");
    info.year = (meta("citation_publication_date", "citation_date", "citation_online_date", "dc.date", "prism.publicationDate").match(/\d{4}/) || [""])[0];
    info.journal = meta("citation_journal_title", "citation_conference_title", "citation_publisher", "prism.publicationName", "og:site_name");
    info.paper = Boolean(info.doi || info.arxiv || info.pmid || info.isbn || info.title);
    return info;
  }

  // ---------- floating card ----------
  let bannerHost = null;
  let hideTimer = null;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const BANNER_CSS = `
    :host { all: initial; }
    .card {
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483646;
      width: min(360px, calc(100vw - 32px)); box-sizing: border-box;
      font: 13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      color: #1f2328; background: #fff; border: 1px solid #d8dee4; border-left: 4px solid var(--accent);
      border-radius: 10px; box-shadow: 0 8px 28px rgba(15, 23, 42, .18); padding: 12px 14px;
      animation: zlc-in .18s ease-out;
    }
    .card.found { --accent: #1e8e3e; } .card.possible { --accent: #e37400; } .card.notFound { --accent: #8b95a1; }
    .card.compact { padding: 8px 12px; width: auto; max-width: calc(100vw - 32px); }
    @keyframes zlc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .head { display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex: none; }
    .head .label { flex: 1; }
    .x { all: unset; cursor: pointer; color: #6e7781; font-size: 16px; line-height: 1; padding: 2px 4px; border-radius: 4px; }
    .x:hover { background: #f0f2f4; color: #1f2328; }
    .item { margin-top: 8px; }
    .item + .item { padding-top: 8px; border-top: 1px dashed #e5e8eb; }
    .title { font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .sub { color: #57606a; font-size: 12px; margin-top: 2px; }
    .tag { display: inline-block; font-size: 11px; padding: 0 6px; border-radius: 999px; background: #f0f2f4; color: #57606a; margin-left: 4px; }
    .actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .btn { all: unset; cursor: pointer; font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 6px; background: var(--accent); color: #fff; }
    .btn.ghost { background: transparent; color: #1f2328; border: 1px solid #d0d7de; padding: 3px 9px; }
    .btn:hover { filter: brightness(.95); }
    @media (prefers-color-scheme: dark) {
      .card { color: #e6edf3; background: #1c2128; border-color: #373e47; }
      .sub, .x { color: #9da7b3; } .x:hover { background: #2d333b; color: #e6edf3; }
      .tag { background: #2d333b; color: #adbac7; } .item + .item { border-color: #373e47; }
      .btn.ghost { color: #e6edf3; border-color: #444c56; }
    }
  `;

  function removeBanner() {
    clearTimeout(hideTimer);
    if (bannerHost) bannerHost.remove();
    bannerHost = null;
  }

  function renderBanner(result) {
    removeBanner();
    if (!settings.showBanner || !result) return;
    const { status } = result;
    if (!["found", "possible", "notFound"].includes(status)) return;
    if (status === "notFound" && !settings.showNotFound) return;
    if (dismissedSig === lastResultSig) return;

    bannerHost = document.createElement("zlc-banner");
    const root = bannerHost.attachShadow({ mode: "open" });
    const labels = {
      found: "已在 Zotero 库中",
      possible: "Zotero 中可能已有这篇文献",
      notFound: "这篇文献不在 Zotero 库中",
    };
    let body = "";
    if (status !== "notFound") {
      body = result.matches
        .slice(0, 2)
        .map((m) => {
          const sub = [m.creators, m.year, m.library].filter(Boolean).map(esc).join(" · ");
          const reason = status === "possible" && m.reason === "相似标题" ? `相似度 ${Math.round(m.score * 100)}%` : `匹配：${m.reason}`;
          return `<div class="item">
            <div class="title">${esc(m.title)}</div>
            <div class="sub">${sub}<span class="tag">${esc(reason)}</span></div>
            <div class="actions">
              <a class="btn" data-open="${esc(m.selectUrl)}">在 Zotero 中打开</a>
              ${m.webUrl ? `<a class="btn ghost" data-web="${esc(m.webUrl)}">网页版</a>` : ""}
            </div>
          </div>`;
        })
        .join("");
    }
    const compact = status === "notFound";
    root.innerHTML = `<style>${BANNER_CSS}</style>
      <div class="card ${status}${compact ? " compact" : ""}" role="status">
        <div class="head"><span class="dot"></span><span class="label">${labels[status]}</span>
          <button class="x" title="关闭" aria-label="关闭">×</button></div>
        ${body}
      </div>`;
    root.querySelector(".x").addEventListener("click", () => {
      dismissedSig = lastResultSig;
      removeBanner();
    });
    for (const a of root.querySelectorAll("[data-open]")) {
      a.addEventListener("click", () => {
        location.href = a.getAttribute("data-open"); // handed to the zotero:// protocol handler
      });
    }
    for (const a of root.querySelectorAll("[data-web]")) {
      a.addEventListener("click", () => window.open(a.getAttribute("data-web"), "_blank", "noopener"));
    }
    document.documentElement.appendChild(bannerHost);
    if (compact) hideTimer = setTimeout(removeBanner, 6000);
  }

  // ---------- page check ----------
  let checking = false;
  async function checkPage() {
    if (checking) return;
    checking = true;
    try {
      const info = extractPageInfo();
      const result = await send({ type: "pageInfo", info });
      if (!result || result.error) return;
      const sig = `${location.href}|${result.status}|${(result.matches || []).map((m) => m.key).join(",")}`;
      if (sig === lastResultSig) return;
      lastResult = result;
      lastResultSig = sig;
      renderBanner(result);
    } finally {
      checking = false;
    }
  }

  // ---------- inline badges (search results, DOI links) ----------
  const processed = new WeakSet();

  function textWithout(el, skipSel) {
    const clone = el.cloneNode(true);
    for (const n of clone.querySelectorAll(skipSel)) n.remove();
    return text(clone);
  }

  const RULES = [
    { host: /(^|\.)scholar\.google\./, sel: ".gs_r .gs_rt", q: (el) => ({ title: textWithout(el, ".gs_ctc, .gs_ctu, .gs_ctg2, .gs_ct1, .gs_ct2") }) },
    { host: /(^|\.)pubmed\.ncbi\.nlm\.nih\.gov$/, sel: "a.docsum-title", q: (el) => ({ title: text(el), pmid: el.getAttribute("data-article-id") || (el.getAttribute("href") || "").replace(/\D/g, "") }) },
    { host: /(^|\.)arxiv\.org$/, sel: 'dl dt a[href*="/abs/"], p.list-title a[href*="/abs/"]', q: (el) => ({ arxiv: el.getAttribute("href") }) },
    { host: /(^|\.)cnki\.(net|com)/, sel: ".result-table-list td.name a, .result-table-list a.fz14", q: (el) => ({ title: text(el) }) },
    { host: /(^|\.)xueshu\.baidu\.com$/, sel: ".sc_content h3 a", q: (el) => ({ title: text(el) }) },
    { host: /(^|\.)semanticscholar\.org$/, sel: 'a[data-test-id="title-link"]', q: (el) => ({ title: text(el) }) },
    { host: /(^|\.)webofscience\.com$/, sel: 'a[data-ta="summary-record-title-link"]', q: (el) => ({ title: text(el) }) },
    { host: /(^|\.)ieeexplore\.ieee\.org$/, sel: "xpl-results-item h3 a", q: (el) => ({ title: text(el) }) },
  ];

  function collectCandidates() {
    const out = [];
    const host = location.hostname;
    for (const rule of RULES) {
      if (!rule.host.test(host)) continue;
      for (const el of document.querySelectorAll(rule.sel)) {
        if (processed.has(el)) continue;
        processed.add(el);
        const q = rule.q(el);
        if (q.title || q.pmid || q.arxiv || q.doi) out.push({ el, q });
      }
    }
    // Any DOI link on any page (reference lists, reading lists, Wikipedia …).
    let n = 0;
    for (const a of document.querySelectorAll('a[href*="doi.org/10."]')) {
      if (++n > 400) break;
      if (processed.has(a) || a.closest("zlc-banner, zlc-badge")) continue;
      processed.add(a);
      out.push({ el: a, q: { doi: a.href } });
    }
    return out;
  }

  function makeBadge(result) {
    const m = result.matches[0];
    const found = result.status === "found";
    const host = document.createElement("zlc-badge");
    const root = host.attachShadow({ mode: "open" });
    const title = `${found ? "已在 Zotero 库中" : "Zotero 中可能已有相似条目"}：${m.title}${m.library ? " — " + m.library : ""}（点击在 Zotero 中打开）`;
    root.innerHTML = `<style>
      :host { all: initial; display: inline-block; vertical-align: middle; margin: 0 4px; }
      a { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;
        font: 600 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        padding: 3px 6px; border-radius: 999px; color: #fff; background: ${found ? "#1e8e3e" : "#e37400"}; white-space: nowrap; }
      a:hover { filter: brightness(.92); }
    </style><a title="${esc(title)}">${found ? "✓" : "≈"} Zotero</a>`;
    root.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.href = m.selectUrl;
    });
    return host;
  }

  let scanning = false;
  async function scanListings() {
    if (!settings.annotateLinks || scanning) return;
    scanning = true;
    try {
      const cands = collectCandidates();
      for (let i = 0; i < cands.length; i += 50) {
        const batch = cands.slice(i, i + 50);
        const results = await send({ type: "checkBatch", queries: batch.map((c) => c.q) });
        if (!Array.isArray(results)) return;
        results.forEach((res, j) => {
          if (!res || !["found", "possible"].includes(res.status) || !res.matches?.length) return;
          const { el } = batch[j];
          if (!el.isConnected || el.nextElementSibling?.tagName === "ZLC-BADGE") return;
          el.insertAdjacentElement("afterend", makeBadge(res));
        });
      }
    } finally {
      scanning = false;
    }
  }

  function removeBadges() {
    for (const b of document.querySelectorAll("zlc-badge")) b.remove();
  }

  // ---------- wiring ----------
  let scanTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      if (!alive) return observer.disconnect();
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        dismissedSig = null;
        checkPage();
      }
      scanListings();
    }, 800);
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "getPageInfo") {
      sendResponse(extractPageInfo());
    } else if (msg?.type === "recheck") {
      lastResultSig = "";
      dismissedSig = null;
      checkPage();
      sendResponse(true);
    }
    return false;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.settings) return;
    settings = { ...DEFAULTS, ...(changes.settings.newValue || {}) };
    renderBanner(lastResult);
    if (settings.annotateLinks) scanListings();
    else removeBadges();
  });

  // Re-check when the user comes back to the tab (e.g. after saving with the
  // Zotero Connector) and periodically while the paper is still missing.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkPage();
  });
  setInterval(() => {
    if (alive && document.visibilityState === "visible" && ["notFound", "possible"].includes(lastResult?.status)) checkPage();
  }, 30000);

  chrome.storage.local.get("settings").then(({ settings: s }) => {
    settings = { ...DEFAULTS, ...(s || {}) };
    checkPage();
    scanListings();
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
})();
