#!/usr/bin/env bash
# Builds the zip to upload to the Chrome Web Store: dist/new-tab-next-to-current-<version>.zip
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=$(node -p 'require("./manifest.json").version')
OUT="dist/new-tab-next-to-current-${VERSION}.zip"
mkdir -p dist
rm -f "$OUT"
zip -q -X "$OUT" manifest.json background.js icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png
echo "$OUT"
unzip -l "$OUT"
