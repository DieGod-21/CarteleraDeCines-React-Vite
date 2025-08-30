import { useEffect, useMemo, useState } from 'react';
import { createMovie } from '../services/api.js';

const BLANK = {
  imdbID: '',
  Title: '',
  Year: '',
  Type: '',
  Poster: '',
  Estado: true,
  description: '',
  Ubication: '',
};

function Shell({ show, onClose, children, width = 980 }) {
  if (!show) return null;
  return (
    <>
      <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:1050}} />
      <div style={{position:'fixed', inset:0, display:'grid', placeItems:'center', zIndex:1060}}>
        <div className="card bg-dark text-light" style={{width, maxWidth:'95vw'}}>
          <div className="card-body">{children}</div>
        </div>
      </div>
    </>
  );
}

export default function AddMovieModal({ show, onClose, onCreated }) {
  const [f, setF]   = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState('');

  useEffect(() => { if (show) { setF({ ...BLANK, imdbID: String(Date.now()) }); setMsg(''); } }, [show]);

  const canSubmit = useMemo(() => {
    return f.imdbID && f.Title && f.Year && f.Type && f.Poster && f.Ubication && typeof f.Estado === 'boolean';
  }, [f]);

  const h = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true); setMsg('');
    try {
      const payload = {
        imdbID: String(f.imdbID).trim(),
        Title: String(f.Title).trim(),
        Year: String(f.Year).trim(),           // el backend lo guarda como string
        Type: String(f.Type).trim(),
        Poster: String(f.Poster).trim(),
        Estado: !!f.Estado,
        description: String(f.description).trim(),
        Ubication: String(f.Ubication).trim(), // OJO: Ubication con "c"
      };
      await createMovie(payload);
      onCreated?.();      // refrescar lista
      onClose?.();        // cerrar modal
    } catch (err) {
      setMsg(err.message || 'No se pudo crear la película');
    } finally { setBusy(false); }
  };

  return (
    <Shell show={show} onClose={onClose}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h3 className="m-0">Añadir Nueva Película</h3>
        <button className="btn btn-sm btn-light" onClick={onClose}>✕</button>
      </div>

      {msg && <div className="alert alert-warning py-2">{msg}</div>}

      <form onSubmit={submit} className="row g-3">
        <div className="col-md-4">
          <div className="bg-body-tertiary rounded h-100 d-flex align-items-center justify-content-center">
            {f.Poster ? (
              <img src={f.Poster} alt="Poster" className="img-fluid rounded"
                   style={{ objectFit:'cover', height:420 }} />
            ) : (
              <div className="text-secondary p-3 text-center">Previsualización del póster</div>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label">imdbID</label>
              <input className="form-control" value={f.imdbID} onChange={h('imdbID')} />
              <div className="form-text">Debe ser único. Se sugiere mantener el que se generó.</div>
            </div>
            <div className="col-sm-6">
              <label className="form-label">Año</label>
              <input className="form-control" value={f.Year} onChange={h('Year')} placeholder="2025" />
            </div>
            <div className="col-12">
              <label className="form-label">Título</label>
              <input className="form-control" value={f.Title} onChange={h('Title')} placeholder="OTRO VIERNES DE LOCOS" />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Género (Type)</label>
              <input className="form-control" value={f.Type} onChange={h('Type')} placeholder="Comedia, Drama, etc." />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Ubicación (Ubication)</label>
              <input className="form-control" value={f.Ubication} onChange={h('Ubication')} placeholder="Centranorte Mall" />
            </div>
            <div className="col-12">
              <label className="form-label">URL del Póster</label>
              <input className="form-control" value={f.Poster} onChange={h('Poster')}
                     placeholder="https://ejemplo.com/poster.jpg" />
            </div>
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" rows="4" value={f.description} onChange={h('description')}
                        placeholder="Sinopsis…" />
            </div>
            <div className="col-12 form-check form-switch">
              <input className="form-check-input" type="checkbox" id="estadoSwitch"
                     checked={!!f.Estado} onChange={h('Estado')} />
              <label className="form-check-label" htmlFor="estadoSwitch">
                {f.Estado ? 'Estado: Activo' : 'Estado: Inactivo'}
              </label>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-success" disabled={!canSubmit || busy}>
                {busy ? 'Guardando…' : 'Crear película'}
              </button>
              <button type="button" className="btn btn-outline-light" onClick={onClose} disabled={busy}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </Shell>
  );
}