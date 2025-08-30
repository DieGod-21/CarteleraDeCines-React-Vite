import { useEffect, useState } from "react";

export default function SearchBar({ value = "", onChange, onClear, placeholder = "Buscar por título…" }) {
  const [q, setQ] = useState(value);
  useEffect(() => setQ(value), [value]);

  const handleClear = () => {
    setQ("");
    onChange?.("");
    onClear?.();
  };

  return (
    <div className="search-wrap position-relative w-100">
      {/* Ícono (SVG) */}
      <span className="search-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>

      <input
        className="form-control search-modern"   // 👈 importante: NO uses pretty-input ni form-control-lg
        placeholder={placeholder}
        value={q}
        spellCheck={false}
        onChange={(e) => {
          const v = e.target.value;
          setQ(v);
          onChange?.(v);
        }}
        aria-label="Buscar por título"
      />

      {q && (
        <button
          type="button"
          className="btn-clear"
          aria-label="Limpiar búsqueda"
          onClick={handleClear}
          title="Limpiar"
        >
          ×
        </button>
      )}
    </div>
  );
}