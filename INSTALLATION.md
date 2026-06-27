# INSTALLATION GUIDE

## Prerequisites
- Google Chrome 114+ (Manifest V3 support)
- No Node.js required for basic installation

---

## Method 1: Load Unpacked (Recommended for Dev)

```
1. Download or clone this repo
   git clone https://github.com/85652518698a/Brutalist-Chrome.git

2. Open Chrome → address bar → type:
   chrome://extensions

3. Enable "Developer mode" toggle (top right)

4. Click "Load unpacked"

5. Select the Brutalist-Chrome/ folder (the one with manifest.json)

6. Open a new tab
```

You should see the BRUTALIST new tab page immediately.

---

## Granting Permissions

On first load, Chrome may ask for:

| Permission | Why |
|---|---|
| `storage` | Save todos, notes, habits, settings |
| `topSites` | Populate shortcuts grid |
| `bookmarks` | Bookmark bar |
| `history` | Sidebar history tab |
| `notifications` | Pomodoro alerts, daily reminder |
| `geolocation` | Weather (prompted by browser, not extension) |
| `sidePanel` | Side panel UI |
| `contextMenus` | Right-click menu items |

All permissions are used locally. No data leaves your browser.

---

## Weather Setup

Weather uses [Open-Meteo](https://open-meteo.com/) — completely free, no API key.

When you first open a new tab, Chrome will ask for **location access**. Allow it for weather to work. You can deny it and weather will show "OFFLINE" gracefully.

---

## Updating

```bash
git pull origin main
```
Then go to `chrome://extensions` and click the **refresh icon** on the Brutalist Chrome card.

---

## Troubleshooting

**New tab shows blank / Chrome default**
→ Disable any other "new tab" extensions that might conflict.

**Weather not loading**
→ Check you've allowed location. Open DevTools on the new tab page (F12) and look for errors in Console.

**Icons missing**
→ Make sure you selected the root `Brutalist-Chrome/` folder (containing `manifest.json`), not a subfolder.

**Extension greyed out**
→ Go to `chrome://extensions`, find Brutalist Chrome, and click "Enable".

---

## Uninstall

`chrome://extensions` → Find "Brutalist Chrome" → Click "Remove"

Your todos, notes, and habits saved in Chrome storage will also be cleared.
