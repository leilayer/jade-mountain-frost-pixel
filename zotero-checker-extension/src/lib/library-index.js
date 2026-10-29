// In-memory index over the Zotero library and the matching logic.
// Pure module (no chrome.* APIs) so it can be unit-tested in Node.

import {
  arxivFromUrl,
  bigrams,
  doiFromUrl,
  extractIdentifiers,
  normalizeArxiv,
  normalizeDoi,
  normalizeIsbns,
  normalizePmid,
  normalizeUrl,
  parseExtra,
  titleKey,
  titleSimilarity,
} from "./normalize.js";

const SKIP_TYPES = new Set(["attachment", "note", "annotation"]);
const MIN_EXACT_TITLE = 8; // spaceless chars; avoids matching "Introduction"
const MIN_FUZZY_TITLE = 12;
const MIN_CONTAINED_TITLE = 18;

function creatorSummary(creators) {
  if (!Array.isArray(creators) || !creators.length) return "";
  const authors = creators.filter((c) => !c.creatorType || c.creatorType === "author");
  const list = authors.length ? authors : creators;
  const name = (c) => c.lastName || c.name || c.firstName || "";
  if (list.length === 1) return name(list[0]);
  if (list.length === 2) return `${name(list[0])} and ${name(list[1])}`;
  return `${name(list[0])} et al.`;
}

// Compact record stored in chrome.storage — one per top-level regular item.
export function itemToRecord(json, libId) {
  const data = json && (json.data || json);
  if (!data || !data.key || SKIP_TYPES.has(data.itemType) || data.deleted) return null;
  const extra = parseExtra(data.extra);
  const doi = normalizeDoi(data.DOI) || normalizeDoi(extra.doi) || doiFromUrl(data.url);
  const arxiv =
    arxivFromUrl(data.url) ||
    normalizeArxiv(extra.arxiv) ||
    (/arxiv/i.test(data.archiveID || "") ? normalizeArxiv(data.archiveID) : "") ||
    (doi.startsWith("10.48550/") ? normalizeArxiv(doi) : "");
  const date = (json.meta && json.meta.parsedDate) || data.date || "";
  const rec = {
    k: data.key,
    lib: libId,
    ty: data.itemType,
    t: data.title || data.caseName || data.nameOfAct || data.subject || "",
    d: doi,
    a: arxiv,
    p: normalizePmid(extra.pmid),
    i: normalizeIsbns(data.ISBN),
    u: normalizeUrl(data.url),
    y: (String(date).match(/\d{4}/) || [""])[0],
    c: (json.meta && json.meta.creatorSummary) || creatorSummary(data.creators),
    pub:
      data.publicationTitle ||
      data.proceedingsTitle ||
      data.bookTitle ||
      data.university ||
      data.repository ||
      data.websiteTitle ||
      data.publisher ||
      "",
  };
  for (const k of Object.keys(rec)) {
    if (rec[k] === "" || (Array.isArray(rec[k]) && !rec[k].length)) delete rec[k];
  }
  return rec;
}

function push(map, key, rec) {
  if (!key) return;
  const list = map.get(key);
  if (list) list.push(rec);
  else map.set(key, [rec]);
}

// Normalise a raw query (from a page, a pasted line, …) into comparable keys.
export function normalizeQuery(q) {
  const out = {
    doi: normalizeDoi(q.doi) || (q.url ? doiFromUrl(q.url) : ""),
    arxiv: normalizeArxiv(q.arxiv) || (q.url ? arxivFromUrl(q.url) : ""),
    pmid: normalizePmid(q.pmid),
    isbns: normalizeIsbns(Array.isArray(q.isbn) ? q.isbn.join(" ") : q.isbn),
    url: normalizeUrl(q.url),
    title: q.title ? String(q.title).trim() : "",
  };
  if (!out.arxiv && out.doi.startsWith("10.48550/")) out.arxiv = normalizeArxiv(out.doi);
  return out;
}

export class LibraryIndex {
  constructor(records = []) {
    this.records = records;
    this.byDoi = new Map();
    this.byArxiv = new Map();
    this.byPmid = new Map();
    this.byIsbn = new Map();
    this.byUrl = new Map();
    this.byTitle = new Map();
    this.titleEntries = []; // [{rec, key}] for fuzzy matching
    this._grams = new Map();
    for (const rec of records) {
      push(this.byDoi, rec.d, rec);
      push(this.byArxiv, rec.a, rec);
      push(this.byPmid, rec.p, rec);
      for (const isbn of rec.i || []) push(this.byIsbn, isbn, rec);
      push(this.byUrl, rec.u, rec);
      const key = titleKey(rec.t);
      if (key) {
        push(this.byTitle, key, rec);
        this.titleEntries.push({ rec, key });
      }
    }
  }

