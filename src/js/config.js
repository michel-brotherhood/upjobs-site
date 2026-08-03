/**
 * Configuração central da Upjobs — dados de contato e conversão.
 * Fonte única usada por header, footer, formulários e CTAs.
 */
export const SITE = {
  name: "Upjobs Cursos e Treinamentos",
  shortName: "Upjobs",
  // WhatsApp de vendas (somente dígitos, com DDI 55)
  whatsapp: "5521999389009",
  whatsappDisplay: "(21) 99938-9009",
  // Grupo VIP (WhatsApp) — link oficial a confirmar pelo cliente
  vipGroupUrl: "https://chat.whatsapp.com/",
  phone: "552120420068",
  phoneDisplay: "(21) 2042-0068",
  emails: {
    contato: "contato@upjobscursos.com.br",
    secretaria: "secretaria@upjobscursos.com.br",
  },
  address: {
    label: "Unidade I — Mutuá",
    street: "Av. Dezoito do Forte, 2096 — Mutuá",
    city: "São Gonçalo",
    state: "RJ",
    mapsQuery: "Av. Dezoito do Forte, 2096, Mutuá, São Gonçalo - RJ",
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/",
  },
  // Mensagem padrão para o WhatsApp
  defaultMessage:
    "Olá! Vim pelo site da Upjobs e gostaria de mais informações sobre os cursos.",
};

/** Constrói uma URL wa.me com mensagem pré-preenchida. */
export function waLink(message = SITE.defaultMessage, phone = SITE.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Link tel: a partir dos dígitos configurados. */
export function telLink(phone = SITE.phone) {
  return `tel:+${phone}`;
}
