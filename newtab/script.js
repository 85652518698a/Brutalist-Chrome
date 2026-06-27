/**
 * BRUTALIST CHROME — New Tab Entry Point
 * Bootstraps all modules in dependency order.
 */

import { Clock }        from './clock.js';
import { Search }       from './search.js';
import { Weather }      from './weather.js';
import { Quotes }       from './quotes.js';
import { Bookmarks }    from './bookmarks.js';
import { Productivity } from './productivity.js';
import { Widgets }      from './widgets.js';
import { Animations }   from './animations.js';

// ── COMMAND PALETTE REGISTRY ──────────────────────────────
const COMMANDS = [
  { icon: '⌕', label: 'Google Search',      shortcut: '/',        action: () => document.getElementById('searchInput')?.focus() },
  { icon: '✓', label: 'Add Todo',            shortcut: 'T',        action: () => document.getElementById('todoInput')?.focus() },
  { icon: '✎', label: 'Open Notes',          shortcut: 'N',        action: () => document.getElementById('notesArea')?.focus() },
  { icon: '▶', label: 'Start Pomodoro',      shortcut: '',         action: () => document.getElementById('pomoStart')?.click() },
  { icon: '↺', label: 'Reset Pomodoro',      shortcut: '',         action: () => document.getElementById('pomoReset')?.click() },
  { icon: '◎', label: 'New Quote',           shortcut: '',         action: () => document.getElementById('newQuoteBtn')?.click() },
  { icon: '☰', label: 'Toggle Bookmarks',    shortcut: 'B',        action: () => toggleBookmarks() },
  { icon: '⚙', label: 'Open Settings',       shortcut: ',',        action: () => chrome.runtime.openOptionsPage?.() },
  { icon: '◑', label: 'Toggle Background',   shortcut: '',         action: () => toggleBackground() },
  { icon: '?', label: 'Keyboard Shortcuts',  shortcut: '/',        action: () => showShortcutsHelp() },
];

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  Animations.initPageLoad();
  Clock.init();
  Search.init();
  await Weather.init();
  Quotes.init();
  await Bookmarks.init();
  Productivity.init();
  Widgets.init();
  initCommandPalette();
  initKeyboardShortcuts();
  initBackgroundToggle();
  console.log('[BRUTALIST] ✓ All modules loaded');
});

// ── COMMAND PALETTE ───────────────────────────────────────
function initCommandPalette() {
  const overlay  = document.getElementById('commandOverlay');
  const input    = document.getElementById('commandInput');
  const results  = document.getElementById('commandResults');
  let activeIdx  = -1;

  function renderCommands(filter = '') {
    const filtered = COMMANDS.filter(c =>
      c.label.toLowerCase().includes(filter.toLowerCase())
    );
    activeIdx = -1;
    results.innerHTML = filtered.map((cmd, i) => `
      <li class="command-result-item" data-idx="${i}" role="option">
        <span class="cmd-icon">${cmd.icon}</span>
        <span class="cmd-label">${cmd.label}</span>
        ${cmd.shortcut ? `<span class="cmd-shortcut">Alt+${cmd.shortcut}</span>` : ''}
      </li>
    `).join('');

    results.querySelectorAll('.command-result-item').forEach((el, i) => {
      el.addEventListener('click', () => {
        filtered[i].action();
        closeCommand();
      });
    });
    return filtered;
  }

  function openCommand() {
    overlay.hidden = false;
    input.value = '';
    renderCommands();
    requestAnimationFrame(() => input.focus());
  }

  function closeCommand() {
    overlay.hidden = true;
    input.value = '';
  }

  function navigate(dir) {
    const items = results.querySelectorAll('.command-result-item');
    if (!items.length) return;
    items[activeIdx]?.classList.remove('active');
    activeIdx = (activeIdx + dir + items.length) % items.length;
    items[activeIdx]?.classList.add('active');
    items[activeIdx]?.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', e => renderCommands(e.target.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); navigate(1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); navigate(-1); }
    if (e.key === 'Enter') {
      const active = results.querySelector('.command-result-item.active');
      active?.click();
    }
    if (e.key === 'Escape') closeCommand();
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCommand();
  });

  window._openCommand = openCommand;
  window._closeCommand = closeCommand;
}

// ── KEYBOARD SHORTCUTS ────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    const typing = ['INPUT', 'TEXTAREA'].includes(tag);

    // Ctrl+K — command palette
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      window._openCommand?.();
      return;
    }

    // Escape — close overlays
    if (e.key === 'Escape') {
      document.getElementById('commandOverlay').hidden = true;
      document.getElementById('searchSuggestions')?.classList.remove('visible');
      return;
    }

    if (typing) return; // don't hijack while user types

    // / — focus search
    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
    }
    // t — todo
    if (e.key === 't') document.getElementById('todoInput')?.focus();
    // n — notes
    if (e.key === 'n') document.getElementById('notesArea')?.focus();
    // , — settings
    if (e.key === ',') chrome.runtime.openOptionsPage?.();
  });
}

// ── BACKGROUND TOGGLE ─────────────────────────────────────
function initBackgroundToggle() {
  const bgImage = document.getElementById('bgImage');
  let visible = true;

  window.toggleBackground = () => {
    visible = !visible;
    bgImage.style.opacity = visible ? '0.18' : '0';
    toast(visible ? 'BACKGROUND ON' : 'BACKGROUND OFF');
  };
}

function toggleBookmarks() {
  const bar = document.getElementById('bookmarksBar');
  bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
}

function showShortcutsHelp() {
  toast('/ Search  •  T Todo  •  N Notes  •  Ctrl+K Command');
}

// ── GLOBAL TOAST ─────────────────────────────────────────
window.toast = function(msg, type = 'default', duration = 2500) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
};
