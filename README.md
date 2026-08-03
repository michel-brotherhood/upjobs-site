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
│   empregabilidade.html, esg.html, consultoria.html, matricula.html,
│   faq.html, contato.html, grupo-vip.html, privacidade.html, 404.html
├── sitemap.xml, robots.txt, manifest.webmanifest
├── build.js, package.json      (build de CSS sem dependências)
├── dist/styles.min.css         (bundle de produção — versionado)
├── public/
│   ├── images/   (logos da marca)
│   ├── fonts/    (Barlow Condensed + Inter, .woff2 auto-hospedadas)
│   ├── og/       (imagem Open Graph)
│   └── favicon/  (favicon.svg + favicon-32.png/favicon-512.png/apple-touch-icon.png,
│                  gerados a partir de "icone circular.webp" enviada pelo cliente)
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

## Navegação e menu flutuante

O menu principal segue um conjunto fixo — **Quem Somos, Cursos, Dúvidas, Treinamentos, Consultoria, Atendimento** — definido em `src/js/components/header.js`. O item **"Início"** só aparece nas páginas internas (a home nunca linka para si mesma). "Treinamentos" reaproveita o catálogo filtrado por NRs (`cursos.html?seg=nr-seguranca`), sem precisar de página própria.

O botão flutuante (`src/js/components/wa-float.js`) é um menu speed-dial com 3 atalhos — **Matrícula, Dúvidas, Contato** — com animação de abertura escalonada (respeitando `prefers-reduced-motion`).

## Página de Matrícula (sem backend)

`matricula.html` + `src/js/modules/matricula.js` implementam o formulário de matrícula com máscaras de telefone e CPF (validação de dígitos verificadores) e o curso pré-selecionado quando acessado via `?curso=<id>` (usado pelo CTA das páginas de curso).

**Importante — como o site é 100% estático (sem backend), o envio funciona assim:**
1. Ao enviar, o formulário monta um link `mailto:` para `contato@upjobscursos.com.br` com todos os dados preenchidos e aciona o **cliente de e-mail do próprio usuário** (não há envio automático/silencioso — isso exigiria um backend ou serviço de formulário, fora do escopo atual).
2. Em seguida, abre o **WhatsApp** da Upjobs com a mesma mensagem pré-preenchida, para agilizar o atendimento.

Se no futuro for adicionado um backend (Node/PHP/Python) ou um serviço de formulário (ex.: Formspree), o `mailto:` pode ser substituído por um envio real de e-mail sem alterar o restante do fluxo.

## Perguntas frequentes (FAQ)

O conteúdo das perguntas frequentes tem fonte única em `src/js/modules/faq-data.js`, renderizado via `faq-widget.js`:
- `faq.html`: lista completa (9 perguntas), com a primeira já aberta.
- `quem-somos.html`, `diferenciais.html` e `contato.html`: a mesma lista embutida como accordion, com link para a página completa.

O material original enviado pelo cliente citava a marca **"Greenjob"** em vez de "Upjobs" em alguns trechos — o texto foi adaptado para Upjobs. Os telefones de contato usados são os oficiais já configurados em `config.js` ((21) 2042-0068 e (21) 99938-9009 WhatsApp).

## Página de Consultoria

`consultoria.html` usa o conteúdo real do serviço (fornecido pelo cliente a partir do site anterior): Prontuário de Instalações Elétricas (PIE) com a lista de exigências da NR-10, as etapas da Adequação à NR-12 (numeradas, pois representam uma sequência real do processo) e um grid de Treinamentos de NRs (NR-10/12/33/34/35) linkando para os cursos correspondentes quando existem. Inclui também um formulário de orçamento de treinamento (converte em WhatsApp, mesmo padrão dos demais formulários do site).

## Textos e imagens pendentes de conteúdo real (uso interno — não expor no site)

Para não expor rascunho/nota de desenvolvedor ao visitante, os textos visíveis no site **não citam
"placeholder" nem "ver README"** — usam frases neutras como "em breve". O controle de pendências fica
só aqui:

- **Número "+3.000 alunos"** e estatísticas — marcados com `*` no site. Confirmar/ajustar.
- **Depoimentos** (home) — falas ilustrativas (não atribuídas a pessoas identificáveis), com o
  ícone de marca como avatar. Substituir pelos relatos e fotos reais dos alunos assim que
  aprovados. Ver `index.html`, seção "DEPOIMENTOS".
- **Logos de empresas parceiras** (ESG) — inserir marcas autorizadas.
- **Fotos** (infraestrutura, equipe, certificado, consultoria/in company) — todos os blocos com a
  tarja visual "IMAGEM" (`.img-ph`) precisam de fotos reais autorizadas.

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
