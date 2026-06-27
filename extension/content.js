/**
 * BRUTALIST CHROME — Content Script
 * Injected into all pages. Minimal footprint.
 */

(function () {
  'use strict';

  // ── READING MODE SHORTCUT (Alt+R) ─────────────────────
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'r') toggleReadingMode();
  });

  function toggleReadingMode() {
    const existing = document.getElementById('brutalist-reading-overlay');
    if (existing) { existing.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'brutalist-reading-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647;
      background: #0D0D0D; color: #F2EFE8;
      font-family: 'Helvetica Neue', sans-serif;
      font-size: 18px; line-height: 1.8;
      padding: 80px max(80px, calc(50% - 360px));
      overflow-y: auto;
    `;

    // Extract main content
    const article = document.querySelector('article, main, [role="main"], .post-content, .article-body');
    const content = article ? article.innerText : document.body.innerText;

    const title = document.title.toUpperCase();
    overlay.innerHTML = `
      <div style="font-family:Arial Black,sans-serif;font-size:2rem;font-weight:900;
                  letter-spacing:-0.04em;margin-bottom:8px;color:#F2EFE8">${title}</div>
      <div style="width:32px;height:2px;background:#DC2626;margin-bottom:40px"></div>
      <div style="white-space:pre-wrap">${content.slice(0, 5000)}</div>
      <button onclick="this.closest('#brutalist-reading-overlay').remove()"
              style="position:fixed;top:24px;right:24px;background:#DC2626;border:none;
                     color:#fff;font-family:monospace;font-size:12px;letter-spacing:0.1em;
                     padding:8px 16px;cursor:pointer;text-transform:uppercase">
        EXIT [ALT+R]
      </button>
    `;
    document.body.appendChild(overlay);
  }

  // ── PAGE PROGRESS BAR ─────────────────────────────────
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: #DC2626; z-index: 2147483646;
    transition: width 0.1s; pointer-events: none;
  `;
  document.body.appendChild(bar);

  document.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
  }, { passive: true });

})();
