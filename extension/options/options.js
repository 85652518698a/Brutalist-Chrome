/**
 * BRUTALIST CHROME — Options Script
 */

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initToggles();
  initSliders();
  initSave();
  initDataActions();
});

function loadSettings() {
  chrome.storage.local.get('settings', r => {
    const s = r.settings || {};

    // Toggles
    document.querySelectorAll('.toggle').forEach(t => {
      const key = t.dataset.key;
      const def = t.dataset.default === 'true';
      const val = key in s ? s[key] : def;
      t.classList.toggle('on', val);
    });

    // Sliders
    const opacitySlider = document.getElementById('bgOpacity');
    if (opacitySlider) {
      const val = Math.round((s.bgOpacity || 0.18) * 100);
      opacitySlider.value = val;
      document.getElementById('bgOpacityVal').textContent = val + '%';
    }

    // Pomodoro
    if (s.pomoWork)  document.getElementById('pomoWork').value  = s.pomoWork;
    if (s.pomoShort) document.getElementById('pomoShort').value = s.pomoShort;
    if (s.pomoLong)  document.getElementById('pomoLong').value  = s.pomoLong;

    // Search engine
    const engineSel = document.getElementById('searchEngine');
    if (engineSel && s.searchEngine) engineSel.value = s.searchEngine;
  });
}

function initToggles() {
  document.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });
}

function initSliders() {
  const slider = document.getElementById('bgOpacity');
  const label  = document.getElementById('bgOpacityVal');
  slider?.addEventListener('input', () => {
    label.textContent = slider.value + '%';
  });
}

function initSave() {
  document.getElementById('saveBtn').addEventListener('click', () => {
    const settings = gatherSettings();
    chrome.storage.local.set({ settings }, () => {
      const status = document.getElementById('saveStatus');
      status.textContent = '✓ SAVED';
      setTimeout(() => status.textContent = '', 2000);
    });
  });
}

function gatherSettings() {
  const s = {};

  document.querySelectorAll('.toggle').forEach(t => {
    if (t.dataset.key) s[t.dataset.key] = t.classList.contains('on');
  });

  const slider = document.getElementById('bgOpacity');
  if (slider) s.bgOpacity = parseInt(slider.value) / 100;

  const pw = document.getElementById('pomoWork');
  const ps = document.getElementById('pomoShort');
  const pl = document.getElementById('pomoLong');
  if (pw) s.pomoWork  = parseInt(pw.value);
  if (ps) s.pomoShort = parseInt(ps.value);
  if (pl) s.pomoLong  = parseInt(pl.value);

  const eng = document.getElementById('searchEngine');
  if (eng) s.searchEngine = eng.value;

  return s;
}

function initDataActions() {
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    chrome.storage.local.get(null, data => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `brutalist-chrome-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (confirm('RESET ALL DATA? This cannot be undone.')) {
      chrome.storage.local.clear(() => {
        const status = document.getElementById('saveStatus');
        status.textContent = '⚠ DATA CLEARED';
        setTimeout(() => status.textContent = '', 3000);
      });
    }
  });
}
