import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';

const Detailsurah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [surahList, setSurahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const surahId = parseInt(id);
  const previousSurahId = surahId > 1 ? surahId - 1 : null;
  const nextSurahId = surahId < 114 ? surahId + 1 : null;

  const sanitizeTranslation = (text) => {
    if (!text) return '';
    const cleaned = text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
    return DOMPurify.sanitize(cleaned, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      try {
        const surahRes = await fetch(`https://api.quran.com/api/v4/chapters/${id}`);
        const surahListRes = await fetch('https://api.quran.com/api/v4/chapters');
        if (!surahRes.ok || !surahListRes.ok) throw new Error('Gagal memuat data surah');
        const surahData = await surahRes.json();
        const listData = await surahListRes.json();

        const versesRes = await fetch(
          `https://api.quran.com/api/v4/verses/by_chapter/${id}?translations=33&fields=text_uthmani,verse_key&per_page=${surahData.chapter.verses_count}`
        );
        if (!versesRes.ok) throw new Error('Gagal memuat ayat');

        const versesData = await versesRes.json();

        setSurahInfo(surahData.chapter);
        setVerses(versesData.verses);
        setSurahList(listData.chapters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const SurahNavigation = () => (
    <div className="flex justify-between items-center max-w-4xl mx-auto mt-8 px-4">
      {previousSurahId ? (
        <Link
          to={`/surah/${previousSurahId}`}
          className="inline-flex items-center text-sm text-emerald-600 hover:underline"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Surah Sebelumnya
        </Link>
      ) : <div></div>}
      {nextSurahId ? (
        <Link
          to={`/surah/${nextSurahId}`}
          className="inline-flex items-center text-sm text-emerald-600 hover:underline"
        >
          Surah Selanjutnya
          <ChevronRightIcon className="w-4 h-4 ml-1" />
        </Link>
      ) : null}
    </div>
  );

  const SurahGridNavbar = () => (
    <div className="overflow-x-auto bg-white shadow-inner border-y sticky top-[64px] z-10">
      <div className="flex space-x-2 px-4 py-3 min-w-max">
        {surahList.map((surah) => (
          <button
            key={surah.id}
            onClick={() => navigate(`/surah/${surah.id}`)}
            className={`text-sm px-3 py-1 rounded-full border transition ${
              surah.id === surahId
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {surah.name_simple}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-emerald-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Sedang memuat data surah...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center px-6 py-10 bg-white shadow-md rounded-xl">
          <div className="text-red-600 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali ke daftar surah
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 min-h-screen pb-20">
      <header className="sticky top-0 bg-white shadow-md z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Kembali
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">{surahInfo?.name_simple}</h1>
            <div className="flex justify-center gap-2 text-xs text-gray-500 mt-1">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                {surahInfo?.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
              </span>
              <span>•</span>
              <span>{surahInfo?.verses_count} Ayat</span>
            </div>
          </div>
          <div className="w-5"></div>
        </div>
      </header>

      {/* Surah Grid Navbar */}
      <SurahGridNavbar />

      {/* Nama Arab */}
      {surahInfo && (
        <div className="text-center mt-10">
          <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow border border-gray-100">
            <h2 className="text-4xl font-arabic text-emerald-600">{surahInfo.name_arabic}</h2>
          </div>
        </div>
      )}

      {/* Navigasi atas */}
      {surahInfo && <SurahNavigation />}

      <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6">
        {verses.map((verse) => (
          <div
            key={verse.id}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:border-emerald-200 transition"
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="bg-emerald-100 text-emerald-700 w-7 h-7 flex items-center justify-center rounded-full font-semibold">
                  {verse.verse_number}
                </div>
                Ayat {verse.verse_number}
              </div>
              <div className="text-xs font-mono text-gray-400">{verse.verse_key}</div>
            </div>
            <div className="text-3xl font-arabic text-right text-gray-800 leading-relaxed mb-4 tracking-wide">
              {verse.text_uthmani}
            </div>
            <div className="text-base text-gray-600 leading-relaxed bg-emerald-50 p-4 rounded-lg">
              <div className="text-sm text-emerald-600 mb-1 font-medium">Terjemahan:</div>
              <p className="text-justify">
                "{sanitizeTranslation(verse.translations[0]?.text)}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi bawah */}
      {surahInfo && <SurahNavigation />}

      <div className="fixed bottom-6 right-6">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white border border-gray-200 shadow-md px-4 py-2 rounded-full text-emerald-600 hover:text-emerald-700 hover:border-emerald-200 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
      </div>
    </div>
  );
};

export default Detailsurah;
