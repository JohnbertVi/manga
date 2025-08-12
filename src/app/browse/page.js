"use client";

import Navbar from '../../components/Navbar';


function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 flex flex-col animate-pulse overflow-hidden">
      <div className="w-full h-64 bg-indigo-200" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-indigo-100 rounded w-2/3 mb-2" />
        <div className="h-4 bg-indigo-50 rounded w-full mb-4" />
        <div className="h-10 bg-indigo-100 rounded w-1/2 mt-auto" />
      </div>
    </div>
  );
}

async function fetchManga() {
  try {
    const baseUrl = typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';
    const res = await fetch(`${baseUrl}/api/popular`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch manga');
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}



export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManga()
      .then(result => {
        setMangaList(result.data || []);
        setLoading(false);
      })
      .catch(e => {
        setError("Error loading manga.");
        setLoading(false);
      });
  }, []);

  // Filter manga by search
  const filteredManga = mangaList.filter(manga =>
    manga.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-indigo-300 flex flex-col">
      <Navbar />
      {/* Hero Section for Consistency */}
      <section className="w-full py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-400 via-indigo-200 to-white mb-0">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-4 drop-shadow-lg tracking-tight">Discover & Read Manga</h1>
          <p className="text-lg md:text-xl text-indigo-700 mb-6 font-medium">Explore trending, new, and classic manga. Search, filter, and start reading instantly.</p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search manga by title..."
              className="w-full max-w-md px-5 py-3 rounded-xl border-2 border-indigo-300 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full py-8 px-4 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500 font-semibold text-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredManga.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg">No manga found.</div>
            ) : (
              filteredManga.map((manga) => (
                <div
                  key={manga.id || manga._id || manga.slug}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-indigo-100 flex flex-col overflow-hidden group relative animate-fadeIn"
                  style={{ animationDelay: `${Math.random() * 0.5}s` }}
                >
                  <div className="relative w-full h-64 bg-indigo-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={manga.cover || manga.thumbnail || '/next.svg'}
                      alt={manga.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                      style={{ minHeight: '12rem', maxHeight: '16rem' }}
                    />
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-md">{manga.source || 'Manga'}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-indigo-800 mb-2 truncate" title={manga.title}>{manga.title}</h2>
                    {/* Genre badges */}
                    {manga.genres && manga.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {manga.genres.slice(0, 4).map((genre, idx) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium shadow">{genre}</span>
                        ))}
                        {manga.genres.length > 4 && (
                          <span className="bg-indigo-200 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium shadow">+{manga.genres.length - 4}</span>
                        )}
                      </div>
                    )}
                    <p className="text-gray-600 text-base mb-4 line-clamp-3">{manga.description?.slice(0, 120) || 'No description available.'}</p>
                    <Link
                      href={`/read/${manga.id || manga._id || manga.slug}`}
                      className="mt-auto inline-block bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-semibold px-5 py-2 rounded-xl shadow transition-colors text-center text-lg"
                    >
                      Read Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
