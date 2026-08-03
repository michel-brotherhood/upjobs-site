# Upjobs Cursos e Treinamentos — Site Institucional

Site institucional e de conversão da **Upjobs Cursos e Treinamentos**, escola de cursos profissionalizantes, técnicos, industriais e de segurança do trabalho em São Gonçalo/RJ.

Objetivo: apresentar a instituição, construir autoridade e **gerar matrículas e leads qualificados** via WhatsApp, telefone e formulário.

## Stack

- **HTML5 semântico** (sem framework, multi-página)
- **CSS3 moderno** — Custom Properties, Grid, Flexbox, `clamp()` (sem Tailwind; design autoral)
- **JavaScript puro (ES Modules)** — sem React/Next/TypeScript
- **Sem backend** nesta fase: os formulários convertem em **WhatsApp** (`wa.me` com mensagem pré-preenchida)
- **Fontes auto-hospedadas** (Barlow Condensed · Inter · IBM Plex Mono, subset latin) em `public/fonts/` — sem dependência de CDN externo, melhor performance e privacidade/LGPD
- **Direção de arte "Ficha Técnica / Blueprint":** rótulos técnicos monoespaçados, códigos de segmento/curso, marcas de corte e grade blueprint (ver `src/css/tech.css`)

Escolhas justificadas: o projeto é altamente autoral e com muitas seções customizadas, o que favorece CSS tradicional em vez de Tailwind. Como não há persistência de dados nesta fase, não há backend — o WhatsApp é o canal principal de conversão, reduzindo fricção.

## Como rodar

O site usa ES Modules e `fetch` (catálogo de cursos), então precisa ser servido por **HTTP** (não abra via `file://`).

```bash
# Qualquer servidor estático. Exemplos:
python3 -m http.server 8080   # ou: npm start
# ou
npx serve .
```

Acesse `http://localhost:8080`.

## Build de CSS

As páginas em produção referenciam **`dist/styles.min.css`** — um bundle único, minificado, que inlina todos os `@import` de `src/css/` (incluindo as fontes). Isso elimina o encadeamento de requisições de CSS e melhora o LCP.

```bash
npm run build   # gera dist/styles.min.css (script Node puro, sem dependências)
```

**Sempre que editar qualquer arquivo em `src/css/`, rode `npm run build`** e faça commit do `dist/styles.min.css` atualizado. O bundle é versionado justamente para o site funcionar no host sem etapa de build.

## Estrutura

```
upjobs-site/
├── index.html, cursos.html, curso.html, quem-somos.html,
│   diferenciais.html, infraestrutura.html, certificacoes.html,
│   empregabilidade.html, esg.html, contato.html, grupo-vip.html,
│   privacidade.html, 404.html
├── sitemap.xml, robots.txt, manifest.webmanifest
├── build.js, package.json      (build de CSS sem dependências)
├── dist/styles.min.css         (bundle de produção — versionado)
├── public/
│   ├── images/   (logos da marca)
│   ├── fonts/    (Barlow Condensed + Inter, .woff2 auto-hospedadas)
│   ├── og/       (imagem Open Graph)
│   └── favicon/  (favicon.svg)
└── src/
    ├── css/  (fonts, tokens, reset, base, typography, layout, components,
    │          utilities, pages/, styles.css = entrada única de dev)
    ├── js/   (config.js, main.js, components/, modules/, utils/)
    └── data/cursos.json  (fonte única do catálogo e das páginas de curso)
```

## Configuração de contato (importante)

Todos os dados de contato e conversão ficam centralizados em **`src/js/config.js`**:
telefone, WhatsApp, e-mails, endereço, redes sociais e **link do Grupo VIP**.
Ajuste ali para refletir os canais oficiais. O link oficial do Grupo VIP (`vipGroupUrl`)
ainda **precisa ser informado pelo cliente**.

## Conteúdo a validar / substituir

Itens marcados como *placeholder* no site (não invente dados — confirme antes de publicar):

- **Número "+3.000 alunos"** e estatísticas — marcados com `*`. Confirmar/ajustar.
- **Depoimentos** (home) — textos ilustrativos; substituir por relatos reais autorizados.
- **Logos de empresas parceiras** (ESG) — inserir marcas autorizadas.
- **Fotos** (infraestrutura, equipe, certificado) — todos os blocos com tarja
  "IMAGEM / Substituir por foto real" precisam de imagens reais autorizadas.
- **Redes sociais** em `config.js` — inserir URLs oficiais.

### Assets de imagem recomendados

| Uso | Formato | Proporção | Observações |
|-----|---------|-----------|-------------|
| Hero / Open Graph | WebP + JPG | 1200×630 | Imagem social para compartilhamento |
| Fotos de infraestrutura | WebP | 4:3 | Laboratórios, salas, fachada, EPIs |
| Depoimentos (avatar) | WebP | 1:1 | Foto do aluno (opcional) |
| Certificado | WebP/PNG | 4:3 | Arte oficial do certificado |
| Logos parceiros | SVG/PNG | livre | Fundo transparente |

Sugestão de otimização futura: gerar versões AVIF/WebP com `srcset`/`sizes`,
auto-hospedar as fontes e adicionar um bundler (Vite, sem React/TS) se o projeto crescer.

## Acessibilidade e performance

- HTML semântico, foco visível, navegação por teclado, `prefers-reduced-motion`.
- Metas: LCP ≤ 2,5s, CLS ≤ 0,1, INP ≤ 200ms.
- Imagens com dimensões explícitas; JS com `type="module"` (defer nativo).

## Próximos passos sugeridos

1. Substituir placeholders por conteúdo/fotos reais autorizados.
2. Confirmar link do Grupo VIP e redes sociais em `config.js`.
3. Auto-hospedar fontes e otimizar imagens (WebP/AVIF + `srcset`).
4. Opcional: backend leve para os formulários (e-mail/CRM) e Analytics com consentimento (LGPD).
