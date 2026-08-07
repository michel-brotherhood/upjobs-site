/**
 * Autenticação simples para o painel /admin — usuário único, sessão por
 * cookie assinado por token aleatório guardado no D1 (tabela sessions).
 */
const COOKIE_NAME = "upjobs_admin_session";
const SESSION_HOURS = 12;
const REMEMBER_DAYS = 30;

function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach((part) => {
    const [k, ...rest] = part.trim().split("=");
    if (k) out[k] = decodeURIComponent(rest.join("="));
  });
  return out;
}

export async function requireSession(request, env) {
  const cookies = parseCookies(request);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  const row = await env.DB.prepare("SELECT expires_at FROM sessions WHERE token = ?").bind(token).first();
  if (!row) return false;
  if (row.expires_at < Date.now()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return false;
  }
  return true;
}

export async function createSessionCookie(env, remember = false) {
  const token = crypto.randomUUID();
  const hours = remember ? REMEMBER_DAYS * 24 : SESSION_HOURS;
  const expiresAt = Date.now() + hours * 60 * 60 * 1000;
  await env.DB.prepare("INSERT INTO sessions (token, expires_at) VALUES (?, ?)").bind(token, expiresAt).run();
  const maxAge = hours * 60 * 60;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export async function clearSessionCookie(request, env) {
  const cookies = parseCookies(request);
  const token = cookies[COOKIE_NAME];
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
}
