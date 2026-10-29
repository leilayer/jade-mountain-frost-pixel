import assert from "node:assert/strict";
import { test } from "node:test";

import { LibraryIndex, itemToRecord } from "../src/lib/library-index.js";
import { arxivFromUrl, doiFromUrl, normalizeDoi, normalizeIsbns, normalizeUrl, titleKey } from "../src/lib/normalize.js";

const ITEMS = [
  {
    key: "AAAA1111",
    meta: { creatorSummary: "He et al.", parsedDate: "2016-06-01" },
    data: {
      key: "AAAA1111",
      itemType: "conferencePaper",
      title: "Deep Residual Learning for Image Recognition",
      DOI: "10.1109/CVPR.2016.90",
      creators: [{ creatorType: "author", lastName: "He", firstName: "Kaiming" }],
    },
  },
  {
    key: "BBBB2222",
    data: {
      key: "BBBB2222",
      itemType: "preprint",
      title: "Attention Is All You Need",
      url: "http://arxiv.org/abs/1706.03762v7",
      archiveID: "arXiv:1706.03762",
      DOI: "10.48550/arXiv.1706.03762",
      date: "2017-06-12",
    },
  },
  {
    key: "CCCC3333",
    data: {
      key: "CCCC3333",
      itemType: "journalArticle",
      title: "钙钛矿太阳能电池的稳定性研究进展",
      extra: "PMID: 31234567\nOriginal Date: 2019",
      url: "https://kns.cnki.net/kcms2/article/abstract?v=abc&uniplatform=NZKPT",
    },
  },
  {
    key: "DDDD4444",
    data: { key: "DDDD4444", itemType: "book", title: "The Art of Computer Programming", ISBN: "0-201-89683-4" },
  },
  {
    key: "EEEE5555",
    data: {
      key: "EEEE5555",
      itemType: "journalArticle",
      title: "A Survey on <i>Large Language Models</i>: Capabilities and Limits",
      extra: "DOI: 10.1000/XYZ.123",
    },
  },
  { key: "NOTE0001", data: { key: "NOTE0001", itemType: "note", note: "hello" } },
  { key: "TRASH001", data: { key: "TRASH001", itemType: "journalArticle", title: "Trashed", deleted: 1 } },
];

const index = new LibraryIndex(ITEMS.map((j) => itemToRecord(j, "u")).filter(Boolean));

test("records skip notes and trashed items", () => {
  assert.equal(index.size, 5);
});

test("DOI normalisation", () => {
  assert.equal(normalizeDoi("https://doi.org/10.1109/CVPR.2016.90."), "10.1109/cvpr.2016.90");
  assert.equal(normalizeDoi("doi:10.1016/0021-9991(87)90140-9)"), "10.1016/0021-9991(87)90140-9");
  assert.equal(doiFromUrl("https://onlinelibrary.wiley.com/doi/full/10.1002/adma.202001234?af=R"), "10.1002/adma.202001234");
  assert.equal(doiFromUrl("https://www.nature.com/articles/10.1038/s41586-020-2649-2.pdf"), "10.1038/s41586-020-2649-2");
  assert.equal(doiFromUrl("https://pubs.acs.org/doi/abs/10.1021%2Fjacs.0c01234"), "10.1021/jacs.0c01234");
});

test("arXiv, ISBN and URL normalisation", () => {
  assert.equal(arxivFromUrl("https://arxiv.org/pdf/1706.03762v5.pdf"), "1706.03762");
  assert.equal(arxivFromUrl("https://arxiv.org/abs/hep-th/9711200v3"), "hep-th/9711200");
  assert.deepEqual(normalizeIsbns("0-201-89683-4"), ["9780201896831"]);
  assert.equal(normalizeUrl("https://www.example.com/a/?utm_source=x&b=2"), "example.com/a?b=2");
  assert.equal(titleKey("Deep  Residual-Learning: for Image Recognition!"), "deepresiduallearningforimagerecognition");
});

