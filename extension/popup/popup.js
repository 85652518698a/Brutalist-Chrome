/**
 * BRUTALIST CHROME — Popup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadEngine();
  initEngineButtons();
  initQuickAdd();
  initNavLinks();
});

function loadStats() {
  chrome.storage.local.get('prodState', r => {
    const state = r.prodState || { todos: [], habits: [] };
    const pending = state.todos.filter(t => !t.done).length;
    const habitsDone = state.habits.filter(h => h.done).length;

    document.getElementById('statTodos').textContent  = pending;
    document.getElementById('statHabits').textContent = `${habitsDone}/${state.habits.length}`;
  });
}

function loadEngine() {
  chrome.storage.local.get('settings', r => {
    const engine = r.settings?.searchEngine || 'google';
    document.querySelectorAll('.eng-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.engine === engine);
    });
  });
}

function initEngineButtons() {
  document.querySelectorAll('.eng-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.eng-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      chrome.storage.local.get('settings', r => {
        const s = r.settings || {};
        s.searchEngine = btn.dataset.engine;
        chrome.storage.local.set({ settings: s });
      });
    });
  });
}

function initQuickAdd() {
  const input = document.getElementById('quickTodo');
  const btn   = document.getElementById('quickAddBtn');

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    chrome.storage.local.get('prodState', r => {
      const state = r.prodState || { todos: [], habits: [], notes: '' };
      state.todos.unshift({ id: Date.now(), text, done: false });
      chrome.storage.local.set({ prodState: state }, () => {
        input.value = '';
        loadStats();
      });
    });
  }

  btn.addEventListener('click', addTask);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
}

function initNavLinks() {
  document.getElementById('openNewTab').addEventListener('click', e => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') });
  });

  document.getElementById('openOptions').addEventListener('click', e => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('openSidebar').addEventListener('click', e => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) chrome.sidePanel.open({ windowId: tab.windowId });
    });
    window.close();
  });
}
