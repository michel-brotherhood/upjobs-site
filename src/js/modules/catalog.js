import { loadCourses, segmentOf, segCode, courseCode, modalityLabel } from "./courses-data.js";
import { icon } from "../utils/icons.js";
import { waLink } from "../config.js";

/** Card de curso — estilo ficha técnica (código mono + segmento + spec). */
export function courseCard(course, data) {
  const seg = segmentOf(data, course.segment);
  const code = courseCode(data, course);
  return `
    <article class="card course-card card--link" data-reveal>
      <a href="curso.html?id=${course.id}" class="course-card__media${course.img ? " course-card__media--photo" : ""}"${course.img ? ` style="background-image:url('public/images/cursos/cards/card-${course.img}.webp')"` : ""} aria-label="${course.title}">
        <span class="course-card__code tech-code">${code}</span>
        ${course.img ? "" : `<span class="icon-badge icon-badge--dark">${icon(seg ? seg.icon : "bolt")}</span>`}
      </a>
      <div class="course-card__body">
        <span class="tech-label course-card__seg">${seg ? seg.label : ""}</span>
        <h3><a href="curso.html?id=${course.id}">${course.title}</a></h3>
        <p class="text-muted">${course.short}</p>
        <div class="course-card__meta">
          ${course.duration ? `<span>${course.duration}</span>` : ""}<span>${modalityLabel(course)}</span><span>Certificado</span>
        </div>
        <div class="course-card__foot">
          <a class="btn btn--ghost btn--block" href="curso.html?id=${course.id}">Ver ficha do curso ${icon("arrow")}</a>
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
  `;

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

/** Renderiza uma lista fixa de cursos (por id, na ordem informada) num container. */
export async function initCourseList(containerId, ids) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const data = await loadCourses();
  const list = ids.map((id) => data.courses.find((c) => c.id === id)).filter(Boolean);
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
