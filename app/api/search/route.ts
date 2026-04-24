import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const { data, error } = await supabase
    .from("animes")
    .select("titulo, slug, url_portada")
    .ilike("titulo", `%${q}%`)
    .order("votes", { ascending: false })
    .limit(8);

  if (error) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }

  return NextResponse.json({ results: data || [] });
}
