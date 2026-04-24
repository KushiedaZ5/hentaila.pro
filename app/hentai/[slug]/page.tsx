import { supabase } from "@/lib/supabase";
import { imgPath } from "@/lib/imgPath";
import { timeAgo } from "@/lib/timeAgo";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// =============================================
// Types
// =============================================
interface Anime {
  id_anime: number;
  titulo: string;
  slug: string;
  sinopsis: string;
  url_portada: string;
  background: string;
  tipo: string;
  estado: string;
  puntuacion: number;
  votes: number;
  episodios: number;
  año: number;
  nombre_english: string;
  studio: string;
}

interface Episode {
  id_episodio: number;
  id_anime: number;
  numero: number;
  titulo_episodio: string;
  thumb: string;
  fecha_estreno: string;
}

interface Genero {
  id_genero: number;
  nombre: string;
}

// =============================================
// Data Fetching
// =============================================
async function getAnimeData(slug: string) {
  // 1. Fetch anime by slug
  const { data: anime } = await supabase
    .from("animes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!anime) return null;

  // 2. Fetch all episodes for this anime (descending by numero)
  const { data: episodes } = await supabase
    .from("episodios")
    .select("*")
    .eq("id_anime", anime.id_anime)
    .order("numero", { ascending: false });

  // 3. Fetch genres via pivot table
  const { data: animeGeneros } = await supabase
    .from("anime_generos")
    .select("id_genero")
    .eq("id_anime", anime.id_anime);

  let genres: Genero[] = [];
  if (animeGeneros && animeGeneros.length > 0) {
    const generoIds = animeGeneros.map((ag: { id_genero: number }) => ag.id_genero);
    const { data: generosData } = await supabase
      .from("generos")
      .select("*")
      .in("id_genero", generoIds);
    genres = (generosData || []) as Genero[];
  }

  // 4. Fetch 9 similar hentais (excluding current)
  const { data: similar } = await supabase
    .from("animes")
    .select("id_anime, titulo, slug, url_portada")
    .neq("id_anime", anime.id_anime)
    .order("votes", { ascending: false })
    .limit(9);

  return {
    anime: anime as Anime,
    episodes: (episodes || []) as Episode[],
    genres,
    similar: (similar || []) as Anime[],
  };
}

// =============================================
// Dynamic Metadata (SEO)
// =============================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: anime } = await supabase
    .from("animes")
    .select("titulo, sinopsis, url_portada")
    .eq("slug", slug)
    .single();

  if (!anime) {
    return { title: "Anime no encontrado | HentaiLA" };
  }

  return {
    title: `Ver ${anime.titulo} Online | HentaiLA`,
    description: anime.sinopsis || `Ver ${anime.titulo} online en HD.`,
    openGraph: {
      title: `${anime.titulo} | HentaiLA.pro`,
      description: anime.sinopsis || `Ver ${anime.titulo} online en HD.`,
      siteName: "HentaiLA",
      locale: "es_LA",
      type: "website",
    },
  };
}

