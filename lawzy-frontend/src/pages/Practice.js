import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ChevronRight, 
  ShieldAlert, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  BrainCircuit,
  Terminal
} from 'lucide-react';

const Practice = ({ caseData }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPurpose, setShowPurpose] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post('http://localhost:8000/questions/generate', { case_data: caseData });
        setCards(res.data.cards);
      } catch (e) { 
        console.error("Error fetching questions"); 
        // Fallback for demo/empty state
        setCards([{ 
            category: "Consistency", 
            question: "Sample Question: Describe the sequence of events again.", 
            difficulty: 3, 
            purpose: "Testing for narrative contradictions." 
        }]);
      }
      setLoading(false);
    };
    if (caseData) fetchQuestions();
  }, [caseData]);

  const handleNext = () => {
    setShowPurpose(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // --- LOADING STATE ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0c] text-center p-6">
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-24 h-24 border-2 border-lawzy-gold/20 border-t-lawzy-gold rounded-full"
        />
        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lawzy-gold animate-pulse" size={32} />
      </div>
      <h3 className="text-lawzy-gold font-black tracking-[0.3em] uppercase text-sm mb-2">Simulating Interrogation</h3>
      <p className="text-gray-500 font-mono text-xs animate-pulse">Analyzing potential cross-examination traps...</p>
    </div>
  );

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-lawzy-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- PROGRESS HEADER --- */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-lawzy-gold" />
            <span className="text-[10px] font-black tracking-[0.3em] text-lawzy-gold uppercase">Preparation Module</span>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Phase {currentIndex + 1} of {cards.length}
          </span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-lawzy-gold/50 to-lawzy-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
        </div>
      </div>

      {/* --- QUESTION CARD --- */}
      <div className="w-full max-w-2xl relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative group"
          >
            {/* Card Glow */}
            <div className="absolute -inset-0.5 bg-lawzy-gold/20 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition" />
            
            <div className="relative bg-[#111114] border border-white/10 p-10 md:p-14 rounded-[2.5rem] shadow-3xl min-h-[450px] flex flex-col justify-between backdrop-blur-xl">
              
              {/* Card Meta */}
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-lawzy-gold/60 uppercase tracking-widest">Category</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-lawzy-gold" />
                    <span className="text-sm font-bold text-white">{currentCard?.category}</span>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Stress Level</span>
                  <div className="flex gap-1 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                        className={`w-3 h-1.5 rounded-sm ${i < currentCard?.difficulty ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-white/10'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="flex-grow flex items-center">
                <h3 className="text-2xl md:text-3xl font-medium text-gray-100 leading-tight tracking-tight">
                  <span className="text-lawzy-gold/30 font-serif italic text-4xl mr-2">“</span>
                  {currentCard?.question}
                  <span className="text-lawzy-gold/30 font-serif italic text-4xl ml-2">”</span>
                </h3>
              </div>

              {/* Reveal Intent Section */}
              <div className="mt-12 space-y-6">
                <AnimatePresence>
                  {showPurpose ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl"
                    >
                      <div className="flex items-center mb-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                        <Zap size={12} className="mr-2"/> Interrogation Intent:
                      </div>
                      <p className="text-blue-100/70 text-sm leading-relaxed italic font-light">
                        {currentCard?.purpose}
                      </p>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setShowPurpose(true)}
                      className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-lawzy-gold hover:border-lawzy-gold/30 transition-all flex items-center justify-center gap-3"
                    >
                      <HelpCircle size={14} /> Reveal Tactical Insight
                    </button>
                  )}
                </AnimatePresence>

                <button 
                  onClick={currentIndex === cards.length - 1 ? () => window.location.href='/dashboard' : handleNext}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center hover:bg-lawzy-gold transition-all active:scale-95 text-sm uppercase tracking-widest"
                >
                  {currentIndex === cards.length - 1 ? "Complete Briefing" : "Confirm & Next"} 
                  <ChevronRight className="ml-2" size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- FOOTER DISCLAIMER --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 max-w-2xl flex items-start p-6 bg-red-500/[0.03] border border-red-500/10 rounded-3xl"
      >
        <ShieldAlert className="text-red-500 mr-4 shrink-0" size={24} />
        <div className="space-y-1">
          <h4 className="text-red-500 font-black text-[10px] uppercase tracking-widest">Crucial Notice</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            This module is designed to test your <strong>consistency</strong> and <strong>mental resilience</strong>. It does not replace professional legal coaching. 
            Maintain absolute truth: contradicting recorded facts in a formal interrogation can lead to immediate legal escalation.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Practice;