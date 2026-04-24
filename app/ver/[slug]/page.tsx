import { supabase } from "@/lib/supabase";
import { imgPath } from "@/lib/imgPath";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlayerClient from "./PlayerClient";

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
  tipo: string;
}

interface Episode {
  id_episodio: number;
  id_anime: number;
  numero: number;
  titulo_episodio: string;
  thumb: string;
  fecha_estreno: string;
}

interface VideoLink {
  id_link: number;
  id_episodio: number;
  id_servidor: number;
  url_video: string;
  idioma: string;
  es_descarga: boolean;
  calidad: string;
  servidor: { nombre: string };
}

// =============================================
// Slug Parsing: "overflow-1" → { animeSlug: "overflow", episodeNumber: 1 }
// Strategy: find the LAST hyphen followed by a pure number at end of string
// =============================================
function parseCompositeSlug(slug: string): {
  animeSlug: string;
  episodeNumber: number;
} | null {
  const match = slug.match(/^(.+)-(\d+)$/);
  if (!match) return null;
  return {
    animeSlug: match[1],
    episodeNumber: parseInt(match[2], 10),
  };
}

// =============================================
// Data Fetching
// =============================================
async function getPlayerData(animeSlug: string, episodeNumber: number) {
  // 1. Fetch anime by slug
  const { data: anime } = await supabase
    .from("animes")
    .select("*")
    .eq("slug", animeSlug)
    .single();

  if (!anime) return null;

  // 2. Fetch the specific episode
  const { data: episode } = await supabase
    .from("episodios")
    .select("*")
    .eq("id_anime", anime.id_anime)
    .eq("numero", episodeNumber)
    .single();

  if (!episode) return null;

  // 3. Fetch all episodes of this anime (for navigation)
  const { data: allEpisodes } = await supabase
    .from("episodios")
    .select("id_episodio, numero")
    .eq("id_anime", anime.id_anime)
    .order("numero", { ascending: true });

  const episodes = (allEpisodes || []) as Episode[];

  // Calculate prev/next
  const currentIndex = episodes.findIndex(
    (ep) => ep.numero === episodeNumber
  );
  const prevEpisode =
    currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  // 4. Fetch video links for this episode (join with servidores)
  const { data: videoLinks } = await supabase
    .from("links_videos")
    .select("*, servidor:servidores(*)")
    .eq("id_episodio", episode.id_episodio);

  const allLinks = (videoLinks || []) as VideoLink[];
  const streamingVideos = allLinks.filter((v) => !v.es_descarga);
  const downloadLinks = allLinks.filter((v) => v.es_descarga);

  // 5. Fetch 9 similar hentais
  const { data: similar } = await supabase
    .from("animes")
    .select("id_anime, titulo, slug, url_portada")
    .neq("id_anime", anime.id_anime)
    .order("votes", { ascending: false })
    .limit(9);

  return {
    anime: anime as Anime,
    episode: episode as Episode,
    episodes,
    prevEpisode,
    nextEpisode,
    streamingVideos,
    downloadLinks,
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
  const parsed = parseCompositeSlug(slug);
  if (!parsed) {
    return { title: "Episodio no encontrado | HentaiLA" };
  }

  const { data: anime } = await supabase
    .from("animes")
    .select("titulo, sinopsis")
    .eq("slug", parsed.animeSlug)
    .single();

  if (!anime) {
    return { title: "Episodio no encontrado | HentaiLA" };
  }

  return {
    title: `${anime.titulo} Episodio ${parsed.episodeNumber} HentaiLA - Ver Hentai en Español | HentaiLA`,
    description: `Ver el episodio ${parsed.episodeNumber} de ${anime.titulo} en HD completamente GRATIS.`,
    openGraph: {
      title: `Ver ${anime.titulo} ${parsed.episodeNumber} Online Sub Español | HentaiLA.pro`,
      description: `Ya está aquí, el episodio ${parsed.episodeNumber} de tu hentai favorito ${anime.titulo}.`,
      siteName: "HentaiLA",
      locale: "es_ES",
      type: "article",
    },
  };
}

// =============================================
// Page Component
// =============================================
export default async function VerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseCompositeSlug(slug);

  if (!parsed) {
    notFound();
  }

  const data = await getPlayerData(parsed.animeSlug, parsed.episodeNumber);

  if (!data) {
    notFound();
  }

  const {
    anime,
    episode,
    prevEpisode,
    nextEpisode,
    streamingVideos,
    downloadLinks,
    similar,
  } = data;

  return (
    <>
      {/* BREADCRUMB + TITLE + EPISODE NAV */}
      <section className="section top">
        <nav className="breadcrumb" id="breadcrumb">
          <Link href="/">Inicio</Link>
          <Link href={`/hentai/${anime.slug}`}>{anime.titulo}</Link>
          <strong>Episodio {episode.numero}</strong>
        </nav>
        <div className="top-header">
          <section className="section-header">
            <h1 className="section-title" id="episode-title">
              {anime.titulo}:{" "}
              <span>Episodio {episode.numero}</span>
            </h1>
          </section>
          <ul className="episodes_nav-list" id="episode-nav">
            <li>
              <Link
                href={`/hentai/${anime.slug}`}
                className="btn rnd list-btn fa-list"
              >
                Listado de episodios
              </Link>
            </li>
            {prevEpisode && (
              <li>
                <Link
                  href={`/ver/${anime.slug}-${prevEpisode.numero}`}
                  className="btn rnd npd fa-arrow-left"
                >
                  <span aria-hidden="true" hidden>
                    Anterior
                  </span>
                </Link>
              </li>
            )}
            {nextEpisode && (
              <li>
                <Link
                  href={`/ver/${anime.slug}-${nextEpisode.numero}`}
                  className="btn rnd npd fa-arrow-right"
                >
                  <span aria-hidden="true" hidden>
                    Siguiente
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* 2-COLUMN LAYOUT */}
      <div className="columns">
        {/* MAIN */}
        <main>
          {/* Player (Client Component) */}
          <PlayerClient
            videos={streamingVideos}
            downloads={downloadLinks}
          />

          {/* Comments */}
          <section className="section">
            <header className="section-header">
              <h3 className="section-title">Comentarios</h3>
            </header>
            <div
              id="comments-area"
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

        {/* ASIDE */}
        <aside>
          <div>
            {/* Social Links */}
            <section className="section">
              <ul className="follow-list">
                <li>
                  <a
                    href="#"
                    className="btn lnk npd fa-twitter"
                    rel="nofollow"
                    target="_blank"
                  >
                    <span>Siguenos en</span> Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    rel="nofollow"
                    target="_blank"
                    className="btn lnk npd fa-facebook"
                  >
                    <span>Síguenos en</span> Facebook
                  </a>
                </li>
              </ul>
            </section>

            {/* Similar Hentais */}
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
                          alt={`Thumb ${h.titulo}`}
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
