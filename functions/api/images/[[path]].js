/** Serve publicamente as fotos enviadas pelo painel (guardadas no R2). */
export async function onRequestGet({ params, env }) {
  if (!env.IMAGES) return new Response("Storage não configurado", { status: 500 });

  const key = Array.isArray(params.path) ? params.path.join("/") : params.path;
  const object = await env.IMAGES.get(key);
  if (!object) return new Response("Não encontrado", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
}
