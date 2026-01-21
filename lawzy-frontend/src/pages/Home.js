import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Send, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Gavel, 
  ChevronRight, 
  Paperclip,
  CheckCircle
} from 'lucide-react';
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
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      alert("Error contacting Lawzy Backend. Ensure FastAPI is running.");
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans">
      
      {/* --- FLASHY BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lawzy-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-12"
      >
        
        {/* MULTILINGUAL BADGE */}
        <motion.div 
          variants={itemVars}
          className="flex items-center space-x-2 bg-lawzy-gold/10 border border-lawzy-gold/20 px-4 py-1.5 rounded-full mb-8"
        >
          <Globe size={14} className="text-lawzy-gold animate-spin-slow" />
          <span className="text-xs font-medium text-lawzy-gold tracking-widest uppercase">
            Supports Hindi • English • Bengali • Tamil • & more
          </span>
        </motion.div>

        {/* HERO SECTION */}
        <motion.div variants={itemVars} className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-lawzy-gold rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Scale size={42} className="text-black" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            LAWZY AI
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Democratizing Indian Justice. Instant mapping of <span className="text-white font-semibold">IPC</span> & <span className="text-white font-semibold">BNS</span> statutes in your own language.
          </p>
        </motion.div>

        {/* SEARCH BAR AREA */}
        <motion.div 
          variants={itemVars}
          className="w-full max-w-3xl relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-lawzy-gold to-yellow-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-[#16161a] border border-white/10 p-2 rounded-2xl shadow-2xl">
            {!loading ? (
              <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row items-center">
                <textarea
                  className="w-full bg-transparent p-8 focus:outline-none resize-none text-m text-gray-200 placeholder-gray-600"
                  placeholder={`                                         Ask anything...
'Threatening me over a property dispute' or 'मेरे साथ धोखाधड़ी हुई है'`}
                  rows={2}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!query.trim()}
                  className="w-full md:w-auto m-2 px-8 py-4 bg-lawzy-gold text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Analyze <Send size={18} />
                </button>
              </form>
            ) : (
              <div className="p-16 text-center">
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-16 h-16 border-4 border-lawzy-gold/20 border-t-lawzy-gold rounded-full"
                  />
                  <Gavel className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lawzy-gold animate-bounce" size={24} />
                </div>
                <h3 className="mt-6 text-lawzy-gold font-bold text-xl tracking-tight">Scanning Bharatiya Nyaya Sanhita...</h3>
                <p className="text-gray-500 text-sm mt-2">Connecting your query to relevant penal codes</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* FEATURES GRID (The "Goodies") */}
        <motion.div 
          variants={itemVars}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl"
        >
          <FeatureCard 
            icon={<ShieldCheck className="text-lawzy-gold" />}
            title="IPC & BNS Dual Map"
            desc="Automatic cross-referencing between old Indian Penal Code and New Bharatiya Nyaya Sanhita."
          />
          <FeatureCard 
            icon={<Zap className="text-blue-400" />}
            title="Plain Language"
            desc="No more legal jargon. Get a simplified summary that anyone can understand instantly."
          />
          <FeatureCard
            icon={<CheckCircle className="text-red-400" />}
            title="Legal Signal Checklist"
            desc="Automatically identifies relevant legal signals for your case, marking them True based on the facts you provide. Only necessary signals are populated to keep guidance precise."
          />
          <FeatureCard 
            icon={<Gavel className="text-purple-400" />}
            title="Actionable Steps"
            desc="Guidance on whether to go to the Police, Court, or seek Alternative Dispute Resolution."
          />
          <FeatureCard 
            icon={<Paperclip className="text-green-400" />}
            title="Instant Document Readiness"
            desc="Automatically suggests and generates context-specific legal documents, police complaints, affidavits, or notices, ready to download or print."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-orange-400" />}
            title="Authority Cross-Questioning Prep"
            desc="Prepares you for interactions with police, lawyers, or officials. Helping you stay consistent, confident, and aware of what information to provide."
          />
        </motion.div>

        {/* FOOTER MINI-TEXT */}
        <motion.p variants={itemVars} className="mt-16 text-gray-600 text-xs uppercase tracking-[0.2em]">
          Developed by TopGooners • Made for India
        </motion.p>

      </motion.div>
    </div>
  );
};

// Helper Component for Feature Cards
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.06] transition-colors group">
    <div className="mb-4 p-3 bg-white/5 inline-block rounded-lg group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-white font-bold mb-2 flex items-center">
      {title} <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-all" />
    </h4>
    <p className="text-gray-400 text-sm leading-relaxed">
      {desc}
    </p>
  </div>
);

export default Home;