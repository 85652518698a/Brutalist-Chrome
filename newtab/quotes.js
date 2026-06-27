/**
 * BRUTALIST CHROME — Quotes Module
 * Rotating motivational quotes with local fallback.
 */

const LOCAL_QUOTES = [
  { text: "Simplicity is the ultimate sophistication.", author: "LEONARDO DA VINCI" },
  { text: "Make it work, make it right, make it fast.", author: "KENT BECK" },
  { text: "The function of good software is to make the complex appear simple.", author: "GRADY BOOCH" },
  { text: "Code is read more often than it is written.", author: "GUIDO VAN ROSSUM" },
  { text: "No simplicity. No excuses. Just function.", author: "BRUTALIST CHROME" },
  { text: "Do not seek praise. Seek criticism.", author: "PAUL ARDEN" },
  { text: "An idiot admires complexity, a genius admires simplicity.", author: "TERRY DAVIS" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "HAROLD ABELSON" },
  { text: "The best way to predict the future is to invent it.", author: "ALAN KAY" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "ANTOINE DE SAINT-EXUPÉRY" },
  { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "EDWARD V. BERARD" },
  { text: "First, solve the problem. Then, write the code.", author: "JOHN JOHNSON" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "MARTIN FOWLER" },
  { text: "Work. Focus. Discipline. Repeat.", author: "BRUTALIST CHROME" },
];

export const Quotes = {
  _current: 0,

  init() {
    // Pick today's quote deterministically
    const today = new Date();
    const seed  = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
    this._current = seed % LOCAL_QUOTES.length;

    this._render(LOCAL_QUOTES[this._current]);

    document.getElementById('newQuoteBtn')?.addEventListener('click', () => {
      this._current = (this._current + 1) % LOCAL_QUOTES.length;
      this._render(LOCAL_QUOTES[this._current]);
    });
  },

  _render(quote) {
    const text   = document.getElementById('quoteText');
    const author = document.getElementById('quoteAuthor');
    if (!text || !author) return;

    // Fade transition
    text.style.opacity   = '0';
    author.style.opacity = '0';
    setTimeout(() => {
      text.textContent   = `"${quote.text}"`;
      author.textContent = `— ${quote.author}`;
      text.style.opacity   = '1';
      author.style.opacity = '1';
      text.style.transition   = 'opacity 0.3s';
      author.style.transition = 'opacity 0.3s';
    }, 150);
  }
};
