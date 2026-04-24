"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { imgPath } from "@/lib/imgPath";

// =============================================
// Types
// =============================================
interface SearchResult {
  titulo: string;
  slug: string;
  url_portada: string;
}

// =============================================
// HeaderClient — Search, Dark Mode, Hamburger Menu
// =============================================
export default function HeaderClient() {
  const router = useRouter();

  // ——— SEARCH STATE ———
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ——— DARK MODE STATE ———
  const [isDarkMode, setIsDarkMode] = useState(true);

  // ——— HAMBURGER STATE ———
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // =============================================
  // DARK MODE — Init from localStorage
  // =============================================
  useEffect(() => {
    const savedMode = localStorage.getItem("hla-mode");
    if (savedMode === "light") {
      document.body.classList.add("w");
      setIsDarkMode(false);
    }
  }, []);

  function toggleDarkMode() {
    const isLight = document.body.classList.toggle("w");
    setIsDarkMode(!isLight);
    localStorage.setItem("hla-mode", isLight ? "light" : "dark");
  }

  // =============================================
  // HAMBURGER MENU
  // =============================================
  function toggleMenu() {
    setIsMenuOpen((prev) => {
      const next = !prev;
      const hd = document.getElementById("hd");
      if (hd) {
        if (next) hd.classList.add("on");
        else hd.classList.remove("on");
      }
      return next;
    });
  }

  // =============================================
  // SEARCH — Debounced fetch
  // =============================================
  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsSearchOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setIsSearchOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleSearchInput(value: string) {
    setQuery(value);

    // Debounce 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(value);
    }, 300);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length > 0) {
      setIsSearchOpen(false);
      router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleResultClick(slug: string) {
    setIsSearchOpen(false);
    setQuery("");
    router.push(`/hentai/${slug}`);
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Focus → reopen if we have results
  function handleFocus() {
    if (query.length >= 2 && results.length > 0) {
      setIsSearchOpen(true);
    }
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // =============================================
  // RENDER
  // =============================================
  return (
    <>
      {/* HAMBURGER BUTTON */}
      <button
        id="menu-btn"
        className={`btn menu-btn lnk${isMenuOpen ? " on" : ""}`}
        onClick={toggleMenu}
        type="button"
      >
        <i className="menu-icon" aria-hidden="true">
          menu
        </i>
      </button>

      {/* LOGO */}
      <figure className="logo">
        <a href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="190.51"
            height="49"
            viewBox="0 0 190.51 49"
          >
            <g transform="translate(-255 -31.5)">
              <path
                d="M26.321-16.429c0-4.367-2.853-7.061-7.62-7.061a19.506,19.506,0,0,0-4.523.653l1.3-7.265v-.122a.664.664,0,0,0-.693-.694H8.554a1,1,0,0,0-.937.816L2.36-.265v.122a.767.767,0,0,0,.734.776H9.247a1.124,1.124,0,0,0,.978-.9l2.893-16.408a11.328,11.328,0,0,1,2.69-.286c1.875,0,2.608.408,2.608,1.673a4.582,4.582,0,0,1-.122.98L15.808-.224v.163A.687.687,0,0,0,16.5.633h6.153a1.082,1.082,0,0,0,.978-.857l2.486-14.163A12.357,12.357,0,0,0,26.321-16.429Zm23.554,1.714c0-4.857-2.771-8.776-8.68-8.776-6.805,0-11.451,3.02-12.8,11.1l-.448,2.694a12.59,12.59,0,0,0-.163,2.082c0,5.8,4.483,8.612,9.006,8.612A28.745,28.745,0,0,0,45.718-.265a1.214,1.214,0,0,0,1.019-1.143l.652-3.673v-.163c0-.367-.244-.531-.611-.531h-.163c-1.549.163-5.664.327-7.824.327-2.038,0-3.342-.286-3.342-2.327a7.735,7.735,0,0,1,.122-1.265H48.245a1.046,1.046,0,0,0,1.019-.9l.408-2.449A14.952,14.952,0,0,0,49.875-14.714ZM42.54-15a8.12,8.12,0,0,1-.2,1.633H36.305c.489-2.327,1.467-4.041,3.749-4.041A2.161,2.161,0,0,1,42.54-15Zm31.5-1.265c0-4.082-1.712-7.224-6.4-7.224a11.81,11.81,0,0,0-6.52,2.245l.2-1.061v-.122a.664.664,0,0,0-.693-.694H55.05a1,1,0,0,0-.937.816L50.2-.265V-.1c0,.49.448.735.937.735h5.827a1.073,1.073,0,0,0,1.1-.9l2.771-15.8a8.291,8.291,0,0,1,3.464-.9c1.386,0,1.915.327,1.915,1.592a12.172,12.172,0,0,1-.285,2.082L63.648-.265V-.1a.7.7,0,0,0,.693.735h6.113a1.128,1.128,0,0,0,1.019-.9L73.714-13A18.469,18.469,0,0,0,74.04-16.265Zm18.582-6.2a.621.621,0,0,0-.652-.653h-3.1l.774-4.449v-.122A.644.644,0,0,0,89-28.347h-.122l-6.235,1.061a1.187,1.187,0,0,0-1.019.857l-.571,3.306h-2.69a1.089,1.089,0,0,0-1.019.857l-.611,3.429v.122a.789.789,0,0,0,.693.776l2.608.612-1.915,10.9a13.768,13.768,0,0,0-.2,2.122C77.911-.347,80.438,1,83.983,1A18.732,18.732,0,0,0,87.691.633,1.148,1.148,0,0,0,88.71-.184l.652-3.837v-.122a.666.666,0,0,0-.734-.653H86.754c-.734,0-.978-.163-.978-.694a4.249,4.249,0,0,1,.122-.857l1.956-10.98h3.1a1,1,0,0,0,.937-.816l.734-4.163Zm22.779.98c0-.694-.489-.816-1.263-.98a47.478,47.478,0,0,0-8.924-1.02c-6.235,0-11.166,2.245-12.47,10.041l-.693,4.122a15.032,15.032,0,0,0-.244,2.367C91.807-1.857,94.945,1,98.9,1a9.708,9.708,0,0,0,6.276-2.449L105.01-.184v.122a.675.675,0,0,0,.734.694h5.094a.914.914,0,0,0,.856-.816l3.668-20.98A1.016,1.016,0,0,0,115.4-21.49Zm-8.639,4.653L104.969-6.673a7.724,7.724,0,0,1-3.5,1.1c-1.141,0-1.875-.408-1.875-1.878a4.668,4.668,0,0,1,.082-1.02l.774-4.367C101.017-16.1,102.035-17,104.317-17A22.329,22.329,0,0,1,106.762-16.837Zm21.6-13.469a.7.7,0,0,0-.734-.694h-6.439a1.189,1.189,0,0,0-1.1.816l-.693,4v.122a.733.733,0,0,0,.774.694h6.439a1.138,1.138,0,0,0,1.06-.816l.693-4Zm-1.589,7.918a.731.731,0,0,0-.734-.735h-6.072a1.177,1.177,0,0,0-1.06.857l-3.871,22v.122a.767.767,0,0,0,.734.776h6.072a1.218,1.218,0,0,0,1.06-.9l3.871-22Z"
                transform="translate(252.64 71)"
                fill="var(--link)"
              />
              <path
                d="M1309.636,469.828H1262.7a4,4,0,0,1-3.935-4.7l7.045-40a4,4,0,0,1,3.936-3.3H1316.7a4,4,0,0,1,3.935,4.7l-7.068,40A4,4,0,0,1,1309.636,469.828Z"
                transform="translate(-875.7 -389.828)"
                fill="var(--primary)"
                stroke="rgba(0,0,0,0)"
                strokeMiterlimit={10}
                strokeWidth={1}
              />
              <path
                d="M1308.414,460.606v.08a.794.794,0,0,1-.779.81l-6.869,0a.757.757,0,0,1-.7-.8l-4.193-23.716c-.071-.4-.134-.511-.254-.52-.145-.011-.229.2-.3.584l-3,17.072h4.465c.41,0,.719.15.7.71s-1.6,4.217-3.315,5.436c-1.8,1.283-13.176,1.174-15.354,1.174-4.665,0-9.24-1.56-9.24-7.24a14.514,14.514,0,0,1,.21-2.18l3.776-21.73a1.107,1.107,0,0,1,1.029-.84h6.793a.637.637,0,0,1,.6.67v.17l-3.786,21.73a7.012,7.012,0,0,0-.08.8c0,.96.49,1.3,1.688,1.3h3.866l3.379-19.674c1.608-4.16,4.865-5,8.78-5s6.985.758,7.935,4.873Z"
                transform="translate(-875.712 -389.828)"
                fill="#fff"
              />
            </g>
          </svg>
        </a>
      </figure>

      {/* NAV: Search + Menu + Mode + User */}
      <nav>
        {/* SEARCH BOX */}
        <div
          className={`search${isSearchOpen ? " on" : ""}`}
          id="search-box"
          ref={searchBoxRef}
        >
          <form
            action="#"
            className="fa-search"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Milfs, waifus..."
              id="search-anime"
              autoComplete="off"
              value={query}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={handleFocus}
            />
          </form>
          <ul className="sub-menu" id="search-results">
            {query.length < 2 && (
              <li>Escribe al menos 2 caracteres...</li>
            )}
            {query.length >= 2 && isLoading && (
              <li className="loading">...</li>
            )}
            {query.length >= 2 && !isLoading && results.length === 0 && (
              <li>No se encontraron resultados</li>
            )}
            {results.map((r) => (
              <li key={r.slug}>
                <a
                  href={`/hentai/${r.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleResultClick(r.slug);
                  }}
                >
                  <figure>
                    <img
                      src={imgPath(r.url_portada)}
                      alt={r.titulo}
                    />
                  </figure>
                  <span>{r.titulo}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* MENU LINKS */}
        <ul className="menu">
          <li className="hfa-home">
            <a href="/">Inicio</a>
          </li>
          <li className="fa-star">
            <a href="/tierlist" title="Tierlist">
              Tierlist
            </a>
          </li>
          <li className="fa-play">
            <a href="/catalogo" title="Hentai sin Censura">
              Sin Censura
            </a>
          </li>
          <li className="fa-list">
            <a href="/catalogo">Directorio Hentai</a>
          </li>
          <li className="hfa-question-circle">
            <a href="/hentainator" title="HentaiNator">
              HentaiNator
            </a>
          </li>
        </ul>
      </nav>

      {/* DARK MODE TOGGLE */}
      <div className="mode">
        <button
          type="button"
          className={`btn btn-mode lnk npd${!isDarkMode ? " on" : ""}`}
          onClick={toggleDarkMode}
        >
          <i className="fa-sun">
            <span aria-hidden="true" hidden>
              dia
            </span>
          </i>
          <i className="fa-moon">
            <span aria-hidden="true" hidden>
              noche
            </span>
          </i>
        </button>
      </div>

      {/* USER ICON */}
      <div className="user-box">
        <a href="#" rel="nofollow" className="btn btn-user lnk npd">
          <span className="avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24.9"
              height="29.234"
              viewBox="0 0 24.9 29.234"
            >
              <g transform="translate(-9.823 -17.29)">
                <path
                  d="M22.273,17.29a7.479,7.479,0,1,1-7.479,7.479A7.479,7.479,0,0,1,22.273,17.29Zm0,29.234a16.285,16.285,0,0,1-12.45-5.8,9.475,9.475,0,0,1,8.371-5.082,2.079,2.079,0,0,1,.6.093,10.595,10.595,0,0,0,6.952,0,2.079,2.079,0,0,1,.6-.093,9.475,9.475,0,0,1,8.371,5.082A16.285,16.285,0,0,1,22.273,46.525Z"
                  fill="#fff"
                />
              </g>
            </svg>
          </span>
        </a>
      </div>
    </>
  );
}
