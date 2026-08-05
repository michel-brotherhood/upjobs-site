import { mountHeader } from "./components/header.js";
import { mountFooter } from "./components/footer.js";
import { mountWaFloat } from "./components/wa-float.js";
import { mountDiferenciaisStrip } from "./components/diferenciais-strip.js";
import { initReveal } from "./modules/reveal.js";
import { initForms } from "./modules/forms.js";
import { waLink } from "./config.js";
import { icon } from "./utils/icons.js";

const page = document.body.dataset.page || "";

// Estrutura comum a todas as páginas
mountHeader(page);
mountDiferenciaisStrip();
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

// Vídeo "Nossa história": autoplay mudo em loop; clique ativa/desativa o som.
document.querySelectorAll(".historia-video[data-video-toggle]").forEach((fig) => {
  const video = fig.querySelector("video");
  const badge = fig.querySelector("[data-vsound]");
  const btn = fig.querySelector(".historia-video__play");
  if (!video) return;
  const sync = () => {
    fig.classList.toggle("is-muted", video.muted);
    if (badge) badge.innerHTML = `${icon(video.muted ? "mute" : "sound")} ${video.muted ? "Sem som" : "Com som"}`;
    if (btn) btn.setAttribute("aria-label", video.muted ? "Ativar som do vídeo" : "Silenciar vídeo");
  };
  const toggle = () => {
    video.muted = !video.muted;
    if (!video.muted && video.paused) video.play().catch(() => {});
    sync();
  };
  btn?.addEventListener("click", toggle);
  video.addEventListener("click", toggle);
  video.addEventListener("volumechange", sync);
  sync();
});

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
if (["quem-somos", "diferenciais", "contato", "inicio"].includes(page)) {
  import("./modules/faq-widget.js").then((m) => m.renderFaq("faq-embed"));
}
if (page === "treinamentos") {
  import("./modules/catalog.js").then((m) =>
    m.initCourseList("nr-courses-grid", ["nr-10", "nr-33", "nr-34", "nr-35", "seguranca-geral-nrs"])
  );
}
if (page === "matricula") {
  import("./modules/matricula.js").then((m) => m.initMatricula());
}
