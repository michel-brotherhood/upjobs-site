import { SITE, waLink } from "../config.js";
import { icon } from "../utils/icons.js";

/** Ícones de redes sociais (Facebook, Instagram, LinkedIn). */
function socialLinks(cls = "") {
  return `
    <a class="${cls}" href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
    <a class="${cls}" href="${SITE.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
    <a class="${cls}" href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>`;
}

/** Menu padrão do site. "Início" é adicionado à frente apenas nas páginas internas. */
const NAV = [
  { id: "quem-somos", label: "Quem Somos", href: "quem-somos.html" },
  { id: "cursos", label: "Cursos", href: "cursos.html" },
  { id: "treinamentos", label: "Treinamentos", href: "treinamentos.html" },
  { id: "blog", label: "Blog", href: "blog.html" },
  { id: "contato", label: "Atendimento", href: "contato.html" },
];

/** Monta o header no elemento com id "site-header". */
export function mountHeader(active) {
  const el = document.getElementById("site-header");
  if (!el) return;

  const items =
    active === "inicio" ? NAV : [{ id: "inicio", label: "Início", href: "index.html" }, ...NAV];

  const links = items.map(
    (n) =>
      `<li><a href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");

  el.innerHTML = `
    <a class="skip-link" href="#main">Pular para o conteúdo</a>
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="${SITE.name} — página inicial">
        <img src="public/images/upjobs-logo-verde-branco.webp" alt="${SITE.name}" width="102" height="57" fetchpriority="high">
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
          <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
  `;

  // Menu mobile: overlay em tela cheia com bloqueio de rolagem do fundo
  const toggle = el.querySelector(".nav-toggle");
  const nav = el.querySelector(".main-nav");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    // Impede a rolagem da página enquanto o menu está aberto
    document.documentElement.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  // Fecha ao clicar num link (navegação)
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  // Fecha com Esc e devolve o foco ao botão
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}
