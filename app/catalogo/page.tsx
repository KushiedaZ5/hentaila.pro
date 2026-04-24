import { supabase } from "@/lib/supabase";
import { imgPath } from "@/lib/imgPath";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

// Definimos los tipos
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

export const metadata = {
  title: "Directorio de Hentai | HentaiLA",
  description: "Explora el catálogo completo de HentaiLA.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const letter = typeof resolvedParams.letter === "string" ? resolvedParams.letter : "all";
  const state = typeof resolvedParams.state === "string" ? resolvedParams.state : "all";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "recent";
  const searchQuery = typeof resolvedParams.q === "string" ? resolvedParams.q.trim() : "";
  
  const itemsPerPage = 20;
  
  // Base query
  let query = supabase.from("animes").select("*", { count: "exact" });

  // Search query filter (from header search bar)
  if (searchQuery.length > 0) {
    query = query.ilike("titulo", `%${searchQuery}%`);
  }

  // Filters
  if (letter !== "all" && letter.length === 1) {
    query = query.ilike("titulo", `${letter}%`);
  }
  
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

  // Generar letras para el filtro
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Build the base URL params (propagate q if present)
  const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";

  return (
    <>
      {/* BREADCRUMB + TÍTULO */}
      <section className="section top">
        <nav className="breadcrumb">
          <Link href="/">Inicio</Link>
          <strong>Directorio Hentai</strong>
        </nav>
        <div className="top-header">
          <section className="section-header">
            <h1 className="section-title">
              {searchQuery
                ? `Resultados para: "${searchQuery}"`
                : "Directorio de hentai"}
            </h1>
            {!searchQuery && (
              <p>
                En esta sección podrás filtrar tus hentais en categorías, géneros, por
                la letra inicial del nombre, los más populares y más.
              </p>
            )}
          </section>
        </div>
      </section>

      {/* BARRA ALFABÉTICA */}
      <section className="section">
        <ul className="alpha-list" id="alpha-list">
          <li>
            <Link href={`/catalogo?letter=all&state=${state}&sort=${sort}${qParam}`} className={letter === "all" ? "on" : ""}>
              #
            </Link>
          </li>
          {letters.map((l) => (
            <li key={l}>
              <Link
                href={`/catalogo?letter=${l}&state=${state}&sort=${sort}${qParam}`}
                className={letter === l ? "on" : ""}
              >
                {l}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="columns">
        {/* ASIDE (filtros) */}
        <aside>
          <div>
            <form method="GET" action="/catalogo">
              <input type="hidden" name="letter" value={letter} />
              <input type="hidden" name="sort" value={sort} />
              
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
          </div>
        </aside>

        {/* MAIN (resultados) */}
        <main>
          <section className="section">
            <header className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title" id="results-title">
                Resultados <span id="results-count">{totalCount} encontrados</span>
              </h3>
              <div className="sort-by" style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/catalogo?letter=${letter}&state=${state}&sort=recent${qParam}`} className={`btn lnk npd ${sort === 'recent' ? 'text-primary' : ''}`}>Recientes</Link>
                <Link href={`/catalogo?letter=${letter}&state=${state}&sort=popular${qParam}`} className={`btn lnk npd ${sort === 'popular' ? 'text-primary' : ''}`}>Populares</Link>
                <Link href={`/catalogo?letter=${letter}&state=${state}&sort=az${qParam}`} className={`btn lnk npd ${sort === 'az' ? 'text-primary' : ''}`}>A-Z</Link>
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
                        href={`/catalogo?page=${p}&letter=${letter}&state=${state}&sort=${sort}${qParam}`}
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
