/**
 * BRUTALIST CHROME — Weather Module
 * Uses IP-based location — no geolocation permission needed.
 */

const WMO_CODES = {
  0:  { desc: 'CLEAR SKY',       icon: '◉' },
  1:  { desc: 'MAINLY CLEAR',    icon: '◉' },
  2:  { desc: 'PARTLY CLOUDY',   icon: '◎' },
  3:  { desc: 'OVERCAST',        icon: '◌' },
  45: { desc: 'FOGGY',           icon: '≋' },
  48: { desc: 'RIME FOG',        icon: '≋' },
  51: { desc: 'LIGHT DRIZZLE',   icon: '∷' },
  61: { desc: 'RAIN',            icon: '∷' },
  63: { desc: 'MODERATE RAIN',   icon: '∷∷' },
  71: { desc: 'SNOW',            icon: '❄' },
  80: { desc: 'RAIN SHOWERS',    icon: '∷' },
  95: { desc: 'THUNDERSTORM',    icon: '⚡' },
  99: { desc: 'HAIL STORM',      icon: '⚡∷' },
};

export const Weather = {
  async init() {
    const cache    = await this._loadCache();
    if (cache) this._render(cache);

    const cacheAge = Date.now() - (cache?.timestamp || 0);
    if (cacheAge > 30 * 60 * 1000) {
      await this._fetchAndRender();
    }
  },

  async _fetchAndRender() {
    try {
      // IP-based location — no browser permission needed
      const ipRes  = await fetch('https://ipapi.co/json/');
      const ipData = await ipRes.json();
      const lat    = ipData.latitude;
      const lon    = ipData.longitude;
      const city   = (ipData.city || 'UNKNOWN').toUpperCase();

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weathercode,relativehumidity_2m` +
        `&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;

      const res  = await fetch(url);
      const data = await res.json();

      const weatherData = {
        temp:      Math.round(data.current.temperature_2m),
        code:      data.current.weathercode,
        humidity:  data.current.relativehumidity_2m,
        high:      Math.round(data.daily.temperature_2m_max[0]),
        low:       Math.round(data.daily.temperature_2m_min[0]),
        city,
        timestamp: Date.now(),
      };

      this._render(weatherData);
      chrome.storage?.local.set({ weatherCache: weatherData });

    } catch (err) {
      document.getElementById('weatherDesc').textContent = 'OFFLINE';
      console.warn('[Weather] fetch failed:', err);
    }
  },

  _render(data) {
    const meta = WMO_CODES[data.code] || { desc: 'UNKNOWN', icon: '◈' };
    const set  = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('weatherTemp', `${data.temp}°`);
    set('weatherIcon', meta.icon);
    set('weatherDesc', meta.desc);
    set('weatherHigh', data.high);
    set('weatherLow',  data.low);
    set('weatherHum',  data.humidity);
    set('weatherLoc',  data.city || '---');
  },

  async _loadCache() {
    return new Promise(resolve => {
      chrome.storage?.local.get('weatherCache', r => resolve(r.weatherCache || null));
    });
  },
};
