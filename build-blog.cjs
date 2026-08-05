/**
 * build-blog.js — gera páginas estáticas do Blog a partir de src/data/blog.json.
 *
 * Produz:
 *   - blog.html                (índice/listagem dos artigos)
 *   - <slug>.html (na raiz)     (uma página estática por artigo, com SEO e JSON-LD)
 *
 * Páginas estáticas (em vez de renderização por JS) porque o Blog é a
 * principal porta de entrada de SEO orgânico — título, meta description,
 * canonical e dados estruturados precisam estar no HTML servido.
 *
 * Rode `node build-blog.js` (ou `npm run build:blog`) sempre que editar
 * src/data/blog.json e faça commit dos arquivos gerados.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const ORIGIN = "https://www.upjobscursos.com.br";
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/blog.json"), "utf8"));
const posts = data.posts;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** <head> comum às páginas do blog. */
function head({ title, description, canonical, image, keywords, jsonld }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
${keywords ? `  <meta name="keywords" content="${esc(keywords)}">\n` : ""}  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#050505">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="${jsonld && jsonld["@type"] === "BlogPosting" ? "article" : "website"}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="public/favicon/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="public/favicon/favicon-512.png" sizes="512x512" type="image/png">
  <link rel="apple-touch-icon" href="public/favicon/apple-touch-icon.png">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="preload" href="public/fonts/inter-400-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="public/fonts/barlow-condensed-700-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="dist/styles.min.css">
${jsonld ? `  <script type="application/ld+json">\n  ${JSON.stringify(jsonld)}\n  </script>\n` : ""}</head>`;
}

const FOOT = `  <footer class="site-footer" id="site-footer"></footer>
  <script type="module" src="src/js/main.js"></script>
</body>
</html>
`;

/** Card de artigo (usado no índice e na seção "leia também"). */
function card(p, reveal) {
  return `        <article class="post-card"${reveal ? ` data-reveal="${reveal}"` : ""}>
          <a class="post-card__media" href="${p.slug}.html">
            <img src="${p.image}" alt="${esc(p.alt)}" width="1600" height="900" loading="lazy">
            <span class="post-card__cat">${esc(p.category)}</span>
          </a>
          <div class="post-card__body">
            <time class="post-card__date" datetime="${p.date}">${esc(p.dateLabel)}</time>
            <h2 class="post-card__title"><a href="${p.slug}.html">${esc(p.cardTitle)}</a></h2>
            <p class="post-card__excerpt">${esc(p.excerpt)}</p>
            <span class="post-card__more">Ler artigo <span data-icon="arrow"></span></span>
          </div>
        </article>`;
}

/* ---------- Índice (blog.html) ---------- */
function buildIndex() {
  const cards = posts.map((p, i) => card(p, i === 0 ? "" : String((i % 3) * 80))).join("\n");
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog da Upjobs",
    url: `${ORIGIN}/blog.html`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.seoTitle,
      url: `${ORIGIN}/${p.slug}.html`,
      datePublished: p.date,
      image: `${ORIGIN}/${p.image}`,
    })),
  };
  return `${head({
    title: "Blog — Upjobs Cursos e Treinamentos",
    description:
      "Carreiras, mercado de trabalho e dicas sobre cursos profissionalizantes: energia solar, segurança eletrônica, elétrica, refrigeração e área naval. Blog da Upjobs.",
    canonical: `${ORIGIN}/blog.html`,
    image: `${ORIGIN}/public/og/og-default.png`,
    jsonld,
  })}
<body data-page="blog" class="full-bleed-safe">
  <header class="site-header" id="site-header"></header>
  <main id="main">
    <section class="page-hero">
      <div class="container page-hero__inner">
        <span class="eyebrow eyebrow--light">Blog da Upjobs</span>
        <h1>Carreira, mercado e cursos profissionalizantes</h1>
        <p class="lead">Conteúdo prático sobre as profissões que mais crescem no Rio de Janeiro — e como se qualificar para elas.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="post-grid">
${cards}
        </div>
      </div>
    </section>
  </main>
${FOOT}`;
}

/* ---------- Artigo (<slug>.html) ---------- */
function buildPost(p) {
  const url = `${ORIGIN}/${p.slug}.html`;
  const imgAbs = `${ORIGIN}/${p.image}`;
  const bodyHtml = p.body
    .map((b) =>
      b.h2 ? `          <h2>${esc(b.h2)}</h2>` : `          <p>${esc(b.p)}</p>`
    )
    .join("\n");

  const related = posts.filter((o) => o.slug !== p.slug).slice(0, 2);
  const relatedCards = related.map((o) => card(o, "")).join("\n");

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.seoTitle,
    description: p.metaDescription,
    image: imgAbs,
    datePublished: p.date,
    dateModified: p.date,
    keywords: p.keywords,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Upjobs Cursos e Treinamentos" },
    publisher: {
      "@type": "Organization",
      name: "Upjobs Cursos e Treinamentos",
      logo: { "@type": "ImageObject", url: `${ORIGIN}/public/favicon/favicon-512.png` },
    },
  };

  return `${head({
    title: `${p.seoTitle} — Upjobs`,
    description: p.metaDescription,
    canonical: url,
    image: imgAbs,
    keywords: p.keywords,
    jsonld,
  })}
<body data-page="blog-post" class="full-bleed-safe">
  <header class="site-header" id="site-header"></header>
  <main id="main">
    <section class="page-hero">
      <div class="container page-hero__inner">
        <span class="eyebrow eyebrow--light">${esc(p.category)}</span>
        <h1>${esc(p.seoTitle)}</h1>
        <p class="article-meta"><time datetime="${p.date}">${esc(p.dateLabel)}</time> · Upjobs Cursos e Treinamentos</p>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        <figure class="article-cover">
          <img src="${p.image}" alt="${esc(p.alt)}" width="1600" height="900" fetchpriority="high">
        </figure>
        <div class="prose">
${bodyHtml}
        </div>

        <div class="article-cta cta-band">
          <div class="split" style="align-items:center">
            <div class="stack"><h2>Quer começar nessa carreira?</h2><p class="lead">Fale com a nossa equipe e garanta sua vaga na próxima turma em São Gonçalo/RJ.</p></div>
            <div class="cluster cluster--end"><a class="btn btn--whatsapp btn--lg" data-wa="Olá! Vim pelo blog da Upjobs (${esc(p.category)}) e quero mais informações sobre o curso." href="#"><span data-icon="whatsapp"></span> Falar no WhatsApp</a><a class="btn btn--ghost-light btn--lg" href="matricula.html">Fazer matrícula</a></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--surface section--tight">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Leia também</span><h2 class="section-title">Outros artigos do blog</h2></div>
        <div class="post-grid">
${relatedCards}
        </div>
      </div>
    </section>
  </main>
${FOOT}`;
}

/* ---------- Escrita ---------- */
fs.writeFileSync(path.join(ROOT, "blog.html"), buildIndex());
console.log("blog.html");
for (const p of posts) {
  fs.writeFileSync(path.join(ROOT, `${p.slug}.html`), buildPost(p));
  console.log(`${p.slug}.html`);
}
console.log(`\n✓ ${posts.length} artigos + índice gerados.`);
