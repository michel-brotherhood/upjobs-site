import { icon } from "../utils/icons.js";

const ITEMS = [
  { label: "Matrícula", href: "matricula.html", ic: "pencil" },
  { label: "Dúvidas", href: "faq.html", ic: "help" },
  { label: "Contato", href: "contato.html", ic: "mail" },
];

/** Insere o menu flutuante (speed-dial) com Matrícula, Dúvidas e Contato. */
export function mountWaFloat() {
  if (document.querySelector(".fab")) return;

  const wrap = document.createElement("div");
  wrap.className = "fab";
  wrap.innerHTML = `
    <ul class="fab__menu" role="list">
      ${ITEMS.map(
        (it, i) =>
          `<li style="--i:${i}"><a href="${it.href}">${icon(it.ic)}<span>${it.label}</span></a></li>`
      ).join("")}
    </ul>
    <button class="fab__toggle" type="button" aria-expanded="false" aria-label="Abrir menu de atendimento">
      <span class="fab__icon fab__icon--open">${icon("chat")}</span>
      <span class="fab__icon fab__icon--close">${icon("close")}</span>
    </button>
  `;
  document.body.appendChild(wrap);

  const toggle = wrap.querySelector(".fab__toggle");
  const close = () => {
    wrap.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = wrap.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && wrap.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });
}
