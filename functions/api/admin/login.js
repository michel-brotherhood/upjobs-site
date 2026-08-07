import { createSessionCookie, jsonResponse } from "../../_shared/auth.js";

/**
 * Requer a env var ADMIN_PASSWORD configurada no projeto Cloudflare Pages
 * (Settings → Environment variables) — defina uma senha forte lá.
 */
export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) {
    return jsonResponse({ ok: false, error: "admin_not_configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // .trim() nos dois lados: protege contra espaço/quebra de linha que às vezes
  // gruda ao colar a senha no campo de variável de ambiente da Cloudflare.
  const submitted = String(body?.password || "").trim();
  const expected = String(env.ADMIN_PASSWORD).trim();
  if (!submitted || submitted !== expected) {
    // DEBUG temporário: expõe só o tamanho do que chegou (nunca o valor),
    // pra descobrir se algo no navegador está alterando a senha antes de
    // enviar (autofill de senha antiga salva, autocapitalize no celular, etc).
    return jsonResponse({ ok: false, error: "invalid_credentials", submittedLength: submitted.length }, { status: 401 });
  }

  const cookie = await createSessionCookie(env);
  return jsonResponse({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
