import { loadCourses, segmentOf, segCode, courseCode, modalityLabel } from "./courses-data.js";
import { icon } from "../utils/icons.js";
import { waLink } from "../config.js";

/** Card de curso — estilo ficha técnica (código mono + segmento + spec). */
export function courseCard(course, data) {
  const seg = segmentOf(data, course.segment);
  const code = courseCode(data, course);
  const cardImg = course.img
    ? (/^https?:\/\//.test(course.img) ? course.img : `public/images/cursos/cards/card-${course.img}.webp`)
    : "";
  return `
    <article class="card course-card card--link${course.comingSoon ? " course-card--soon" : ""}" data-reveal>
      <a href="curso.html?id=${course.id}" class="course-card__media${cardImg ? " course-card__media--photo" : ""}"${cardImg ? ` style="background-image:url('${cardImg}')"` : ""} aria-label="${course.title}">
        <span class="course-card__code tech-code">${code}</span>
        ${course.img ? "" : `<span class="icon-badge icon-badge--dark">${icon(seg ? seg.icon : "bolt")}</span>`}
        ${course.comingSoon ? `<span class="course-card__ribbon">Em breve</span>` : ""}
      </a>
      <div class="course-card__body">
        <span class="tech-label course-card__seg">${seg ? seg.label : ""}</span>
        <h3><a href="curso.html?id=${course.id}">${course.title}</a></h3>
        <p class="text-muted">${course.short}</p>
        ${
          course.comingSoon
            ? ""
            : `<div class="course-card__meta">
          ${course.duration ? `<span>${course.duration}</span>` : ""}<span>${modalityLabel(course)}</span><span>Certificado</span>
        </div>`
        }
        <div class="course-card__foot">
          <a class="btn btn--ghost btn--block" href="curso.html?id=${course.id}">${course.comingSoon ? "Quero ser avisado" : "Ver ficha do curso"} ${icon("arrow")}</a>
        </div>
      </div>
    </article>
  `;
}

/** Renderiza a página de catálogo com filtros por segmento. */
export async function initCatalog() {
  const grid = document.getElementById("catalog-grid");
  const toolbar = document.getElementById("catalog-toolbar");
  if (!grid || !toolbar) return;

  const data = await loadCourses();
  const params = new URLSearchParams(location.search);
  let current = params.get("seg") || "todos";

  // Botões de filtro (com contagem de cursos por segmento)
  const filters = [{ id: "todos", label: "Todos os cursos" }, ...data.segments.map((s) => ({ id: s.id, label: s.label }))];
  toolbar.innerHTML = `
    <span class="catalog-toolbar__title">Filtrar por área</span>
    <div class="catalog-toolbar__list">
      ${filters
        .map((f) => {
          const count = f.id === "todos" ? data.courses.length : data.courses.filter((c) => c.segment === f.id).length;
          return `<button class="filter-btn" type="button" data-seg="${f.id}" aria-pressed="${f.id === current}"><span class="filter-btn__label">${f.label}</span><span class="filter-btn__count">${count}</span></button>`;
        })
        .join("")}
    </div>
    <span class="catalog-toolbar__hint" aria-hidden="true">${icon("arrow")}</span>
  `;

  // No mobile a lista rola na horizontal; o "hint" (sombra + seta) avisa que
  // dá pra arrastar e some sozinho quando o usuário chega ao fim da lista.
  const list = toolbar.querySelector(".catalog-toolbar__list");
  const hint = toolbar.querySelector(".catalog-toolbar__hint");
  const syncHint = () => {
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
    hint.classList.toggle("is-hidden", atEnd || list.scrollWidth <= list.clientWidth + 4);
  };
  list.addEventListener("scroll", syncHint, { passive: true });
  window.addEventListener("resize", syncHint);
  syncHint();

  function render() {
    const list = current === "todos" ? data.courses : data.courses.filter((c) => c.segment === current);
    if (!list.length) {
      grid.innerHTML = `<p class="catalog-empty">Nenhum curso encontrado neste segmento no momento. <a class="text-green" href="${waLink()}" target="_blank" rel="noopener">Fale conosco no WhatsApp</a>.</p>`;
      return;
    }
    grid.innerHTML = list.map((c) => courseCard(c, data)).join("");
    grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  }

  toolbar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    current = btn.dataset.seg;
    toolbar.querySelectorAll(".filter-btn").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const url = new URL(location.href);
    if (current === "todos") url.searchParams.delete("seg");
    else url.searchParams.set("seg", current);
    history.replaceState(null, "", url);
    render();
  });

  render();
}

/** Renderiza os cursos em destaque na home (grid #featured-courses). */
export async function initFeatured() {
  const grid = document.getElementById("featured-courses");
  if (!grid) return;
  const data = await loadCourses();
  const featured = data.courses.filter((c) => c.featured).slice(0, 6);
  grid.innerHTML = featured.map((c) => courseCard(c, data)).join("");
  grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}

/**
 * Renderiza cursos num container. Se `segmentId` for informado, lista todos os
 * cursos daquele segmento automaticamente (novos cursos aparecem sem precisar
 * editar o HTML/JS). Caso contrário, usa a lista fixa de ids na ordem informada.
 */
export async function initCourseList(containerId, segmentId, ids) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const data = await loadCourses();
  const list = segmentId
    ? data.courses.filter((c) => c.segment === segmentId)
    : ids.map((id) => data.courses.find((c) => c.id === id)).filter(Boolean);
  grid.innerHTML = list.map((c) => courseCard(c, data)).join("");
  grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}

/** Renderiza a grade de segmentos na home (#segments-grid). */
export async function initSegments() {
  const grid = document.getElementById("segments-grid");
  if (!grid) return;
  const data = await loadCourses();
  grid.innerHTML = data.segments
    .map((s) => {
      const count = data.courses.filter((c) => c.segment === s.id).length;
      return `
        <a class="seg-card" href="cursos.html?seg=${s.id}" data-reveal>
          <div class="seg-card__head">
            <span class="icon-badge">${icon(s.icon)}</span>
            <span class="tech-code seg-card__code">${segCode(s.id)}</span>
          </div>
          <h3>${s.label}</h3>
          <p>${s.desc}</p>
          <span class="seg-card__count">${count} curso${count > 1 ? "s" : ""} ${icon("arrow")}</span>
        </a>`;
    })
    .join("");
  grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}