test("matches by DOI (any URL form)", () => {
  const r = index.match({ url: "https://ieeexplore.ieee.org/document/10.1109/CVPR.2016.90" });
  assert.equal(r.status, "found");
  assert.equal(r.matches[0].rec.k, "AAAA1111");
  assert.equal(r.matches[0].reason, "DOI");
});

test("matches by DOI stored in Extra", () => {
  assert.equal(index.match({ doi: "10.1000/xyz.123" }).status, "found");
});

test("matches arXiv abs/pdf pages and versioned ids", () => {
  for (const url of ["https://arxiv.org/abs/1706.03762", "https://arxiv.org/pdf/1706.03762v2"]) {
    const r = index.match({ url });
    assert.equal(r.status, "found", url);
    assert.equal(r.matches[0].rec.k, "BBBB2222");
  }
});

test("matches PMID, ISBN and URL", () => {
  assert.equal(index.match({ pmid: "31234567" }).matches[0].rec.k, "CCCC3333");
  assert.equal(index.match({ isbn: "9780201896831" }).matches[0].rec.k, "DDDD4444");
  const r = index.match({ url: "https://kns.cnki.net/kcms2/article/abstract?uniplatform=NZKPT&v=abc" });
  assert.equal(r.status, "found");
  assert.equal(r.matches[0].reason, "URL");
});

test("exact title (case, punctuation, markup and CJK insensitive)", () => {
  const r = index.match({ title: "deep residual learning for image recognition." });
  assert.equal(r.status, "found");
  assert.equal(index.match({ title: "A survey on large language models — capabilities and limits" }).status, "found");
  assert.equal(index.match({ title: "钙钛矿太阳能电池的稳定性研究进展" }).status, "found");
});

test("same title but different DOI is only 'possible'", () => {
  const r = index.match({ title: "Deep Residual Learning for Image Recognition", doi: "10.9999/other" });
  assert.equal(r.status, "possible");
});

test("similar titles are reported as possible", () => {
  const r = index.match({ title: "Deep Residual Learning for Image Recognitions" });
  assert.equal(r.status, "possible");
  assert.equal(r.matches[0].rec.k, "AAAA1111");
  assert.equal(index.match({ title: "钙钛矿太阳能电池稳定性的研究进展" }).status, "possible");
});

test("unrelated papers are not found", () => {
  assert.equal(index.match({ title: "Graph Neural Networks for Molecular Property Prediction" }).status, "notFound");
  assert.equal(index.match({ doi: "10.1234/nothing" }).status, "notFound");
  assert.equal(index.match({ title: "Intro" }).status, "empty");
});

test("free text: identifiers, titles and full citations", () => {
  assert.equal(index.matchText("doi: 10.1109/CVPR.2016.90").status, "found");
  assert.equal(index.matchText("arXiv:1706.03762").status, "found");
  assert.equal(index.matchText("1706.03762").status, "found");
  assert.equal(index.matchText("ISBN 978-0-201-89683-1").status, "found");
  const citation =
    "He K, Zhang X, Ren S, Sun J. Deep residual learning for image recognition. In: Proceedings of CVPR; 2016. p. 770-778.";
  const r = index.matchText(citation);
  assert.equal(r.status, "found");
  assert.equal(r.matches[0].rec.k, "AAAA1111");
  assert.equal(index.matchText("Smith J. Something entirely different. Nature 2020.").status, "notFound");
});

test("related but different CJK titles stay apart", () => {
  assert.equal(index.match({ title: "钙钛矿太阳能电池的效率研究进展" }).status, "notFound");
});

test("a citation containing a library title wins over a fuzzy hit", () => {
  const r = index.matchText("Anon. Deep residual learning for image recognitions? No: Deep Residual Learning for Image Recognition, CVPR 2016");
  assert.equal(r.status, "found");
  assert.equal(r.matches[0].reason, "引文包含标题");
});
