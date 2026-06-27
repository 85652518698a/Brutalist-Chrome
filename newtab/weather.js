/**
 * BRUTALIST CHROME — Weather Module
 * Uses wttr.in — no API key, no permission issues.
 */

const WMO_CODES = {
  0:  { desc: 'CLEAR SKY',      icon: '◉' },
  1:  { desc: 'MAINLY CLEAR',   icon: '◉' },
  2:  { desc: 'PARTLY CLOUDY',  icon: '◎' },
  3:  { desc: 'OVERCAST',       icon: '◌' },
  45: { desc: 'FOGGY',          icon: '≋' },
  48: { desc: 'RIME FOG',       icon: '≋' },
  51: { desc: 'LIGHT DRIZZLE',  icon: '∷' },
  61: { desc: 'RAIN',           icon: '∷' },
  63: { desc: 'MODERATE RAIN',  icon: '∷∷' },
  71: { desc: 'SNOW',           icon: '❄' },
  80: { desc: 'RAIN SHOWERS',   icon: '∷' },
  95: { desc: 'THUNDERSTORM',   icon: '⚡' },
  99: { desc: 'HAIL STORM',     icon: '⚡∷' },
};

export const Weather = {
  async init() {
    const cache = await this._loadCache();
    if (cache) this._render(cache);

    const cacheAge = Date.now() - (cache?.timestamp || 0);
    if (cacheAge > 30 * 60 * 1000) {
      await this._fetchAndRender();
    }
  },

  async _fetchAndRender() {
    try {
      // wttr.in — free, no key, auto-detects location by IP
      const res  = await fetch('https://wttr.in/?format=j1');
      const data = await res.json();

      const current = data.current_condition[0];
      const area    = data.nearest_area[0];
      const city    = area.areaName[0].value.toUpperCase();

      const weatherData = {
        temp:      parseInt(current.temp_C),
        code:      this._mapCondition(parseInt(current.weatherCode)),
        humidity:  parseInt(current.humidity),
        high:      parseInt(data.weather[0].maxtempC),
        low:       parseInt(data.weather[0].mintempC),
        city,
        timestamp: Date.now(),
      };

      this._render(weatherData);
      chrome.storage?.local.set({ weatherCache: weatherData });

    } catch (err) {
      const el = document.getElementById('weatherDesc');
      if (el) el.textContent = 'OFFLINE';
      console.warn('[Weather] fetch failed:', err);
    }
  },

  // Map wttr.in weather codes to WMO-like codes
  _mapCondition(code) {
    if (code === 113) return 0;
    if (code === 116) return 2;
    if (code === 119 || code === 122) return 3;
    if (code === 143 || code === 248 || code === 260) return 45;
    if ([263,266,293,296].includes(code)) return 51;
    if ([299,302,305,308].includes(code)) return 63;
    if ([323,326,329,332,335,338,368,371].includes(code)) return 71;
    if ([200,386,389,392,395].includes(code)) return 95;
    return 2;
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
