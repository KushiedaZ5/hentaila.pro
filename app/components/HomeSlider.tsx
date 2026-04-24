"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { imgPath } from "@/lib/imgPath";
import Link from "next/link";

interface SlideData {
  id_anime: number;
  titulo: string;
  slug: string;
  sinopsis: string;
  estado: string;
  url_portada: string;
  background: string;
}

export default function HomeSlider({ slides }: { slides: SlideData[] }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
  }, [total]);

  useEffect(() => {
    if (total > 1) startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total, startAutoplay]);

  function goTo(index: number) {
    setCurrent(index);
    startAutoplay(); // Reset timer on manual nav
  }

  if (total === 0) return null;

  return (
    <section className="latest-hentais section top">
      <div className="slider slick-initialized">
        {slides.map((anime, i) => (
          <div
            className="item"
            key={anime.id_anime}
            style={{
              display: i === current ? "block" : "none",
              animation: i === current ? "fadeIn 0.6s ease" : "none",
            }}
          >
            <article className="cont">
              <header className="h-header">
                <h2 className="h-title">
                  <Link href={`/hentai/${anime.slug}`}>{anime.titulo}</Link>
                </h2>
                <div className="h-meta">
                  <span className="type-hentai">Hentai</span>
                  <span
                    className={
                      anime.estado === "En Emisión"
                        ? "status-on"
                        : "status-off"
                    }
                  >
                    <i aria-hidden="true">Estado</i> {anime.estado}
                  </span>
                </div>
              </header>
              <div className="h-content">
                <p>{anime.sinopsis}</p>
              </div>
              <footer className="h-footer">
                <nav className="genres">
                  <span className="fa-folders">Géneros</span>
                </nav>
              </footer>
            </article>
            <figure className="bg">
              <img
                src={imgPath(anime.background || anime.url_portada)}
                alt={`Background ${anime.titulo}`}
              />
            </figure>
          </div>
        ))}
      </div>
      {/* DOTS */}
      {total > 1 && (
        <ul className="slick-dots">
          {slides.map((_, i) => (
            <li
              key={i}
              className={i === current ? "slick-active" : ""}
            >
              <button onClick={() => goTo(i)} type="button">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
