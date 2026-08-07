/**
 * Painel /admin — usuário único, sem dependências externas.
 * Login por senha (sessão via cookie) + CRUD de cursos sobre /api/admin/courses.
 */
const root = document.getElementById("admin-root");
let SEGMENTS = [];
let COURSES = [];

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
  });
  let data = null;
  try { data = await res.json(); } catch { /* sem corpo */ }
  return { ok: res.ok, status: res.status, data };
}

async function init() {
  const { data } = await api("/api/admin/session");
  if (data?.ok) renderDashboard();
  else renderLogin();
}

function renderLogin(errorMsg = "") {
  root.innerHTML = `
    <form class="admin-login" id="login-form">
      <h1>Painel Upjobs</h1>
      <p class="admin-hint">Acesso restrito. Informe a senha do administrador.</p>
      <input type="password" name="password" placeholder="Senha" required autofocus>
      <button type="submit" class="btn btn--primary">Entrar</button>
      <p class="admin-login__error">${errorMsg}</p>
    </form>
  `;
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = new FormData(e.target).get("password");
    const { ok, data } = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    if (ok && data?.ok) renderDashboard();
    else if (data?.error === "admin_not_configured") renderLogin("Painel ainda não configurado (falta a variável ADMIN_PASSWORD).");
    else renderLogin(`Senha incorreta. (recebido: ${data?.submittedLength ?? "?"} caractere(s) — apague este aviso depois de resolver)`);
  });
}

async function renderDashboard() {
  root.innerHTML = `<p class="admin-loading">Carregando cursos…</p>`;
  const { ok, data } = await api("/api/admin/courses");
  if (!ok) { renderLogin("Sessão expirada, faça login novamente."); return; }
  SEGMENTS = data.segments;
  COURSES = data.courses;
  paintDashboard();
}

function segmentLabel(id) {
  return SEGMENTS.find((s) => s.id === id)?.label || id;
}

function paintDashboard() {
  const rows = [...COURSES]
    .sort((a, b) => segmentLabel(a.segment).localeCompare(segmentLabel(b.segment)) || a.title.localeCompare(b.title))
    .map((c) => `
      <tr data-hidden="${c.hidden}">
        <td class="admin-td-title">${c.title}</td>
        <td>${segmentLabel(c.segment)}</td>
        <td>${c.duration || "—"}</td>
        <td>${c.modality || "—"}</td>
        <td>
          ${c.hidden ? '<span class="admin-badge admin-badge--hidden">Oculto</span>' : '<span class="admin-badge">Visível</span>'}
          ${c.comingSoon ? '<span class="admin-badge admin-badge--soon">Em breve</span>' : ""}
        </td>
        <td>
          <div class="admin-row-actions">
            <button type="button" data-action="edit" data-id="${c.id}">Editar</button>
            <button type="button" data-action="toggle" data-id="${c.id}">${c.hidden ? "Mostrar" : "Ocultar"}</button>
            <button type="button" class="is-danger" data-action="delete" data-id="${c.id}">Excluir</button>
          </div>
        </td>
      </tr>
    `).join("");

  root.innerHTML = `
    <div class="admin-header">
      <h1>Painel de cursos</h1>
      <div class="admin-header__actions">
        <button type="button" class="btn btn--primary" id="btn-new">+ Novo curso</button>
        <button type="button" class="btn btn--ghost" id="btn-logout">Sair</button>
      </div>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Curso</th><th>Segmento</th><th>Carga horária</th><th>Modalidade</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6">Nenhum curso cadastrado.</td></tr>`}</tbody>
      </table>
    </div>
  `;

  document.getElementById("btn-logout").addEventListener("click", async () => {
    await api("/api/admin/logout", { method: "POST" });
    renderLogin();
  });
  document.getElementById("btn-new").addEventListener("click", () => openModal(null));

  root.querySelectorAll("[data-action]").forEach((btn) => {
    const id = btn.dataset.id;
    const course = COURSES.find((c) => c.id === id);
    btn.addEventListener("click", async () => {
      if (btn.dataset.action === "edit") openModal(course);
      if (btn.dataset.action === "toggle") {
        await api("/api/admin/courses", { method: "PATCH", body: JSON.stringify({ id, hidden: !course.hidden }) });
        renderDashboard();
      }
      if (btn.dataset.action === "delete") {
        if (!confirm(`Excluir definitivamente o curso "${course.title}"? Essa ação não pode ser desfeita.`)) return;
        await api(`/api/admin/courses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        renderDashboard();
      }
    });
  });
}

