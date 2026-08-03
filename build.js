/**
 * Build de CSS sem dependências.
 * Inlina recursivamente os @import de src/css/styles.css, minifica de forma
 * conservadora e escreve dist/styles.min.css (referenciado pelas páginas em produção).
 *
 * Uso: node build.js
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const ENTRY = resolve(ROOT, "src/css/styles.css");
const OUT_DIR = resolve(ROOT, "dist");
const OUT = resolve(OUT_DIR, "styles.min.css");

const seen = new Set();

/** Lê um arquivo CSS e inlina seus @import (relativos ao próprio arquivo). */
function inline(file) {
  if (seen.has(file)) return "";
  seen.add(file);
  const css = readFileSync(file, "utf8");
  const base = dirname(file);
  return css.replace(/@import\s+url\(["']?([^"')]+)["']?\);?/g, (_, ref) => {
    return "\n" + inline(resolve(base, ref)) + "\n";
  });
}

/** Minificação conservadora: remove comentários e colapsa espaços. */
function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")           // comentários
    .replace(/\s+/g, " ")                          // colapsa espaços/quebras
    .replace(/\s*([{}:;,>~])\s*/g, "$1")          // remove espaço ao redor de tokens
    .replace(/;}/g, "}")                            // ; final redundante
    .trim();
}

let out = inline(ENTRY);
// As URLs de fonte em fonts.css são relativas a src/css/ (../../public/fonts/...).
// No arquivo final em dist/, o caminho correto é ../public/fonts/...
out = out.replace(/\.\.\/\.\.\/public\//g, "../public/");
out = minify(out);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, out);
console.log(`dist/styles.min.css gerado — ${(out.length / 1024).toFixed(1)} KB`);
