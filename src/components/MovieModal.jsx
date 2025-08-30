import { useEffect, useMemo, useState } from "react";

const BLANK = {
  imdbID: "",
  Title: "",
  Year: "",
  Type: "",
  Poster: "",
  Estado: true,
  description: "",
  Ubication: "",
};

function Backdrop({ show, onClose }) {
  if (!show) return null;
  return (
    <div
      className="modal-backdrop-custom"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 1050 }}
      aria-hidden="true"
    />
  );
}

function Frame({ show, onClose, children, width = 980 }) {
  if (!show) return null;

  // Cerrar con ESC solo cuando está visible
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-frame-custom"
      style={{ position: "fixed", inset: 0, zIndex: 1060, display: "grid", placeItems: "center" }}
      onClick={onClose}
    >
      <div
        className="card bg-dark text-light shadow-lg"
        style={{ width, maxWidth: "95vw", borderRadius: 16 }}
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
      >
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}

/**
 * Props:
 * - mode: 'details' | 'form'
 * - show, onClose
 * - movie (details)
 * - initial (form)  null => crear
 * - onSubmit(payload)
 * - onEditClick, onDeleteClick (details)
 */
export default function MovieModal({
  mode = "details",
  show,
  onClose,
  movie,
  initial,
  onSubmit,
  onEditClick,
  onDeleteClick,
}) {
  const isForm = mode === "form";

  // 🔒 Scroll-lock robusto (se activa al abrir y se quita SIEMPRE al cerrar)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [show]);

  // ----- STATE del formulario -----
  const [f, setF] = useState(BLANK);
  useEffect(() => {
    if (!isForm) return;
    if (!initial) setF({ ...BLANK, imdbID: String(Date.now()) });
    else setF({ ...BLANK, ...initial });
  }, [isForm, initial, show]);

  const canSubmit = useMemo(() => {
    if (!isForm) return false;
    return (
      f.imdbID && f.Title && f.Year && f.Type && f.Poster &&
      f.Ubication !== "" && typeof f.Estado === "boolean"
    );
  }, [isForm, f]);

  const h = (k) => (e) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = {
      imdbID: String(f.imdbID).trim(),
      Title: String(f.Title).trim(),
      Year: String(f.Year).trim(),
      Type: String(f.Type).trim(),
      Poster: String(f.Poster).trim(),
      Estado: !!f.Estado,
      description: String(f.description).trim(),
      Ubication: String(f.Ubication).trim(),
    };
    onSubmit?.(payload);
  };

  const posterFrameStyle = {
    width: "100%",
    height: 420,
    background: "radial-gradient(120% 100% at 0% 0%, #0f1830, #0a1020)",
    border: "1px dashed rgba(255,255,255,.08)",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const imgStyle = { width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 10 };

  return (
    <>
      <Backdrop show={show} onClose={onClose} />
      <Frame show={show} onClose={onClose}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="m-0">
            {isForm ? (initial ? "Editar Película" : "Añadir Nueva Película") : movie?.Title || "Detalles"}
          </h3>
          <button className="btn btn-sm btn-light" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* BODY */}
        {isForm ? (
          <form onSubmit={submit} className="row g-3">
            <div className="col-md-4">
              <div style={posterFrameStyle}>
                {f.Poster ? (
                  <img src={f.Poster} alt="Poster" style={imgStyle}
                       onError={(e) => { e.currentTarget.src = "/img/fallback_poster.jpg"; }} />
                ) : (
                  <div className="text-secondary text-center px-3">Previsualización del póster</div>
                )}
              </div>
            </div>

            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">imdbID</label>
                  <input className="form-control bg-dark text-light border-secondary"
                         value={f.imdbID} onChange={h("imdbID")} disabled={!!initial} />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Año</label>
                  <input className="form-control bg-dark text-light border-secondary"
                         value={f.Year} onChange={h("Year")} placeholder="2025" />
                </div>
                <div className="col-12">
                  <label className="form-label">Título</label>
                  <input className="form-control bg-dark text-light border-secondary"
                         value={f.Title} onChange={h("Title")} placeholder="Jurassic World Rebirth" />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Género (Type)</label>
                  <input className="form-control bg-dark text-light border-secondary"
                         value={f.Type} onChange={h("Type")} placeholder="Acción, Comedia…" />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Ubicación (Ubication)</label>
                  <input className="form-control bg-dark text-light border-secondary"
                         value={f.Ubication} onChange={h("Ubication")} placeholder="OAKLAND, POPCINEMA…" />
                </div>
                <div className="col-12">
                  <label className="form-label">URL del Póster</label>
                  <input className="form-control bg-dark text-light border-secondary"
                         value={f.Poster} onChange={h("Poster")} placeholder="https://…/poster.jpg" />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control bg-dark text-light border-secondary"
                            rows="4" value={f.description} onChange={h("description")}
                            placeholder="Sinopsis…" />
                </div>
                <div className="col-12 form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="estadoSwitch"
                         checked={!!f.Estado} onChange={h("Estado")} />
                  <label className="form-check-label" htmlFor="estadoSwitch">
                    {f.Estado ? "Estado: Activo" : "Estado: Inactivo"}
                  </label>
                </div>
                <div className="col-12 d-flex gap-2">
                  <button className="btn btn-success" disabled={!canSubmit}>
                    {initial ? "Guardar cambios" : "Crear película"}
                  </button>
                  <button type="button" className="btn btn-outline-light" onClick={onClose}>Cancelar</button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          // Detalles
          <div className="row g-4">
            <div className="col-md-4">
              <div style={posterFrameStyle}>
                {movie?.Poster ? (
                  <img src={movie.Poster} alt={movie?.Title} style={imgStyle}
                       onError={(e) => { e.currentTarget.src = "/img/fallback_poster.jpg"; }} />
                ) : (
                  <div className="text-secondary text-center px-3">Sin imagen</div>
                )}
              </div>
            </div>
            <div className="col-md-8">
              <p><strong>Año:</strong> {movie?.Year}</p>
              <p><strong>Género:</strong> {movie?.Type}</p>
              <p><strong>Ubicación:</strong>{" "}
                <span className="badge text-bg-success">{movie?.Ubicacion ?? movie?.Ubication}</span>
              </p>
              <h5 className="mt-3">Sinopsis</h5>
              <p className="mb-4">{movie?.description}</p>

              <div className="d-flex gap-2">
                <button className="btn btn-warning" onClick={onEditClick}>Editar</button>
                <button className="btn btn-danger" onClick={onDeleteClick}>Eliminar</button>
                <button className="btn btn-outline-light ms-auto" onClick={onClose}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </Frame>
    </>
  );
}