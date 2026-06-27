/**
 * BRUTALIST CHROME — Clock Module
 * Live clock, date, timezone, and calendar strip.
 */

export const Clock = {
  _interval: null,

  init() {
    this._render();
    this._interval = setInterval(() => this._render(), 1000);
    this._buildCalendarStrip();
  },

  _render() {
    const now  = new Date();
    const time = document.getElementById('clockTime');
    const date = document.getElementById('clockDate');
    const tz   = document.getElementById('clockTZ');
    if (!time) return;

    // HH:MM:SS
    time.textContent = now.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    // DAY DD MMM YYYY
    date.textContent = now.toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();

    // Timezone offset
    const offset = -now.getTimezoneOffset();
    const sign   = offset >= 0 ? '+' : '-';
    const hh     = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const mm     = String(Math.abs(offset) % 60).padStart(2, '0');
    tz.textContent = `UTC${sign}${hh}:${mm}`;
  },

  _buildCalendarStrip() {
    const strip = document.getElementById('calendarStrip');
    if (!strip) return;
    const today = new Date();
    const days  = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

    // Show 7 days: 3 before today, today, 3 after
    for (let i = -3; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isToday = i === 0;

      const el = document.createElement('div');
      el.className = 'cal-day' + (isToday ? ' today' : '');
      el.innerHTML = `
        <span class="cal-day-name">${days[d.getDay()]}</span>
        <span class="cal-day-num">${String(d.getDate()).padStart(2,'0')}</span>
      `;
      strip.appendChild(el);

      if (isToday) el.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  },

  destroy() {
    clearInterval(this._interval);
  }
};
