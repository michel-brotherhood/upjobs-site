/** Carrega e memoriza cursos.json. */
let cache = null;

export async function loadCourses() {
  if (cache) return cache;
  const res = await fetch("src/data/cursos.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Falha ao carregar cursos");
  cache = await res.json();
  return cache;
}

export function segmentOf(data, id) {
  return data.segments.find((s) => s.id === id);
}

/** Código curto de segmento (para os rótulos técnicos). */
const SEG_CODES = {
  "energia-eletrica": "EL",
  "refrigeracao": "RF",
  "seguranca-eletronica": "SE",
  "naval-offshore": "NV",
  "construcao-civil": "CC",
  "administrativo": "AD",
  "nr-seguranca": "NR",
};
export function segCode(segmentId) {
  return SEG_CODES[segmentId] || "UP";
}

/** Código técnico do curso, ex.: "EL-03" (posição dentro do segmento). */
export function courseCode(data, course) {
  const within = data.courses.filter((c) => c.segment === course.segment);
  const n = within.findIndex((c) => c.id === course.id) + 1;
  return `${segCode(course.segment)}-${String(n).padStart(2, "0")}`;
}

/** Benefícios inclusos comuns a todos os cursos (diferenciais da escola). */
export const COURSE_INCLUDES = [
  "Aulas 100% práticas com ferramentas reais",
  "EPIs fornecidos para as aulas",
  "Material de consumo incluso",
  "Turmas reduzidas e atenção individual",
  "Certificado de conclusão",
  "Apoio à empregabilidade e indicação de vagas",
];

/** Chips de informação exibidos em cada curso. */
export const COURSE_INFO = [
  { icon: "users", text: "Turmas reduzidas" },
  { icon: "wrench", text: "Prática com ferramentas reais" },
  { icon: "cert", text: "Certificado incluso" },
];
