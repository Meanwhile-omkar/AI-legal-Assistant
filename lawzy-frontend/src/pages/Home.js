import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Send } from 'lucide-react';
import axios from 'axios';

const Home = ({ setAnalysisData }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/analyze', { query });
      setAnalysisData(response.data);
      // Smoothly transition after data is ready
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      alert("Error contacting Lawzy Backend. Ensure FastAPI is running.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <Scale size={48} className="text-lawzy-gold mr-3" />
          <h1 className="text-5xl font-bold tracking-tighter">LAWZY AI</h1>
        </div>
        <p className="text-gray-400">Democratizing Indian Justice through AI</p>
      </motion.div>

      <motion.div 
        layout
        className="w-full max-w-2xl bg-lawzy-slate p-2 rounded-2xl border border-gray-700 shadow-2xl"
      >
        {!loading ? (
          <form onSubmit={handleAnalyze} className="flex items-center">
            <textarea
              className="w-full bg-transparent p-4 focus:outline-none resize-none text-lg"
              placeholder="Describe your legal issue in any language..."
              rows="3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="p-4 bg-lawzy-gold rounded-xl hover:bg-yellow-600 transition-colors ml-2"
            >
              <Send color="black" />
            </button>
          </form>
        ) : (
          <div className="p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-8 h-8 border-4 border-lawzy-gold border-t-transparent rounded-full mb-4"
            />
            <p className="text-lawzy-gold font-medium animate-pulse">Analyzing Statutory Sections...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;