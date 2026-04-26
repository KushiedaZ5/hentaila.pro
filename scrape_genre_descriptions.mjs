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
// Genre slugs for the Wayback Machine URLs
// Map: genre name → URL slug on hentaila.com
// =============================================
const genreSlugMap = {
  "3D": "3d",
  "Ahegao": "ahegao",
  "Anal": "anal",
  "Bondage": "bondage",
  "Casadas": "casadas",
  "Chikan": "chikan",
  "Ecchi": "ecchi",
  "Elfas": "elfas",
  "Enfermeras": "enfermeras",
  "Escolares": "escolares",
  "Futanari": "futanari",
  "Gal": "gal",
  "Gore": "gore",
  "Hardcore": "hardcore",
  "Harem": "harem",
  "Incesto": "incesto",
  "Juegos Sexuales": "juegos-sexuales",
  "Lolicon": "petit",  // same thing, try petit's page
  "Maids": "maids",
  "Milfs": "milfs",
  "Netorare": "netorare",
  "Ninfomania": "ninfomania",
  "Ninjas": "ninjas",
  "Orgias": "orgias",
  "Oyakodon": "oyakodon",
  "Paizuri": "paizuri",
  "Romance": "romance",
  "Shota": "shota",
  "Softcore": "softcore",
  "Succubus": "succubus",
  "Teacher": "teacher",
  "Tentaculos": "tentaculos",
  "Tetonas": "tetonas",
  "Threesome": "threesome",
  "Vanilla": "vanilla",
  "Violacion": "violacion",
  "Virgenes": "virgenes",
  "Yaoi": "yaoi",
  "Yuri": "yuri",
};

// =============================================
// Scrape each genre page from Wayback Machine
// =============================================
const BASE = "https://web.archive.org/web/20240423054557/https://www4.hentaila.com/genero/";

const results = {};
const genreNames = Object.keys(genreSlugMap);

console.log(`Scraping ${genreNames.length} genre pages from Wayback Machine...\n`);

for (const name of genreNames) {
  const slug = genreSlugMap[name];
  const url = BASE + slug;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!res.ok) {
      console.log(`  ⚠ ${name} (${slug}): HTTP ${res.status} — skipping`);
      results[name] = null;
      continue;
    }

    const html = await res.text();

    // The description is inside <section class="section top"> 
    // specifically in the <p> tag after the <h1> title
    // Pattern: between the breadcrumb section and the follow links
    // In the converted markdown, it appears right after "[Inicio](...)" line
    // and before "- [Síguenos en Twitter]"
    
    // Extract using regex on HTML directly
    // The description is inside: <div class="top-header"> <section class="section-header"> <p>DESCRIPTION</p>
    const descMatch = html.match(/<section class="section-header">\s*<h1[^>]*>[^<]*<\/h1>\s*<p>([^<]+)<\/p>/s);

    if (descMatch && descMatch[1]) {
      const desc = descMatch[1].trim();
      // Filter out fake descriptions like "genre.paizuri" which are just placeholders
      if (desc.startsWith("genre.") || desc.length < 10) {
        console.log(`  ⊘ ${name}: placeholder "${desc}" — skipping`);
        results[name] = null;
      } else {
        console.log(`  ✓ ${name}: "${desc.substring(0, 80)}..."`);
        results[name] = desc;
      }
    } else {
      console.log(`  ⊘ ${name}: no description found — skipping`);
      results[name] = null;
    }

    // Rate limit: wait 1 second between requests
    await new Promise(r => setTimeout(r, 1000));

  } catch (err) {
    console.log(`  ✗ ${name}: ${err.message} — skipping`);
    results[name] = null;
  }
}

// =============================================
// Summary of found descriptions
// =============================================
const found = Object.entries(results).filter(([_, v]) => v !== null);
const empty = Object.entries(results).filter(([_, v]) => v === null);

console.log(`\n========================================`);
console.log(`RESULTS: ${found.length} descriptions found, ${empty.length} empty`);
console.log(`========================================\n`);

if (found.length > 0) {
  console.log("DESCRIPTIONS FOUND:");
  for (const [name, desc] of found) {
    console.log(`  [${name}]: ${desc}`);
  }
}

if (empty.length > 0) {
  console.log("\nNO DESCRIPTION:");
  for (const [name] of empty) {
    console.log(`  - ${name}`);
  }
}

// =============================================
// Add 'descripcion' column and update Supabase
// =============================================
if (found.length > 0) {
  console.log("\n\nUpdating Supabase with descriptions...");
  
  for (const [name, desc] of found) {
    const { error } = await supabase
      .from("generos")
      .update({ descripcion: desc })
      .eq("nombre", name);

    if (error) {
      console.log(`  ⚠ ${name}: ${error.message}`);
      if (error.message.includes("column") || error.message.includes("descripcion")) {
        console.log(`\n  ❌ The 'descripcion' column doesn't exist in the generos table!`);
        console.log(`  You need to add it first in Supabase Dashboard:`);
        console.log(`    ALTER TABLE generos ADD COLUMN descripcion text;`);
        console.log(`\n  Saving descriptions to a JSON file instead...`);
        
        // Save to JSON as fallback
        const { writeFileSync } = await import("fs");
        writeFileSync("genre_descriptions.json", JSON.stringify(results, null, 2));
        console.log(`  ✓ Saved to genre_descriptions.json`);
        break;
      }
    } else {
      console.log(`  ✓ ${name} updated`);
    }
  }
}

console.log("\n✅ Done!");
