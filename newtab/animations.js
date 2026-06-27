/**
 * BRUTALIST CHROME — Animations Module
 * Page load sequence and micro-interaction orchestration.
 */

export const Animations = {
  initPageLoad() {
    // Stagger children of animated containers
    document.querySelectorAll('.animate-enter').forEach((el, i) => {
      el.style.animationDelay = `${i * 60}ms`;
    });
    document.querySelectorAll('.animate-slide-left').forEach((el, i) => {
      el.style.animationDelay = `${i * 40 + 80}ms`;
    });
    document.querySelectorAll('.animate-slide-right').forEach((el, i) => {
      el.style.animationDelay = `${i * 40 + 80}ms`;
    });

    // Add hover glitch to brand word
    const brand = document.querySelector('.brand-word');
    if (brand) {
      brand.setAttribute('data-text', brand.textContent);
      brand.addEventListener('mouseenter', () => brand.classList.add('glitch'));
      brand.addEventListener('mouseleave', () =>
        setTimeout(() => brand.classList.remove('glitch'), 500)
      );
    }

    // Subtle background parallax on mouse move
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      const bg = document.getElementById('bgImage');
      if (bg) bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
  },
};
