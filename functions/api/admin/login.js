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

  if (!body?.password || body.password !== env.ADMIN_PASSWORD) {
    return jsonResponse({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const cookie = await createSessionCookie(env);
  return jsonResponse({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
