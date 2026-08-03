import { waLink } from "../config.js";
import { icon } from "../utils/icons.js";

/** Insere o botão flutuante de WhatsApp (persistente). */
export function mountWaFloat() {
  if (document.querySelector(".wa-float")) return;
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = waLink();
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Falar no WhatsApp");
  a.innerHTML = `${icon("whatsapp")}<span class="wa-float__label">Fale conosco</span>`;
  document.body.appendChild(a);
}
