# BRUTALIST CHROME

> **No Simplicity. No Excuses. Just Function.**

A premium Google Chrome customization built around brutalist design principles — raw concrete aesthetics, aggressive typography, and uncompromising productivity tools baked into every new tab.

---

## What Is This?

**Brutalist Chrome** is a Manifest V3 Chrome Extension that completely overrides your new tab page and adds a full productivity system to your browser. It combines:

- A **brutalist-themed animated New Tab page** with live widgets
- A **Manifest V3 Extension** for functionality beyond what a Chrome theme allows
- A **Side Panel** for quick access to todos, notes, and history
- A **Popup** for instant task management and settings
- **Context menu integration** to save text to todos/notes from any page
- A **daily reminder** system via Chrome Alarms

---

## Features

### New Tab Page
| Feature | Description |
|---|---|
| Live Clock | HH:MM:SS with timezone |
| Calendar Strip | 14-day scrollable strip with today highlighted |
| Weather | Real-time via Open-Meteo (no API key needed) |
| Quotes | Daily rotating motivational quotes |
| Google Search | Multi-engine: Google, Bing, DuckDuckGo, Brave |
| Shortcuts Grid | Auto-populated from your top sites |
| Pomodoro Timer | 25/5/15 min configurable, notifications |
| Habit Tracker | Daily habits with streak counter |
| Todo List | Persistent, keyboard-friendly |
| Scratchpad Notes | Auto-saves to Chrome storage |
| Command Palette | `Ctrl+K` — access anything instantly |
| Keyboard Shortcuts | `/` search · `T` todo · `N` notes |
| Glitch Animation | Hover the BRUTALIST logo |
| Parallax BG | Subtle mouse-tracking parallax on wallpaper |
| Ticker Tape | "WORK // FOCUS // DISCIPLINE // REPEAT" |

### Extension Features
| Feature | Description |
|---|---|
| Side Panel | Todos, Notes, Browser History |
| Context Menus | Right-click → Add to Todo / Notes / Search |
| Reading Mode | `Alt+R` on any page — clean dark reader |
| Page Progress Bar | Red progress bar injected on all pages |
| Popup | Quick stats + task add + engine picker |
| Options Page | Full settings panel |
| Daily Notification | 8 AM motivational notification |
| Data Export | Export all data as JSON backup |

---

## Installation

### Method 1: Load Unpacked (Development)

```bash
# 1. Clone the repo
git clone https://github.com/85652518698a/Brutalist-Chrome.git

# 2. Open Chrome and go to:
chrome://extensions

# 3. Enable "Developer mode" (top right toggle)

# 4. Click "Load unpacked"

# 5. Select the Brutalist-Chrome/ folder

# 6. Open a new tab — done.
```

### Method 2: Chrome Web Store
*(Coming soon)*

---

## Chrome API Limitations Explained

Some visual customizations are impossible via Chrome's public APIs. Here's what can and can't be done:

| Feature | Status | Notes |
|---|---|---|
| New Tab Override | ✅ Done | Via `chrome_url_overrides` |
| Toolbar Color | ✅ Partial | Via Chrome Theme (manifest `theme` key) |
| Tab Strip Redesign | ❌ Impossible | Chrome restricts native tab UI |
| Omnibox Redesign | ❌ Impossible | Only text behavior can be modified |
| Floating Tabs | ❌ Impossible | Would require forking Chromium |
| Native Sidebar Replacement | ✅ Implemented | Via `chrome.sidePanel` API |
| Reading Mode | ✅ Implemented | Custom overlay via content script |
| Page Progress Bar | ✅ Implemented | Injected via content script |

**To get full native browser redesign** (floating tabs, omnibox skin, custom chrome frame), you would need to build a custom Chromium fork. See `docs/architecture.md`.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Ctrl+K` | Open command palette |
| `/` | Focus search bar |
| `T` | Focus todo input |
| `N` | Focus notes |
| `,` | Open settings |
| `Esc` | Close overlays |
| `Alt+R` | Toggle reading mode (any page) |
| `Ctrl+Shift+B` | Open extension popup |
| `Ctrl+Shift+S` | Toggle side panel |

---

## Project Structure

```
Brutalist-Chrome/
├── manifest.json          # Extension manifest (MV3)
├── assets/
│   ├── wallpapers/        # Background images (WebP)
│   └── icons/             # Extension icons
├── theme/
│   ├── variables.css      # CSS custom properties
│   ├── animations.css     # Keyframe animations
│   └── palette.json       # Color definitions
├── newtab/
│   ├── index.html         # New Tab entry
│   ├── style.css          # Main styles
│   ├── script.js          # Entry + command palette
│   ├── clock.js           # Clock + calendar
│   ├── search.js          # Multi-engine search
│   ├── weather.js         # Open-Meteo weather
│   ├── quotes.js          # Rotating quotes
│   ├── bookmarks.js       # Top sites grid
│   ├── productivity.js    # Pomodoro + habits + todo + notes
│   ├── widgets.js         # Widget interactions
│   └── animations.js      # Page load animations
├── extension/
│   ├── background.js      # Service worker
│   ├── content.js         # Injected into all pages
│   ├── popup/             # Browser action popup
│   ├── options/           # Full settings page
│   └── sidebar/           # Chrome Side Panel
└── scripts/
    ├── build.js           # Validation
    ├── zip.js             # Package for store
    └── release.js         # Version bump + zip
```

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Void | `#0D0D0D` | Page background |
| Obsidian | `#121212` | Cards |
| Concrete | `#1A1A1A` | Elevated surfaces |
| Graphite | `#2A2A2A` | Borders |
| Red | `#DC2626` | Accent color |
| White | `#F2EFE8` | Primary text |
| Fog | `#9A9A9A` | Secondary text |

---

## License

MIT — see [LICENSE](LICENSE)

---

*STAY PRODUCTIVE. STAY BRUTAL.*
