import { SITE, waLink } from "../config.js";
import { loadCourses } from "./courses-data.js";

/** Aplica máscara de telefone BR: (00) 0000-0000 / (00) 00000-0000. */
function maskPhone(value) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) => {
      let out = "";
      if (a) out += `(${a}`;
      if (a && a.length === 2) out += ") ";
      out += b;
      if (c) out += `-${c}`;
      return out;
    });
  }
  return d.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, a, b, c) => {
    let out = "";
    if (a) out += `(${a}`;
    if (a && a.length === 2) out += ") ";
    out += b;
    if (c) out += `-${c}`;
    return out;
  });
}

function setError(field, msg) {
  if (!field) return;
  const box = field.querySelector(".field__error");
  if (msg) {
    field.setAttribute("data-error", "");
    if (box) box.textContent = msg;
  } else {
    field.removeAttribute("data-error");
    if (box) box.textContent = "";
  }
}

/** Inicializa a página de matrícula: preenche cursos, aplica máscaras e trata o envio. */
export async function initMatricula() {
  const form = document.getElementById("matricula-form");
  if (!form) return;

  // Preenche o select de cursos a partir da fonte única de dados.
  const select = form.querySelector("#m-curso");
  const data = await loadCourses();
  const params = new URLSearchParams(location.search);
  const preselect = params.get("curso") || "";
  data.courses.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.title;
    opt.textContent = c.title;
    if (preselect && c.id === preselect) opt.selected = true;
    select.appendChild(opt);
  });

  // Máscaras
  form.querySelectorAll('[data-mask="phone"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = maskPhone(input.value);
    });
  });
  // Limpa erro ao editar
  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (field) setError(field, "");
  });

  const status = form.querySelector(".form__status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    const nome = form.querySelector("#m-nome");
    const email = form.querySelector("#m-email");
    const celular = form.querySelector("#m-celular");
    const curso = form.querySelector("#m-curso");
    const consent = form.querySelector("#m-consent");

    if (!nome.value.trim()) {
      setError(nome.closest(".field"), "Informe seu nome completo.");
      ok = false;
    }
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      setError(email.closest(".field"), "Informe um e-mail válido.");
      ok = false;
    }
    if (celular.value.replace(/\D/g, "").length < 10) {
      setError(celular.closest(".field"), "Informe um celular válido com DDD.");
      ok = false;
    }
    if (!curso.value) {
      setError(curso.closest(".field"), "Selecione o curso de interesse.");
      ok = false;
    }
    if (!consent.checked) {
      setError(consent.closest(".field"), "É necessário concordar para continuar.");
      ok = false;
    }

    if (!ok) {
      status.dataset.state = "error";
      status.textContent = "Confira os campos destacados e tente novamente.";
      const firstErr = form.querySelector("[data-error] input, [data-error] select, [data-error] textarea");
      if (firstErr) firstErr.focus();
      return;
    }

    const fd = new FormData(form);
    const rows = [
      ["Nome", fd.get("nome")],
      ["E-mail", fd.get("email")],
      ["Endereço", fd.get("endereco")],
      ["Telefone", fd.get("telefone")],
      ["Celular/WhatsApp", fd.get("celular")],
      ["Curso de interesse", fd.get("curso")],
      ["Forma de pagamento", fd.get("pagamento")],
      ["Mensagem", fd.get("mensagem")],
    ].filter(([, v]) => v && String(v).trim());

    const bodyText = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    const subject = `Matrícula — ${fd.get("curso")} — ${fd.get("nome")}`;
    const mailto = `mailto:${SITE.emails.contato}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    const waMessage = `*Nova matrícula pelo site Upjobs*\n${bodyText}`;

    status.dataset.state = "success";
    status.textContent = "Abrindo seu e-mail e o WhatsApp da Upjobs…";

    // Abre o cliente de e-mail do usuário com os dados preenchidos.
    window.location.href = mailto;
    // Em seguida, direciona para o WhatsApp para agilizar o atendimento.
    setTimeout(() => {
      window.open(waLink(waMessage), "_blank", "noopener");
    }, 600);

    form.reset();
  });
}
