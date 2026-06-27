/**
 * BRUTALIST CHROME — Bookmarks Module
 * Loads top sites + bookmarks into shortcuts grid and bottom bar.
 */

const FALLBACK_SITES = [
  { title: 'GITHUB',   url: 'https://github.com' },
  { title: 'GMAIL',    url: 'https://mail.google.com' },
  { title: 'YOUTUBE',  url: 'https://youtube.com' },
  { title: 'TWITTER',  url: 'https://twitter.com' },
  { title: 'REDDIT',   url: 'https://reddit.com' },
  { title: 'NOTION',   url: 'https://notion.so' },
  { title: 'FIGMA',    url: 'https://figma.com' },
  { title: 'VERCEL',   url: 'https://vercel.com' },
];

export const Bookmarks = {
  async init() {
    const sites = await this._getTopSites();
    this._renderGrid(sites.slice(0, 8));
    this._renderBar(sites.slice(0, 12));
  },

  async _getTopSites() {
    try {
      const top = await new Promise(resolve => chrome.topSites.get(resolve));
      return top.map(s => ({
        title: s.title.toUpperCase().slice(0, 10),
        url:   s.url,
      }));
    } catch {
      return FALLBACK_SITES;
    }
  },

  _favicon(url) {
    try {
      const origin = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
    } catch {
      return '';
    }
  },

  _renderGrid(sites) {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    sites.forEach(s => {
      const a   = document.createElement('a');
      a.className = 'shortcut-item';
      a.href    = s.url;
      a.title   = s.title;

      const img = document.createElement('img');
      img.className = 'shortcut-favicon';
      img.src   = this._favicon(s.url);
      img.alt   = s.title;
      // No inline onerror — use addEventListener
      img.addEventListener('error', () => { img.style.display = 'none'; });

      const label = document.createElement('span');
      label.className = 'shortcut-label';
      label.textContent = s.title;

      a.appendChild(img);
      a.appendChild(label);
      grid.appendChild(a);
    });
  },

  _renderBar(sites) {
    const bar = document.getElementById('bmList');
    if (!bar) return;
    bar.innerHTML = '';
    sites.forEach(s => {
      const a   = document.createElement('a');
      a.className = 'bm-item';
      a.href    = s.url;

      const img = document.createElement('img');
      img.src   = this._favicon(s.url);
      img.width = 12;
      img.height = 12;
      img.alt   = '';
      img.addEventListener('error', () => { img.style.display = 'none'; });

      a.appendChild(img);
      a.appendChild(document.createTextNode(' ' + s.title));
      bar.appendChild(a);
    });
  }
};
