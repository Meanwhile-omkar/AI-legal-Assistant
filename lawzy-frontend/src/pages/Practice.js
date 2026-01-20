import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChevronRight, RotateCcw, ShieldAlert, Info, HelpCircle } from 'lucide-react';

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
      } catch (e) { console.error("Error fetching questions"); }
      setLoading(false);
    };
    if (caseData) fetchQuestions();
  }, [caseData]);

  const handleNext = () => {
    setShowPurpose(false);
    if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-lawzy-gold mb-4"></div>
      <p className="text-lawzy-gold font-mono">SIMULATING AUTHORITY INTERROGATION...</p>
    </div>
  );

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 italic">Authority Prep</h2>
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            className="bg-lawzy-gold h-full"
          />
        </div>
        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Question {currentIndex + 1} of {cards.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="bg-lawzy-slate border border-gray-700 p-8 rounded-3xl shadow-2xl min-h-[300px] flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] text-lawzy-gold font-bold uppercase">
                {currentCard?.category}
              </span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < currentCard?.difficulty ? 'bg-red-500' : 'bg-gray-700'}`} />
                ))}
              </div>
            </div>
            
            <h3 className="text-2xl font-medium text-white leading-snug">
              "{currentCard?.question}"
            </h3>
          </div>

          <div className="mt-8 space-y-4">
            {showPurpose ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-blue-200 text-sm italic"
              >
                <div className="flex items-center mb-1 font-bold text-blue-400 not-italic">
                  <Info size={14} className="mr-2"/> Why they are asking this:
                </div>
                {currentCard?.purpose}
              </motion.div>
            ) : (
              <button 
                onClick={() => setShowPurpose(true)}
                className="w-full py-3 text-gray-400 text-xs flex items-center justify-center hover:text-white transition-colors"
              >
                <HelpCircle size={14} className="mr-2"/> Reveal interrogation intent
              </button>
            )}

            <button 
              onClick={currentIndex === cards.length - 1 ? () => window.location.href='/' : handleNext}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center hover:bg-lawzy-gold transition-colors"
            >
              {currentIndex === cards.length - 1 ? "Finish Session" : "Next Question"} 
              <ChevronRight className="ml-2" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex items-start p-4 bg-red-900/10 border border-red-900/20 rounded-xl">
        <ShieldAlert className="text-red-500 mr-3 shrink-0" size={20} />
        <p className="text-[11px] text-gray-400 leading-tight">
          <strong>Important:</strong> These questions are generated to help you maintain consistency and mental clarity. Do not use this to manufacture false statements. Contradicting facts in a formal interrogation can have severe legal consequences.
        </p>
      </div>
    </div>
  );
};

export default Practice;