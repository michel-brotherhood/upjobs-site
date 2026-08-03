import { mountHeader } from "./components/header.js";
import { mountFooter } from "./components/footer.js";
import { mountWaFloat } from "./components/wa-float.js";
import { initReveal } from "./modules/reveal.js";
import { initForms } from "./modules/forms.js";
import { waLink } from "./config.js";
import { icon } from "./utils/icons.js";

const page = document.body.dataset.page || "";

// Estrutura comum a todas as páginas
mountHeader(page);
mountFooter();
mountWaFloat();

// Resolve ícones inline: <span data-icon="whatsapp"></span>
document.querySelectorAll("[data-icon]").forEach((el) => {
  el.innerHTML = icon(el.dataset.icon);
});
// Resolve CTAs de WhatsApp: <a data-wa>...</a> ou data-wa="mensagem custom"
document.querySelectorAll("[data-wa]").forEach((el) => {
  const custom = el.getAttribute("data-wa");
  el.href = custom ? waLink(custom) : waLink();
  el.target = "_blank";
  el.rel = "noopener";
});

initReveal();
initForms();

// Carregamentos específicos por página (code splitting nativo via import dinâmico)
if (page === "inicio") {
  import("./modules/catalog.js").then((m) => {
    m.initSegments();
    m.initFeatured();
  });
}
if (page === "cursos") {
  import("./modules/catalog.js").then((m) => m.initCatalog());
}
if (page === "curso") {
  import("./modules/course.js").then((m) => m.initCoursePage());
}
if (page === "faq") {
  import("./modules/faq-widget.js").then((m) => m.renderFaq("faq-list", { openFirst: true }));
}
if (["quem-somos", "diferenciais", "contato"].includes(page)) {
  import("./modules/faq-widget.js").then((m) => m.renderFaq("faq-embed"));
}
if (page === "matricula") {
  import("./modules/matricula.js").then((m) => m.initMatricula());
}
