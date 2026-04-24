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
            Nuestra misión es brindarte el mejor hidrógeno lo antes posible, en HLA tienes una gran variedad de títulos en nuestro apartado &quot;<strong>Directorio de Hentais</strong>&quot;, los podrás segmentar en categorías, emisión o finalizado, sin censura! también serás capaz de agregar tus hentais a favoritos, así te será más fácil recordar con que anime te la estabas ********** D:!
          </p>
          <h3>Qué es Hentai?</h3>
          <p>
            En serio estás leyendo esta parte? pues que te puedo decir, lo resumiré forma simple y sencilla. Anime porno o porno anime, como gustes leerlo, pues eso, al igual que en el anime muchos de los episodios <strong>hentai</strong> que ves, tienen su respectivo manga aunque esto no es ley, pero por lo general si, así que si tienen ganas de leer manga caliente muy pronto tendremos esa opción en HLA!
          </p>
          <h3>Fetiches Hentai</h3>
          <p>
            Ya estamos entrando en una zona oscura, pero es algo real no feik, a quién carajos le excita ver tentáculos! ok no me juzguen. Les comento esto porque esta es una de las categorías más populares, volviendo al tema son hentais en la cual una chica (casi siempre) tiene relaciones sexuales con algún monstruo con tentáculos, y ya saben lo que pasa con esos tentáculos no? jajaja! bueno ya saben esta categoría la pueden encontrar en nuestro directorio como, <strong>Hentai tentáculos</strong>
          </p>
          <h3>Hentai sin Censura:</h3>
          <p>
            Todos quisiéramos disfrutar hentai sin censura, pero esto es muy difícil dadas las leyes penales de japón que prohíben la publicación de material &quot;moralmente perjudicial&quot;, ¿que quiere decir esto? que las obras audiovisuales no podrán mostrar las partes genitales de los dibujos o personas, es así como vemos cientos de vídeos pixeleados o con franjas de color negro, esto pasa en el Hentai y en películas (Con razón ven hentai en vez de porno real)! de igual modo en HentaiLA nos preocupamos por ti y es por eso que tenemos una sección muy especial llamada <strong>Hentai sin censura!</strong> la encontrarás en nuestro listado o directorio de Hentais!
          </p>
          <h3>Los géneros más populares en el Hentai!</h3>
          <p>
            Claro que todos aman las lolis! pero dadas las estadísticas, los géneros de Hentai más populares son el Yaoi y el Yuri. No creo que tenga explicar el significado de cada uno de estos, si es así te invito a abandonar inmediatamente HentaiLA hombre de poca cultura! es broma! Ok no, vale lo explicaré.
          </p>
          <ul>
            <li><strong>Yaoi</strong>: Morritos del mismo sexo teniendo relaciones!</li>
            <li><strong>Yuri</strong>: Morritas haciendo tijeras, el popular pan con pan! :D!</li>
          </ul>
          <p>Si estoy equivocado me pueden corregir!</p>
        </div>
      </section>
    </>
  );
}
