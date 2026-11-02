# New Tab Next To Current

Chrome extension (Manifest V3) that opens new tabs created with `Ctrl+T` (or the `+` button) directly to the right of the active tab, instead of at the end of the tab strip.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.

## Behaviour

- Only blank new tabs (`chrome://newtab/`) are moved. They go next to their opener tab (which Chrome sets to the active tab on `Ctrl+T`), or next to the previously active tab if there is no opener. Links opened in a new tab are left to Chrome, which already places them next to their source.
- If the active tab is pinned, the new tab stays where Chrome put it (unpinned tabs can't go between pinned ones).
- New-tab-page overrides from other extensions change the URL, so the new tab is not moved in that case.

## Files

- `manifest.json`: extension manifest
- `background.js`: service worker that tracks the active tab per window and moves new tabs
