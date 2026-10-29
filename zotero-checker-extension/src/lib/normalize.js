// Identifier / title normalisation shared by the background worker and tests.
// Pure functions only — no chrome.* APIs here.

const DOI_RE = /10\.\d{4,9}\/[^\s"'<>]+/i;
const ARXIV_NEW_RE = /(?:^|[^\d.])(\d{4}\.\d{4,5})(?:v\d+)?(?![\d])/i;
const ARXIV_OLD_RE = /\b([a-z-]+(?:\.[a-z]{2})?\/\d{7})(?:v\d+)?\b/i;

// Path segments publishers append after a DOI in article URLs.
const DOI_URL_SUFFIX_RE =
  /(?:\/(?:full|abstract|pdf|epdf|pdfdirect|html|fulltext|figures|tables|references|citedby|metrics|suppl|supplemental|summary|meta|issuetoc|info|share))+\/?$/i;

export function normalizeDoi(input) {
  if (!input) return "";
  let s = String(input).trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  const m = s.match(DOI_RE);
  if (!m) return "";
  let doi = m[0];
  // Trailing punctuation picked up from prose or citations. Parentheses are legal
  // inside DOIs (e.g. 10.1016/0021-9991(87)90140-9), so only drop unbalanced ones.
  const count = (ch) => doi.split(ch).length - 1;
  for (;;) {
    const before = doi;
    doi = doi.replace(/[.,;:\]}>]+$/, "");
    if (doi.endsWith(")") && count(")") > count("(")) doi = doi.slice(0, -1);
    if (doi === before) break;
  }
  return doi.toLowerCase();
}

