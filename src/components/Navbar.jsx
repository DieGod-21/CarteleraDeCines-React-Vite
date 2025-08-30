export default function Navbar({ darkMode, toggleTheme }) {
  const handleInicio = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("app:resetAll"));
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      } w-100 shadow-sm`}
    >
      <div className="container-fluid">
        {/* Brand */}
        <a
          className="navbar-brand brand-hero fw-semibold"
          href="#"
          onClick={handleInicio}
          title="Volver al inicio (reset filtros)"
        >
          🎬 Cartelera de Cines
        </a>

        {/* ====== MÓVIL (<lg) ====== */}
        <div className="ms-auto d-lg-none">
          <div className="toggler-anchor position-relative d-inline-block">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            {/* Panel flotante: justo bajo el hamburguesa */}
            <div
              id="mobileMenu"
              className={[
                "collapse",
                "position-absolute end-0 top-100 mt-2 z-3 menu-popover",
                "w-auto",
              ].join(" ")}
              style={{ minWidth: 190 }}
            >
              <ul className="navbar-nav flex-column gap-2">
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    title="Volver al inicio (reset filtros)"
                    data-bs-toggle="collapse"
                    data-bs-target="#mobileMenu"
                    onClick={(e) => { handleInicio(e); e.currentTarget.blur(); }}
                  >
                    Inicio
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost theme-btn"
                    title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    data-bs-toggle="collapse"
                    data-bs-target="#mobileMenu"
                    onClick={(e) => { toggleTheme(); e.currentTarget.blur(); }}
                  >
                    <span
                      className="theme-icon"
                      data-mode={darkMode ? "dark" : "light"}
                      aria-hidden="true"
                    />
                    <span className="theme-label">
                      {darkMode ? "Claro" : "Oscuro"}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ====== ESCRITORIO (≥lg) ====== */}
        <div className="d-none d-lg-flex ms-auto">
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-nav"
                title="Volver al inicio (reset filtros)"
                onClick={(e) => { handleInicio(e); e.currentTarget.blur(); }}
              >
                Inicio
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-nav theme-btn"
                title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                onClick={(e) => { toggleTheme(); e.currentTarget.blur(); }}
              >
                <span
                  className="theme-icon"
                  data-mode={darkMode ? "dark" : "light"}
                  aria-hidden="true"
                />
                <span className="theme-label">
                  {darkMode ? "Claro" : "Oscuro"}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}