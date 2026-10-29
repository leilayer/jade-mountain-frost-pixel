import assert from "node:assert/strict";
import { test } from "node:test";

import { ZoteroClient } from "../src/lib/zotero-api.js";

function fakeFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url: new URL(url), headers: init.headers });
    const { status = 200, body = [], headers = {} } = handler(new URL(url), init) || {};
    return new Response(JSON.stringify(body), { status, headers });
  };
  fn.calls = calls;
  return fn;
}

test("web API: pages through 100-item pages with the API key", async () => {
  const all = Array.from({ length: 230 }, (_, i) => ({ key: `K${i}`, data: { key: `K${i}`, itemType: "book", title: `T${i}` } }));
  const f = fakeFetch((u) => {
    const start = Number(u.searchParams.get("start"));
    return { body: all.slice(start, start + 100), headers: { "Last-Modified-Version": "42", "Total-Results": "230" } };
  });
  const client = new ZoteroClient({ source: "web", apiKey: "abc", userId: "123" }, f);
  const { items, version } = await client.fetchItems({ prefix: "/users/123" });
  assert.equal(items.length, 230);
  assert.equal(version, 42);
  assert.equal(f.calls.length, 3);
  assert.equal(f.calls[0].url.origin + f.calls[0].url.pathname, "https://api.zotero.org/users/123/items/top");
  assert.equal(f.calls[0].headers["Zotero-API-Key"], "abc");
});

test("web API: incremental fetch uses since on /items", async () => {
  const f = fakeFetch(() => ({ body: [], headers: { "Last-Modified-Version": "50" } }));
  const client = new ZoteroClient({ source: "web", apiKey: "abc", userId: "123" }, f);
  await client.fetchItems({ prefix: "/users/123" }, { since: 42 });
  assert.equal(f.calls[0].url.pathname, "/users/123/items");
  assert.equal(f.calls[0].url.searchParams.get("since"), "42");
});

test("local API: sends Zotero-Allowed-Request and maps errors", async () => {
  const f = fakeFetch(() => ({ status: 403, body: "Local API is not enabled" }));
  const client = new ZoteroClient({ source: "local" }, f);
  await assert.rejects(client.getLibraryVersion({ prefix: "/users/0" }), { code: "LOCAL_API_DISABLED" });
  assert.equal(f.calls[0].headers["Zotero-Allowed-Request"], "1");
  assert.equal(f.calls[0].url.origin, "http://127.0.0.1:23119");

  const offline = new ZoteroClient({ source: "local" }, async () => {
    throw new TypeError("Failed to fetch");
  });
  await assert.rejects(offline.getLibraryVersion({ prefix: "/users/0" }), { code: "OFFLINE" });
});

test("web API without a key is rejected up front", () => {
  assert.throws(() => new ZoteroClient({ source: "web" }), { code: "NO_KEY" });
});
