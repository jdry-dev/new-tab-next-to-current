// Moves new tabs opened with Ctrl+T (or the "+" button) next to the tab that
// was active when they were opened.
//
// This runs without the "tabs" permission, so tab URLs are not visible. Instead
// we rely on how Chrome creates such tabs: they open as the active tab and
// Chrome sets their opener to the tab you were on. Background tabs (middle-click,
// Ctrl+click) are not active and are left alone. Links that open in the
// foreground also match; Chrome already places those right after their opener,
// so moving them there is usually a no-op.

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

chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.active || tab.openerTabId === undefined) return;

  let anchor;
  try {
    anchor = await chrome.tabs.get(tab.openerTabId);
  } catch {
    return; // opener tab was closed
  }
  if (anchor.windowId !== tab.windowId) return;
  // An unpinned tab can't be placed among pinned tabs; leave it where it is.
  if (anchor.pinned) return;

  // If the new tab sits left of the anchor, removing it shifts the anchor left.
  const targetIndex = tab.index < anchor.index ? anchor.index : anchor.index + 1;
  if (tab.index === targetIndex) return;

  await moveWithRetry(tab.id, targetIndex);
});
