import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local
const envContent = readFileSync(".env.local", "utf-8");
const envVars = {};
envContent.split("\n").forEach(line => {
  const [key, ...vals] = line.split("=");
  if (key && vals.length) envVars[key.trim()] = vals.join("=").trim();
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// =============================================
// Target: exact genre list from hentaila.com (minus Petit, since Lolicon = Petit)
// =============================================
const targetGenres = [
  "3D",
  "Ahegao",
  "Anal",
  "Bondage",
  "Casadas",
  "Chikan",
  "Ecchi",
  "Elfas",
  "Enfermeras",
  "Escolares",
  "Futanari",
  "Gal",
  "Gore",
  "Hardcore",
  "Harem",
  "Incesto",
  "Juegos Sexuales",
  "Maids",
  "Milfs",
  "Netorare",
  "Ninfomania",
  "Ninjas",
  "Orgias",
  "Oyakodon",
  "Paizuri",
  "Romance",
  "Shota",
  "Softcore",
  "Succubus",
  "Teacher",
  "Tentaculos",
  "Tetonas",
  "Threesome",
  "Vanilla",
  "Violacion",
  "Virgenes",
  "Yaoi",
  "Yuri",
];

// =============================================
// 1. Save current Paizuri anime assignments before cleaning
// =============================================
const { data: currentGenres } = await supabase.from("generos").select("*");
const paizuriGenre = currentGenres?.find(g => g.nombre === "Paizuri");
let paizuriAnimeIds = [];

if (paizuriGenre) {
  const { data: pivotData } = await supabase
    .from("anime_generos")
    .select("id_anime")
    .eq("id_genero", paizuriGenre.id_genero);
  paizuriAnimeIds = (pivotData || []).map(r => r.id_anime);
  console.log(`Saved ${paizuriAnimeIds.length} Paizuri anime assignments`);
}

// =============================================
// 2. Clear pivot table and genres table
// =============================================
console.log("\nClearing anime_generos...");
const { error: clearPivotErr } = await supabase
  .from("anime_generos")
  .delete()
  .gte("id_genero", 0); // delete all rows

if (clearPivotErr) console.log("  ⚠", clearPivotErr.message);
else console.log("  ✓ Cleared");

console.log("Clearing generos...");
const { error: clearGenreErr } = await supabase
  .from("generos")
  .delete()
  .gte("id_genero", 0); // delete all rows

if (clearGenreErr) console.log("  ⚠", clearGenreErr.message);
else console.log("  ✓ Cleared");

// =============================================
// 3. Insert all target genres
// =============================================
console.log(`\nInserting ${targetGenres.length} genres...`);
for (const name of targetGenres) {
  const { error } = await supabase.from("generos").insert({ nombre: name });
  if (error) {
    console.log(`  ⚠ ${name}: ${error.message}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

// =============================================
// 4. Verify and get new IDs
// =============================================
const { data: allGenres } = await supabase
  .from("generos")
  .select("*")
  .order("nombre");

console.log(`\n=== ${allGenres?.length} GENRES INSERTED ===`);
allGenres?.forEach(g => console.log(`  [${g.id_genero}] ${g.nombre}`));

// =============================================
// 5. Re-assign Paizuri to the saved anime IDs
// =============================================
const newPaizuri = allGenres?.find(g => g.nombre === "Paizuri");
if (newPaizuri && paizuriAnimeIds.length > 0) {
  console.log(`\nRe-assigning Paizuri (ID: ${newPaizuri.id_genero}) to ${paizuriAnimeIds.length} animes...`);
  for (const animeId of paizuriAnimeIds) {
    const { error } = await supabase.from("anime_generos").insert({
      id_anime: animeId,
      id_genero: newPaizuri.id_genero,
    });
    if (error) console.log(`  ⚠ anime ${animeId}: ${error.message}`);
    else console.log(`  ✓ anime ${animeId}`);
  }
}

// Final check
const { data: finalPivot } = await supabase
  .from("anime_generos")
  .select("*")
  .eq("id_genero", newPaizuri?.id_genero);
console.log(`\n✅ DONE — ${allGenres?.length} genres total, Paizuri has ${finalPivot?.length} animes`);
