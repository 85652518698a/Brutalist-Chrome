/**
 * BRUTALIST CHROME — Sidebar Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initTodo();
  initNotes();
  initHistory();
});

function initTabs() {
  document.querySelectorAll('.sb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sb-tab, .sb-panel').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

// ── TODO ──
function initTodo() {
  loadTodos();
  document.getElementById('sbTodoAdd').addEventListener('click', addTodo);
  document.getElementById('sbTodoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
  });
}

function loadTodos() {
  chrome.storage.local.get('prodState', r => {
    const todos = r.prodState?.todos || [];
    renderTodos(todos);
  });
}

function renderTodos(todos) {
  const list = document.getElementById('sbTodoList');
  list.innerHTML = todos.length ? todos.map(t => `
    <li class="sb-todo-item ${t.done ? 'done' : ''}" data-id="${t.id}">
      <div class="sb-todo-cb"></div>
      <span>${t.text}</span>
    </li>
  `).join('') : '<div class="sb-empty">NO TASKS</div>';

  list.querySelectorAll('.sb-todo-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      chrome.storage.local.get('prodState', r => {
        const state = r.prodState || { todos: [] };
        const t = state.todos.find(x => x.id === id);
        if (t) t.done = !t.done;
        chrome.storage.local.set({ prodState: state }, loadTodos);
      });
    });
  });
}

function addTodo() {
  const input = document.getElementById('sbTodoInput');
  const text  = input.value.trim();
  if (!text) return;
  chrome.storage.local.get('prodState', r => {
    const state = r.prodState || { todos: [], habits: [], notes: '' };
    state.todos.unshift({ id: Date.now(), text, done: false });
    chrome.storage.local.set({ prodState: state }, () => {
      input.value = '';
      loadTodos();
    });
  });
}

// ── NOTES ──
function initNotes() {
  chrome.storage.local.get('prodState', r => {
    document.getElementById('sbNotes').value = r.prodState?.notes || '';
  });
  document.getElementById('sbNotesSave').addEventListener('click', () => {
    const notes = document.getElementById('sbNotes').value;
    chrome.storage.local.get('prodState', r => {
      const state = r.prodState || { todos: [], habits: [], notes: '' };
      state.notes = notes;
      chrome.storage.local.set({ prodState: state });
    });
  });
}

// ── HISTORY ──
function initHistory() {
  chrome.history.search({ text: '', maxResults: 20 }, items => {
    const list = document.getElementById('sbHistory');
    if (!items.length) { list.innerHTML = '<div class="sb-empty">NO HISTORY</div>'; return; }
    list.innerHTML = items.map(item => `
      <div class="sb-history-item" data-url="${item.url}">
        <div class="sb-history-title">${item.title || 'Untitled'}</div>
        <div class="sb-history-url">${item.url}</div>
      </div>
    `).join('');
    list.querySelectorAll('.sb-history-item').forEach(el => {
      el.addEventListener('click', () => chrome.tabs.create({ url: el.dataset.url }));
    });
  });
}
