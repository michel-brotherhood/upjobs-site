import { SITE, waLink } from "../config.js";
import { icon } from "../utils/icons.js";

/** Conteúdo único dos diferenciais (mesmo texto do site anterior, cliente já aprovou). */
const ITEMS = [
  {
    title: "Turmas personalizadas e reduzidas.",
    text: "Não enchemos as salas de alunos na qual vira uma bagunça e não se aprende nada! Turmas reduzidas para que todos tenham a mesma atenção do professor e consigam aprender facilmente.",
  },
  {
    title: "Fornecimento de EPIs para práticas.",
    text: "Para realizar as aulas práticas é necessário estar protegido com Equipamentos de Proteção Individual (EPI). Nós fornecemos para você.",
  },
  {
    title: "Ferramentas e Materiais por nossa conta.",
    text: "Fornecemos todas as ferramentas e materiais de consumo para realização das aulas práticas com segurança e praticidade.",
  },
  {
    title: "Cadastro de currículos e indicações de oportunidades em empresas parceiras.",
    text: "Enviamos os currículos para oportunidades de emprego em empresas parceiras exclusivas para alunos da Upjobs.",
  },
  {
    title: "Certificado Conclusão de Curso.",
    text: "Ao completar o curso, os alunos recebem o certificado de conclusão e estão preparados para entrar no mercado de trabalho ou empreender.",
  },
];

/** Fotos reais da estrutura para o carrossel "Conheça nosso espaço". */
const SPACE_PHOTOS = [
  { src: "public/images/espaco/espaco-1.webp", alt: "Alunos praticando instalações elétricas prediais no laboratório da Upjobs" },
  { src: "public/images/espaco/espaco-2.webp", alt: "Turma na bancada de comandos elétricos e força e controle" },
  { src: "public/images/espaco/espaco-3.webp", alt: "Aula prática de instalações elétricas prediais" },
];

/**
 * Monta a faixa de Diferenciais + carrossel "Conheça nosso espaço" em todas as
 * páginas, sempre logo acima do rodapé. Injetada antes do elemento #site-footer
 * para não precisar editar cada página HTML individualmente.
 */
export function mountDiferenciaisStrip() {
  const footerEl = document.getElementById("site-footer");
  if (!footerEl || document.getElementById("diferenciais-strip")) return;

  const itemsHtml = ITEMS.map(
    (it) => `
      <li>
        <span class="icon-badge" aria-hidden="true">${icon("thumbsup")}</span>
        <span>
          <strong>${it.title}</strong>
          <p class="text-muted">${it.text}</p>
        </span>
      </li>`
  ).join("");

  const slidesHtml = SPACE_PHOTOS.map(
    (p) => `<figure class="space-carousel__slide"><img src="${p.src}" alt="${p.alt}" loading="lazy" width="1200" height="900"></figure>`
  ).join("");

  const section = document.createElement("div");
  section.id = "diferenciais-strip";
  section.innerHTML = `
    <section class="section diferenciais-strip" aria-labelledby="dif-strip-title">
      <div class="container">
        <div class="split diferenciais-strip__grid" style="align-items:start">
          <div>
            <h2 id="dif-strip-title" class="section-title">Diferenciais da Upjobs!</h2>
            <p class="lead">Mais de 3 mil alunos já escolheram a Upjobs. Agora é a sua vez de sair na frente!</p>
            <ul class="diferenciais-list" role="list">${itemsHtml}</ul>
          </div>
          <div class="vip-box cta-band">
            <span class="icon-badge icon-badge--dark" aria-hidden="true">${icon("rocket")}</span>
            <h3>Entre para o GRUPO VIP e receba promoções exclusivas direto no seu WhatsApp!</h3>
            <p class="lead">Junte-se a mais de 3 mil alunos já capacitados e destaque-se no mercado com a Upjobs.</p>
            <a class="btn btn--whatsapp btn--lg btn--block" href="${SITE.vipGroupUrl}" target="_blank" rel="noopener">${icon("whatsapp")} Grupo VIP</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section upcapacita-strip" aria-labelledby="upcapacita-strip-title">
      <div class="container">
        <div class="split" style="align-items:center">
          <div class="upcapacita-strip__logo">
            <img src="public/images/upcapacita-logo.svg" alt="UPCAPACITA — Educação Corporativa" width="300" height="58" loading="lazy">
          </div>
          <div class="stack">
            <h2 id="upcapacita-strip-title">Flexibilidade, Qualidade e Certificação Garantida</h2>
            <p class="text-muted">Aprenda de forma fácil e flexível com a nossa plataforma intuitiva, disponível em computadores, celulares e tablets. Acesse material didático completo, incluindo vídeo aulas, apostilas e simulados, tudo em nossa plataforma exclusiva. Obtenha certificados reconhecidos em todo o Brasil, assinados por nossa equipe de engenheiros e profissionais habilitados. Comece sua jornada educacional com a UPCAPACITA hoje mesmo!</p>
            <div><a class="btn btn--primary" href="https://upcapacita.com.br/" target="_blank" rel="noopener">Conheça a UPCAPACITA ${icon("arrow")}</a></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--surface" aria-labelledby="espaco-strip-title">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Nossa estrutura</span>
          <h2 id="espaco-strip-title" class="section-title">Conheça nosso espaço</h2>
          <p class="section-intro">Laboratórios equipados com ferramentas reais para você treinar exatamente como vai trabalhar.</p>
        </div>
        <div class="space-carousel">
          <button class="space-carousel__nav space-carousel__nav--prev" type="button" aria-label="Foto anterior">${icon("arrow")}</button>
          <div class="space-carousel__track" tabindex="0" aria-label="Fotos da estrutura da Upjobs">${slidesHtml}</div>
          <button class="space-carousel__nav space-carousel__nav--next" type="button" aria-label="Próxima foto">${icon("arrow")}</button>
        </div>
      </div>
    </section>
  `;

  footerEl.before(section);

  // Navegação do carrossel (scroll nativo com snap; botões avançam um slide)
  const track = section.querySelector(".space-carousel__track");
  const prev = section.querySelector(".space-carousel__nav--prev");
  const next = section.querySelector(".space-carousel__nav--next");
  const scrollByStep = (dir) => {
    const slide = track.querySelector(".space-carousel__slide");
    const step = slide ? slide.getBoundingClientRect().width + 16 : track.clientWidth;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  prev?.addEventListener("click", () => scrollByStep(-1));
  next?.addEventListener("click", () => scrollByStep(1));
}
