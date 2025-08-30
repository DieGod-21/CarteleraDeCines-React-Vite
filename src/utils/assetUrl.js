// src/utils/assetUrl.js

// Devuelve la URL correcta a un archivo dentro de /public
// - en local => "/"
// - en GitHub Pages => "/CarteleraDeCines-React-Vite/"
export function fromPublic(path = '') {
  const base = import.meta.env.BASE_URL || '/';
  // quitamos "/" inicial si lo hay para evitar doble slash
  const clean = String(path ?? '').replace(/^\//, '');
  return base + clean;
}

// Atajo para posters con imagen de respaldo
export function posterOrFallback(url, fallbackRel = 'img/fallback_poster.jpg') {
  const u = String(url ?? '').trim();
  // si viene una URL absoluta (http o https), úsala tal cual
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return u;
  }
  // si viene vacío → fallback desde public
  return u ? u : fromPublic(fallbackRel);
}