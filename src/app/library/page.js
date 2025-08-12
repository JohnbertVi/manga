"use client";
import { useState, useEffect } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Library() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Load favorites from localStorage
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
    setLoading(false);
  }, []);

  function removeFavorite(id) {
    const updated = favorites.filter(m => m.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    // Optional: show a small notification
    alert("Manga removed from library");
  }

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">My Library</h1>
          <p className="text-indigo-200 mb-2 md:text-lg">Your personal collection of favorite manga</p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow py-10 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="text-gray-400 text-xl">Loading your library...</div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-10 text-center">
              <div className="text-red-400 text-5xl mb-4"><FaHeart /></div>
              <h2 className="text-2xl font-bold text-white mb-3">Your Library is Empty</h2>
              <p className="text-gray-400 mb-6 max-w-lg mx-auto">Browse manga and click the heart icon to add titles to your library for easy access.</p>
              <a href="/browse" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors inline-block font-medium">
                Browse Manga
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.map(manga => (
                  <div key={manga.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all group flex flex-col shadow-md relative">
                    <div className="relative">
                      <a href={`/read/${manga.id}`}> 
                        <img src={manga.thumbnail} alt={manga.title} className="h-40 w-full object-cover" />
                      </a>
                      <button 
                        onClick={() => removeFavorite(manga.id)} 
                        className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/70 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <FaHeart size={16} />
                      </button>
                      {manga.source && (
                        <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                          {manga.source}
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-white truncate mb-1">{manga.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-2">{manga.description}</p>
                      <a href={`/read/${manga.id}`} className="mt-auto text-indigo-400 hover:text-indigo-300 text-xs font-semibold">
                        Continue Reading
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your entire library?")) {
                      localStorage.setItem("favorites", "[]");
                      setFavorites([]);
                    }
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-500 transition-colors inline-flex items-center gap-2"
                >
                  <FaTrash size={14} />
                  Clear Library
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
