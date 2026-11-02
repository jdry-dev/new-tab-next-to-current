#!/usr/bin/env bash
# Renders icons/*.png and store images from their sources using headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-google-chrome}"
FLAGS=(--headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=3000)

"$CHROME" "${FLAGS[@]}" --dump-dom "file://$PWD/store/src/render-icons.html" 2>/dev/null \
  | grep -o 'ICON [0-9]* [A-Za-z0-9+/=]*' \
  | while read -r _ size data; do
      echo "$data" | base64 -d > "icons/icon${size}.png"
      echo "icons/icon${size}.png"
    done

shot() { # <html> <width> <height> <out>
  "$CHROME" "${FLAGS[@]}" --window-size="$2,$3" --screenshot="$PWD/$4" "file://$PWD/$1" 2>/dev/null
  echo "$4"
}
shot store/src/screenshot.html 1280 800 store/screenshot-1280x800.png
shot store/src/promo.html 440 280 store/promo-small-440x280.png
