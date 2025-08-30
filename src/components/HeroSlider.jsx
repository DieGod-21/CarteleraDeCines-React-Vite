// src/components/HeroSlider.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { fromPublic } from "../utils/assetUrl.js"; // 👈 nuevo: para fallback

export default function HeroSlider({ slides = [], intervalMs = 3000 }) {
  const validSlides = (slides || []).filter((s) => s && s.image);
  const count = validSlides.length;
  if (count === 0) return <section className="hero-slider" />;

  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [anim, setAnim] = useState(null);
  const timerRef = useRef(null);
  const hovering = useRef(false);

  const current = validSlides[index] || {};
  const next = validSlides[count > 1 ? nextIndex : index] || current;

  const goTo = (to, mode = "fade") => {
    if (count < 2) return;
    const tgt = (to + count) % count;
    setNextIndex(tgt);
    setAnim(mode === "fade" ? "fade" : mode);
    setTimeout(() => {
      setIndex(tgt);
      setAnim(null);
    }, mode === "fade" ? 600 : 550);
  };

  const nextAuto = () => goTo(index + 1, "fade");
  const prevManual = () => goTo(index - 1, "slide-right");
  const nextManual = () => goTo(index + 1, "slide-left");

  useEffect(() => {
    if (count < 2) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!hovering.current && !anim) nextAuto();
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [index, anim, count, intervalMs]);

  const onEnter = () => (hovering.current = true);
  const onLeave = () => (hovering.current = false);

  const dots = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  const posCurrent = current.position || "center 35%";
  const posNext = next.position || "center 35%";

  return (
    <section
      className="hero-slider"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ /* 👇 opcional si tu CSS no define alto */
        minHeight: 520
      }}
    >
      {count === 1 ? (
        <img
          className="bg"
          src={current.image}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: posCurrent }}
          onError={(e) => {               // 👈 fallback 1/3
            e.currentTarget.onerror = null;
            e.currentTarget.src = fromPublic("img/fallback_poster.jpg");
          }}
        />
      ) : (
        <>
          <div className={`hero-layer hero-fade ${anim === "fade" ? "is-anim" : ""}`}>
            <img
              className="bg bg-current"
              src={current.image}
              alt=""
              style={{ objectPosition: posCurrent }}
              onError={(e) => {           // 👈 fallback 2/3
                e.currentTarget.onerror = null;
                e.currentTarget.src = fromPublic("img/fallback_poster.jpg");
              }}
            />
            <img
              className="bg bg-next"
              src={next.image}
              alt=""
              style={{ objectPosition: posNext }}
              onError={(e) => {           // 👈 fallback 3/3
                e.currentTarget.onerror = null;
                e.currentTarget.src = fromPublic("img/fallback_poster.jpg");
              }}
            />
          </div>

          <div className={`hero-layer hero-slide ${anim?.startsWith("slide") ? "is-anim" : ""} ${anim || ""}`}>
            <div className="slide-track">
              <img className="bg" src={current.image} alt="" style={{ objectPosition: posCurrent }} />
              <img className="bg" src={next.image} alt="" style={{ objectPosition: posNext }} />
            </div>
          </div>
        </>
      )}

      <div className="hero-overlay">
        {current.kicker && <div className="kicker">{current.kicker}</div>}
        {current.title && <h1 className="title">{current.title}</h1>}
        {current.ctaText && (
          <div className="cta-row">
            <button className="btn btn-warning btn-lg" onClick={current.onCtaClick}>
              {current.ctaText}
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <>
          <button className="nav prev" aria-label="Anterior" onClick={prevManual}>❮</button>
          <button className="nav next" aria-label="Siguiente" onClick={nextManual}>❯</button>
          <div className="dots">
            {dots.map((i) => (
              <button
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => goTo(i, i > index ? "slide-left" : "slide-right")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}