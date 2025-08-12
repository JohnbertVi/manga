// Next.js API route to fetch manga from Mangaverse RapidAPI
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const genres = searchParams.get('genres') || 'Harem,Fantasy';
  const nsfw = searchParams.get('nsfw') || 'true';
  const type = searchParams.get('type') || 'all';
  const url = `https://mangaverse-api.p.rapidapi.com/manga/fetch?page=${page}&genres=${encodeURIComponent(genres)}&nsfw=${nsfw}&type=${type}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'mangaverse-api.p.rapidapi.com',
        'x-rapidapi-key': '22ca8082d8mshf331df5b90c0554p108234jsn02cb6284000e',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mangaverse API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `Mangaverse API responded with status ${response.status}: ${errorText}` }), { status: response.status });
    }
    const data = await response.json();
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
