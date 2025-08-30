import MovieCard from './MovieCard.jsx';

/**
 * props:
 * - movies: array de películas
 * - loading, error
 * - onReset: () => void
 * - onView:  (imdbID|movie) => void   // Ver detalles (GET por ID)
 * - onEdit:  (imdbID|movie) => void   // Editar (PUT)
 * - onDelete:(imdbID|movie) => void   // Eliminar (DELETE)
 * - onSelect: (movie) => void         // compatibilidad; si no pasas onView, se usa onSelect
 */
export default function MovieGrid({
  movies = [],
  loading,
  error,
  onReset,
  onView,
  onEdit,
  onDelete,
  onSelect,
}) {
  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        {onReset && (
          <button className="btn btn-sm btn-outline-dark" onClick={onReset}>
            Mostrar todo
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        {[...Array(6)].map((_, i) => (
          <div className="col" key={i}>
            <div className="card h-100 placeholder-glow">
              <div className="ratio ratio-2x3 bg-secondary placeholder"></div>
              <div className="card-body">
                <h5 className="card-title placeholder col-8"></h5>
                <p className="card-text placeholder col-10"></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '3rem' }}>🙈</div>
        <h5 className="mt-3">Sin resultados</h5>
        <p className="text-muted">Prueba otro título o cambia la ubicación.</p>
        {onReset && (
          <button className="btn btn-success" onClick={onReset}>
            Mostrar todo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="movie-grid row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
      {movies.map((m) => {
        const key = m.imdbID ?? m.id ?? `${m.Title}-${m.Year}`;
        const handleView   = () => (onView   ? onView(m.imdbID ?? m) : onSelect?.(m));
        const handleEdit   = () =>  onEdit?.(m.imdbID ?? m);
        const handleDelete = () =>  onDelete?.(m.imdbID ?? m);

        return (
          <div className="col" key={key}>
            <MovieCard
              m={m}
              // click en el póster o botón "Ver"
              onView={handleView}
              // botones "Editar" y "Eliminar"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        );
      })}
    </div>
  );
}