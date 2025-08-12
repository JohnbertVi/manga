// Next.js API route for fetching manga genres from MyAnimeList via RapidAPI

export async function GET() {
  const url = 'https://myanimelist.p.rapidapi.com/v2/manga/genres';
  const headers = {
    'x-rapidapi-host': 'myanimelist.p.rapidapi.com',
    'x-rapidapi-key': '22ca8082d8mshf331df5b90c0554p108234jsn02cb6284000e',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch genres' }), { status: response.status });
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
