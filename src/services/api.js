const BASE = 'https://movie.azurewebsites.net/api/cartelera';

// GET: lista con filtros
export async function getMovies({ title = '', ubication = '' } = {}) {
  const url = `${BASE}?title=${encodeURIComponent(title)}&ubication=${encodeURIComponent(ubication)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar películas');
  return res.json();
}

// GET: por ID
export async function getMovieById(imdbID) {
  const url = `${BASE}?imdbID=${encodeURIComponent(imdbID)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar película');
  return res.json();
}

// POST: crear nueva
export async function createMovie(movie) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!res.ok) throw new Error('Error al crear película');
  return res.json();
}

// PUT: actualizar existente (requiere imdbID en query)
export async function updateMovie(imdbID, movie) {
  const url = `${BASE}?imdbID=${encodeURIComponent(imdbID)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!res.ok) throw new Error('Error al actualizar película');
  return res.json();
}

// DELETE: eliminar por ID
export async function deleteMovie(imdbID) {
  const url = `${BASE}?imdbID=${encodeURIComponent(imdbID)}`;
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar película');
  return true;
}