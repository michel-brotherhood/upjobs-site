import { jsonResponse } from "../../_shared/auth.js";

/**
 * Endpoint temporário de diagnóstico — NÃO expõe a senha, só metadados
 * (tamanho e se há espaço/quebra de linha nas pontas) para ajudar a
 * confirmar se ADMIN_PASSWORD está configurada como esperado.
 * Remover depois que o login estiver funcionando.
 */
export async function onRequestGet({ env }) {
  const raw = env.ADMIN_PASSWORD;
  if (!raw) return jsonResponse({ configured: false });
  return jsonResponse({
    configured: true,
    length: raw.length,
    hasLeadingOrTrailingWhitespace: raw !== raw.trim(),
  });
}
