"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";

export default function MangaReader() {
  const { mangaId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manga, setManga] = useState(null);
  // Remove duplicate state declarations below

  useEffect(() => {
    async function fetchManga() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/mangaverse?mangaId=${mangaId}`);
        const data = await res.json();
        setManga(data.data?.manga || null);
      } catch (err) {
        setError("Failed to load manga.");
      }
      setLoading(false);
    }
    if (mangaId) fetchManga();
  }, [mangaId]);
  const router = useRouter();
    if (loading) return <div className="p-8 text-center">Loading manga...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!manga) return <div className="p-8 text-center">No manga found.</div>;

    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">{manga.title}</h1>
        <img src={manga.cover} alt={manga.title} className="w-48 h-72 object-cover rounded mb-4" />
        <p className="mb-4 text-gray-700">{manga.synopsis || manga.description}</p>
        <div>
          <h2 className="text-xl font-semibold mb-2">Chapters</h2>
          <ul className="space-y-2">
            {(manga.chapters || []).map(ch => (
              <li key={ch._id || ch.id} className="border p-2 rounded hover:bg-gray-100">
                <a href={ch.url || `#`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {ch.name || ch.title || `Chapter ${ch.number}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

  // Get source from query string
  const [source, setSource] = useState("MangaDex");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSource(params.get("source") || "MangaDex");
    }
  }, []);
  const [images, setImages] = useState([]);
  // 'loading' and 'error' already declared above, remove these duplicates
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [mangaInfo, setMangaInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReaderSettingsOpen, setIsReaderSettingsOpen] = useState(false);
  const [readingMode, setReadingMode] = useState("vertical"); // vertical, horizontal, webtoon
  const [chapterLanguage, setChapterLanguage] = useState('en'); // 'en' or 'all'
  const [imageZoom, setImageZoom] = useState(100); // Image zoom percentage
  const [isMangaInfoOpen, setIsMangaInfoOpen] = useState(true); // Toggle manga info panel
  const [theme, setTheme] = useState("dark"); // dark, light, sepia
  const [isTranslating, setIsTranslating] = useState(false); // Translation loading state
  const [translatedDescription, setTranslatedDescription] = useState(""); // Translated manga description
  const [translationTarget, setTranslationTarget] = useState("en"); // Target language for translation
  const [showTranslationOptions, setShowTranslationOptions] = useState(false); // Show language options
  const [isFavorite, setIsFavorite] = useState(false); // Favorite state
  const pageRef = useRef(null);

  // Add to favorites
  function addFavorite() {
    if (!mangaInfo) return;
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!favs.find(m => m.id === mangaInfo.id)) {
      favs.push({
        id: mangaInfo.id,
        title: mangaInfo.attributes?.title?.en || Object.values(mangaInfo.attributes?.title || {})[0] || "Untitled",
        description: mangaInfo.attributes?.description?.en || "",
        thumbnail: mangaInfo.relationships?.find(r => r.type === "cover_art")?.attributes?.fileName
          ? `https://uploads.mangadex.org/covers/${mangaInfo.id}/${mangaInfo.relationships.find(r => r.type === "cover_art").attributes.fileName}`
          : "/public/next.svg",
        source: "MangaDex",
        genres: (mangaInfo.attributes?.tags || []).map(tag => tag.attributes?.name?.en).filter(Boolean)
      });
      localStorage.setItem("favorites", JSON.stringify(favs));
      setIsFavorite(true);
      alert("Added to library!");
    }
  }

  // Check if already favorite
  useEffect(() => {
    if (!mangaInfo) return;
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(!!favs.find(m => m.id === mangaInfo.id));
  }, [mangaInfo]);

  // Fetch manga info
  useEffect(() => {
    async function fetchMangaInfo() {
      try {
        let data;
        if (source === "MangaDex") {
          const url = `https://api.mangadex.org/manga/${mangaId}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`MangaDex API responded with status ${res.status}: ${res.statusText}`);
          data = await res.json();
          if (!data.data) throw new Error("No manga data returned from MangaDex API.");
          setMangaInfo(data.data);
          if (data.data?.attributes?.title?.en) {
            document.title = `${data.data.attributes.title.en} | MyMangaLibrary`;
          }
        } else if (source === "Jikan") {
          const url = `https://api.jikan.moe/v4/manga/${mangaId}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Jikan API responded with status ${res.status}: ${res.statusText}`);
          data = await res.json();
          if (!data.data) throw new Error("No manga data returned from Jikan API.");
          setMangaInfo(data.data);
          if (data.data?.title) {
            document.title = `${data.data.title} | MyMangaLibrary`;
          }
        } else if (source === "AniList") {
          const query = {
            query: `query { Media(id: ${mangaId}, type: MANGA) { id title { romaji english native } description coverImage { large } genres } }`
          };
          const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
          });
          if (!res.ok) throw new Error(`AniList API responded with status ${res.status}: ${res.statusText}`);
          data = await res.json();
          if (!data.data?.Media) throw new Error("No manga data returned from AniList API.");
          setMangaInfo(data.data.Media);
          if (data.data.Media?.title?.english || data.data.Media?.title?.romaji) {
            document.title = `${data.data.Media.title.english || data.data.Media.title.romaji} | MyMangaLibrary`;
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load manga info. Please check your internet connection or try again later.");
        console.error("Error fetching manga info:", err);
      }
    }
    if (source) fetchMangaInfo();
  }, [mangaId, source]);

  // Fetch chapters only for MangaDex
  useEffect(() => {
    if (source !== "MangaDex") {
      setChapters([]);
      setSelectedChapter(null);
      return;
    }
    async function fetchChapters() {
      try {
        const res = await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}&order[chapter]=asc&limit=100`);
        const data = await res.json();
        // Filter chapters by language
        let filteredChapters = [];
        if (chapterLanguage === 'en') {
          filteredChapters = (data.data || []).filter(ch => ch.attributes.translatedLanguage === 'en');
        } else {
          filteredChapters = data.data || [];
        }
        // Unique chapters by chapter number
        const uniqueChapters = [];
        const seenChapters = new Set();
        for (const ch of filteredChapters) {
          const chNum = ch.attributes.chapter;
          if (chNum && !seenChapters.has(chNum)) {
            uniqueChapters.push(ch);
            seenChapters.add(chNum);
          }
        }
        setChapters(uniqueChapters);
        if (uniqueChapters.length > 0) {
          setSelectedChapter(uniqueChapters[0].id);
        }
      } catch {
        setChapters([]);
      }
    }
    fetchChapters();
  }, [mangaId, chapterLanguage, source]);

  // Fetch images for selected chapter (MangaDex only)
  useEffect(() => {
    if (source !== "MangaDex" || !selectedChapter) return;
    async function fetchImages() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://api.mangadex.org/at-home/server/${selectedChapter}`);
        const data = await res.json();
        if (data.chapter && data.chapter.data) {
          const baseUrl = data.baseUrl;
          const hash = data.chapter.hash;
          const imageUrls = data.chapter.data.map(filename => `${baseUrl}/data/${hash}/${filename}`);
          setImages(imageUrls);
          setCurrentPage(0); // Reset to first page when changing chapters
        } else {
          setError("No images found.");
        }
      } catch (err) {
        setError("Failed to load images.");
        console.error("Error fetching images:", err);
      }
      setLoading(false);
    }
    fetchImages();
  }, [selectedChapter]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (readingMode === "horizontal") {
        if (e.key === "ArrowRight" || e.key === "d") {
          nextPage();
        } else if (e.key === "ArrowLeft" || e.key === "a") {
          prevPage();
        }
      }
      
      // Handle chapter navigation with keyboard
      if (e.key === "," && chapters.length > 0) {
        prevChapter();
      } else if (e.key === "." && chapters.length > 0) {
        nextChapter();
      }
      
      // Toggle fullscreen with F key
      if (e.key === "f") {
        toggleFullscreen();
      }
      
      // Zoom controls
      if (e.key === "z") {
        setImageZoom(Math.min(200, imageZoom + 10));
      } else if (e.key === "x") {
        setImageZoom(Math.max(50, imageZoom - 10));
      } else if (e.key === "r") {
        setImageZoom(100);
      }
      
      // Toggle manga info
      if (e.key === "i") {
        setIsMangaInfoOpen(!isMangaInfoOpen);
      }
    }
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, images.length, readingMode, chapters, selectedChapter, imageZoom, isMangaInfoOpen]);

  // Navigation functions
  const nextPage = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    } else {
      nextChapter();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    } else {
      prevChapter();
    }
  };

  const nextChapter = () => {
    const currentIndex = chapters.findIndex(ch => ch.id === selectedChapter);
    if (currentIndex < chapters.length - 1) {
      setSelectedChapter(chapters[currentIndex + 1].id);
      // Scroll to top after changing chapter
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const prevChapter = () => {
    const currentIndex = chapters.findIndex(ch => ch.id === selectedChapter);
    if (currentIndex > 0) {
      setSelectedChapter(chapters[currentIndex - 1].id);
    }
  };

  const scrollToTop = () => {
    if (pageRef.current && readingMode !== "vertical") {
      pageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Translation function for manga description
  const translateDescription = async (targetLang) => {
    if (!mangaInfo?.attributes?.description?.en) return;
    
    setIsTranslating(true);
    setTranslationTarget(targetLang);
    
    try {
      // Check if we already have a translation for this language
      if (translatedDescription && translationTarget === targetLang) {
        setIsTranslating(false);
        return;
      }
      
      // Call the translation API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: mangaInfo.attributes.description.en,
          targetLang: targetLang,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Translation error:', data.error);
        alert('Translation failed: ' + data.error);
        setTranslatedDescription("");
      } else {
        setTranslatedDescription(data.translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate. Please try again later.');
      setTranslatedDescription("");
    } finally {
      setIsTranslating(false);
    }
  };

  // Find chapter details
  const currentChapterDetails = chapters.find(ch => ch.id === selectedChapter)?.attributes || {};
  const chapterTitle = currentChapterDetails.title
    ? `${currentChapterDetails.title}`
    : `Chapter ${currentChapterDetails.chapter || "?"}`;

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === "light" ? "bg-gray-100 text-gray-900" : 
      theme === "sepia" ? "bg-amber-100 text-amber-900" : 
      "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100"
    } ${isFullscreen ? 'pt-0' : 'pt-4'}`}>
      {/* Navbar - Hidden in fullscreen mode */}
      {!isFullscreen && <Navbar />}
      {/* Reader Header - Hidden in fullscreen mode */}
      {!isFullscreen && (
        <header className={`w-full max-w-7xl mx-auto px-4 mb-4 ${
          theme === "light" ? "bg-white shadow-sm rounded-lg" : 
          theme === "sepia" ? "bg-amber-50 shadow-sm rounded-lg" : 
          ""
        } p-4`}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Link href="/browse" className={`p-2 rounded-full ${
                theme === "light" ? "bg-gray-200 hover:bg-indigo-600 hover:text-white text-gray-800" : 
                theme === "sepia" ? "bg-amber-200 hover:bg-amber-600 hover:text-white text-amber-800" : 
                "bg-gray-900 hover:bg-indigo-600 text-white"
              } transition-colors shadow-md`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              {mangaInfo && (
                <h1 className={`text-xl font-bold ${
                  theme === "light" ? "text-gray-900" : 
                  theme === "sepia" ? "text-amber-900" : 
                  "text-white"
                } truncate drop-shadow-md`}>
                  {mangaInfo.attributes?.title?.en || Object.values(mangaInfo.attributes?.title || {})[0] || "Untitled"}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Chapter Navigation */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevChapter}
                  disabled={chapters.findIndex(ch => ch.id === selectedChapter) <= 0}
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-gray-200 hover:bg-indigo-600 hover:text-white text-gray-800" : 
                    theme === "sepia" ? "bg-amber-200 hover:bg-amber-600 hover:text-white text-amber-800" : 
                    "bg-gray-900 hover:bg-indigo-600 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <select
                  className={`${
                    theme === "light" ? "bg-white text-gray-900 border-gray-300" : 
                    theme === "sepia" ? "bg-amber-50 text-amber-900 border-amber-300" : 
                    "bg-gray-900 text-white border-gray-800"
                  } px-2 py-2 rounded-lg border text-sm min-w-[150px] md:min-w-[200px] shadow-md`}
                  value={selectedChapter || ""}
                  onChange={e => setSelectedChapter(e.target.value)}
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      Ch. {ch.attributes.chapter || "?"} {ch.attributes.title ? `- ${ch.attributes.title}` : ""} [{ch.attributes.translatedLanguage}]
                    </option>
                  ))}
                </select>
                <button 
                  onClick={nextChapter}
                  disabled={chapters.findIndex(ch => ch.id === selectedChapter) >= chapters.length - 1}
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-gray-200 hover:bg-indigo-600 hover:text-white text-gray-800" : 
                    theme === "sepia" ? "bg-amber-200 hover:bg-amber-600 hover:text-white text-amber-800" : 
                    "bg-gray-900 hover:bg-indigo-600 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Reader Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMangaInfoOpen(!isMangaInfoOpen)}
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-gray-200 hover:bg-indigo-600 hover:text-white text-gray-800" : 
                    theme === "sepia" ? "bg-amber-200 hover:bg-amber-600 hover:text-white text-amber-800" : 
                    "bg-gray-900 hover:bg-indigo-600 text-white"
                  } transition-colors shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsReaderSettingsOpen(!isReaderSettingsOpen)}
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-gray-200 hover:bg-indigo-600 hover:text-white text-gray-800" : 
                    theme === "sepia" ? "bg-amber-200 hover:bg-amber-600 hover:text-white text-amber-800" : 
                    "bg-gray-900 hover:bg-indigo-600 text-white"
                  } transition-colors shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-gray-200 hover:bg-indigo-600 hover:text-white text-gray-800" : 
                    theme === "sepia" ? "bg-amber-200 hover:bg-amber-600 hover:text-white text-amber-800" : 
                    "bg-gray-900 hover:bg-indigo-600 text-white"
                  } transition-colors shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Reader Settings Panel */}
          {isReaderSettingsOpen && (
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-indigo-600 shadow-lg">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Reading Mode</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setReadingMode("vertical")} 
                      className={`px-3 py-1.5 rounded-md text-sm ${readingMode === "vertical" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      Vertical
                    </button>
                    <button 
                      onClick={() => setReadingMode("horizontal")} 
                      className={`px-3 py-1.5 rounded-md text-sm ${readingMode === "horizontal" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      Page-by-Page
                    </button>
                    <button 
                      onClick={() => setReadingMode("webtoon")} 
                      className={`px-3 py-1.5 rounded-md text-sm ${readingMode === "webtoon" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      Webtoon
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Image Zoom ({imageZoom}%)</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setImageZoom(Math.max(50, imageZoom - 10))}
                      className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md text-sm shadow-md"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={imageZoom}
                      onChange={(e) => setImageZoom(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <button 
                      onClick={() => setImageZoom(Math.min(200, imageZoom + 10))}
                      className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md text-sm shadow-md"
                    >
                      +
                    </button>
                    <button
                      onClick={() => setImageZoom(100)}
                      className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-md text-sm shadow-md"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Theme</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTheme("dark")} 
                      className={`px-3 py-1.5 rounded-md text-sm ${theme === "dark" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      Dark
                    </button>
                    <button 
                      onClick={() => setTheme("light")} 
                      className={`px-3 py-1.5 rounded-md text-sm ${theme === "light" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      Light
                    </button>
                    <button 
                      onClick={() => setTheme("sepia")} 
                      className={`px-3 py-1.5 rounded-md text-sm ${theme === "sepia" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      Sepia
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Display Options</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsMangaInfoOpen(!isMangaInfoOpen)} 
                      className={`px-3 py-1.5 rounded-md text-sm ${isMangaInfoOpen ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"} shadow-md`}
                    >
                      {isMangaInfoOpen ? "Hide Manga Info" : "Show Manga Info"}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Keyboard Shortcuts</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <div>← / A: Previous page</div>
                    <div>→ / D: Next page</div>
                    <div>, (comma): Previous chapter</div>
                    <div>. (period): Next chapter</div>
                    <div>F: Toggle fullscreen</div>
                    <div>Z: Zoom in</div>
                    <div>X: Zoom out</div>
                    <div>R: Reset zoom</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Manga Info */}
          {mangaInfo && isMangaInfoOpen && (
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-indigo-600 shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  {mangaInfo.attributes?.title?.en || Object.values(mangaInfo.attributes?.title || {})[0] || "Untitled"}
                </h2>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={addFavorite}
                    disabled={isFavorite}
                    className={`p-2 rounded-full ${isFavorite ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-red-500"} transition-colors`}
                  >
                    {isFavorite ? "Favorited" : "Add to Library"}
                  </button>
                  <button 
                    onClick={() => setIsMangaInfoOpen(false)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Cover Image */}
                <div className="md:w-1/4 lg:w-1/5">
                  {mangaInfo.relationships?.find(r => r.type === "cover_art")?.attributes?.fileName && (
                    <img 
                      src={`https://uploads.mangadex.org/covers/${mangaId}/${mangaInfo.relationships.find(r => r.type === "cover_art").attributes.fileName}`}
                      alt={mangaInfo.attributes?.title?.en || "Manga Cover"}
                      className="w-full h-auto rounded-lg shadow-lg object-cover border border-indigo-600 hover:transform hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                {/* Info */}
                <div className="md:w-3/4 lg:w-4/5">
                  {/* Status and Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-indigo-700/70 text-white px-2 py-0.5 rounded text-xs shadow-md">
                        {mangaInfo.attributes?.status || "Ongoing"}
                      </span>
                      {mangaInfo.attributes?.year && (
                        <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs shadow-md">
                          {mangaInfo.attributes.year}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★</span>
                      <span className="text-gray-500">★</span>
                      <span className="text-gray-400 text-sm ml-1">4.0</span>
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mangaInfo.attributes?.tags?.map(tag => (
                      <span key={tag.id} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs shadow-md hover:bg-indigo-700 hover:text-white transition-colors cursor-pointer">
                        {tag.attributes.name.en}
                      </span>
                    )).slice(0, 10)}
                    {mangaInfo.attributes?.tags?.length > 10 && (
                      <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs shadow-md">
                        +{mangaInfo.attributes.tags.length - 10} more
                      </span>
                    )}
                  </div>
                  {/* Description */}
                  <div className="mb-2 relative">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-semibold ${
                        theme === "light" ? "text-gray-700" : 
                        theme === "sepia" ? "text-amber-800" : 
                        "text-gray-300"
                      }`}>Description</h4>
                      {/* Translation Button - always visible */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowTranslationOptions(!showTranslationOptions)}
                          className={`px-2 py-1 text-xs rounded ${
                            theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : 
                            theme === "sepia" ? "bg-amber-200 hover:bg-amber-300 text-amber-800" : 
                            "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          } flex items-center gap-1`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          Translate
                        </button>
                        {/* Language Selection Dropdown */}
                        {showTranslationOptions && (
                          <div className={`absolute right-0 top-full mt-1 w-32 rounded-md shadow-lg z-10 ${
                            theme === "light" ? "bg-white border border-gray-200" : 
                            theme === "sepia" ? "bg-amber-50 border border-amber-200" : 
                            "bg-gray-900 border border-gray-700"
                          }`}>
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  translateDescription('es');
                                  setShowTranslationOptions(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-xs ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-100" : 
                                  theme === "sepia" ? "text-amber-800 hover:bg-amber-100" : 
                                  "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                Spanish
                              </button>
                              <button
                                onClick={() => {
                                  translateDescription('fr');
                                  setShowTranslationOptions(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-xs ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-100" : 
                                  theme === "sepia" ? "text-amber-800 hover:bg-amber-100" : 
                                  "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                French
                              </button>
                              <button
                                onClick={() => {
                                  translateDescription('de');
                                  setShowTranslationOptions(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-xs ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-100" : 
                                  theme === "sepia" ? "text-amber-800 hover:bg-amber-100" : 
                                  "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                German
                              </button>
                              <button
                                onClick={() => {
                                  translateDescription('ja');
                                  setShowTranslationOptions(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-xs ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-100" : 
                                  theme === "sepia" ? "text-amber-800 hover:bg-amber-100" : 
                                  "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                Japanese
                              </button>
                              <button
                                onClick={() => {
                                  translateDescription('zh');
                                  setShowTranslationOptions(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-xs ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-100" : 
                                  theme === "sepia" ? "text-amber-800 hover:bg-amber-100" : 
                                  "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                Chinese
                              </button>
                              <button
                                onClick={() => {
                                  setTranslatedDescription("");
                                  setTranslationTarget("en");
                                  setShowTranslationOptions(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-xs ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-100" : 
                                  theme === "sepia" ? "text-amber-800 hover:bg-amber-100" : 
                                  "text-gray-300 hover:bg-gray-800"
                                }`}
                              >
                                Original (English)
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Display description or translation */}
                    {isTranslating ? (
                      <div className="flex items-center space-x-2 text-xs">
                        <div className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${
                          theme === "light" ? "border-indigo-600" : 
                          theme === "sepia" ? "border-amber-700" : 
                          "border-indigo-500"
                        }`}></div>
                        <span className={`${
                          theme === "light" ? "text-gray-600" : 
                          theme === "sepia" ? "text-amber-700" : 
                          "text-gray-400"
                        }`}>
                          Translating...
                        </span>
                      </div>
                    ) : (
                      <div>
                        {translatedDescription && translationTarget !== "en" ? (
                          <div>
                            <p className={`text-xs ${
                              theme === "light" ? "text-gray-600" : 
                              theme === "sepia" ? "text-amber-700" : 
                              "text-gray-400"
                            } line-clamp-3 hover:line-clamp-none cursor-pointer transition-all`}>
                              {translatedDescription}
                            </p>
                            <p className="text-xs text-indigo-400 mt-1">
                              Translated to {
                                translationTarget === 'es' ? 'Spanish' :
                                translationTarget === 'fr' ? 'French' :
                                translationTarget === 'de' ? 'German' :
                                translationTarget === 'ja' ? 'Japanese' :
                                translationTarget === 'zh' ? 'Chinese' : 'Unknown'
                              }
                            </p>
                          </div>
                        ) : (
                          <p className={`text-xs ${
                            theme === "light" ? "text-gray-600" : 
                            theme === "sepia" ? "text-amber-700" : 
                            "text-gray-400"
                          } line-clamp-3 hover:line-clamp-none cursor-pointer transition-all`}>
                            {mangaInfo?.attributes?.description?.en || "No description available."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Author and Publication Info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <div>
                      <span className="text-gray-500">Author:</span> {mangaInfo.relationships?.find(r => r.type === "author")?.attributes?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="text-gray-500">Artist:</span> {mangaInfo.relationships?.find(r => r.type === "artist")?.attributes?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="text-gray-500">Publication:</span> {mangaInfo.attributes?.publicationDemographic || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Chapter Language Filter */}
          <div className="mb-4 flex gap-2 items-center justify-center">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
                chapterLanguage === 'en' 
                  ? (theme === "light" 
                      ? 'bg-indigo-600 text-white' 
                      : theme === "sepia" 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-indigo-600 text-white'
                    )
                  : (theme === "light" 
                      ? 'bg-gray-200 text-gray-800' 
                      : theme === "sepia" 
                        ? 'bg-amber-200 text-amber-800' 
                        : 'bg-gray-800 text-gray-300'
                    )
              }`}
              onClick={() => setChapterLanguage('en')}
            >
              English Only
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
                chapterLanguage === 'all' 
                  ? (theme === "light" 
                      ? 'bg-indigo-600 text-white' 
                      : theme === "sepia" 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-indigo-600 text-white'
                    )
                  : (theme === "light" 
                      ? 'bg-gray-200 text-gray-800' 
                      : theme === "sepia" 
                        ? 'bg-amber-200 text-amber-800' 
                        : 'bg-gray-800 text-gray-300'
                    )
              }`}
              onClick={() => setChapterLanguage('all')}
            >
              All Languages
            </button>
          </div>
          {/* Chapter Title */}
          <div className={`${
            theme === "light" ? "bg-white" : 
            theme === "sepia" ? "bg-amber-50" : 
            "bg-gray-900"
          } rounded-lg p-4 mb-6 border ${
            theme === "light" ? "border-gray-300" : 
            theme === "sepia" ? "border-amber-300" : 
            "border-indigo-600"
          } shadow-lg`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-bold ${
                theme === "light" ? "text-gray-900" : 
                theme === "sepia" ? "text-amber-900" : 
                "text-white"
              } drop-shadow-md`}>
                {chapterTitle}
              </h2>
              {readingMode === "horizontal" && (
                <span className={`text-sm ${
                  theme === "light" ? "text-gray-600" : 
                  theme === "sepia" ? "text-amber-700" : 
                  "text-gray-400"
                }`}>
                  Page {currentPage + 1} of {images.length}
                </span>
              )}
            </div>
          </div>
        </header>
      )}
      {/* Reader Content */}
      <main className="w-full max-w-7xl mx-auto px-4 flex-grow">
        {loading && (
          <div className={`flex flex-col items-center justify-center h-64 ${
            theme === "light" ? "bg-gray-100" : 
            theme === "sepia" ? "bg-amber-50" : 
            "bg-gray-950"
          } rounded-lg`}>
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === "light" ? "border-indigo-600" : 
              theme === "sepia" ? "border-amber-700" : 
              "border-indigo-500"
            } mb-3`}></div>
            <p className={`${
              theme === "light" ? "text-gray-700" : 
              theme === "sepia" ? "text-amber-800" : 
              "text-gray-400"
            }`}>
              Loading chapter...
            </p>
          </div>
        )}
        
        {error && (
          <div className={`${
            theme === "light" ? "bg-red-100 text-red-700" : 
            theme === "sepia" ? "bg-red-100/70 text-red-800" : 
            "bg-red-900/30 text-red-400"
          } text-center p-6 rounded-lg mb-4 flex flex-col items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className={`mt-3 px-4 py-2 rounded ${
                theme === "light" ? "bg-red-600 hover:bg-red-700" : 
                theme === "sepia" ? "bg-red-700 hover:bg-red-800" : 
                "bg-red-800 hover:bg-red-700"
              } text-white font-medium`}
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Horizontal Reading Mode */}
        {readingMode === "horizontal" && images.length > 0 && !loading && (
          <div className={`flex flex-col items-center ${
            theme === "light" ? "bg-gray-100 text-gray-900" : 
            theme === "sepia" ? "bg-amber-50 text-amber-900" : 
            "bg-gray-950 text-gray-100"
          } rounded-lg p-4`}>
            <div ref={pageRef} className="relative w-full max-w-3xl mx-auto">
              <img
                src={images[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className={`rounded-lg shadow-lg border ${
                  theme === "light" ? "border-gray-300 bg-white" : 
                  theme === "sepia" ? "border-amber-300 bg-amber-100" : 
                  "border-gray-800 bg-gray-900"
                } w-full h-auto transition-all duration-200`}
                style={{ transform: `scale(${imageZoom/100})`, transformOrigin: 'top center' }}
              />
              
              {/* Navigation Overlay */}
              <div className="absolute inset-0 flex justify-between items-center">
                <button 
                  onClick={prevPage}
                  className="h-full w-1/2 flex items-center justify-start opacity-0 hover:opacity-100 transition-opacity px-4"
                  aria-label="Previous page"
                >
                  <div className={`${
                    theme === "light" ? "bg-white/80" : 
                    theme === "sepia" ? "bg-amber-100/80" : 
                    "bg-gray-900/80"
                  } p-2 rounded-full`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                      theme === "light" ? "text-gray-900" : 
                      theme === "sepia" ? "text-amber-900" : 
                      "text-white"
                    }`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                <button 
                  onClick={nextPage}
                  className="h-full w-1/2 flex items-center justify-end opacity-0 hover:opacity-100 transition-opacity px-4"
                  aria-label="Next page"
                >
                  <div className={`${
                    theme === "light" ? "bg-white/80" : 
                    theme === "sepia" ? "bg-amber-100/80" : 
                    "bg-gray-900/80"
                  } p-2 rounded-full`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                      theme === "light" ? "text-gray-900" : 
                      theme === "sepia" ? "text-amber-900" : 
                      "text-white"
                    }`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Page Controls */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button 
                onClick={prevPage}
                disabled={currentPage <= 0}
                className={`p-2 rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : 
                  theme === "sepia" ? "bg-amber-200 hover:bg-amber-300 text-amber-800" : 
                  "bg-gray-900 hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className={`${
                theme === "light" ? "text-gray-800" : 
                theme === "sepia" ? "text-amber-800" : 
                "text-gray-400"
              } text-sm`}>
                Page {currentPage + 1} of {images.length}
              </span>
              <button 
                onClick={nextPage}
                disabled={currentPage >= images.length - 1}
                className={`p-2 rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : 
                  theme === "sepia" ? "bg-amber-200 hover:bg-amber-300 text-amber-800" : 
                  "bg-gray-900 hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <button 
                onClick={() => setImageZoom(Math.max(50, imageZoom - 10))}
                className={`p-1 rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : 
                  theme === "sepia" ? "bg-amber-200 hover:bg-amber-300 text-amber-800" : 
                  "bg-gray-900 hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors text-xs`}
              >
                -
              </button>
              <span className={`${
                theme === "light" ? "text-gray-800" : 
                theme === "sepia" ? "text-amber-800" : 
                "text-gray-400"
              } text-xs`}>
                {imageZoom}%
              </span>
              <button 
                onClick={() => setImageZoom(Math.min(200, imageZoom + 10))}
                className={`p-1 rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : 
                  theme === "sepia" ? "bg-amber-200 hover:bg-amber-300 text-amber-800" : 
                  "bg-gray-900 hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors text-xs`}
              >
                +
              </button>
              <button 
                onClick={() => setImageZoom(100)}
                className={`px-2 py-1 text-xs rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : 
                  theme === "sepia" ? "bg-amber-200 hover:bg-amber-300 text-amber-800" : 
                  "bg-gray-900 hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors`}
              >
                Reset
              </button>
            </div>
          </div>
        )}
        
        {/* Vertical Reading Mode */}
        {readingMode === "vertical" && images.length > 0 && !loading && (
          <div className={`flex flex-col gap-4 ${
            theme === "light" ? "bg-gray-100 text-gray-900" : 
            theme === "sepia" ? "bg-amber-50 text-amber-900" : 
            "bg-gray-950 text-gray-100"
          } rounded-lg p-4`}>
            {images.map((url, idx) => (
              <div key={idx} className="w-full flex justify-center">
                <img
                  src={url}
                  alt={`Page ${idx + 1}`}
                  className={`rounded-lg shadow-lg border ${
                    theme === "light" ? "border-gray-300 bg-white" : 
                    theme === "sepia" ? "border-amber-300 bg-amber-100" : 
                    "border-gray-800 bg-gray-900"
                  } w-full max-w-3xl object-contain transition-all duration-200`}
                  style={{ transform: `scale(${imageZoom/100})`, transformOrigin: 'top center' }}
                />
              </div>
            ))}
            {/* Next Chapter Button moved to the right */}
            <div className="flex flex-row justify-end w-full">
              <button
                onClick={nextChapter}
                disabled={chapters.findIndex(ch => ch.id === selectedChapter) >= chapters.length - 1}
                className={`mt-6 px-6 py-2 rounded-lg text-sm font-semibold shadow-md ${
                  theme === "light" ? "bg-indigo-600 text-white hover:bg-indigo-700" : 
                  theme === "sepia" ? "bg-amber-600 text-white hover:bg-amber-700" : 
                  "bg-indigo-700 text-white hover:bg-indigo-800"
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                Next Chapter
              </button>
            </div>
          </div>
        )}
        
        {/* Webtoon Reading Mode */}
        {readingMode === "webtoon" && images.length > 0 && !loading && (
          <div className={`flex flex-col items-center ${
            theme === "light" ? "bg-gray-100 text-gray-900" : 
            theme === "sepia" ? "bg-amber-50 text-amber-900" : 
            "bg-gray-950 text-gray-100"
          } rounded-lg p-0`}>
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Page ${idx + 1}`}
                className="w-full max-w-3xl object-contain"
                style={{ marginBottom: 0 }}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Floating Controls - Visible in fullscreen */}
      {isFullscreen && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
          theme === "light" ? "bg-white/90 border-gray-300" : 
          theme === "sepia" ? "bg-amber-100/90 border-amber-300" : 
          "bg-gray-900/90 border-gray-800"
        } rounded-full px-4 py-2 border flex items-center gap-2 z-50`}>
          {readingMode === "horizontal" && (
            <>
              <button 
                onClick={prevPage}
                disabled={currentPage <= 0}
                className={`p-2 rounded-full ${
                  theme === "light" ? "hover:bg-gray-200 text-gray-800" : 
                  theme === "sepia" ? "hover:bg-amber-200 text-amber-800" : 
                  "hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className={`${
                theme === "light" ? "text-gray-800" : 
                theme === "sepia" ? "text-amber-800" : 
                "text-white"
              } text-sm`}>
                {currentPage + 1}/{images.length}
              </span>
              <button 
                onClick={nextPage}
                disabled={currentPage >= images.length - 1}
                className={`p-2 rounded-full ${
                  theme === "light" ? "hover:bg-gray-200 text-gray-800" : 
                  theme === "sepia" ? "hover:bg-amber-200 text-amber-800" : 
                  "hover:bg-gray-800 text-white"
                } disabled:opacity-50 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="h-5 border-r border-gray-400 mx-1"></div>
            </>
          )}
          
          {/* Zoom Controls */}
          <button 
            onClick={() => setImageZoom(Math.max(50, imageZoom - 10))}
            className={`p-2 rounded-full ${
              theme === "light" ? "hover:bg-gray-200 text-gray-800" : 
              theme === "sepia" ? "hover:bg-amber-200 text-amber-800" : 
              "hover:bg-gray-800 text-white"
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className={`text-sm ${
            theme === "light" ? "text-gray-800" : 
            theme === "sepia" ? "text-amber-800" : 
            "text-white"
          }`}>
            {imageZoom}%
          </span>
          
          <button 
            onClick={() => setImageZoom(Math.min(200, imageZoom + 10))}
            className={`p-2 rounded-full ${
              theme === "light" ? "hover:bg-gray-200 text-gray-800" : 
              theme === "sepia" ? "hover:bg-amber-200 text-amber-800" : 
              "hover:bg-gray-800 text-white"
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="h-5 border-r border-gray-400 mx-1"></div>
          
          <button 
            onClick={toggleFullscreen}
            className={`p-2 rounded-full ${
              theme === "light" ? "hover:bg-gray-200 text-gray-800" : 
              theme === "sepia" ? "hover:bg-amber-200 text-amber-800" : 
              "hover:bg-gray-800 text-white"
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => setIsReaderSettingsOpen(!isReaderSettingsOpen)}
            className={`p-2 rounded-full ${
              theme === "light" ? "hover:bg-gray-200 text-gray-800" : 
              theme === "sepia" ? "hover:bg-amber-200 text-amber-800" : 
              "hover:bg-gray-800 text-white"
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {/* Show error message if any */}
      {error && (
        <div className="p-6 text-center text-red-400">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      {/* Show message for Jikan/AniList manga */}
      {source !== "MangaDex" && !error && (
        <div className="p-6 text-center text-gray-400">
          <h2 className="text-lg font-bold mb-2">Reader not available for this source</h2>
          <p>Chapters and images are only available for MangaDex manga. You can view info for Jikan and AniList manga here.</p>
        </div>
      )}
    </div>
  );
}
