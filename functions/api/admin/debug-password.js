import { jsonResponse } from "../../_shared/auth.js";

/**
 * Endpoint temporário de diagnóstico — NÃO expõe a senha, só metadados
 * (tamanho e se há espaço/quebra de linha nas pontas) para ajudar a
 * confirmar se ADMIN_PASSWORD está configurada como esperado.
 * Remover depois que o login estiver funcionando.
 */
export async function onRequestGet({ request, env }) {
  const raw = env.ADMIN_PASSWORD;
  if (!raw) return jsonResponse({ configured: false });

  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");
  const result = {
    configured: true,
    length: raw.length,
    hasLeadingOrTrailingWhitespace: raw !== raw.trim(),
  };
  if (candidate !== null) {
    result.match = candidate.trim() === raw.trim();
  }
  return jsonResponse(result);
}
