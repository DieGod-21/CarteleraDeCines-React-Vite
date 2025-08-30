import Select, { components } from "react-select";

/* Chevron personalizado */
const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    {/* ícono SVG */}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </components.DropdownIndicator>
);

/* Sin línea separadora entre valor e íconos */
const IndicatorSeparator = () => null;

const toOptions = (arr) => [
  { value: "", label: "Todas las ubicaciones" },
  ...arr.map((v) => ({ value: v, label: v })),
];

export default function Filters({ value, onChange, options = [] }) {
  const opts = toOptions(options);
  const selected = opts.find((o) => o.value === value) ?? opts[0];

  return (
    <Select
      options={opts}
      value={selected}
      onChange={(opt) => onChange(opt?.value ?? "")}
      isClearable={false}
      isSearchable={true}
      classNamePrefix="rs"              /* prefijo CSS */
      placeholder="Todas las ubicaciones"
      components={{ DropdownIndicator, IndicatorSeparator }}
      /* Portal para que el menú quede por encima de todo */
      menuPortalTarget={document.body}
      /* Estilos in-JS: tamaño, ring, etc. */
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base, state) => ({
          ...base,
          borderRadius: 14,
          minHeight: 44,
          paddingLeft: 4,
          paddingRight: 4,
          fontSize: "1rem",
          borderColor: state.isFocused ? "var(--sel-ring, #60a5fa)" : "var(--sel-bd, #ced4da)",
          boxShadow: state.isFocused
            ? "0 0 0 .25rem color-mix(in srgb, var(--sel-ring, #60a5fa) 35%, transparent)"
            : "0 1px 2px rgba(0,0,0,.06)",
          backgroundColor: "var(--sel-bg, #fff)",
          color: "var(--sel-fg, #212529)",
          cursor: "pointer",
          ":hover": {
            borderColor: "var(--sel-bd-hover, #a7b0bb)",
          },
        }),
        valueContainer: (base) => ({ ...base, padding: "4px 8px" }),
        placeholder: (base) => ({ ...base, color: "var(--sel-fg, #212529)", opacity: 0.72 }),
        singleValue: (base) => ({ ...base, color: "var(--sel-fg, #212529)" }),
        input: (base) => ({ ...base, color: "var(--sel-fg, #212529)" }),
        dropdownIndicator: (base) => ({ ...base, color: "var(--sel-fg, #212529)", paddingInline: 8 }),
        menu: (base) => ({
          ...base,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "var(--sel-bg, #fff)",
          boxShadow: "0 8px 24px rgba(0,0,0,.2)",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "color-mix(in srgb, var(--sel-ring, #6ea8fe) 24%, var(--sel-bg, #fff))"
            : state.isFocused
            ? "color-mix(in srgb, var(--sel-ring, #6ea8fe) 12%, var(--sel-bg, #fff))"
            : "transparent",
          color: "var(--sel-fg, #212529)",
          cursor: "pointer",
          paddingBlock: 10,
        }),
      }}
      /* Tema de react-select (colores activos) */
      theme={(t) => ({
        ...t,
        borderRadius: 14,
        colors: {
          ...t.colors,
          primary: "var(--sel-ring, #60a5fa)",
          primary25: "color-mix(in srgb, var(--sel-ring, #60a5fa) 12%, var(--sel-bg, #fff))",
          neutral0: "var(--sel-bg, #fff)",
          neutral80: "var(--sel-fg, #212529)",
        },
      })}
    />
  );
}
