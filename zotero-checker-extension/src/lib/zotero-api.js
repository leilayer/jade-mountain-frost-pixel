// Thin client for the Zotero 7 local API (http://127.0.0.1:23119/api) and the
// zotero.org Web API v3. Both speak the same protocol; only base URL, auth and
// page size differ.

export const LOCAL_BASE = "http://127.0.0.1:23119/api";
export const WEB_BASE = "https://api.zotero.org";

export class ZoteroError extends Error {
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class ZoteroClient {
  /** @param {{source: 'local'|'web', apiKey?: string, userId?: string|number}} settings */
  constructor(settings, fetchImpl = globalThis.fetch.bind(globalThis)) {
    this.source = settings.source === "web" ? "web" : "local";
    this.apiKey = (settings.apiKey || "").trim();
    this.userId = String(settings.userId || "").trim();
    this.fetch = fetchImpl;
    this.pageSize = this.source === "local" ? 1000 : 100;
    if (this.source === "web" && (!this.apiKey || !this.userId)) {
      throw new ZoteroError("NO_KEY", "请先在设置中填写 Zotero API Key");
    }
  }

  get sourceId() {
    return this.source === "local" ? "local" : `web:${this.userId}`;
  }

  get userPrefix() {
    return this.source === "local" ? "/users/0" : `/users/${this.userId}`;
  }

  async request(path, params = {}, { timeout = 30000 } = {}) {
    const base = this.source === "local" ? LOCAL_BASE : WEB_BASE;
    const url = new URL(base + path);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
    const headers = { "Zotero-API-Version": "3" };
    // Zotero's HTTP server drops browser requests that don't carry this header.
    if (this.source === "local") headers["Zotero-Allowed-Request"] = "1";
    else headers["Zotero-API-Key"] = this.apiKey;

    for (let attempt = 0; ; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      let res;
      try {
        res = await this.fetch(url, { headers, signal: ctrl.signal, cache: "no-store" });
      } catch (e) {
        if (this.source === "local") {
          throw new ZoteroError(
            "OFFLINE",
            "无法连接到 Zotero。请确认 Zotero 7 正在运行，并已开启本地 API。",
          );
        }
        throw new ZoteroError("NETWORK", `无法连接 zotero.org：${e.message || e}`);
      } finally {
        clearTimeout(timer);
      }

      if ((res.status === 429 || res.status === 503) && attempt < 3) {
        const wait = Number(res.headers.get("Retry-After") || res.headers.get("Backoff") || 5);
        await sleep(Math.min(wait, 30) * 1000);
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw this._httpError(res.status, text);
      }
      const backoff = Number(res.headers.get("Backoff") || 0);
      if (backoff) await sleep(Math.min(backoff, 30) * 1000);
      return res;
    }
  }

  _httpError(status, text) {
    if (this.source === "local") {
      if (status === 403 && /not enabled/i.test(text)) {
        return new ZoteroError(
          "LOCAL_API_DISABLED",
          "Zotero 本地 API 未开启：Zotero → 设置 → 高级 → 勾选“允许此计算机上的其他应用程序与 Zotero 通讯”。",
          status,
        );
      }
      if (status === 404) {
        return new ZoteroError(
          "LOCAL_API_UNSUPPORTED",
          "当前 Zotero 版本不支持本地 API，请升级到 Zotero 7 或改用网页 API。",
          status,
        );
      }
    } else if (status === 403) {
      return new ZoteroError("BAD_KEY", "API Key 无效或没有读取该文库的权限。", status);
    }
    return new ZoteroError("HTTP", `Zotero 返回错误 ${status}：${text.slice(0, 120)}`, status);
  }

  /** User library plus (optionally) group libraries. */
  async listLibraries(includeGroups = true) {
    const libs = [{ id: "u", type: "user", name: "我的文库", prefix: this.userPrefix }];
    if (!includeGroups) return libs;
    try {
      const res = await this.request(`${this.userPrefix}/groups`, { format: "json" });
      const groups = await res.json();
      for (const g of Array.isArray(groups) ? groups : []) {
        const id = g.id ?? g.data?.id;
        if (id == null) continue;
        libs.push({
          id: `g${id}`,
          type: "group",
          groupId: id,
          name: g.data?.name || `群组 ${id}`,
          prefix: `/groups/${id}`,
        });
      }
    } catch (e) {
      // Groups are optional — a key without group access must not break the user library.
      if (e.code === "OFFLINE" || e.code === "LOCAL_API_DISABLED") throw e;
    }
    return libs;
  }

  /** Current library version, or null when the server doesn't report it. */
  async getLibraryVersion(lib) {
    const res = await this.request(`${lib.prefix}/items/top`, { limit: 1, format: "json" }, { timeout: 8000 });
    const v = res.headers.get("Last-Modified-Version");
    return v == null || v === "" ? null : Number(v);
  }

  /** All top-level items, or only those changed after `since`. */
  async fetchItems(lib, { since = null, onPage } = {}) {
    const path = since == null ? `${lib.prefix}/items/top` : `${lib.prefix}/items`;
    const items = [];
    let version = null;
    for (let start = 0; ; start += this.pageSize) {
      const params = { format: "json", limit: this.pageSize, start };
      if (since != null) params.since = since;
      const res = await this.request(path, params, { timeout: 120000 });
      const v = res.headers.get("Last-Modified-Version");
      if (v != null && v !== "") version = Number(v);
      const page = await res.json();
      if (!Array.isArray(page)) break;
      items.push(...page);
      const total = Number(res.headers.get("Total-Results"));
      if (onPage) onPage(items.length, Number.isFinite(total) ? total : null);
      if (page.length < this.pageSize || (Number.isFinite(total) && items.length >= total)) break;
    }
    return { items, version };
  }

  /** Keys of items deleted (purged) since `since` — Web API only. */
  async fetchDeletedKeys(lib, since) {
    const res = await this.request(`${lib.prefix}/deleted`, { since });
    const body = await res.json();
    return Array.isArray(body?.items) ? body.items : [];
  }

  /** Resolve an API key to {userID, username, access}. */
  static async verifyKey(apiKey, fetchImpl = globalThis.fetch.bind(globalThis)) {
    let res;
    try {
      res = await fetchImpl(`${WEB_BASE}/keys/${encodeURIComponent(apiKey.trim())}`, {
        headers: { "Zotero-API-Version": "3" },
      });
    } catch (e) {
      throw new ZoteroError("NETWORK", `无法连接 zotero.org：${e.message || e}`);
    }
    if (res.status === 404 || res.status === 403) {
      throw new ZoteroError("BAD_KEY", "API Key 无效，请到 zotero.org/settings/keys 重新创建。", res.status);
    }
    if (!res.ok) throw new ZoteroError("HTTP", `zotero.org 返回错误 ${res.status}`, res.status);
    return res.json();
  }
}
