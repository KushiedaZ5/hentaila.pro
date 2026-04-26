import { supabase } from "@/lib/supabase";
import { imgPath } from "@/lib/imgPath";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 0;

// =============================================
// Types
// =============================================
interface Anime {
  id_anime: number;
  titulo: string;
  slug: string;
  sinopsis: string;
  url_portada: string;
  estado: string;
  votes: number;
  tipo: string;
}

interface Genero {
  id_genero: number;
  nombre: string;
  descripcion?: string | null;
}

// =============================================
// Dynamic Metadata
// =============================================
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const genreSlug = typeof resolvedParams.genre === "string" ? resolvedParams.genre.trim().toLowerCase() : "";

  if (genreSlug) {
    // Fetch the genre name from DB to get proper casing
    const { data: generos } = await supabase
      .from("generos")
      .select("nombre")
      .order("nombre");

    const matchedGenre = (generos || []).find(
      (g: { nombre: string }) => g.nombre.toLowerCase() === genreSlug
    );

    const genreName = matchedGenre ? matchedGenre.nombre : genreSlug;

    return {
      title: `Hentai: ${genreName} | HentaiLA`,
      description: `Explora todos los hentais del género ${genreName} en HentaiLA.`,
    };
  }

  return {
    title: "Directorio de Hentai | HentaiLA",
    description: "Explora el catálogo completo de HentaiLA.",
  };
}

