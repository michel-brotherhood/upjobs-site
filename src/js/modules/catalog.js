import { loadCourses, segmentOf } from "./courses-data.js";
import { icon } from "../utils/icons.js";
import { waLink } from "../config.js";

/** Card de curso para o catálogo e destaques da home. */
export function courseCard(course, data) {
  const seg = segmentOf(data, course.segment);
  return `
    <article class="card course-card card--link" data-reveal>
      <a href="curso.html?id=${course.id}" class="course-card__media" aria-label="${course.title}">
        <span class="course-card__seg"><span class="chip chip--dark">${seg ? seg.label : ""}</span></span>
        <span class="icon-badge">${icon(seg ? seg.icon : "bolt")}</span>
      </a>
      <div class="course-card__body">
        <h3><a href="curso.html?id=${course.id}">${course.title}</a></h3>
        <p class="text-muted">${course.short}</p>
        <div class="course-card__meta">
          <span>${icon("users")} Turmas reduzidas</span>
          <span>${icon("cert")} Certificado</span>
        </div>
        <div class="course-card__foot">
          <a class="btn btn--ghost btn--block" href="curso.html?id=${course.id}">Ver curso ${icon("arrow")}</a>
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

  // Botões de filtro
  const filters = [{ id: "todos", label: "Todos os cursos" }, ...data.segments.map((s) => ({ id: s.id, label: s.label }))];
  toolbar.innerHTML = filters
    .map(
      (f) =>
        `<button class="filter-btn" type="button" data-seg="${f.id}" aria-pressed="${f.id === current}">${f.label}</button>`
    )
    .join("");

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
          <span class="icon-badge">${icon(s.icon)}</span>
          <h3>${s.label}</h3>
          <p>${s.desc}</p>
          <span class="seg-card__count">${count} curso${count > 1 ? "s" : ""} ${icon("arrow")}</span>
        </a>`;
    })
    .join("");
  grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}
