// Next.js API route to fetch popular manga from MangaDex

export async function GET(request) {
  // Get page from query params, default to 1
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 300;
  const offset = (page - 1) * limit;
  // MangaDex API: Get latest manga updates (sort by latestUploadedChapter desc)
  const url = `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&order[latestUploadedChapter]=desc`;

  let diagnostics = {};
  try {
    // MangaDex
    const response = await fetch(url);
    diagnostics.mangaDexStatus = response.status;
    diagnostics.mangaDexStatusText = response.statusText;
    let mangaList = [];
    if (response.ok) {
      const data = await response.json();
      diagnostics.mangaDexDataLength = Array.isArray(data.data) ? data.data.length : 0;
      diagnostics.mangaDexRaw = data;
      async function getCoverUrl(manga) {
        const coverRel = manga.relationships?.find(r => r.type === "cover_art");
        const coverId = coverRel?.id;
        const mangaId = manga.id;
        if (coverId && mangaId) {
          // Fetch cover details from cover endpoint
          try {
            const coverRes = await fetch(`https://api.mangadex.org/cover/${coverId}`);
            if (coverRes.ok) {
              const coverData = await coverRes.json();
              const fileName = coverData.data?.attributes?.fileName;
              if (fileName) {
                return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
              }
            }
          } catch {}
        }
        return "/1.png";
      }
      // Fetch cover art for each manga (async)
      mangaList = await Promise.all((data.data || []).map(async manga => ({
        id: manga.id,
        title: manga.attributes?.title?.en || Object.values(manga.attributes?.title || {})[0] || "Untitled",
        thumbnail: await getCoverUrl(manga),
        description: manga.attributes?.description?.en || "No description available.",
        source: "MangaDex",
        latestChapter: manga.attributes?.latestUploadedChapter || null
      })));
    } else {
      diagnostics.mangaDexError = `Response not OK: ${response.status} ${response.statusText}`;
    }

  // Jikan API (MyAnimeList) - get 300 manga
  const jikanRes = await fetch('https://api.jikan.moe/v4/manga?limit=300');
    if (jikanRes.ok) {
      const jikanData = await jikanRes.json();
      const jikanList = (jikanData.data || []).map(manga => ({
        id: manga.mal_id,
        title: manga.title_english || manga.title || "Untitled",
        thumbnail: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || "/1.png",
        description: manga.synopsis || "No description available.",
        source: "Jikan"
      }));
      mangaList = mangaList.concat(jikanList);
    }

    // AniList GraphQL - fetch 300 manga
    const anilistQuery = {
      query: `query { Page(perPage: 300) { media(type: MANGA, sort: POPULARITY_DESC, isAdult: false) { id title { romaji english native } description coverImage { large } genres } } }`
    };
    const anilistRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anilistQuery)
    });
    if (anilistRes.ok) {
      const anilistData = await anilistRes.json();
      const mediaList = anilistData.data?.Page?.media;
      if (Array.isArray(mediaList)) {
        const anilistList = mediaList.map(manga => ({
          id: manga.id,
          title: manga.title?.english || manga.title?.romaji || manga.title?.native || "Untitled",
          thumbnail: manga.coverImage?.large || "/1.png",
          description: manga.description || "No description available.",
          source: "AniList"
        }));
        mangaList = mangaList.concat(anilistList);
      }
    }

  // Always return all sources for every page (no slicing)
  return new Response(JSON.stringify({ data: mangaList, page, total: mangaList.length, perPage: limit, diagnostics }), { status: 200 });
  } catch (error) {
    diagnostics.error = error.message;
    return new Response(JSON.stringify({ error: error.message, diagnostics }), { status: 500 });
  }
}
