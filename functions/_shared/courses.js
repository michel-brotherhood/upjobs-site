/**
 * Compartilhado entre as funções públicas e as de admin.
 * Segmentos não são editáveis pelo painel (baixo volume, mudam raramente) —
 * ficam fixos aqui, junto com o mapeamento das colunas do D1 para o mesmo
 * formato JSON que o site sempre usou (compatível com src/data/cursos.json).
 */
export const SEGMENTS = [
  { id: "energia-eletrica", label: "Energia e Elétrica", icon: "bolt", desc: "Instalações residenciais, prediais e industriais, comandos e energia solar." },
  { id: "refrigeracao", label: "Refrigeração e Climatização", icon: "snow", desc: "Instalação e manutenção de ar-condicionado e refrigeração — uma das áreas com maior procura por profissionais no Rio de Janeiro." },
  { id: "seguranca-eletronica", label: "Segurança Eletrônica", icon: "cam", desc: "CFTV, alarmes, redes e automação residencial." },
  { id: "naval-offshore", label: "Naval e Offshore", icon: "ship", desc: "Atuação em estaleiros, plataformas e indústria marítima." },
  { id: "construcao-civil", label: "Construção Civil", icon: "bricks", desc: "Instalações, manutenção predial e serviços técnicos." },
  { id: "administrativo", label: "Administrativo e Gestão", icon: "briefcase", desc: "Rotinas de escritório, atendimento e gestão." },
  { id: "informatica", label: "Informática", icon: "monitor", desc: "Pacote Office, planilhas avançadas e ferramentas de produtividade para o dia a dia profissional." },
  { id: "nr-seguranca", label: "Segurança do Trabalho (NRs)", icon: "helmet", desc: "Certificação em Normas Regulamentadoras." },
];

/** Converte uma linha do D1 (snake_case) para o formato usado pelo front-end (camelCase). */
export function rowToCourse(row) {
  const course = {
    id: row.id,
    title: row.title,
    segment: row.segment,
    featured: !!row.featured,
    short: row.short || "",
    forWho: row.for_who || "",
    learn: JSON.parse(row.learn || "[]"),
    syllabus: JSON.parse(row.syllabus || "[]"),
  };
  if (row.img) course.img = row.img;
  if (row.duration) course.duration = row.duration;
  if (row.modality) course.modality = row.modality;
  if (row.coming_soon) course.comingSoon = true;
  return course;
}
