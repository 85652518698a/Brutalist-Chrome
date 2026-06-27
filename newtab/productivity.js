/**
 * BRUTALIST CHROME — Productivity Module
 * Pomodoro timer, habit tracker, todo list, scratchpad notes.
 */

export const Productivity = {
  // ── STATE ──────────────────────────────────────────────
  _pomo: {
    work:    25 * 60,
    short:   5  * 60,
    long:    15 * 60,
    left:    25 * 60,
    session: 1,
    running: false,
    mode:    'work', // 'work' | 'short' | 'long'
    timer:   null,
  },
  _score: 0,

  // ── INIT ───────────────────────────────────────────────
  init() {
    this._loadState();
    this._initPomodoro();
    this._initHabits();
    this._initTodo();
    this._initNotes();
  },

  // ── POMODORO ───────────────────────────────────────────
  _initPomodoro() {
    const p = this._pomo;
    const display  = document.getElementById('pomoDisplay');
    const session  = document.getElementById('pomoSession');
    const startBtn = document.getElementById('pomoStart');
    const pauseBtn = document.getElementById('pomoPause');
    const resetBtn = document.getElementById('pomoReset');

    const render = () => {
      const m = String(Math.floor(p.left / 60)).padStart(2, '0');
      const s = String(p.left % 60).padStart(2, '0');
      if (display) display.textContent = `${m}:${s}`;
      if (session) session.textContent = p.session;
      // Color: red when ≤ 5 min
      if (display) display.style.color = p.left <= 300 ? 'var(--red)' : 'var(--white)';
    };

    const tick = () => {
      if (!p.running) return;
      p.left--;
      render();
      if (p.left <= 0) this._pomoComplete();
    };

    startBtn?.addEventListener('click', () => {
      if (p.running) return;
      p.running = true;
      p.timer = setInterval(tick, 1000);
      window.toast?.('FOCUS SESSION STARTED', 'default', 1500);
    });

    pauseBtn?.addEventListener('click', () => {
      p.running = false;
      clearInterval(p.timer);
      window.toast?.('PAUSED', 'default', 1200);
    });

    resetBtn?.addEventListener('click', () => {
      p.running = false;
      clearInterval(p.timer);
      p.left = p.work;
      p.mode = 'work';
      render();
    });

    render();
  },

  _pomoComplete() {
    const p = this._pomo;
    p.running = false;
    clearInterval(p.timer);

    if (p.mode === 'work') {
      this._addScore(10);
      window.toast?.('SESSION COMPLETE. +10 PTS', 'success', 3000);
      p.session++;
      p.mode = p.session % 4 === 0 ? 'long' : 'short';
      p.left = p.session % 4 === 0 ? p.long : p.short;
    } else {
      p.mode = 'work';
      p.left = p.work;
      window.toast?.('BREAK OVER. BACK TO WORK.', 'default', 2000);
    }

    chrome.notifications?.create({
      type: 'basic',
      iconUrl: '../assets/icons/icon48.png',
      title: 'BRUTALIST CHROME',
      message: p.mode === 'work' ? 'Break over. Get back to work.' : 'Focus session complete. Take a break.',
    });

    document.getElementById('pomoSession').textContent = p.session;
  },

  // ── HABITS ────────────────────────────────────────────
  _defaultHabits: [
    { id: 'h1', name: 'DEEP WORK',    streak: 0, done: false },
    { id: 'h2', name: 'EXERCISE',     streak: 0, done: false },
    { id: 'h3', name: 'NO SOCIALS',   streak: 0, done: false },
    { id: 'h4', name: 'READ 30 MIN',  streak: 0, done: false },
  ],

  _initHabits() {
    this._renderHabits();

    document.getElementById('addHabitBtn')?.addEventListener('click', () => {
      const name = prompt('Habit name:')?.toUpperCase().trim();
      if (!name) return;
      this._state.habits.push({ id: 'h' + Date.now(), name, streak: 0, done: false });
      this._saveState();
      this._renderHabits();
    });
  },

  _renderHabits() {
    const list = document.getElementById('habitsList');
    if (!list) return;
    list.innerHTML = this._state.habits.map(h => `
      <div class="habit-item ${h.done ? 'done' : ''}" data-id="${h.id}">
        <div class="habit-check">${h.done ? '✓' : ''}</div>
        <span class="habit-name">${h.name}</span>
        <span class="habit-streak">🔥${h.streak}</span>
      </div>
    `).join('');

    list.querySelectorAll('.habit-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const h  = this._state.habits.find(x => x.id === id);
        if (!h) return;
        h.done = !h.done;
        if (h.done) { h.streak++; this._addScore(5); }
        else if (h.streak > 0) h.streak--;
        this._saveState();
        this._renderHabits();
      });
    });
  },

  // ── TODO ──────────────────────────────────────────────
  _initTodo() {
    this._renderTodo();

    document.getElementById('todoAddBtn')?.addEventListener('click', () => this._addTodo());
    document.getElementById('todoInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._addTodo();
    });
    document.getElementById('todoClearBtn')?.addEventListener('click', () => {
      this._state.todos = this._state.todos.filter(t => !t.done);
      this._saveState();
      this._renderTodo();
    });
  },

  _addTodo() {
    const input = document.getElementById('todoInput');
    const text  = input?.value.trim();
    if (!text) return;
    this._state.todos.unshift({ id: Date.now(), text, done: false });
    input.value = '';
    this._saveState();
    this._renderTodo();
  },

  _renderTodo() {
    const list    = document.getElementById('todoList');
    const count   = document.getElementById('todoCount');
    const remain  = document.getElementById('todoRemaining');
    if (!list) return;

    const todos   = this._state.todos;
    const pending = todos.filter(t => !t.done).length;

    if (count)  count.textContent  = `${todos.length} TASKS`;
    if (remain) remain.textContent = `${pending} remaining`;

    list.innerHTML = todos.map(t => `
      <li class="todo-item ${t.done ? 'done' : ''}" data-id="${t.id}">
        <input type="checkbox" class="todo-cb" ${t.done ? 'checked' : ''} />
        <span class="todo-text">${t.text}</span>
        <button class="todo-del" title="Delete">✕</button>
      </li>
    `).join('');

    list.querySelectorAll('.todo-cb').forEach(cb => {
      cb.addEventListener('change', e => {
        const id = parseInt(e.target.closest('.todo-item').dataset.id);
        const t  = this._state.todos.find(x => x.id === id);
        if (t) { t.done = cb.checked; if (t.done) this._addScore(3); }
        this._saveState();
        this._renderTodo();
      });
    });

    list.querySelectorAll('.todo-del').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = parseInt(e.target.closest('.todo-item').dataset.id);
        this._state.todos = this._state.todos.filter(t => t.id !== id);
        this._saveState();
        this._renderTodo();
      });
    });
  },

  // ── NOTES ─────────────────────────────────────────────
  _initNotes() {
    const area = document.getElementById('notesArea');
    const save = document.getElementById('notesSaveBtn');
    if (!area) return;

    area.value = this._state.notes || '';

    // Auto-save on pause
    let saveTimer;
    area.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        this._state.notes = area.value;
        this._saveState();
      }, 800);
    });

    save?.addEventListener('click', () => {
      this._state.notes = area.value;
      this._saveState();
      window.toast?.('SCRATCHPAD SAVED', 'success', 1500);
    });
  },

  // ── SCORE ─────────────────────────────────────────────
  _addScore(pts) {
    this._score += pts;
    const el = document.getElementById('prodScore');
    if (el) el.textContent = this._score;
  },

  // ── PERSISTENCE ───────────────────────────────────────
  _state: { todos: [], habits: [], notes: '' },

  _loadState() {
    chrome.storage?.local.get('prodState', r => {
      if (r.prodState) {
        this._state = r.prodState;
        // Reset habits each day
        const today = new Date().toDateString();
        if (this._state.lastReset !== today) {
          this._state.habits.forEach(h => h.done = false);
          this._state.lastReset = today;
        }
      } else {
        this._state.habits = [...this._defaultHabits];
      }
      this._renderHabits();
      this._renderTodo();
      const area = document.getElementById('notesArea');
      if (area) area.value = this._state.notes || '';
    });
  },

  _saveState() {
    chrome.storage?.local.set({ prodState: this._state });
  }
};
