import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  Cpu, 
  Printer, 
  FileCheck, 
  ChevronLeft 
} from 'lucide-react';
import jsPDF from 'jspdf';
import { generateDocument } from '../api'; // Centralized API

const DocGen = ({ caseData, suggestions, isSuggestionsLoading }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  
  // Smooth loading effect for transitions
  const [fakeLoading, setFakeLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState("Initializing AI...");

  /* --------------------- ROTATING STATUS MESSAGES ---------------------- */
  useEffect(() => {
    const statuses = [
      "Accessing Prefetched Data...", 
      "Optimizing Templates...", 
      "Finalizing AI Models..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setScanStatus(statuses[i % statuses.length]);
      i++;
    }, 600);

    // Give it 1.5 seconds of "fake" loading to ensure smooth tile entrance
    const timer = setTimeout(() => setFakeLoading(false), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  /* --------------------- HANDLE DOCUMENT GENERATION ---------------------- */
  const handleGenerate = async (title) => {
    setSelectedDoc(title);
    setDocContent("");
    setLoadingContent(true);
    try {
      // 1. Call API
      const res = await generateDocument(caseData, title); 
      
      // 2. FIX: Since api.js has ".then(res => res.data.document_text)",
      // 'res' is now the actual string content.
      setDocContent(res); 

    } catch (e) { 
      console.error("Generation failed:", e); 
      alert("AI drafting failed. Please try again.");
    } finally {
      setLoadingContent(false);
    }
  };

  /* --------------------- DOWNLOAD PDF ---------------------- */
  const downloadPDF = () => {
    if (!selectedDoc || !docContent) return;
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - margin * 2;
    
    doc.setFont("helvetica", "bold");
    doc.text(selectedDoc.toUpperCase(), margin, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(docContent, pageWidth);
    doc.text(lines, margin, 35);
    doc.save(`${selectedDoc.replace(/\s+/g, '_')}.pdf`);
  };

  // Check if we are still in any loading phase
  const isCurrentlyBusy = fakeLoading || isSuggestionsLoading;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Decor */}
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
                  <span className="text-[10px] text-gray-600">PRE-FETCH READY</span>
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
              // Phase 1: Skeletons
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
              // Phase 2: Reveal pre-fetched data from App.js
              suggestions?.map((doc) => (
                <motion.button
                  key={doc.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerate(doc.title)}
                  className={`relative p-8 rounded-[2rem] border text-left transition-all group overflow-hidden ${
                    selectedDoc === doc.title 
                    ? 'border-lawzy-gold bg-lawzy-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${selectedDoc === doc.title ? 'bg-lawzy-gold text-black' : 'bg-white/5 text-lawzy-gold'}`}>
                      <FileText size={20} />
                    </div>
                    {selectedDoc === doc.title && <CheckCircle size={20} className="text-lawzy-gold animate-bounce-short" />}
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
              <h3 className="text-lawzy-gold font-black tracking-[0.3em] uppercase text-xs">AI is drafting your {selectedDoc}...</h3>
            </motion.div>
          ) : docContent && (
            <motion.div key="doc-result" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {/* Document Result Header */}
              <div className="flex justify-between items-center mb-6 px-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <FileCheck size={16} className="text-green-500" /> Draft Finalized
                </div>
                <div className="flex gap-3">
                    <button onClick={downloadPDF} className="px-6 py-2.5 bg-lawzy-gold text-black font-black rounded-full text-xs uppercase transition-transform hover:scale-105 flex items-center gap-2">
                        <Download size={14} /> PDF
                    </button>
                    <button onClick={() => window.print()} className="p-2.5 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">
                        <Printer size={16} />
                    </button>
                </div>
              </div>

              {/* Virtual Paper */}
              <div className="bg-white text-[#1a1a1e] p-12 md:p-20 font-serif shadow-2xl rounded-sm">
                <div className="border-b-2 border-black mb-10 pb-6 text-center">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedDoc}</h2>
                  <p className="text-[9px] font-sans font-bold uppercase tracking-[0.4em] mt-2 opacity-40">Drafting Protocol v1.0 • Lawzy AI</p>
                </div>
                <div className="whitespace-pre-wrap text-sm md:text-base leading-[2] text-justify selection:bg-lawzy-gold/30">
                  {docContent}
                </div>
                <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between">
                   <p className="text-[9px] text-gray-400 max-w-xs uppercase font-sans tracking-wider font-bold">Confidential Draft</p>
                   <div className="text-right">
                      <div className="h-0.5 w-32 bg-gray-200 mb-2 ml-auto" />
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Digital Signature Required</p>
                   </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button onClick={() => { setSelectedDoc(null); setDocContent(""); }} className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white flex items-center gap-2 mx-auto transition-all">
                  <ChevronLeft size={14} /> Change Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocGen;