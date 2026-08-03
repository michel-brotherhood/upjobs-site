import { SITE, waLink } from "../config.js";
import { icon } from "../utils/icons.js";

/** Ícones de redes sociais (Facebook, Instagram, LinkedIn). */
function socialLinks(cls = "") {
  return `
    <a class="${cls}" href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
    <a class="${cls}" href="${SITE.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
    <a class="${cls}" href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>`;
}

const NAV = [
  { id: "inicio", label: "Início", href: "index.html" },
  { id: "cursos", label: "Cursos", href: "cursos.html" },
  { id: "quem-somos", label: "Quem Somos", href: "quem-somos.html" },
  { id: "diferenciais", label: "Diferenciais", href: "diferenciais.html" },
  { id: "empregabilidade", label: "Empregabilidade", href: "empregabilidade.html" },
  { id: "esg", label: "ESG", href: "esg.html" },
  { id: "contato", label: "Contato", href: "contato.html" },
];

/** Monta o header no elemento com id "site-header". */
export function mountHeader(active) {
  const el = document.getElementById("site-header");
  if (!el) return;

  const links = NAV.map(
    (n) =>
      `<li><a href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");

  el.innerHTML = `
    <a class="skip-link" href="#main">Pular para o conteúdo</a>
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="${SITE.name} — página inicial">
        <img src="public/images/upjobs-logo-verde-branco.webp" alt="${SITE.name}" width="76" height="43" fetchpriority="high">
      </a>
      <nav class="main-nav" id="main-nav" aria-label="Navegação principal">
        <ul role="list">
          ${links}
          <li class="nav-cta"><a class="btn btn--whatsapp btn--block" href="${waLink()}" target="_blank" rel="noopener">${icon("whatsapp")} Falar no WhatsApp</a></li>
          <li class="nav-social" aria-hidden="false"><span class="header-social">${socialLinks()}</span></li>
        </ul>
      </nav>
      <div class="header-actions">
        <span class="header-social header-social--desktop">${socialLinks()}</span>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Abrir menu">
          <span class="icon-open">${icon("menu")}</span>
          <span class="icon-close">${icon("close")}</span>
        </button>
      </div>
    </div>
  `;

  // Toggle do menu mobile
  const toggle = el.querySelector(".nav-toggle");
  const nav = el.querySelector(".main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  // Fecha ao navegar/clicar num link
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  // Fecha com Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}
