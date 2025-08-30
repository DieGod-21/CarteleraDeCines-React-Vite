import { useEffect, useState } from 'react';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../services/api.js';

import SearchBar from '../components/SearchBar.jsx';
import Filters from '../components/Filters.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import MovieModal from '../components/MovieModal.jsx';
import HeroSlider from '../components/HeroSlider.jsx';

export default function Home() {
  // ---- Filtros ----
  const [title, setTitle] = useState('');
  const [ubi, setUbi] = useState('');
  const [allUbicaciones, setAllUbicaciones] = useState([]);

  // ---- Listado (filtrado) ----
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // ---- Modales ----
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ===== Helpers =====
  const reload = async () => {
    try {
      setLoading(true);
      setErr('');
      const data = await getMovies({ title, ubication: ubi });
      setMovies(Array.isArray(data) ? data : []);
    } catch {
      setErr('No se pudo cargar la cartelera');
    } finally {
      setLoading(false);
    }
  };

  // Cargar ubicaciones una vez (GET sin filtros)
  useEffect(() => {
    (async () => {
      try {
        const data = await getMovies({ title: '', ubication: '' });
        const setU = new Set(data.map(m => (m.Ubicacion ?? m.Ubication)).filter(Boolean));
        setAllUbicaciones(Array.from(setU).sort());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Cargar catálogo (debounce) al cambiar filtros
  useEffect(() => {
    const id = setTimeout(reload, 600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, ubi]);

  const resetAll = () => { setTitle(''); setUbi(''); };

  useEffect(() => {
    const handler = () => resetAll();
    window.addEventListener('app:resetAll', handler);
    return () => window.removeEventListener('app:resetAll', handler);
  }, []);

  // ====== CRUD ======
  const handleView = async (idOrObj) => {
    try {
      const imdbID = typeof idOrObj === 'string' ? idOrObj : idOrObj.imdbID;
      const data = await getMovieById(imdbID);
      setSelected(data);
      setShowDetails(true);
    } catch (e) { console.error(e); alert('No se pudo cargar el detalle.'); }
  };

  const handleOpenCreate = () => { setEditing(null); setShowForm(true); };

  const handleOpenEdit = async (idOrObj) => {
    try {
      const imdbID = typeof idOrObj === 'string' ? idOrObj : idOrObj.imdbID;
      const data = await getMovieById(imdbID);
      setEditing(data); setShowForm(true);
    } catch (e) { console.error(e); alert('No se pudo cargar la película para editar.'); }
  };

  const handleDelete = async (idOrObj) => {
    const imdbID = typeof idOrObj === 'string' ? idOrObj : idOrObj.imdbID;
    if (!confirm('¿Eliminar esta película?')) return;
    try { await deleteMovie(imdbID); await reload(); }
    catch (e) { console.error(e); alert('No se pudo eliminar.'); }
  };

  const handleSubmitForm = async (payload) => {
    try {
      if (editing) await updateMovie(editing.imdbID, payload);
      else          await createMovie(payload);
      setShowForm(false); setEditing(null);
      await reload();
    } catch (e) { console.error(e); alert('No se pudo guardar la película.'); }
  };

  // ===== BANNERS ESTÁTICOS (public/banners/*.jpg) =====
  const EXTRA_BANNERS = [
    { image: '/banners/1.jpg', title: 'CARTELERA',      kicker: 'YA EN CINES' },
    { image: '/banners/2.jpg', title: 'ESTRENOS',       kicker: 'NO TE LOS PIERDAS' },
    { image: '/banners/3.jpg', title: 'PRÓXIMAMENTE',   kicker: 'AVANCES' },
    { image: '/banners/4.jpg', title: 'CLÁSICOS',       kicker: 'RE-ESTRENO' },
    { image: '/banners/5.jpg', title: 'EVENTOS',        kicker: 'FUNCIONES ESPECIALES' },
  ];

  const HERO_SLIDES = EXTRA_BANNERS.map(b => ({
    ...b,
    ctaText: 'VER CARTELERA',
    onCtaClick: () => document.getElementById('cartelera')?.scrollIntoView({ behavior: 'smooth' }),
  }));

  return (
    <>
      {/* ===== HERO en el header (siempre visible, no depende del filtro) ===== */}
      <div className="mb-4">
        <HeroSlider slides={HERO_SLIDES} intervalMs={3000} />
      </div>

      {/* Ancla para el botón del hero */}
      <div id="cartelera"></div>

      {/* ===== Filtros + botón crear ===== */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-md-6">
          <SearchBar value={title} onChange={setTitle} onClear={resetAll} />
        </div>
        <div className="col-12 col-md-3">
          <Filters value={ubi} onChange={setUbi} options={allUbicaciones} />
        </div>
        <div className="col-12 col-md-3 d-flex justify-content-end gap-3 align-items-center">
          <small className="text-muted d-none d-md-inline">{movies.length} resultados</small>
          <button className="btn btn-success" onClick={handleOpenCreate}>+ Añadir película</button>
        </div>
      </div>

      {/* ===== Grid ===== */}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={err}
        onReset={resetAll}
        onView={handleView}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* ===== Modal de detalles ===== */}
      <MovieModal
        mode="details"
        show={showDetails}
        onClose={() => setShowDetails(false)}
        movie={selected}
        onEditClick={() => { setShowDetails(false); setEditing(selected); setShowForm(true); }}
        onDeleteClick={() => { setShowDetails(false); handleDelete(selected.imdbID); }}
      />

      {/* ===== Modal de formulario ===== */}
      <MovieModal
        mode="form"
        show={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        initial={editing}
        onSubmit={handleSubmitForm}
      />
    </>
  );
}