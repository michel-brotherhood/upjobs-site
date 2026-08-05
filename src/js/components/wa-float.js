import { icon } from "../utils/icons.js";
import { waLink } from "../config.js";

/** Insere o botão flutuante — vai direto para o WhatsApp. */
export function mountWaFloat() {
  if (document.querySelector(".fab")) return;

  const link = document.createElement("a");
  link.className = "fab";
  link.href = waLink();
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", "Falar no WhatsApp");
  link.innerHTML = icon("whatsapp");

  document.body.appendChild(link);
}
