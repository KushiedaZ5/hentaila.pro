import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually
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

// Get all animes (just id, titulo, slug)
const { data: animes, error } = await supabase
  .from("animes")
  .select("id_anime, titulo, slug")
  .order("titulo");

console.log("=== ALL ANIMES ===");
console.log("Error:", error);
console.log("Total:", animes?.length);
animes?.forEach(a => console.log(`  [${a.id_anime}] ${a.titulo} (${a.slug})`));
