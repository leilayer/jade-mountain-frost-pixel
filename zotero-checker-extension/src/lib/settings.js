export const DEFAULT_SETTINGS = {
  source: "local", // 'local' = Zotero 7 desktop local API, 'web' = api.zotero.org
  apiKey: "",
  userId: "",
  username: "",
  includeGroups: true,
  showBanner: true, // floating card on article pages
  showNotFound: true, // also show the card when the paper is NOT in the library
  annotateLinks: true, // badges on search results / DOI links
  fuzzyThreshold: 0.85,
};

export async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

export async function saveSettings(patch) {
  const next = { ...(await getSettings()), ...patch };
  await chrome.storage.local.set({ settings: next });
  return next;
}
