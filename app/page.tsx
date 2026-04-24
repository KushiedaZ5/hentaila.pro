import { supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/timeAgo";
import { imgPath } from "@/lib/imgPath";
import Link from "next/link";
import HomeSlider from "./components/HomeSlider";

// Types
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
}

interface Episode {
  id_episodio: number;
  id_anime: number;
  numero: number;
  titulo_episodio: string;
  thumb: string;
  fecha_estreno: string;
}

interface EpisodeWithAnime extends Episode {
  anime: Anime;
}

// Fetch data on the server (SSR)
async function getHomeData() {
  // Get latest animes for the slider (top 10 by id desc = most recent)
  const { data: sliderAnimes } = await supabase
    .from("animes")
    .select("*")
    .order("id_anime", { ascending: false })
    .limit(10);

  // Get latest episodes with their anime info
  const { data: latestEpisodes } = await supabase
    .from("episodios")
    .select("*, anime:animes(*)")
    .order("fecha_estreno", { ascending: false })
    .limit(20);

  // Get recent hentais for the grid (top 15)
  const { data: recentHentais } = await supabase
    .from("animes")
    .select("*")
    .order("id_anime", { ascending: false })
    .limit(15);

  return {
    sliderAnimes: (sliderAnimes || []) as Anime[],
    latestEpisodes: (latestEpisodes || []) as EpisodeWithAnime[],
    recentHentais: (recentHentais || []) as Anime[],
  };
}

export default async function HomePage() {
  const { sliderAnimes, latestEpisodes, recentHentais } = await getHomeData();

  return (
    <>
      {/* HERO SLIDER */}
      <div className="jumbotron">
        <div className="home-slider" data-bind="slider"></div>
      </div>

      {/* SLIDER PRINCIPAL — Client Component */}
      <HomeSlider slides={sliderAnimes} />

      {/* EPISODIOS RECIENTES */}
      <section className="section episodes">
        <header className="section-header">
          <h3 className="section-title">Episodios Hentai Recientes:</h3>
        </header>
        <div className="grid episodes" id="episodes-grid">
          {latestEpisodes.map((ep) => (
            <article className="hentai episode" key={ep.id_episodio}>
              <div className="h-thumb">
                <figure>
                  <img
                    src={imgPath(ep.thumb || ep.anime?.url_portada)}
                    alt={`${ep.anime?.titulo} ${ep.numero}`}
                  />
                </figure>
              </div>
              <header className="h-header">
                <span className="num-episode">Episodio {ep.numero}</span>
                <h2 className="h-title">{ep.anime?.titulo}</h2>
                <time>
                  {ep.fecha_estreno
                    ? timeAgo(ep.fecha_estreno)
                    : "Reciente"}
                </time>
              </header>
              <Link
                href={`/ver/${ep.anime?.slug}-${ep.numero}`}
                title={`${ep.anime?.titulo} ${ep.numero}`}
                className="lnk-blk fa-play-circle"
              >
                <span aria-hidden="true" hidden>
                  Ver ahora
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* HENTAIS MÁS RECIENTES */}
      <section className="section hentai-list">
        <header className="section-header">
          <Link href="/catalogo" className="btn sm lnk npd">
            Lista completa de Hentais
          </Link>
          <h3 className="section-title">Hentais más Recientes</h3>
        </header>
        <div className="grid hentais" id="hentais-grid">
          {recentHentais.map((h) => (
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

      {/* SEO TEXT SECTION */}
      <section className="section text cont">
        <div className="h-content">
          <h3>Hentai Online en HD!</h3>
          <p>
            Nuestra misión es brindarte el mejor contenido lo antes posible.
            Tenemos una gran variedad de títulos en nuestro apartado &quot;
            <a href="/catalogo">Directorio de Hentais</a>&quot;, los podrás
            segmentar en categorías, emisión o finalizado,{" "}
            <strong>sin censura</strong>! también serás capaz de agregar tus
            hentais a favoritos.
          </p>
          <h3>Qué es Hentai?</h3>
          <p>
            Anime porno o porno anime, como gustes leerlo. Al igual que en el
            anime muchos de los episodios que ves, tienen su respectivo manga
            aunque esto no es ley, pero por lo general sí.
          </p>
          <h3>Fetiches Hentai</h3>
          <p>
            Son hentais en la cual una chica (casi siempre) tiene relaciones con
            algún monstruo con tentáculos. Esta categoría la pueden encontrar en
            nuestro directorio como <a href="#">Hentai tentáculos</a>.
          </p>
          <h3>Hentai sin Censura:</h3>
          <p>
            Todos quisiéramos disfrutar hentai sin censura, pero esto es muy
            difícil dadas las leyes penales de Japón que prohíben la publicación
            de material &quot;moralmente perjudicial&quot;. De igual modo
            tenemos una sección muy especial llamada{" "}
            <a href="#">Hentai sin censura!</a>
          </p>
        </div>
      </section>
    </>
  );
}
