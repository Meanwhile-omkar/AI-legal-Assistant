import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FileText, Loader2, CheckCircle, Cpu
} from 'lucide-react';
import jsPDF from 'jspdf';

const DocGen = ({ caseData, suggestions, isSuggestionsLoading }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  
  // FIXED DELAY: Even if data is ready, we show a smooth 1.5s reveal
  const [fakeLoading, setFakeLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState("Initializing AI...");

  useEffect(() => {
    // Rotating messages for engagement
    const statuses = ["Accessing Prefetched Data...", "Optimizing Templates...", "Finalizing AI Models..."];
    let i = 0;
    const interval = setInterval(() => {
      setScanStatus(statuses[i % statuses.length]);
      i++;
    }, 600);

    // Ensure we show the loading for at least 1.5 seconds for "smoothness"
    const timer = setTimeout(() => {
      setFakeLoading(false);
    }, 1500);

    return () => {
        clearInterval(interval);
        clearTimeout(timer);
    };
  }, []);

  const handleGenerate = async (title) => {
    setSelectedDoc(title);
    setDocContent("");
    setLoadingContent(true);
    try {
      const res = await axios.post('http://localhost:8000/documents/generate', { 
        case_data: caseData, 
        selected_doc: title 
      });
      setDocContent(res.data.document_text);
    } catch (e) { console.error("Generation failed"); }
    setLoadingContent(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - (margin * 2);
    doc.setFont("helvetica", "bold");
    doc.text(selectedDoc.toUpperCase(), margin, 20);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(docContent, pageWidth);
    doc.text(lines, margin, 35);
    doc.save(`${selectedDoc.replace(/\s+/g, '_')}.pdf`);
  };

  // Determine if we should show the loading bar
  // We show it if the API is still actually fetching OR if our fake timer hasn't finished
  const isCurrentlyBusy = fakeLoading || isSuggestionsLoading;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lawzy-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Cpu size={18} className="text-lawzy-gold" />
            <span className="text-[10px] font-black tracking-[0.4em] text-lawzy-gold uppercase">Drafting Engine v2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Document Draftsman</h1>
          
          <AnimatePresence>
            {isCurrentlyBusy && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="mt-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-lawzy-gold animate-pulse uppercase tracking-widest">{scanStatus}</span>
                  <span className="text-[10px] text-gray-600">PRE-FETCHED READY</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-lawzy-gold shadow-[0_0_10px_#D4AF37]"
                     initial={{ x: '-100%' }}
                     animate={{ x: '0%' }}
                     transition={{ duration: 1.5, ease: "easeInOut" }}
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* --- SUGGESTION TILES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 min-h-[180px]">
          <AnimatePresence mode="wait">
            {isCurrentlyBusy ? (
              // Phase 1: Perfect Skeletons (Matching size exactly)
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`skel-${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] h-[180px] space-y-4"
                >
                  <div className="h-10 w-10 bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                </motion.div>
              ))
            ) : (
              // Phase 2: Reveal pre-fetched data
              suggestions.map((doc) => (
                <motion.button
                  key={doc.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerate(doc.title)}
                  className={`relative p-8 rounded-[2rem] border text-left transition-all group overflow-hidden ${
                    selectedDoc === doc.title 
                    ? 'border-lawzy-gold bg-lawzy-gold/10' 
                    : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${selectedDoc === doc.title ? 'bg-lawzy-gold text-black' : 'bg-white/5 text-lawzy-gold'}`}>
                      <FileText size={20} />
                    </div>
                    {selectedDoc === doc.title && <CheckCircle size={20} className="text-lawzy-gold" />}
                  </div>
                  <h3 className="font-bold text-white group-hover:text-lawzy-gold transition-colors">{doc.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{doc.description}</p>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* --- DRAFTING AREA --- */}
        <AnimatePresence mode="wait">
          {loadingContent ? (
            <motion.div 
              key="gen-loading"
              className="flex flex-col items-center justify-center p-24 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02]"
            >
              <Loader2 className="animate-spin text-lawzy-gold mb-4" size={48} />
              <h3 className="text-lawzy-gold font-black tracking-[0.4em] uppercase text-xs">AI is drafting your {selectedDoc}...</h3>
            </motion.div>
          ) : docContent && (
            <motion.div key="doc-result" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {/* Document Result Header */}
              <div className="flex justify-between items-center mb-6 px-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Document Generated</span>
                <button onClick={downloadPDF} className="px-6 py-2 bg-lawzy-gold text-black font-black rounded-full text-xs uppercase transition-transform hover:scale-105">
                  Download PDF
                </button>
              </div>

              {/* Virtual Paper */}
              <div className="bg-white text-[#1a1a1e] p-12 md:p-20 font-serif shadow-2xl rounded-sm">
                <div className="border-b-2 border-black mb-10 pb-6 text-center">
                  <h2 className="text-2xl font-black uppercase">{selectedDoc}</h2>
                  <p className="text-[9px] font-sans font-bold uppercase tracking-[0.4em] mt-2 opacity-40">Draft Version 1.0</p>
                </div>
                <div className="whitespace-pre-wrap text-sm md:text-base leading-[2] text-justify">
                  {docContent}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocGen;