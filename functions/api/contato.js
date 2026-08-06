/**
 * Cloudflare Pages Function — recebe os formulários do site e envia um e-mail
 * organizado para a secretaria via Resend. Não substitui o WhatsApp (que
 * continua abrindo no cliente); é um envio adicional, best-effort.
 *
 * Requer a variável de ambiente RESEND_API_KEY configurada no projeto
 * Cloudflare Pages (Settings → Environment variables).
 */

const DEST_EMAIL = "contato@upjobscursos.com.br";
const FROM_EMAIL = "Site Upjobs <site@upjobscursos.com.br>";

const FIELD_LABELS = {
  nome: "Nome",
  telefone: "Telefone",
  email: "E-mail",
  empresa: "Empresa",
  curso: "Curso de interesse",
  mensagem: "Mensagem",
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml({ context, fields }) {
  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font:600 13px system-ui,sans-serif;white-space:nowrap;vertical-align:top;">${escapeHtml(FIELD_LABELS[key] || key)}</td>
          <td style="padding:8px 12px;color:#111827;font:400 14px system-ui,sans-serif;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;">
      <div style="background:#0a3d2e;padding:20px 24px;border-radius:10px 10px 0 0;">
        <h1 style="color:#fff;font-size:18px;margin:0;">Novo contato pelo site Upjobs</h1>
        ${context ? `<p style="color:#a7f3d0;font-size:13px;margin:6px 0 0;">Origem: ${escapeHtml(context)}</p>` : ""}
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 10px 10px;overflow:hidden;">
        ${rows}
      </table>
      <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Enviado automaticamente pelo formulário do site upjobscursos.com.br.</p>
    </div>`;
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), { status: 400 });
  }

  const { context, fields } = payload || {};
  if (!fields || typeof fields !== "object" || !fields.nome) {
    return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "email_not_configured" }), { status: 200 });
  }

  const subject = context ? `Novo contato — ${context}` : "Novo contato pelo site Upjobs";

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [DEST_EMAIL],
        reply_to: fields.email || undefined,
        subject,
        html: buildEmailHtml({ context, fields }),
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      return new Response(JSON.stringify({ ok: false, error: "resend_error", detail }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "network_error" }), { status: 200 });
  }
}
