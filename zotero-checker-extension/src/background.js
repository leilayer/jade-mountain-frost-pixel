// Service worker: keeps a cached index of the Zotero library, answers match
// queries from the content script and popup, and drives the toolbar badge.

import { LibraryIndex, itemToRecord } from "./lib/library-index.js";
import { getSettings } from "./lib/settings.js";
import { ZoteroClient } from "./lib/zotero-api.js";

const META_KEY = "zlcMeta";
const itemsKey = (libId) => `zlcItems:${libId}`;
const CHECK_INTERVAL = { local: 15_000, web: 60_000 };
const UNVERSIONED_REFRESH = 5 * 60_000;
const SYNC_ALARM = "zlc-sync";

let meta = null; // {sourceId, libraries: {id: {...}}, lastSync, error}
let items = {}; // libId -> {itemKey: record}
let index = new LibraryIndex();
let loadPromise = null;
let syncPromise = null;
let lastCheck = 0;
let progress = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const emptyMeta = (sourceId = null) => ({ sourceId, libraries: {}, lastSync: 0, error: null });

function loadStore() {
  loadPromise ??= (async () => {
    const all = await chrome.storage.local.get(null);
    meta = all[META_KEY] || emptyMeta();
    items = {};
    for (const id of Object.keys(meta.libraries)) items[id] = all[itemsKey(id)] || {};
    rebuildIndex();
  })();
  return loadPromise;
}

function rebuildIndex() {
  const recs = [];
  for (const lib of Object.values(items)) recs.push(...Object.values(lib));
  index = new LibraryIndex(recs);
}

async function resetStore(sourceId) {
  const keys = Object.keys(meta.libraries).map(itemsKey);
  if (keys.length) await chrome.storage.local.remove(keys);
  meta = emptyMeta(sourceId);
  items = {};
  rebuildIndex();
}

function sync(opts) {
  syncPromise ??= doSync(opts).finally(() => {
    syncPromise = null;
  });
  return syncPromise;
}

async function doSync({ force = false } = {}) {
  await loadStore();
  const settings = await getSettings();
  let changed = false;
  try {
    const client = new ZoteroClient(settings);
    if (meta.sourceId !== client.sourceId) {
      await resetStore(client.sourceId);
      changed = true;
    }
    const libs = await client.listLibraries(settings.includeGroups);
    const keep = new Set(libs.map((l) => l.id));
    for (const id of Object.keys(meta.libraries)) {
      if (keep.has(id)) continue;
      delete meta.libraries[id];
      delete items[id];
      await chrome.storage.local.remove(itemsKey(id));
      changed = true;
    }

    for (const lib of libs) {
      const prev = meta.libraries[lib.id];
      let version;
      try {
        version = await client.getLibraryVersion(lib);
      } catch (e) {
        if (lib.type === "group") continue; // unreadable group: skip, keep the rest
        throw e;
      }
      const fresh = prev && (version != null ? prev.version === version : Date.now() - prev.fetchedAt < UNVERSIONED_REFRESH);
      if (prev) prev.name = lib.name;
      if (!force && fresh) continue;

      progress = { library: lib.name, done: 0, total: null };
      const onPage = (done, total) => {
        progress = { library: lib.name, done, total };
        broadcastStatus();
      };
      let libItems;
      // The Web API is slow and rate limited, so only pull what changed. The local
      // API is fast and returns everything in one go, so a full reload is simpler.
      if (!force && prev?.version != null && version != null && client.source === "web") {
        const res = await client.fetchItems(lib, { since: prev.version, onPage });
        const deleted = await client.fetchDeletedKeys(lib, prev.version);
        libItems = { ...items[lib.id] };
        for (const key of deleted) delete libItems[key];
        for (const json of res.items) {
          const key = json.key || json.data?.key;
          const rec = itemToRecord(json, lib.id);
          if (rec) libItems[key] = rec;
          else delete libItems[key];
        }
        version = res.version ?? version;
      } else {
        const res = await client.fetchItems(lib, { onPage });
        libItems = {};
        for (const json of res.items) {
          const rec = itemToRecord(json, lib.id);
          if (rec) libItems[rec.k] = rec;
        }
        version = res.version ?? version;
      }
      items[lib.id] = libItems;
      meta.libraries[lib.id] = {
        id: lib.id,
        type: lib.type,
        groupId: lib.groupId ?? null,
        name: lib.name,
        version,
        fetchedAt: Date.now(),
        count: Object.keys(libItems).length,
      };
      await chrome.storage.local.set({ [itemsKey(lib.id)]: libItems });
      changed = true;
    }
    meta.error = null;
    meta.lastSync = Date.now();
  } catch (e) {
    meta.error = { code: e.code || "ERROR", message: e.message || String(e) };
  } finally {
    progress = null;
    lastCheck = Date.now();
  }
  if (changed) rebuildIndex();
  await chrome.storage.local.set({ [META_KEY]: meta });
  await broadcastStatus();
}

// Tell an open popup / options page about sync progress.
async function broadcastStatus() {
  const status = await statusSummary();
  chrome.runtime.sendMessage({ type: "statusChanged", status }).catch(() => {});
}

// Make sure the index reflects recent library changes before answering.
async function ensureFresh(wait = 2500) {
  await loadStore();
  const settings = await getSettings();
  if (Date.now() - lastCheck < CHECK_INTERVAL[settings.source] && !syncPromise) return;
  const p = sync();
  // First run: wait for the whole library; afterwards answer from cache if slow.
  await Promise.race([p, sleep(index.size ? wait : 60_000)]);
}

