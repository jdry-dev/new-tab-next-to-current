# New Tab Next To Current

Chrome extension (Manifest V3) that opens new tabs created with `Ctrl+T` (or the `+` button) directly to the right of the active tab, instead of at the end of the tab strip.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.

## Behaviour

- The extension needs no permissions. It moves a new tab when the tab opens as the active tab and has an opener, which is how Chrome creates tabs for `Ctrl+T` (the opener is the tab you were on). The tab is moved directly to the right of its opener.
- Background tabs (middle-click, `Ctrl+click`) are left alone.
- Links that open in a new foreground tab (`target="_blank"`, `Ctrl+Shift+click`) also match. Chrome already puts these right after the page they came from, so usually nothing changes; if you've already opened other tabs from that page, the new one goes directly next to the page instead of after them.
- If the active tab is pinned, the new tab stays where Chrome put it (unpinned tabs can't go between pinned ones).

## Files

- `manifest.json`: extension manifest
- `background.js`: service worker that moves new tabs next to the tab they were opened from
- `icons/`: extension icons (`icon.svg` is the source)
- `store/`: Chrome Web Store listing text, privacy policy, screenshot and promo tile
- `scripts/package.sh`: builds the zip to upload to the store
- `scripts/render-assets.sh`: regenerates the PNG icons and store images from their sources

## Publishing

See [PUBLISHING.md](PUBLISHING.md).
