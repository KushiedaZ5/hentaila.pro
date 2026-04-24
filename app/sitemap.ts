import { supabase } from "@/lib/supabase";
import type { MetadataRoute } from "next";

const BASE_URL = "https://hentaila.pro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamic anime pages
  const { data: animes } = await supabase
    .from("animes")
    .select("slug, fecha_registro")
    .order("id_anime", { ascending: false });

  const animePages: MetadataRoute.Sitemap = (animes || []).map((anime) => ({
    url: `${BASE_URL}/hentai/${anime.slug}`,
    lastModified: anime.fecha_registro
      ? new Date(anime.fecha_registro)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic episode pages
  const { data: episodes } = await supabase
    .from("episodios")
    .select("numero, fecha_estreno, anime:animes(slug)")
    .order("id_episodio", { ascending: false })
    .limit(5000);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const episodePages: MetadataRoute.Sitemap = (episodes || [])
    .filter((ep: any) => {
      const anime = Array.isArray(ep.anime) ? ep.anime[0] : ep.anime;
      return anime?.slug;
    })
    .map((ep: any) => {
      const anime = Array.isArray(ep.anime) ? ep.anime[0] : ep.anime;
      return {
        url: `${BASE_URL}/ver/${anime.slug}-${ep.numero}`,
        lastModified: ep.fecha_estreno
          ? new Date(ep.fecha_estreno)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

  return [...staticPages, ...animePages, ...episodePages];
}
