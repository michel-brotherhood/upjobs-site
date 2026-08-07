import { clearSessionCookie, jsonResponse } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  const cookie = await clearSessionCookie(request, env);
  return jsonResponse({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
