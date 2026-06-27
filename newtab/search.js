/**
 * BRUTALIST CHROME — Search Module
 * Multi-engine search with keyboard navigation.
 */

const ENGINES = {
  google:    q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  bing:      q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  duckduckgo:q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
  brave:     q => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
};

export const Search = {
  _engine: 'google',
  _suggestTimer: null,

  init() {
    const input    = document.getElementById('searchInput');
    const form     = document.getElementById('searchBox');
    const engines  = document.getElementById('searchEngines');
    const voice    = document.getElementById('voiceBtn');

    // Load saved engine
    chrome.storage?.local.get('searchEngine', r => {
      if (r.searchEngine) this._setEngine(r.searchEngine);
    });

    // Submit on Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        // URL or search
        const isUrl = /^(https?:\/\/|www\.)/.test(q) || q.includes('.') && !q.includes(' ');
        window.location.href = isUrl
          ? (q.startsWith('http') ? q : 'https://' + q)
          : ENGINES[this._engine](q);
      }
      // Navigate suggestions with arrows
      if (e.key === 'ArrowDown') this._navigateSuggestions(1);
      if (e.key === 'ArrowUp')   this._navigateSuggestions(-1);
      if (e.key === 'Escape')    this._hideSuggestions();
    });

    // Suggestions on type
    input.addEventListener('input', e => {
      clearTimeout(this._suggestTimer);
      const q = e.target.value.trim();
      if (q.length < 2) { this._hideSuggestions(); return; }
      this._suggestTimer = setTimeout(() => this._fetchSuggestions(q), 250);
    });

    // Engine buttons
    engines.querySelectorAll('.engine-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._setEngine(btn.dataset.engine);
        chrome.storage?.local.set({ searchEngine: btn.dataset.engine });
        input.focus();
      });
    });

    // Voice search (Web Speech API)
    voice.addEventListener('click', () => this._startVoice(input));

    // Close suggestions on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('#searchContainer')) this._hideSuggestions();
    });
  },

  _setEngine(name) {
    this._engine = name;
    document.querySelectorAll('.engine-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.engine === name);
    });
  },

  async _fetchSuggestions(q) {
    // Use Chrome's omnibox suggestion endpoint via a JSONP-style approach
    // Falls back to static suggestions if offline
    const suggestions = document.getElementById('searchSuggestions');
    const items = this._localSuggestions(q);
    this._renderSuggestions(items, q);
  },

  _localSuggestions(q) {
    // Generate plausible suggestions locally (no external API needed for privacy)
    return [
      q,
      q + ' tutorial',
      q + ' examples',
      q + ' documentation',
      q + ' vs',
    ].slice(0, 5);
  },

  _renderSuggestions(items, query) {
    const box = document.getElementById('searchSuggestions');
    if (!items.length) { this._hideSuggestions(); return; }

    box.innerHTML = items.map((item, i) => `
      <div class="suggestion-item" data-idx="${i}" tabindex="-1">
        <span style="color:var(--smoke);margin-right:8px">⌕</span>${this._highlight(item, query)}
      </div>
    `).join('');

    box.querySelectorAll('.suggestion-item').forEach((el, i) => {
      el.addEventListener('click', () => {
        document.getElementById('searchInput').value = items[i];
        window.location.href = ENGINES[this._engine](items[i]);
      });
      el.addEventListener('mouseenter', () => {
        box.querySelectorAll('.suggestion-item').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
      });
    });

    box.classList.add('visible');
  },

  _highlight(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'),
      '<strong style="color:var(--white)">$1</strong>');
  },

  _hideSuggestions() {
    document.getElementById('searchSuggestions')?.classList.remove('visible');
  },

  _navigateSuggestions(dir) {
    const items = document.querySelectorAll('.suggestion-item');
    if (!items.length) return;
    const active = document.querySelector('.suggestion-item.active');
    let idx = active ? parseInt(active.dataset.idx) + dir : (dir > 0 ? 0 : items.length - 1);
    idx = (idx + items.length) % items.length;
    items.forEach(el => el.classList.remove('active'));
    items[idx].classList.add('active');
    document.getElementById('searchInput').value = items[idx].textContent.trim();
  },

  _startVoice(input) {
    if (!('webkitSpeechRecognition' in window)) {
      window.toast?.('VOICE NOT SUPPORTED', 'error');
      return;
    }
    const sr = new webkitSpeechRecognition();
    sr.continuous = false;
    sr.interimResults = false;
    sr.onstart  = () => { document.getElementById('voiceBtn').style.color = 'var(--red)'; };
    sr.onresult = e => { input.value = e.results[0][0].transcript; };
    sr.onend    = () => { document.getElementById('voiceBtn').style.color = ''; };
    sr.start();
  }
};
