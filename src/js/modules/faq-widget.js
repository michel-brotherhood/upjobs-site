import { FAQ_ITEMS } from "./faq-data.js";

/**
 * Renderiza o accordion de perguntas frequentes num container.
 * @param {string} containerId
 * @param {{ openFirst?: boolean, items?: typeof FAQ_ITEMS }} [opts]
 */
export function renderFaq(containerId, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const items = opts.items || FAQ_ITEMS;
  el.innerHTML = items
    .map(
      (it, i) => `
      <details${opts.openFirst && i === 0 ? " open" : ""}>
        <summary>${it.q}</summary>
        <div>${it.html}</div>
      </details>`
    )
    .join("");
}
