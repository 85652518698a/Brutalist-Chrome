/**
 * BRUTALIST CHROME — Background Service Worker
 * Handles alarms, context menus, notifications, and tab events.
 */

// ── INSTALL ─────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      settings: {
        searchEngine: 'google',
        showWeather:  true,
        showClock:    true,
        showQuotes:   true,
        bgOpacity:    0.18,
        theme:        'dark',
      }
    });
    chrome.tabs.create({ url: 'newtab/index.html' });
  }

  // Context menus
  chrome.contextMenus.create({
    id:       'brutalist-search',
    title:    'Search with Brutalist Chrome: "%s"',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id:       'brutalist-todo',
    title:    'Add to Brutalist Todo: "%s"',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id:       'brutalist-note',
    title:    'Save to Brutalist Notes: "%s"',
    contexts: ['selection'],
  });
});

// ── CONTEXT MENUS ────────────────────────────────────────
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text = info.selectionText?.trim();
  if (!text) return;

  if (info.menuItemId === 'brutalist-search') {
    chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(text)}` });
  }

  if (info.menuItemId === 'brutalist-todo') {
    chrome.storage.local.get('prodState', r => {
      const state = r.prodState || { todos: [], habits: [], notes: '' };
      state.todos.unshift({ id: Date.now(), text, done: false });
      chrome.storage.local.set({ prodState: state });
      chrome.notifications.create({
        type:     'basic',
        iconUrl:  'assets/icons/icon48.png',
        title:    'BRUTALIST TODO',
        message:  `Added: "${text.slice(0, 50)}"`,
      });
    });
  }

  if (info.menuItemId === 'brutalist-note') {
    chrome.storage.local.get('prodState', r => {
      const state = r.prodState || { todos: [], habits: [], notes: '' };
      const timestamp = new Date().toLocaleTimeString();
      state.notes = `[${timestamp}] ${text}\n\n` + (state.notes || '');
      chrome.storage.local.set({ prodState: state });
      chrome.notifications.create({
        type:     'basic',
        iconUrl:  'assets/icons/icon48.png',
        title:    'BRUTALIST NOTES',
        message:  `Saved to scratchpad.`,
      });
    });
  }
});

// ── COMMANDS ────────────────────────────────────────────
chrome.commands.onCommand.addListener(command => {
  if (command === 'open-sidebar') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) chrome.sidePanel.open({ windowId: tab.windowId });
    });
  }
});

// ── SIDE PANEL ──────────────────────────────────────────
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});

// ── ALARMS (Daily habit reset reminder) ─────────────────
chrome.alarms.create('daily-reminder', {
  when:         getNextMorning(),
  periodInMinutes: 24 * 60,
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'daily-reminder') {
    chrome.notifications.create({
      type:    'basic',
      iconUrl: 'assets/icons/icon48.png',
      title:   'BRUTALIST CHROME',
      message: 'New day. New session. Stay brutal.',
    });
  }
});

function getNextMorning() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return d.getTime();
}

// ── MESSAGE RELAY ────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_SETTINGS') {
    chrome.storage.local.get('settings', r => sendResponse(r.settings || {}));
    return true; // async
  }
  if (msg.type === 'SAVE_SETTINGS') {
    chrome.storage.local.set({ settings: msg.data }, () => sendResponse({ ok: true }));
    return true;
  }
});
