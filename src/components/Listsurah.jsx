import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    juz: '',
    revelationType: '',
  
  });
  const [showFilters, setShowFilters] = useState(false);

  const juzToSurah = {
    1: { start: 1, end: 2 }, 2: { start: 2, end: 2 }, 3: { start: 2, end: 3 },
    4: { start: 3, end: 4 }, 5: { start: 4, end: 5 }, 6: { start: 5, end: 6 },
    7: { start: 6, end: 7 }, 8: { start: 7, end: 8 }, 9: { start: 8, end: 9 },
    10: { start: 9, end: 11 }, 11: { start: 11, end: 12 }, 12: { start: 12, end: 14 },
    13: { start: 15, end: 16 }, 14: { start: 17, end: 18 }, 15: { start: 19, end: 21 },
    16: { start: 22, end: 24 }, 17: { start: 25, end: 27 }, 18: { start: 28, end: 29 },
    19: { start: 30, end: 33 }, 20: { start: 34, end: 36 }, 21: { start: 37, end: 39 },
    22: { start: 40, end: 42 }, 23: { start: 43, end: 45 }, 24: { start: 46, end: 48 },
    25: { start: 49, end: 51 }, 26: { start: 52, end: 55 }, 27: { start: 56, end: 59 },
    28: { start: 60, end: 64 }, 29: { start: 65, end: 69 }, 30: { start: 70, end: 114 }
  };

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.quran.com/api/v4/chapters');
        const data = await response.json();
        setSurahs(data.chapters);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = surah.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          surah.translated_name.name.toLowerCase().includes(searchTerm.toLowerCase());

    const juzNumber = Number(filters.juz);
    const matchesJuz = !filters.juz || 
                      (surah.id >= juzToSurah[juzNumber].start &&
                       surah.id <= juzToSurah[juzNumber].end);

    const matchesRevelation = !filters.revelationType ||
                              (filters.revelationType === 'makkah' && surah.revelation_place === 'makkah') ||
                              (filters.revelationType === 'madinah' && surah.revelation_place === 'madinah');

  

    return matchesSearch && matchesJuz && matchesRevelation; 
  });

  const resetFilters = () => {
    setFilters({
      juz: '',
      revelationType: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="mt-2 text-gray-600">Memuat surah...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari surah atau terjemahan..."
            className="w-full p-4 pl-12 text-lg rounded-xl border border-emerald-100 bg-white/50 backdrop-blur-sm 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     shadow-sm transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-5" />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
          </button>

          {(Object.values(filters).some(Boolean) || searchTerm) && (
            <button
              onClick={resetFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 underline"
            >
              Reset semua filter
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* 🔧 DIUBAH: grid-cols-3 → grid-cols-2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Juz</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                  value={filters.juz}
                  onChange={(e) => setFilters({...filters, juz: e.target.value})}
                >
                  <option value="">Semua Juz</option>
                  {Array.from({length: 30}, (_, i) => i + 1).map(juz => (
                    <option key={juz} value={juz}>Juz {juz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Turun</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                  value={filters.revelationType}
                  onChange={(e) => setFilters({...filters, revelationType: e.target.value})}
                >
                  <option value="">Semua</option>
                  <option value="makkah">Makkiyah</option>
                  <option value="madinah">Madaniyah</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xl text-gray-500 font-bold">
        Daftar Surah
        {filters.juz && ` (Juz ${filters.juz})`}
        {filters.revelationType && ` (${filters.revelationType === 'makkah' ? 'Makkiyah' : 'Madaniyah'})`}
      </div>

      {filteredSurahs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"> {/* 🔧 DIUBAH */}
          {filteredSurahs.map(surah => (
            <Link
              to={`/surah/${surah.id}`}
              key={surah.id}
              className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-lg 
                       border border-white transition-all duration-200 hover:border-emerald-100
                       hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full 
                                bg-emerald-500/10 text-emerald-600 font-medium">
                    {surah.id}
                  </div>
                  <div>
                    <h3 className="align-text-top font-semibold text-gray-800 group-hover:text-emerald-700">
                      {surah.name_simple}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {surah.translated_name.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                    {surah.verses_count} ayat
                  </p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {surah.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">Tidak ada surah yang ditemukan</div>
          <button
            onClick={resetFilters}
            className="text-emerald-600 hover:text-emerald-700 underline text-sm"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SurahList;
