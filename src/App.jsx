import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Listsurah from './components/Listsurah';
import Detailsurah from './components/Detailsurah';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-emerald-50 text-gray-800">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-emerald-600 font-extrabold text-xl font-serif">
              Al-Qur'an Digital
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah" element={<Listsurah />} />
            <Route path="/surah/:id" element={<Detailsurah />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t shadow-inner">
          <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Qur'an Digital. Dibuat oleh Wahyu Hidayat.</p>
          <p className="mt-1">Sumber data dari API Quran.com — semoga bermanfaat</p>
          </div>
          
        </footer>
      </div>
    </Router>
  );
}

export default App;
