/**
 * BRUTALIST CHROME — Bookmarks Module
 * Loads top sites + bookmarks into shortcuts grid and bottom bar.
 */

const FALLBACK_SITES = [
  { title: 'GITHUB',    url: 'https://github.com' },
  { title: 'GMAIL',     url: 'https://mail.google.com' },
  { title: 'YOUTUBE',   url: 'https://youtube.com' },
  { title: 'TWITTER',   url: 'https://twitter.com' },
  { title: 'REDDIT',    url: 'https://reddit.com' },
  { title: 'NOTION',    url: 'https://notion.so' },
  { title: 'FIGMA',     url: 'https://figma.com' },
  { title: 'VERCEL',    url: 'https://vercel.com' },
];

export const Bookmarks = {
  async init() {
    const sites = await this._getTopSites();
    this._renderGrid(sites.slice(0, 8));
    this._renderBar(sites.slice(0, 12));
  },

  async _getTopSites() {
    try {
      const top = await new Promise(resolve =>
        chrome.topSites.get(resolve)
      );
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
    grid.innerHTML = sites.map(s => `
      <a class="shortcut-item" href="${s.url}" title="${s.title}">
        <img class="shortcut-favicon"
             src="${this._favicon(s.url)}"
             alt="${s.title}"
             onerror="this.style.display='none'" />
        <span class="shortcut-label">${s.title}</span>
      </a>
    `).join('');
  },

  _renderBar(sites) {
    const bar = document.getElementById('bmList');
    if (!bar) return;
    bar.innerHTML = sites.map(s => `
      <a class="bm-item" href="${s.url}">
        <img src="${this._favicon(s.url)}"
             width="12" height="12"
             alt=""
             onerror="this.style.display='none'" />
        ${s.title}
      </a>
    `).join('');
  }
};
