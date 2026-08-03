/** Reveal on-scroll via IntersectionObserver (progressive enhancement).
 *  Garante que conteúdo já visível ao carregar apareça imediatamente e
 *  degrada com segurança quando não há suporte a IntersectionObserver. */
export function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const reveal = (el) => {
    const delay = el.dataset.reveal;
    if (delay) el.style.transitionDelay = `${delay}ms`;
    el.classList.add("is-visible");
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  const vh = window.innerHeight || document.documentElement.clientHeight;
  items.forEach((el) => {
    // Já visível ao carregar (above-the-fold): revela na hora, sem depender de scroll.
    const top = el.getBoundingClientRect().top;
    if (top < vh * 0.92) {
      el.classList.add("is-visible");
    } else {
      io.observe(el);
    }
  });
}
