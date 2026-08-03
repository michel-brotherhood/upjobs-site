# Deploy — Upjobs Cursos e Treinamentos

Site **estático** (HTML/CSS/JS puro, sem framework). Não há backend, banco nem variáveis secretas — o deploy é apenas de arquivos estáticos.

## Antes de subir (checklist)

1. **Preencher `src/js/config.js`** com os canais oficiais:
   - `whatsapp`, `phone`, `emails`, `address`
   - `vipGroupUrl` (link oficial do Grupo VIP) e `social` (Instagram/Facebook/YouTube)
2. **Rodar o build de CSS** (se editou algo em `src/css/`):
   ```bash
   npm run build      # gera dist/styles.min.css e faz commit dele
   ```
3. **Definir o domínio canônico** (www ou apex) e manter consistente com as tags
   `<link rel="canonical">` e `og:image` (hoje em `https://www.upjobscursos.com.br/`).
   Se mudar o domínio, atualize essas tags nas páginas.
4. Substituir os **placeholders** (fotos, depoimentos, logos, "+3.000") — ver `README.md`.

> Observação: o site precisa ser servido por **HTTP(S)** (usa ES Modules + `fetch`).
> Tanto Cloudflare Pages quanto Nginx atendem isso nativamente.

---

## Cloudflare Pages

**Configuração do projeto (Settings → Builds & deployments):**

| Campo | Valor |
|-------|-------|
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | **`/`** (raiz do repositório) |
| Root directory | `/` |

**Variáveis de ambiente:**
- `NODE_VERSION` = `20` (garante que o `build.js` rode)

> O `dist/styles.min.css` já é versionado, então o site funciona mesmo sem o build.
> O `npm run build` no deploy só garante que o bundle esteja sempre atualizado.

**Arquivos de plataforma já inclusos no repo:**
- `_headers` — cache dos assets + cabeçalhos de segurança + **CSP em modo Report-Only**
- `_redirects` — 404 é automático (`/404.html`); apex→www configura-se no painel

**Domínio:** em *Custom domains*, adicione `www.upjobscursos.com.br` (e o apex, com
regra de redirect apex → www em *Rules → Redirect Rules*). O HTTPS é automático.

> ⚠️ Enquanto estiver testando na URL `*.pages.dev`, a prévia social (og:image) e o
> canonical apontam para o domínio final; a imagem só carrega quando o domínio estiver ativo.

### Ativar a CSP de verdade (opcional, depois)
O `_headers` traz a CSP como `Content-Security-Policy-Report-Only` (não bloqueia nada).
Para **enforçar**, dois pontos exigem atenção antes:
- Há **um `<script type="module">` inline** em `grupo-vip.html` e **atributos `style=""`** inline.
  Para uma CSP estrita sem `unsafe-inline`, mova esse script para um `.js` e use hashes/nonce.
- O mapa embutido em `contato.html` exige `frame-src https://www.google.com`.

Enquanto isso, o Report-Only já mostra no console do navegador o que precisaria ajustar.

---

## VPS (Nginx)

1. Publique os arquivos do repo em `/var/www/upjobs-site` (git clone/pull ou CI).
   Rode `npm run build` uma vez para garantir o `dist/`.
2. Use o exemplo em [`deploy/nginx.conf.example`](deploy/nginx.conf.example) como base
   (ajuste `server_name`, `root` e os caminhos dos certificados).
3. HTTPS com Let's Encrypt:
   ```bash
   sudo certbot --nginx -d upjobscursos.com.br -d www.upjobscursos.com.br
   ```
4. Teste e recarregue:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

O exemplo já cobre: redirect HTTP→HTTPS e apex→www, gzip, MIME de `woff2`/`webmanifest`,
cache dos assets, cabeçalhos de segurança e `error_page 404 /404.html`.

---

## Resumo do que fica "setado"

- **Cloudflare Pages:** preset None · build `npm run build` · output `/` · `NODE_VERSION=20` · domínio custom · (`_headers` e `_redirects` já no repo)
- **VPS:** Nginx com o `nginx.conf.example`, certificado TLS, `root` correto, gzip e MIME
- **Projeto:** `config.js` preenchido, `dist/styles.min.css` buildado, domínio canônico consistente
