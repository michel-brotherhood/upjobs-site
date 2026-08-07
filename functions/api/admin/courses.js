import { requireSession, jsonResponse } from "../../_shared/auth.js";
import { SEGMENTS, rowToCourse } from "../../_shared/courses.js";

const VALID_SEGMENTS = new Set(SEGMENTS.map((s) => s.id));

function slugify(str) {
  return String(str)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Lista todos os cursos (incluindo ocultos) — só para o painel autenticado. */
export async function onRequestGet({ request, env }) {
  if (!(await requireSession(request, env))) return jsonResponse({ ok: false, error: "unauthorized" }, { status: 401 });

  const { results } = await env.DB.prepare("SELECT * FROM courses ORDER BY sort_order ASC").all();
  return jsonResponse({ ok: true, segments: SEGMENTS, courses: results.map((r) => ({ ...rowToCourse(r), hidden: !!r.hidden })) });
}

/** Cria um novo curso. */
export async function onRequestPost({ request, env }) {
  if (!(await requireSession(request, env))) return jsonResponse({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.segment) return jsonResponse({ ok: false, error: "missing_fields" }, { status: 400 });
  if (!VALID_SEGMENTS.has(body.segment)) return jsonResponse({ ok: false, error: "invalid_segment" }, { status: 400 });

  const id = slugify(body.id || body.title);
  const existing = await env.DB.prepare("SELECT id FROM courses WHERE id = ?").bind(id).first();
  if (existing) return jsonResponse({ ok: false, error: "id_taken" }, { status: 409 });

  const { max } = await env.DB.prepare("SELECT COALESCE(MAX(sort_order), -1) as max FROM courses").first();

  await env.DB.prepare(
    `INSERT INTO courses (id, title, segment, featured, coming_soon, hidden, duration, modality, img, short, for_who, learn, syllabus, sort_order)
     VALUES (?, ?, ?, 0, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.title, body.segment, body.comingSoon ? 1 : 0,
    body.duration || null, body.modality || null, body.img || null,
    body.short || "", body.forWho || "",
    JSON.stringify(body.learn || []), JSON.stringify(body.syllabus || []),
    max + 1
  ).run();

  return jsonResponse({ ok: true, id });
}

/** Atualiza um curso existente (descrição, carga horária, modalidade, etc). */
export async function onRequestPut({ request, env }) {
  if (!(await requireSession(request, env))) return jsonResponse({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.id) return jsonResponse({ ok: false, error: "missing_id" }, { status: 400 });
  if (body.segment && !VALID_SEGMENTS.has(body.segment)) return jsonResponse({ ok: false, error: "invalid_segment" }, { status: 400 });

  const existing = await env.DB.prepare("SELECT id FROM courses WHERE id = ?").bind(body.id).first();
  if (!existing) return jsonResponse({ ok: false, error: "not_found" }, { status: 404 });

  await env.DB.prepare(
    `UPDATE courses SET title = ?, segment = ?, img = ?, duration = ?, modality = ?, short = ?, for_who = ?, learn = ?, syllabus = ?, coming_soon = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).bind(
    body.title, body.segment, body.img || null, body.duration || null, body.modality || null,
    body.short || "", body.forWho || "",
    JSON.stringify(body.learn || []), JSON.stringify(body.syllabus || []),
    body.comingSoon ? 1 : 0,
    body.id
  ).run();

  return jsonResponse({ ok: true });
}

/** Alterna oculto/visível (curso some do site público sem precisar excluir). */
export async function onRequestPatch({ request, env }) {
  if (!(await requireSession(request, env))) return jsonResponse({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.id || typeof body.hidden !== "boolean") return jsonResponse({ ok: false, error: "missing_fields" }, { status: 400 });

  const result = await env.DB.prepare("UPDATE courses SET hidden = ? WHERE id = ?").bind(body.hidden ? 1 : 0, body.id).run();
  if (!result.meta.changes) return jsonResponse({ ok: false, error: "not_found" }, { status: 404 });

  return jsonResponse({ ok: true });
}

/** Exclui um curso definitivamente. */
export async function onRequestDelete({ request, env }) {
  if (!(await requireSession(request, env))) return jsonResponse({ ok: false, error: "unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return jsonResponse({ ok: false, error: "missing_id" }, { status: 400 });

  const result = await env.DB.prepare("DELETE FROM courses WHERE id = ?").bind(id).run();
  if (!result.meta.changes) return jsonResponse({ ok: false, error: "not_found" }, { status: 404 });

  return jsonResponse({ ok: true });
}