function linesToArray(text) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function openModal(course) {
  const isNew = !course;
  const segmentOptions = SEGMENTS.map((s) => `<option value="${s.id}" ${course?.segment === s.id ? "selected" : ""}>${s.label}</option>`).join("");

  const backdrop = document.createElement("div");
  backdrop.className = "admin-modal-backdrop";
  backdrop.innerHTML = `
    <form class="admin-modal">
      <h2>${isNew ? "Novo curso" : "Editar curso"}</h2>
      <div class="admin-field">
        <label>Título</label>
        <input name="title" required value="${course?.title || ""}">
      </div>
      <div class="admin-field--row">
        <div class="admin-field">
          <label>Segmento</label>
          <select name="segment" required>${segmentOptions}</select>
        </div>
        <div class="admin-field">
          <label>Carga horária</label>
          <input name="duration" placeholder="ex.: 40h" value="${course?.duration || ""}">
        </div>
      </div>
      <div class="admin-field--row">
        <div class="admin-field">
          <label>Modalidade</label>
          <select name="modality">
            <option value="" ${!course?.modality ? "selected" : ""}>—</option>
            <option value="presencial" ${course?.modality === "presencial" ? "selected" : ""}>Presencial</option>
            <option value="ead" ${course?.modality === "ead" ? "selected" : ""}>EAD</option>
            <option value="semipresencial" ${course?.modality === "semipresencial" ? "selected" : ""}>Semipresencial</option>
          </select>
        </div>
        <div class="admin-field admin-field--check" style="align-self:end">
          <input type="checkbox" name="comingSoon" id="f-soon" ${course?.comingSoon ? "checked" : ""}>
          <label for="f-soon" style="text-transform:none;letter-spacing:0">Marcar como "em breve"</label>
        </div>
      </div>
      <div class="admin-field">
        <label>Descrição curta</label>
        <textarea name="short">${course?.short || ""}</textarea>
      </div>
      <div class="admin-field">
        <label>Para quem é</label>
        <textarea name="forWho">${course?.forWho || ""}</textarea>
      </div>
      <div class="admin-field">
        <label>O que aprende (um item por linha)</label>
        <textarea name="learn">${(course?.learn || []).join("\n")}</textarea>
      </div>
      <div class="admin-field">
        <label>Conteúdo programático (um módulo por linha)</label>
        <textarea name="syllabus">${(course?.syllabus || []).join("\n")}</textarea>
      </div>
      <p class="admin-status"></p>
      <div class="admin-modal__actions">
        <button type="button" class="btn btn--ghost" data-close>Cancelar</button>
        <button type="submit" class="btn btn--primary">${isNew ? "Criar curso" : "Salvar alterações"}</button>
      </div>
    </form>
  `;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelector("[data-close]").addEventListener("click", close);

  backdrop.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = backdrop.querySelector(".admin-status");
    const fd = new FormData(e.target);
    const payload = {
      id: course?.id,
      title: fd.get("title"),
      segment: fd.get("segment"),
      duration: fd.get("duration") || null,
      modality: fd.get("modality") || null,
      comingSoon: fd.get("comingSoon") === "on",
      short: fd.get("short") || "",
      forWho: fd.get("forWho") || "",
      learn: linesToArray(fd.get("learn") || ""),
      syllabus: linesToArray(fd.get("syllabus") || ""),
    };

    const { ok, data } = isNew
      ? await api("/api/admin/courses", { method: "POST", body: JSON.stringify(payload) })
      : await api("/api/admin/courses", { method: "PUT", body: JSON.stringify(payload) });

    if (ok && data?.ok) {
      close();
      renderDashboard();
    } else {
      status.dataset.state = "error";
      status.textContent = data?.error === "id_taken" ? "Já existe um curso com esse título/id." : "Não foi possível salvar. Tente novamente.";
    }
  });
}

init();
