import { icon } from "../utils/icons.js";

/**
 * Depoimentos ilustrativos — a serem substituídos por relatos reais de
 * alunos assim que aprovados pelo cliente (ver README). Nomes fictícios,
 * não atribuídos a pessoas identificáveis.
 */
const TESTIMONIALS = [
  { name: "Rafael Souza", course: "Curso de Eletricista Predial", quote: "Fiz o curso de elétrica e em poucos meses já estava trabalhando. A parte prática fez toda a diferença." },
  { name: "Juliana Mendes", course: "Curso de Refrigeração", quote: "As turmas reduzidas ajudaram muito. O professor acompanha de perto e tira todas as dúvidas." },
  { name: "Carlos Eduardo", course: "Curso de Segurança Eletrônica", quote: "O apoio para conseguir emprego foi o que mais me surpreendeu. Fui indicado e consegui a vaga." },
  { name: "Patrícia Almeida", course: "Curso de Energia Solar", quote: "Já trabalhava com elétrica, mas o curso de energia solar abriu um mercado novo pra mim. Hoje atendo clientes por conta própria." },
  { name: "Bruno Costa", course: "Curso de Eletricista Naval", quote: "Nunca imaginei entrar na área naval sem experiência. O curso me deu a base técnica que faltava e hoje trabalho em estaleiro." },
  { name: "Camila Ferreira", course: "Curso de Assistente Administrativo", quote: "Voltei a estudar depois de anos parada. A didática e o apoio da equipe fizeram eu me sentir capaz de recomeçar." },
  { name: "Diego Martins", course: "Curso de Comandos Elétricos", quote: "As aulas práticas com painéis reais foram o diferencial. Consegui uma vaga na indústria antes mesmo de terminar o curso." },
  { name: "Fernanda Rocha", course: "Curso de CFTV", quote: "Comecei sem saber nada de câmeras e hoje faço instalações por conta própria. O retorno já veio no primeiro mês." },
];

/** Monta o carrossel de depoimentos no elemento com o id informado. */
export function mountTestimonials(containerId) {
  const root = document.getElementById(containerId);
  if (!root) return;

  const slides = TESTIMONIALS.map(
    (t) => `
      <figure class="testimonial-card">
        <blockquote>&ldquo;${t.quote}&rdquo;</blockquote>
        <figcaption>
          <span class="testimonial-avatar">${t.name.charAt(0)}</span>
          <div><cite>${t.name}</cite><br><small>${t.course}</small></div>
        </figcaption>
      </figure>`
  ).join("");

  root.innerHTML = `
    <div class="testimonial-carousel">
      <button class="testimonial-carousel__nav testimonial-carousel__nav--prev" type="button" aria-label="Depoimento anterior">${icon("arrow")}</button>
      <div class="testimonial-carousel__track" tabindex="0" aria-label="Depoimentos de alunos">${slides}</div>
      <button class="testimonial-carousel__nav testimonial-carousel__nav--next" type="button" aria-label="Próximo depoimento">${icon("arrow")}</button>
    </div>
  `;

  const track = root.querySelector(".testimonial-carousel__track");
  const prev = root.querySelector(".testimonial-carousel__nav--prev");
  const next = root.querySelector(".testimonial-carousel__nav--next");
  const scrollByStep = (dir) => {
    const card = track.querySelector(".testimonial-card");
    const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  prev?.addEventListener("click", () => scrollByStep(-1));
  next?.addEventListener("click", () => scrollByStep(1));
}
