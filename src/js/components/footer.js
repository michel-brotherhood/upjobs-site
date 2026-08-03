import { SITE, waLink, telLink } from "../config.js";
import { icon } from "../utils/icons.js";

const YEAR = new Date().getFullYear();

/** Monta o rodapé no elemento com id "site-footer". */
export function mountFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="public/images/upjobs-logo-verde-branco.webp" alt="${SITE.name}" width="150" height="84" loading="lazy">
          <p>Cursos profissionalizantes, técnicos, industriais e treinamentos de segurança do trabalho com foco em empregabilidade em São Gonçalo, Niterói e região metropolitana do Rio de Janeiro.</p>
          <div class="footer-social" style="margin-top:1.25rem">
            <a href="${SITE.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
            <a href="${SITE.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
            <a href="${SITE.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Navegação</h4>
          <ul role="list">
            <li><a href="cursos.html">Cursos</a></li>
            <li><a href="matricula.html">Matrícula</a></li>
            <li><a href="quem-somos.html">Quem Somos</a></li>
            <li><a href="diferenciais.html">Diferenciais</a></li>
            <li><a href="consultoria.html">Consultoria</a></li>
            <li><a href="infraestrutura.html">Infraestrutura</a></li>
            <li><a href="empregabilidade.html">Empregabilidade</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Institucional</h4>
          <ul role="list">
            <li><a href="certificacoes.html">Certificações</a></li>
            <li><a href="esg.html">ESG / Empresas</a></li>
            <li><a href="grupo-vip.html">Grupo VIP</a></li>
            <li><a href="faq.html">Perguntas frequentes</a></li>
            <li><a href="contato.html">Contato</a></li>
            <li><a href="privacidade.html">Privacidade</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Fale com a Upjobs</h4>
          <ul role="list" class="footer-contact">
            <li>${icon("whatsapp")}<a href="${waLink()}" target="_blank" rel="noopener">${SITE.whatsappDisplay}<br><small>WhatsApp — Vendas</small></a></li>
            <li>${icon("phone")}<a href="${telLink()}">${SITE.phoneDisplay}<br><small>Telefone</small></a></li>
            <li>${icon("mail")}<a href="mailto:${SITE.emails.contato}">${SITE.emails.contato}</a></li>
            <li>${icon("pin")}<span>${SITE.address.street}<br>${SITE.address.city}/${SITE.address.state}</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© ${YEAR} ${SITE.name}. CNPJ ${SITE.cnpj}. Todos os direitos reservados.</p>
        <p>Feito com foco em empregabilidade • São Gonçalo/RJ</p>
      </div>
    </div>
  `;
}
