import { requireSession, jsonResponse } from "../../_shared/auth.js";

/** Usado pelo painel para saber, ao carregar a página, se já há sessão válida. */
export async function onRequestGet({ request, env }) {
  const ok = await requireSession(request, env);
  return jsonResponse({ ok });
}
