// src/scripts/fade-in-observer.js
export function observeFadeIn(selector = '.visible-animate') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll(selector);
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0');
        entry.target.classList.add('animate-fade-up');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  elements.forEach(el => {
    el.classList.add('opacity-0');
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  observeFadeIn();
});
