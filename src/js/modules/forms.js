import { SITE, waLink } from "../config.js";

/**
 * Formulários que convertem em WhatsApp.
 * O formulário monta uma mensagem com os dados e abre o wa.me pré-preenchido.
 * Validação nativa + validação leve no cliente.
 *
 * Uso: <form data-wa-form data-context="Curso X"> ... </form>
 * Campos reconhecidos por name: nome, telefone, email, empresa, curso, mensagem, consentimento.
 */
export function initForms() {
  const forms = document.querySelectorAll("[data-wa-form]");
  forms.forEach(bindForm);
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

function bindForm(form) {
  const status = form.querySelector(".form__status");
  const context = form.dataset.context || "";

  // Limpa erro ao editar
  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (field) setError(field, "");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    const nome = form.querySelector('[name="nome"]');
    const tel = form.querySelector('[name="telefone"]');
    const consent = form.querySelector('[name="consentimento"]');

    if (nome && !nome.value.trim()) {
      setError(nome.closest(".field"), "Informe seu nome.");
      ok = false;
    }
    if (tel) {
      const digits = tel.value.replace(/\D/g, "");
      if (digits.length < 10) {
        setError(tel.closest(".field"), "Informe um telefone válido com DDD.");
        ok = false;
      }
    }
    if (consent && !consent.checked) {
      setError(consent.closest(".field"), "É necessário concordar para continuar.");
      ok = false;
    }

    if (!ok) {
      if (status) {
        status.dataset.state = "error";
        status.textContent = "Confira os campos destacados e tente novamente.";
      }
      const firstErr = form.querySelector("[data-error] input, [data-error] select, [data-error] textarea");
      if (firstErr) firstErr.focus();
      return;
    }

    // Monta mensagem
    const data = new FormData(form);
    const lines = ["*Novo contato pelo site Upjobs*"];
    if (context) lines.push(`Interesse: ${context}`);
    const labels = {
      nome: "Nome",
      telefone: "Telefone",
      email: "E-mail",
      empresa: "Empresa",
      curso: "Curso",
      mensagem: "Mensagem",
    };
    for (const key of ["nome", "telefone", "email", "empresa", "curso", "mensagem"]) {
      const v = (data.get(key) || "").toString().trim();
      if (v) lines.push(`${labels[key]}: ${v}`);
    }
    const msg = lines.join("\n");

    if (status) {
      status.dataset.state = "success";
      status.textContent = "Redirecionando para o WhatsApp…";
    }

    const url = waLink(msg);
    window.open(url, "_blank", "noopener");
    form.reset();
  });
}
