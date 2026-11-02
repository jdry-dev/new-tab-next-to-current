# Publishing to the Chrome Web Store

Everything to paste into the dashboard is in `store/listing.md`.

## 1. One-time setup

1. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) with the Google account that should own the extension. Consider a dedicated account: the account's email address can be shown publicly on the listing.
2. Turn on 2-Step Verification for that account (the dashboard requires it).
3. Pay the one-time registration fee ($5) and accept the developer agreement.
4. In the **Account** tab, fill in the publisher name and contact email, and verify the email.

## 2. Host the privacy policy

The dashboard needs a public URL for the privacy policy. Pick one:

- **GitHub:** push this repo to a public GitHub repository and use the link to `store/PRIVACY.md` (or enable GitHub Pages).
- **Gist:** paste `store/PRIVACY.md` into a public [gist](https://gist.github.com) and use its URL.

First replace `<YOUR CONTACT EMAIL>` in `store/PRIVACY.md` with the email you want to show publicly.

## 3. Build the package

```sh
./scripts/package.sh
```

This creates `dist/new-tab-next-to-current-<version>.zip` containing only the files the extension needs (manifest, background script, icons). Before uploading, load the unpacked folder in `chrome://extensions` once more and check that Ctrl+T still works.

## 4. Create the item

1. In the dashboard, click **New item** and upload the zip.
2. **Store listing** tab: paste the description, choose the category and language, upload the icon, screenshot and promo tile listed in `store/listing.md`.
3. **Privacy** tab: paste the single-purpose text, answer "No" to remote code, leave all data types unchecked, tick the three certifications, and enter the privacy policy URL.
4. **Distribution** tab: free, public (or unlisted), all regions.
5. Click **Submit for review**.

Review usually takes from a few days to a couple of weeks; extensions that request no permissions tend to be on the faster end. You'll get an email when it is approved or rejected.

## 5. Publishing updates

1. Bump `version` in `manifest.json` (it must be higher than the published version).
2. Run `./scripts/package.sh`.
3. In the dashboard, open the item → **Package** → **Upload new package**, then **Submit for review**.

## Regenerating images

The icon is drawn in `icons/icon.svg`; the screenshot and promo tile come from `store/src/*.html`. After editing any of them, run:

```sh
./scripts/render-assets.sh
```

This uses headless Google Chrome (override the binary with `CHROME=...`).
