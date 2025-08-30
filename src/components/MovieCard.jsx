export default function MovieCard({
  m,
  onView,    // () => void   -> Ver (GET por ID)
  onEdit,    // () => void   -> Editar (PUT)
  onDelete,  // () => void   -> Eliminar (DELETE)
}) {
  const {
    Poster,
    Title,
    Year,
    Type,
    description,
    Ubicacion,  // API oficial
    Ubication,  // por si viene con "c"
  } = m ?? {};

  const posterSrc =
    Poster && String(Poster).trim()
      ? Poster
      : "/img/fallback_poster.jpg"; // pon esta imagen en public/img/

  const ubic = Ubicacion ?? Ubication ?? "";

  return (
    <article className="movie-card card h-100 shadow-sm">
      {/* Poster fijo 2:3 y sin franjas grises */}
      <div
        className="poster-wrap"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2 / 3",
          overflow: "hidden",
          background: "#0f172a",
          borderTopLeftRadius: ".5rem",
          borderTopRightRadius: ".5rem",
        }}
        onClick={onView}
        role="button"
        aria-label={`Ver ${Title || "película"}`}
      >
        <img
          src={posterSrc}
          alt={Title ?? "Póster"}
          className="poster"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform .25s ease",
          }}
          onError={(e) => {
            e.currentTarget.src = "/img/fallback_poster.jpg";
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1 text-truncate">{Title}</h6>
        <small className="text-muted">
          {Year} {Year && Type ? "•" : ""} {Type}
        </small>

        {description && (
          <p className="mt-2 small mb-2 line-clamp-3">{description}</p>
        )}

        {ubic && <span className="badge bg-primary mt-auto">{ubic}</span>}
      </div>

      {/* Acciones */}
      <div className="card-footer d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-secondary flex-fill"
          onClick={(e) => {
            e.stopPropagation();
            onView?.();
          }}
          aria-label="Ver detalles"
        >
          Ver
        </button>
        <button
          className="btn btn-sm btn-outline-warning flex-fill"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          aria-label="Editar"
        >
          Editar
        </button>
        <button
          className="btn btn-sm btn-outline-danger flex-fill"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          aria-label="Eliminar"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}