// DOI found inside a URL: also strip query/hash and publisher path suffixes.
export function doiFromUrl(url) {
  if (!url) return "";
  let s = String(url);
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  const idx = s.search(/10\.\d{4,9}\//);
  if (idx < 0) return "";
  let tail = s.slice(idx).split(/[?#]/)[0];
  tail = tail.replace(DOI_URL_SUFFIX_RE, "");
  tail = tail.replace(/\.pdf$/i, "");
  return normalizeDoi(tail);
}

export function normalizeArxiv(input) {
  if (!input) return "";
  let s = String(input).trim();
  const doiMatch = s.match(/10\.48550\/arxiv\.(.+)$/i);
  if (doiMatch) s = doiMatch[1];
  s = s.replace(/^arxiv:\s*/i, "");
  const m = s.match(ARXIV_NEW_RE) || s.match(ARXIV_OLD_RE);
  return m ? m[1].toLowerCase() : "";
}

export function arxivFromUrl(url) {
  if (!url) return "";
  const m = String(url).match(
    /arxiv\.org\/(?:abs|pdf|html|format)\/([^?#]+?)(?:\.pdf)?(?:[?#]|$)/i,
  );
  return m ? normalizeArxiv(m[1]) : "";
}

export function normalizePmid(input) {
  if (!input) return "";
  const m = String(input).match(/\d{1,9}/);
  return m ? String(parseInt(m[0], 10)) : "";
}

export function pmidFromUrl(url) {
  if (!url) return "";
  const m = String(url).match(
    /(?:pubmed\.ncbi\.nlm\.nih\.gov\/|ncbi\.nlm\.nih\.gov\/pubmed\/)(\d{1,9})/i,
  );
  return m ? m[1] : "";
}

function isbn10to13(isbn10) {
  const core = "978" + isbn10.slice(0, 9);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(core[i]) * (i % 2 ? 3 : 1);
  return core + ((10 - (sum % 10)) % 10);
}

// Returns every ISBN-13 found in the string (ISBN-10s are converted).
export function normalizeIsbns(input) {
  if (!input) return [];
  const out = new Set();
  const candidates = String(input).match(/[\dXx][\d\s-]{8,16}[\dXx]/g) || [];
  for (const c of candidates) {
    const digits = c.replace(/[\s-]/g, "").toUpperCase();
    if (/^97[89]\d{10}$/.test(digits)) out.add(digits);
    else if (/^\d{9}[\dX]$/.test(digits)) out.add(isbn10to13(digits));
  }
  return [...out];
}

export function normalizeUrl(input) {
  if (!input) return "";
  try {
    const u = new URL(String(input).trim());
    if (!/^https?:$/.test(u.protocol)) return "";
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const path = u.pathname.replace(/\/+$/, "");
    // Keep the query: many catalogues (CNKI, IEEE) identify records by it.
    const params = [...u.searchParams.entries()]
      .filter(([k]) => !/^(utm_|fbclid|gclid|via|casa_token|ref|source)/i.test(k))
      .sort(([a], [b]) => a.localeCompare(b));
    const query = params.length ? "?" + new URLSearchParams(params).toString() : "";
    return host + path + query;
  } catch {
    return "";
  }
}

// Lowercase, strip markup, accents and punctuation; keeps CJK and other scripts.
export function normalizeTitle(input) {
  if (!input) return "";
  return String(input)
    .replace(/<[^>]+>/g, " ")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// Spaceless form used as an exact-match key (immune to spacing differences).
export function titleKey(input) {
  return normalizeTitle(input).replace(/\s+/g, "");
}

export function bigrams(key) {
  const set = new Set();
  for (let i = 0; i < key.length - 1; i++) set.add(key.slice(i, i + 2));
  return set;
}

export function diceSimilarity(aSet, bSet) {
  if (!aSet.size || !bSet.size) return 0;
  let inter = 0;
  const [small, large] = aSet.size < bSet.size ? [aSet, bSet] : [bSet, aSet];
  for (const g of small) if (large.has(g)) inter++;
  return (2 * inter) / (aSet.size + bSet.size);
}

const CJK_RE = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g;

// Similarity of two title keys (0–1). CJK words are one or two characters long, so
// a reordered phrase breaks many bigrams while keeping the characters themselves;
// for those titles the character overlap is averaged in.
export function titleSimilarity(a, b, gramsA = bigrams(a), gramsB = bigrams(b)) {
  const bi = diceSimilarity(gramsA, gramsB);
  const cjk = (s) => (s.match(CJK_RE) || []).length >= s.length * 0.3;
  if (!cjk(a) && !cjk(b)) return bi;
  return (bi + diceSimilarity(new Set(a), new Set(b))) / 2;
}

// Pull every identifier we know about out of free text (a pasted line, an "Extra" field…).
export function extractIdentifiers(text) {
  const s = String(text || "");
  const ids = { doi: "", arxiv: "", pmid: "", isbns: [] };
  const urlDoi = s.match(/https?:\/\/\S*10\.\d{4,9}\/\S+/i);
  ids.doi = urlDoi ? doiFromUrl(urlDoi[0]) : normalizeDoi(s);
  if (/10\.48550\/arxiv/i.test(ids.doi)) ids.arxiv = normalizeArxiv(ids.doi);
  if (!ids.arxiv) {
    const ax = s.match(/arxiv(?:\.org\/(?:abs|pdf)\/|:\s*|\s+)([\w./-]+)/i);
    if (ax) ids.arxiv = normalizeArxiv(ax[1]);
    else if (/^\s*\d{4}\.\d{4,5}(v\d+)?\s*$/.test(s)) ids.arxiv = normalizeArxiv(s);
  }
  const pm = s.match(/(?:pmid:?\s*|pubmed\.ncbi\.nlm\.nih\.gov\/)(\d{1,9})/i);
  if (pm) ids.pmid = pm[1];
  if (/isbn/i.test(s) || /^\s*[\d\s-]{10,17}[\dXx]?\s*$/.test(s)) ids.isbns = normalizeIsbns(s);
  return ids;
}

// Parse "Key: value" lines out of Zotero's Extra field.
export function parseExtra(extra) {
  const out = {};
  for (const line of String(extra || "").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z][\w -]*?)\s*:\s*(.+)$/);
    if (m) out[m[1].toLowerCase()] = m[2].trim();
  }
  return out;
}
