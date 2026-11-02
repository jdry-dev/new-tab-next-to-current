// Moves blank new tabs (Ctrl+T, "+" button) next to the tab that was active
// when they were opened.
//
// By the time tabs.onCreated fires, Chrome may already have made the new tab
// active, so we remember the last two active tabs per window and use whichever
// one is not the new tab. The state lives in chrome.storage.session because the
// MV3 service worker can be suspended at any time and lose in-memory variables.

const NEW_TAB_URLS = new Set(["chrome://newtab/", "chrome://new-tab-page/"]);

const key = (windowId) => `active:${windowId}`;

async function getHistory(windowId) {
  const k = key(windowId);
  const data = await chrome.storage.session.get(k);
  return data[k] ?? [];
}

async function recordActive(windowId, tabId) {
  const history = await getHistory(windowId);
  if (history[0] === tabId) return;
  await chrome.storage.session.set({ [key(windowId)]: [tabId, history[0]] });
}

async function seedFromCurrentTabs() {
  const activeTabs = await chrome.tabs.query({ active: true });
  await Promise.all(activeTabs.map((t) => recordActive(t.windowId, t.id)));
}

async function moveWithRetry(tabId, index, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      await chrome.tabs.move(tabId, { index });
      return;
    } catch (err) {
      // "Tabs cannot be edited right now (user may be dragging a tab)."
      if (i === attempts - 1) {
        console.warn("Could not move new tab:", err);
        return;
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  }
}

chrome.runtime.onInstalled.addListener(seedFromCurrentTabs);
chrome.runtime.onStartup.addListener(seedFromCurrentTabs);

chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  recordActive(windowId, tabId);
});

chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.session.remove(key(windowId));
});

chrome.tabs.onCreated.addListener(async (tab) => {
  const url = tab.pendingUrl || tab.url;
  console.log("onCreated", {
    id: tab.id,
    index: tab.index,
    url: tab.url,
    pendingUrl: tab.pendingUrl,
    openerTabId: tab.openerTabId,
  });
  // Only blank new tabs. Links opened in a new tab have a real URL and Chrome
  // already places them next to their source.
  if (!NEW_TAB_URLS.has(url)) return;

  // Chrome sets the opener for Ctrl+T to the tab that was active; fall back to
  // our own history when it doesn't (e.g. the "+" button in some versions).
  let anchorId = tab.openerTabId;
  if (anchorId === undefined) {
    const history = await getHistory(tab.windowId);
    anchorId = history[0] === tab.id ? history[1] : history[0];
  }
  console.log("anchor", anchorId);
  if (anchorId === undefined) return;

  let anchor;
  try {
    anchor = await chrome.tabs.get(anchorId);
  } catch {
    return; // anchor tab was closed
  }
  if (anchor.windowId !== tab.windowId) return;
  // An unpinned tab can't be placed among pinned tabs; leave it where it is.
  if (anchor.pinned) return;

  // If the new tab sits left of the anchor, removing it shifts the anchor left.
  const targetIndex = tab.index < anchor.index ? anchor.index : anchor.index + 1;
  console.log("move", { from: tab.index, to: targetIndex, anchorIndex: anchor.index });
  if (tab.index === targetIndex) return;

  await moveWithRetry(tab.id, targetIndex);
});
