import { loadCourses, segmentOf, COURSE_INCLUDES, courseCode, courseMetaChips } from "./courses-data.js";
import { icon } from "../utils/icons.js";
import { waLink } from "../config.js";
import { initForms } from "./forms.js";

/** Renderiza a página individual de curso a partir de ?id=. */
export async function initCoursePage() {
  const root = document.getElementById("course-root");
  if (!root) return;

  const data = await loadCourses();
  const id = new URLSearchParams(location.search).get("id");
  const course = data.courses.find((c) => c.id === id);

  if (!course) {
    root.innerHTML = `
      <section class="section container text-center">
        <h1>Curso não encontrado</h1>
        <p class="lead mx-auto">O curso que você procura não está disponível ou o endereço mudou.</p>
        <p class="mt-lg"><a class="btn btn--primary" href="cursos.html">Ver todos os cursos</a></p>
      </section>`;
    return;
  }

  const seg = segmentOf(data, course.segment);
  document.title = `${course.title} — Upjobs Cursos e Treinamentos`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", course.short);

  const waMsg = `Olá! Tenho interesse no curso ${course.title}. Gostaria de saber valores, datas e como me matricular.`;

  const heroImg = course.img ? `public/images/cursos/heros/hero-${course.img}.webp` : "";
  // Background aplicado inline (url resolve relativo ao HTML, não ao dist/).
  const heroStyle = heroImg
    ? ` style="background:linear-gradient(90deg,rgb(4 5 5 / 0.92) 0%,rgb(4 5 5 / 0.72) 48%,rgb(4 5 5 / 0.45) 100%),linear-gradient(0deg,rgb(4 5 5 / 0.85) 0%,rgb(4 5 5 / 0.25) 55%),url('${heroImg}') center / cover no-repeat, #050505"`
    : "";
  root.innerHTML = `
    <section class="page-hero${heroImg ? " page-hero--photo" : ""}"${heroStyle}>
      <div class="container page-hero__inner">
        <nav class="breadcrumb" aria-label="Você está aqui">
          <ol>
            <li><a href="index.html">Início</a></li>
            <li><a href="cursos.html">Cursos</a></li>
            <li>${course.title}</li>
          </ol>
        </nav>
        <span class="course-hero-code"><span class="tech-code" style="color:var(--green-bright)">${courseCode(data, course)}</span> <span class="tech-label" style="color:rgba(255,255,255,.65)">${seg ? seg.label : ""}</span></span>
        <h1>${course.title}</h1>
        <p class="lead">${course.short}</p>
        <div class="course-hero-meta">
          ${courseMetaChips(course).map((c) => `<span>${icon(c.icon)} ${c.text}</span>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container course-layout">
        <div>
          <div class="course-section" data-reveal>
            <h2>Para quem é este curso</h2>
            <p class="lead" style="max-width:60ch">${course.forWho}</p>
          </div>

          <div class="course-section" data-reveal>
            <h2>O que você vai aprender</h2>
            <ul class="check-list" role="list">
              ${course.learn.map((i) => `<li>${i}</li>`).join("")}
            </ul>
          </div>

          <div class="course-section" data-reveal>
            <h2>Conteúdo do curso</h2>
            <ol class="syllabus" role="list">
              ${course.syllabus.map((i) => `<li>${i}</li>`).join("")}
            </ol>
          </div>

          <div class="course-section" data-reveal>
            <h2>Está incluso</h2>
            <ul class="check-list" role="list">
              ${COURSE_INCLUDES.map((i) => `<li>${i}</li>`).join("")}
            </ul>
          </div>
        </div>

        <aside>
          <div class="card enroll-card" data-reveal>
            <h3>Garanta sua vaga</h3>
            <p class="price-note">Valores, condições e próximas turmas informados na hora pelo WhatsApp.</p>
            <ul role="list">
              <li>${icon("check")} Matrícula rápida e sem burocracia</li>
              <li>${icon("check")} ${course.modality === "ead" ? "100% online, estude no seu ritmo" : "Presencial em São Gonçalo/RJ"}</li>
              <li>${icon("check")} Apoio à empregabilidade</li>
            </ul>
            <a class="btn btn--primary btn--block btn--lg" href="matricula.html?curso=${encodeURIComponent(course.id)}">${icon("pencil")} Quero me matricular</a>
            <a class="btn btn--ghost btn--block" href="${waLink(waMsg)}" target="_blank" rel="noopener">${icon("whatsapp")} Falar no WhatsApp</a>
            <a class="btn btn--ghost btn--block" href="cursos.html">Ver outros cursos</a>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="cta-band">
          <div class="split" style="align-items:center">
            <div class="stack">
              <h2>Ainda com dúvidas sobre o ${course.title}?</h2>
              <p class="lead">Fale agora com nossa equipe e receba orientação sobre a carreira, datas e formas de pagamento.</p>
            </div>
            <div class="cluster cluster--end">
              <a class="btn btn--whatsapp btn--lg" href="${waLink(waMsg)}" target="_blank" rel="noopener">${icon("whatsapp")} Falar no WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div id="course-jsonld"></div>
  `;

  // JSON-LD dinâmico do curso
  const ld = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.short,
    provider: {
      "@type": "EducationalOrganization",
      name: "Upjobs Cursos e Treinamentos",
      sameAs: location.origin,
    },
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(ld);
  document.getElementById("course-jsonld").appendChild(s);

  // Reveal imediato (conteúdo injetado)
  root.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  initForms();
}