  get size() {
    return this.records.length;
  }

  _gramsFor(key) {
    let g = this._grams.get(key);
    if (!g) {
      g = bigrams(key);
      this._grams.set(key, g);
    }
    return g;
  }

  /**
   * @param {object} rawQuery {doi, arxiv, pmid, isbn, url, title}
   * @param {{fuzzyThreshold?: number, limit?: number}} opts
   * @returns {{status: 'found'|'possible'|'notFound'|'empty', matches: Array<{rec, reason, score}>}}
   */
  match(rawQuery, opts = {}) {
    const threshold = opts.fuzzyThreshold ?? 0.85;
    const limit = opts.limit ?? 5;
    const q = normalizeQuery(rawQuery || {});
    const tKey = titleKey(q.title);
    const hasIds = Boolean(q.doi || q.arxiv || q.pmid || q.isbns.length);
    if (!hasIds && !q.url && tKey.length < MIN_EXACT_TITLE) {
      return { status: "empty", matches: [] };
    }

    const hits = new Map(); // rec -> {reason, score, strong}
    const add = (recs, reason, score, strong) => {
      for (const rec of recs || []) {
        const prev = hits.get(rec);
        if (!prev || prev.score < score) hits.set(rec, { rec, reason, score, strong });
      }
    };

    add(this.byDoi.get(q.doi), "DOI", 1, true);
    add(this.byArxiv.get(q.arxiv), "arXiv", 1, true);
    add(this.byPmid.get(q.pmid), "PMID", 1, true);
    for (const isbn of q.isbns) add(this.byIsbn.get(isbn), "ISBN", 1, true);
    add(this.byUrl.get(q.url), "URL", 0.98, true);

    if (tKey.length >= MIN_EXACT_TITLE) {
      for (const rec of this.byTitle.get(tKey) || []) {
        // Same title but a different DOI is usually another version
        // (preprint vs. published) — report it, but only as "possible".
        const conflict = Boolean(q.doi && rec.d && rec.d !== q.doi);
        add([rec], conflict ? "标题相同（DOI 不同）" : "标题", conflict ? 0.9 : 0.97, !conflict);
      }
      if (tKey.length >= MIN_FUZZY_TITLE && ![...hits.values()].some((h) => h.strong)) {
        const qGrams = bigrams(tKey);
        for (const { rec, key } of this.titleEntries) {
          if (hits.has(rec)) continue;
          const ratio = Math.min(key.length, tKey.length) / Math.max(key.length, tKey.length);
          if (ratio < 0.6) continue;
          let score = titleSimilarity(tKey, key, qGrams, this._gramsFor(key));
          // "Title: subtitle" vs. "Title" — treat a long shared prefix as similar.
          if (score < threshold && Math.min(key.length, tKey.length) >= 25) {
            const [short, long] = key.length < tKey.length ? [key, tKey] : [tKey, key];
            if (long.startsWith(short)) score = Math.max(score, threshold);
          }
          if (score >= threshold) add([rec], "相似标题", Math.min(score, 0.95), false);
        }
      }
    }

    const matches = [...hits.values()].sort((a, b) => b.score - a.score).slice(0, limit);
    const status = !matches.length ? "notFound" : matches.some((m) => m.strong) ? "found" : "possible";
    return { status, matches };
  }

  // Free text: a DOI, an arXiv id, a title, or a whole reference-list entry.
  matchText(text, opts = {}) {
    const line = String(text || "").trim();
    if (!line) return { status: "empty", matches: [], query: {} };
    const ids = extractIdentifiers(line);
    const isUrl = /^https?:\/\//i.test(line);
    const query = {
      doi: ids.doi,
      arxiv: ids.arxiv,
      pmid: ids.pmid,
      isbn: ids.isbns,
      url: isUrl ? line : "",
      title: isUrl ? "" : line,
    };
    const res = this.match(query, opts);
    if (res.status === "found" || isUrl) return { ...res, query };

    // A citation string ("Smith J. Title of paper. Journal 2020;…") contains the title.
    const lineKey = titleKey(line);
    if (lineKey.length > MIN_CONTAINED_TITLE) {
      const contained = this.titleEntries
        .filter(({ key }) => key.length >= MIN_CONTAINED_TITLE && lineKey.includes(key))
        .map(({ rec }) => ({ rec, reason: "引文包含标题", score: 0.96, strong: true }));
      if (contained.length) {
        const recs = new Set(contained.map((m) => m.rec));
        const matches = [...contained, ...res.matches.filter((m) => !recs.has(m.rec))]
          .sort((a, b) => b.score - a.score)
          .slice(0, opts.limit ?? 5);
        return { status: "found", matches, query };
      }
    }
    return { ...res, query };
  }
}