// =============================================
// Page Component
// =============================================
export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  // ——— Parse all search params ———
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const letter = typeof resolvedParams.letter === "string" ? resolvedParams.letter : "all";
  const state = typeof resolvedParams.state === "string" ? resolvedParams.state : "all";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "recent";
  const searchQuery = typeof resolvedParams.q === "string" ? resolvedParams.q.trim() : "";
  const genreSlug = typeof resolvedParams.genre === "string" ? resolvedParams.genre.trim().toLowerCase() : "";

  const itemsPerPage = 20;

  // =============================================
  // 1. Fetch ALL genres for the sidebar
  // =============================================
  const { data: generosData } = await supabase
    .from("generos")
    .select("*")
    .order("nombre");

  const allGenres = (generosData || []) as Genero[];

  // =============================================
  // 2. Genre filtering logic
  // =============================================
  let activeGenre: Genero | null = null;
  let genreAnimeIds: number[] | null = null;

  if (genreSlug) {
    // Find the genre matching the slug
    activeGenre = allGenres.find(
      (g) => g.nombre.toLowerCase() === genreSlug
    ) || null;

    if (activeGenre) {
      // Get all anime IDs for this genre via the pivot table
      const { data: pivotData } = await supabase
        .from("anime_generos")
        .select("id_anime")
        .eq("id_genero", activeGenre.id_genero);

      genreAnimeIds = (pivotData || []).map((row: { id_anime: number }) => row.id_anime);
    }
  }

  // =============================================
  // 3. Build main animes query
  // =============================================
  let query = supabase.from("animes").select("*", { count: "exact" });

  // Genre filter (must come before other filters)
  if (genreAnimeIds !== null) {
    if (genreAnimeIds.length === 0) {
      // No animes for this genre — force empty results
      query = query.in("id_anime", [-1]);
    } else {
      query = query.in("id_anime", genreAnimeIds);
    }
  }

  // Search query filter (from header search bar)
  if (searchQuery.length > 0) {
    query = query.ilike("titulo", `%${searchQuery}%`);
  }

  // Letter filter
  if (letter !== "all" && letter.length === 1) {
    query = query.ilike("titulo", `${letter}%`);
  }

  // State filter
  if (state === "emision") {
    query = query.eq("estado", "En Emisión");
  } else if (state === "finalizado") {
    query = query.eq("estado", "Finalizado");
  }

  // Sort
  if (sort === "popular") {
    query = query.order("votes", { ascending: false });
  } else if (sort === "az") {
    query = query.order("titulo", { ascending: true });
  } else {
    // recent by default
    query = query.order("id_anime", { ascending: false });
  }

  // Pagination
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  const { data, count } = await query;

  const animes = (data || []) as Anime[];
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // =============================================
  // 4. Build URL helper params for link propagation
  // =============================================
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
  const genreParam = genreSlug ? `&genre=${encodeURIComponent(genreSlug)}` : "";

  // =============================================
  // 5. Determine header content
  // =============================================
  const isGenreActive = activeGenre !== null;

  const pageTitle = searchQuery
    ? `Resultados para: "${searchQuery}"`
    : isGenreActive
      ? `Hentai: ${activeGenre!.nombre}`
      : "Directorio de hentai";

  const pageSubtitle = isGenreActive
    ? (activeGenre!.descripcion || `genre.${genreSlug}`)
    : null;

  const pageDescription = !searchQuery && !isGenreActive
    ? "En esta sección podrás filtrar tus hentais en categorías, géneros, por la letra inicial del nombre, los más populares y más."
    : null;

  // =============================================
  // RENDER
  // =============================================
  return (
    <>
      {/* BREADCRUMB + TÍTULO */}
      <section className="section top">
        <nav className="breadcrumb">
          <Link href="/">Inicio</Link>
          {isGenreActive ? (
            <>
              <Link href="/catalogo">Directorio Hentai</Link>
              <strong>Directorio {activeGenre!.nombre}</strong>
            </>
          ) : (
            <strong>Directorio Hentai</strong>
          )}
        </nav>
        <div className="top-header">
          <section className="section-header">
            <h1 className="section-title">{pageTitle}</h1>
            {pageSubtitle && (
              <p style={{ marginTop: "0.25rem", color: "#c5c5c5", fontSize: "1rem", lineHeight: 1.6 }}>
                {pageSubtitle}
              </p>
            )}
            {pageDescription && <p>{pageDescription}</p>}
          </section>
          {isGenreActive && (
            <div className="follow-list" style={{ marginBottom: "1rem" }}>
              <a
                href="https://twitter.com/hentaila"
                target="_blank"
                rel="nofollow noopener"
                className="btn fa-twitter"
              >
                <span>Síguenos en</span>Twitter
              </a>
              <a
                href="https://facebook.com/hentaila"
                target="_blank"
                rel="nofollow noopener"
                className="btn fa-facebook"
              >
                <span>Síguenos en</span>Facebook
              </a>
            </div>
          )}
        </div>
      </section>

      {/* BARRA ALFABÉTICA */}
      <section className="section">
        <ul className="alpha-list" id="alpha-list">
          <li>
            <Link
              href={`/catalogo?letter=all&state=${state}&sort=${sort}${qParam}${genreParam}`}
              className={letter === "all" ? "on" : ""}
            >
              #
            </Link>
          </li>
          {letters.map((l) => (
            <li key={l}>
              <Link
                href={`/catalogo?letter=${l}&state=${state}&sort=${sort}${qParam}${genreParam}`}
                className={letter === l ? "on" : ""}
              >
                {l}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="columns">
        {/* ==================== ASIDE (filtros) ==================== */}
        <aside>
          <div>
            {/* ——— Estado filter ——— */}
            <form method="GET" action="/catalogo">
              <input type="hidden" name="letter" value={letter} />
              <input type="hidden" name="sort" value={sort} />
              {/* Propagate genre in the form submission */}
              {genreSlug && <input type="hidden" name="genre" value={genreSlug} />}

              <section className="section widget-filter" id="bx-state">
                <header className="section-header" id="toggle-state">
                  <h3 className="section-title">Estado</h3>
                </header>
                <div className="filter-content">
                  <ul className="filter-list">
                    <li>
                      <p className="chk">
                        <input
                          type="radio"
                          id="chk-todos"
                          name="state"
                          value="all"
                          defaultChecked={state === "all"}
                        />
                        <label htmlFor="chk-todos">Todos</label>
                      </p>
                    </li>
                    <li>
                      <p className="chk">
                        <input
                          type="radio"
                          id="chk-emision"
                          name="state"
                          value="emision"
                          defaultChecked={state === "emision"}
                        />
                        <label htmlFor="chk-emision">En emisión</label>
                      </p>
                    </li>
                    <li>
                      <p className="chk">
                        <input
                          type="radio"
                          id="chk-finalizado"
                          name="state"
                          value="finalizado"
                          defaultChecked={state === "finalizado"}
                        />
                        <label htmlFor="chk-finalizado">Finalizado</label>
                      </p>
                    </li>
                  </ul>
                </div>
              </section>

              <button type="submit" className="btn send-btn blk" id="btn-filter">
                Filtrar
              </button>
            </form>

            {/* ——— Géneros list ——— */}
            <section className="section widget-filter" id="bx-genres">
              <header className="section-header" id="toggle-genres">
                <h3 className="section-title">Géneros</h3>
              </header>
              <div className="filter-content">
                <ul className="categories-list">
                  {allGenres.map((g) => {
                    const gSlug = g.nombre.toLowerCase();
                    const isActive = genreSlug === gSlug;
                    return (
                      <li key={g.id_genero} className={`fa-folders${isActive ? " current" : ""}`}>
                        <Link
                          href={`/catalogo?genre=${encodeURIComponent(gSlug)}`}
                          style={isActive ? { color: "var(--link)", fontWeight: 700 } : undefined}
                        >
                          {g.nombre}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </div>
        </aside>

        {/* ==================== MAIN (resultados) ==================== */}
        <main>
          <section className="section">
            <header className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title" id="results-title">
                Resultados <span id="results-count">{totalCount} {isGenreActive ? "hentais encontrados" : "encontrados"}</span>
              </h3>
              <div className="sort-by" style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/catalogo?letter=${letter}&state=${state}&sort=recent${qParam}${genreParam}`} className={`btn lnk npd ${sort === 'recent' ? 'text-primary' : ''}`}>Recientes</Link>
                <Link href={`/catalogo?letter=${letter}&state=${state}&sort=popular${qParam}${genreParam}`} className={`btn lnk npd ${sort === 'popular' ? 'text-primary' : ''}`}>Populares</Link>
                <Link href={`/catalogo?letter=${letter}&state=${state}&sort=az${qParam}${genreParam}`} className={`btn lnk npd ${sort === 'az' ? 'text-primary' : ''}`}>A-Z</Link>
              </div>
            </header>

            <div className="grid hentais" id="catalog-grid">
              {animes.length === 0 ? (
                <p style={{ textAlign: "center", padding: "2rem", color: "var(--text)" }}>
                  No se encontraron hentais con los filtros seleccionados.
                </p>
              ) : (
                animes.map((h) => (
                  <article className="hentai" key={h.id_anime}>
                    <div className="h-thumb">
                      <figure>
                        <img src={imgPath(h.url_portada)} alt={h.titulo} />
                      </figure>
                      <span className="favorites fa-heart">
                        {h.votes ? h.votes.toLocaleString() : 0}
                      </span>
                    </div>
                    <header className="h-header">
                      <h2 className="h-title">{h.titulo}</h2>
                    </header>
                    <Link href={`/hentai/${h.slug}`} className="lnk-blk">
                      <span aria-hidden="true" hidden>
                        Ver ahora
                      </span>
                    </Link>
                  </article>
                ))
              )}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation" style={{ marginTop: '2rem' }}>
                <ul className="pagination episodes_nav-list" id="pagination" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p}>
                      <Link
                        href={`/catalogo?page=${p}&letter=${letter}&state=${state}&sort=${sort}${qParam}${genreParam}`}
                        className={`btn rnd npd ${p === page ? "send-btn" : ""}`}
                        style={{ display: 'inline-block', minWidth: '36px', textAlign: 'center' }}
                      >
                        {p}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
