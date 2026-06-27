# Architecture

## Why Extension + Not Just a Theme?

Chrome Themes only control colors of the native browser chrome (toolbar, tab strip, frame). They can't add widgets, JavaScript, or interactive UI.

Brutalist Chrome solves this with two layers:

```
Layer 1: Chrome Theme (colors.json approach)
  → Frame/toolbar/tab colors via manifest theme key

Layer 2: MV3 Extension (all real features)
  → New Tab override
  → Side Panel
  → Content scripts
  → Background service worker
  → Context menus
  → Storage / notifications
```

## Data Flow

```
chrome.storage.local
      │
      ├── prodState   → { todos, habits, notes, lastReset }
      ├── settings    → { searchEngine, bgOpacity, showWeather, ... }
      └── weatherCache→ { temp, code, humidity, ... }

New Tab ←──────────────── reads prodState on load
Popup   ←──────────────── reads prodState for stats
Sidebar ←──────────────── reads/writes prodState
Background ←────────────── context menus write prodState
```

## What Can't Be Done (Chrome Limits)

| Desired Feature | Why Impossible | Chromium Fork Solution |
|---|---|---|
| Floating tabs | Tab strip is native OS widget | Implement custom tab strip in Chromium |
| Omnibox skin | Security-locked native control | Replace with custom toolbar in Chromium |
| Window frame redesign | OS-level rendering | Custom window manager integration |
| Tab strip reorder animations | Not exposed via any API | Fork and patch `//chrome/browser/ui/views/tabs` |
| Custom scrollbar in Chrome UI | Not accessible | Custom CSS in WebUI pages (Chromium build) |

To build a fully custom Chromium browser, start here:
https://www.chromium.org/developers/how-tos/get-the-code/
