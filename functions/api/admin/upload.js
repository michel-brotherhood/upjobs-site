import { requireSession, jsonResponse } from "../../_shared/auth.js";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

function sanitizeExt(type) {
  return { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" }[type] || "bin";
}

/** Recebe uma foto (multipart/form-data, campo "file") e guarda no R2. */
export async function onRequestPost({ request, env }) {
  if (!(await requireSession(request, env))) return jsonResponse({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!env.IMAGES) return jsonResponse({ ok: false, error: "storage_not_configured" }, { status: 500 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return jsonResponse({ ok: false, error: "missing_file" }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return jsonResponse({ ok: false, error: "invalid_type" }, { status: 400 });
  if (file.size > MAX_BYTES) return jsonResponse({ ok: false, error: "file_too_large" }, { status: 400 });

  const key = `cursos/${crypto.randomUUID()}.${sanitizeExt(file.type)}`;
  await env.IMAGES.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

  const url = new URL(request.url);
  return jsonResponse({ ok: true, url: `${url.origin}/api/images/${key}` });
}
