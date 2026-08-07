# Banco de cursos (Cloudflare D1)

Estas migrations criam o banco usado pelo painel `/admin.html` e pela API
`/api/courses`. `0001_init.sql` cria as tabelas; `0002_seed.sql` popula com
os cursos que já estavam em `src/data/cursos.json` (mantido no repo só como
salvaguarda — veja `src/js/modules/courses-data.js`).

## Configurar em produção (Cloudflare Pages)

1. Criar o banco: `npx wrangler d1 create upjobs-courses`
2. No projeto Pages → Settings → Functions → D1 database bindings:
   variable name `DB`, banco `upjobs-courses`.
3. Rodar as migrations no banco remoto:
   `npx wrangler d1 migrations apply upjobs-courses --remote`
4. Settings → Environment variables → adicionar `ADMIN_PASSWORD`.

## Rodar localmente

```
npx wrangler d1 migrations apply upjobs-courses --local --persist-to=.wrangler/state
echo "ADMIN_PASSWORD=sua-senha" > .dev.vars
npx wrangler pages dev . --d1 DB=upjobs-courses --persist-to=.wrangler/state
```

Não é necessário um `wrangler.toml` — o binding é passado direto na linha de
comando localmente, e configurado pelo painel da Cloudflare em produção.
