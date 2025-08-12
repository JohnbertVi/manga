// Next.js API route to fetch manga chapter images from MangaDex

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mangaId = searchParams.get('mangaId');
  if (!mangaId) {
    return new Response(JSON.stringify({ error: 'Missing mangaId' }), { status: 400 });
  }

  // Step 1: Get chapters for the manga
  const chaptersUrl = `https://api.mangadex.org/chapter?manga=${mangaId}&limit=1&translatedLanguage[]=en&order[chapter]=asc`;
  try {
    const chaptersRes = await fetch(chaptersUrl);
    const chaptersData = await chaptersRes.json();
    if (!chaptersData.data || chaptersData.data.length === 0) {
      return new Response(JSON.stringify({ error: 'No chapters found' }), { status: 404 });
    }
    const chapterId = chaptersData.data[0].id;

    // Step 2: Get at-home/server info for the chapter
    const serverUrl = `https://api.mangadex.org/at-home/server/${chapterId}`;
    const serverRes = await fetch(serverUrl);
    const serverData = await serverRes.json();
    const baseUrl = serverData.baseUrl;
    const hash = serverData.chapter.hash;
    const data = serverData.chapter.data;

    // Step 3: Build image URLs
    const imageUrls = data.map(filename => `${baseUrl}/data/${hash}/${filename}`);
    return new Response(JSON.stringify({ imageUrls }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
