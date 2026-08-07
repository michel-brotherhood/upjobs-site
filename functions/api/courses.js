/**
 * Endpoint público de cursos — substitui a leitura direta de
 * src/data/cursos.json. Retorna o mesmo formato { segments, courses },
 * mas a partir do banco D1 (fonte editável pelo painel /admin), omitindo
 * cursos marcados como ocultos.
 */
import { SEGMENTS, rowToCourse } from "../_shared/courses.js";

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM courses WHERE hidden = 0 ORDER BY sort_order ASC"
  ).all();

  return new Response(
    JSON.stringify({ segments: SEGMENTS, courses: results.map(rowToCourse) }),
    { headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" } }
  );
}