async function statusSummary() {
  await loadStore();
  const settings = await getSettings();
  return {
    source: settings.source,
    total: index.size,
    libraries: Object.values(meta.libraries).map((l) => ({ name: l.name, count: l.count })),
    lastSync: meta.lastSync,
    error: meta.error,
    syncing: Boolean(syncPromise),
    progress,
  };
}

function presentMatch(m, settings) {
  const lib = meta.libraries[m.rec.lib] || { type: "user" };
  const key = m.rec.k;
  const group = lib.type === "group";
  let webUrl = "";
  if (group) webUrl = `https://www.zotero.org/groups/${lib.groupId}/items/${key}`;
  else if (settings.source === "web" && settings.username) {
    webUrl = `https://www.zotero.org/${encodeURIComponent(settings.username)}/items/${key}`;
  }
  return {
    key,
    title: m.rec.t || "(无标题)",
    creators: m.rec.c || "",
    year: m.rec.y || "",
    publication: m.rec.pub || "",
    itemType: m.rec.ty,
    doi: m.rec.d || "",
    reason: m.reason,
    score: Math.round(m.score * 100) / 100,
    library: lib.name || "我的文库",
    selectUrl: group
      ? `zotero://select/groups/${lib.groupId}/items/${key}`
      : `zotero://select/library/items/${key}`,
    webUrl,
  };
}

async function present(result) {
  const settings = await getSettings();
  return {
    status: index.size || !meta.error ? result.status : "error",
    matches: result.matches.map((m) => presentMatch(m, settings)),
    index: await statusSummary(),
  };
}

async function checkInfo(info) {
  const none = async () => ({ status: "none", matches: [], index: await statusSummary() });
  if (!info) return none();
  // Ordinary web pages are only looked up by URL in the cached index, so browsing
  // doesn't keep pinging Zotero; article pages get a freshness check first.
  if (info.paper) await ensureFresh();
  else await loadStore();
  const settings = await getSettings();
  const res = index.match(info, { fuzzyThreshold: settings.fuzzyThreshold });
  if (res.status === "empty" || (!info.paper && res.status !== "found")) return none();
  return present(res);
}

const BADGES = {
  found: { text: "✓", color: "#1E8E3E", title: "已在 Zotero 库中" },
  possible: { text: "?", color: "#E37400", title: "Zotero 中可能已有相似条目" },
  notFound: { text: "+", color: "#5F6B7A", title: "此文献不在 Zotero 库中" },
  error: { text: "!", color: "#C5221F", title: "无法读取 Zotero 文库" },
  none: { text: "", color: "#5F6B7A", title: "" },
};

async function setBadge(tabId, status) {
  if (tabId == null || tabId < 0) return;
  const b = BADGES[status] || BADGES.none;
  try {
    await chrome.action.setBadgeText({ tabId, text: b.text });
    await chrome.action.setBadgeBackgroundColor({ tabId, color: b.color });
    if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ tabId, color: "#FFFFFF" });
    await chrome.action.setTitle({ tabId, title: b.title ? `Zotero 查重 · ${b.title}` : "Zotero 查重" });
  } catch {
    // Tab closed in the meantime.
  }
}

const handlers = {
  async pageInfo(msg, sender) {
    const result = await checkInfo(msg.info);
    await setBadge(sender.tab?.id, result.status);
    return result;
  },
  async checkInfo(msg) {
    const result = await checkInfo(msg.info);
    if (msg.tabId != null) await setBadge(msg.tabId, result.status);
    return result;
  },
  async checkBatch(msg) {
    await ensureFresh();
    const settings = await getSettings();
    return Promise.all(
      (msg.queries || []).map((q) =>
        present(index.match(q, { fuzzyThreshold: settings.fuzzyThreshold, limit: 3 })),
      ),
    );
  },
  async checkText(msg) {
    await ensureFresh();
    const settings = await getSettings();
    const out = [];
    for (const line of msg.lines || []) {
      const res = index.matchText(line, { fuzzyThreshold: settings.fuzzyThreshold, limit: 3 });
      out.push({ line, ...(await present(res)) });
    }
    return out;
  },
  async getStatus() {
    ensureFresh().catch(() => {});
    return statusSummary();
  },
  async sync(msg) {
    await sync({ force: Boolean(msg.force) });
    return statusSummary();
  },
  async clearCache() {
    await syncPromise?.catch(() => {});
    await loadStore();
    await resetStore(null);
    await chrome.storage.local.set({ [META_KEY]: meta });
    await sync({ force: true });
    return statusSummary();
  },
  async openUrl(msg) {
    // zotero:// links are handed to the OS protocol handler; the page stays put.
    if (msg.tabId != null && msg.url.startsWith("zotero:")) await chrome.tabs.update(msg.tabId, { url: msg.url });
    else await chrome.tabs.create({ url: msg.url });
    return true;
  },
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const handler = handlers[msg?.type];
  if (!handler) return false;
  handler(msg, sender).then(sendResponse, (e) => sendResponse({ error: e.message || String(e) }));
  return true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.settings) return;
  const before = changes.settings.oldValue || {};
  const after = changes.settings.newValue || {};
  if (
    before.source !== after.source ||
    before.apiKey !== after.apiKey ||
    before.userId !== after.userId ||
    before.includeGroups !== after.includeGroups
  ) {
    lastCheck = 0;
    sync({ force: true }).catch(() => {});
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 10 });
  if (details.reason === "install") chrome.runtime.openOptionsPage();
  sync().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 10 });
  sync().catch(() => {});
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM) sync().catch(() => {});
});
