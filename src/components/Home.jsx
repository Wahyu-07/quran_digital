import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-[60vh] text-center">
      {/* Arabic Calligraphy */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-700 mb-4 arabic-font">
        القرآن الكريم
      </h1>

      {/* Subtitle */}
      <p className="font-semibold text-lg text-gray-600 mb-10 max-w-xl">
        Bacalah dan pahami petunjuk dari Allah SWT melalui Al-Qur’an digital yang mudah diakses.
      </p>

      {/* Baca Quran Button with Icon and Text */}
      <Link
        to="/surah"
        className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-all duration-300"
      >
        <BookOpenIcon className="h-6 w-6" />
        <span className="text-lg font-medium">Baca Quran</span>
      </Link>
    </div>
  );
};

export default Home;