// =============================================
// Page Component
// =============================================
export default async function FichaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getAnimeData(slug);

  if (!data) {
    notFound();
  }

  const { anime, episodes, genres, similar } = data;

  // Computed values
  const statusClass = anime.estado === "En Emisión" ? "status-on" : "status-off";
  const ratingPercent = anime.puntuacion ? (anime.puntuacion / 10) * 100 : 0;
  const ratingDisplay = anime.puntuacion ? anime.puntuacion.toFixed(1) : "0.0";

  return (
    <>
      {/* HERO SECTION: Breadcrumb + Anime Card + Background */}
      <section className="section top" id="anime-hero">
        <nav className="breadcrumb" id="breadcrumb">
          <Link href="/">Inicio</Link>
          <strong>{anime.titulo}</strong>
        </nav>

        <article className="hentai-single" id="anime-card">
          {/* HEADER */}
          <header className="h-header">
            <h1 className="h-title">{anime.titulo}</h1>
            <div className="h-meta">
              <span className="type-hentai">{anime.tipo || "Hentai"}</span>
              <span className={statusClass}>
                <i aria-hidden="true">estado</i> {anime.estado}
              </span>{" "}
              <span className="num-episode">
                <span>{anime.episodios || episodes.length}</span> episodios
              </span>
            </div>
          </header>

          {/* COVER THUMB */}
          <div className="h-thumb">
            <figure>
              <img
                src={imgPath(anime.url_portada)}
                alt={`Portada ${anime.titulo}`}
              />
            </figure>
            <button type="button" className="btn btn-favorites rnd" id="btn-fav">
              <span className="fa-heart">
                <i className="fa-plus"></i>
              </span>
            </button>
          </div>

          {/* RATING */}
          <div className="h-rating">
            <p className="fa-star total">
              {ratingDisplay}{" "}
              <span>
                <span>{(anime.votes || 0).toLocaleString()}</span> votos
              </span>
            </p>
            <div className="progress">
              <span style={{ width: `${ratingPercent}%` }}></span>
            </div>
            <ul className="vote-list">
              <li>
                <button type="button" className="btn sm blk" id="vote-up">
                  <i className="fa-thumbs-up">
                    <span hidden>up</span>
                  </i>
                </button>
              </li>
              <li>
                <button type="button" className="btn sm blk" id="vote-down">
                  <i className="fa-thumbs-down">
                    <span hidden>down</span>
                  </i>
                </button>
              </li>
            </ul>
          </div>

          {/* SYNOPSIS */}
          <div className="h-content">
            <h2 className="content-title" title="De que va">
              {anime.titulo}
            </h2>
            <p>{anime.sinopsis}</p>
          </div>

          {/* GENRES */}
          <footer className="h-footer">
            <nav className="genres">
              <span className="fa-folders">Géneros</span>
              {genres.map((g) => (
                <Link
                  key={g.id_genero}
                  href="/catalogo"
                  className="btn sm"
                  title={`hentai ${g.nombre}`}
                >
                  {g.nombre}
                </Link>
              ))}
            </nav>
          </footer>
        </article>

        {/* BACKGROUND IMAGE */}
        <figure className="bg" id="anime-bg">
          <img
            src={imgPath(anime.background || anime.url_portada)}
            alt={`Imagen de Fondo ${anime.titulo}`}
          />
        </figure>
      </section>

      {/* 2-COLUMN LAYOUT */}
      <div className="columns">
        {/* MAIN: Episodes List */}
        <main>
          <section className="section">
            <header className="section-header">
              <h3 className="section-title">Episodios</h3>
            </header>
            <div className="episodes-list" id="episodes-list">
              {episodes.map((ep) => (
                <article className="hentai episode sm" key={ep.id_episodio}>
                  <div className="h-thumb">
                    <figure>
                      <img
                        src={imgPath(ep.thumb || anime.url_portada)}
                        alt={`Foto Hentai ${anime.titulo}`}
                      />
                    </figure>
                  </div>
                  <header className="h-header">
                    <h2 className="h-title">
                      {ep.titulo_episodio ||
                        `${anime.titulo} Episodio ${ep.numero}`}
                    </h2>
                    <time>
                      {ep.fecha_estreno
                        ? timeAgo(ep.fecha_estreno)
                        : "Reciente"}
                    </time>
                  </header>
                  <Link
                    href={`/ver/${anime.slug}-${ep.numero}`}
                    className="lnk-blk fa-play"
                  >
                    <span aria-hidden="true" hidden>
                      Ver ahora
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <header className="section-header">
              <h3 className="section-title">Comentarios</h3>
            </header>
            <div
              style={{
                backgroundColor: "var(--gray-dark)",
                borderRadius: ".25rem",
                padding: "var(--space)",
                textAlign: "center",
                color: "var(--text)",
              }}
            >
              <p style={{ marginBottom: 0 }}>
                Los comentarios estarán disponibles próximamente.
              </p>
            </div>
          </section>
        </main>

        {/* ASIDE: Similar Hentais */}
        <aside>
          <div>
            <section className="section widget-hentais">
              <header className="section-header">
                <h3 className="section-title">Hentais Similares</h3>
              </header>
              <div className="grid hentais" id="similar-grid">
                {similar.map((h) => (
                  <article className="hentai" key={h.id_anime}>
                    <div className="h-thumb">
                      <figure>
                        <img
                          src={imgPath(h.url_portada)}
                          alt={h.titulo}
                        />
                      </figure>
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
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </>
  );
}
