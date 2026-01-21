import { prefetchSuggestions } from "../api"; // Only import what you actually use
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';    
import {
  ShieldCheck,
  FileText,
  GraduationCap,
  ArrowRight,
  HelpCircle,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                   MAIN                                     */
/* -------------------------------------------------------------------------- */

const Dashboard = ({ data, setSuggestions, setIsSuggestionsLoading, suggestions }) => {
  const navigate = useNavigate();

  /* --------------------- SUGGESTIONS PREFETCH ---------------------- */
  useEffect(() => {
    if (!data) return;

    const fetchSuggestions = async () => {
      if (setSuggestions && suggestions?.length === 0) {
        setIsSuggestionsLoading?.(true);
        try {
          // Use centralized function from api.js
          const suggestionData = await prefetchSuggestions(data);
          setSuggestions(suggestionData);
        } catch (e) {
          console.error("Prefetching document titles failed:", e);
        } finally {
          setIsSuggestionsLoading?.(false);
        }
      }
    };

    fetchSuggestions();
  }, [data, suggestions, setSuggestions, setIsSuggestionsLoading]);

  /* ---------------------------- EMPTY STATE ---------------------------- */
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="text-center p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl">
          <AlertTriangle size={48} className="text-lawzy-gold mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl">No Analysis Data Found</h2>
          <p className="text-gray-400 mt-2">
            Please go back and describe your issue.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 text-lawzy-gold flex items-center justify-center w-full"
          >
            <ArrowRight size={18} className="rotate-180 mr-2" /> Go to Home
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------- ANIMATIONS ---------------------------- */
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 pb-[260px] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-lawzy-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-10 relative z-10"
      >
        {/* ------------------------------------------------------------------ */}
        {/*                                HEADER                              */}
        {/* ------------------------------------------------------------------ */}
        <header className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-lawzy-gold/10 text-lawzy-gold text-[10px] px-2 py-1 rounded font-black tracking-widest uppercase">
              Verified Legal Intelligence
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight">
            Legal Analysis Dashboard
          </h2>
          <p className="text-gray-500 mt-3 italic max-w-3xl border-l-2 border-lawzy-gold/30 pl-4">
            "{data.normalized_query.english_version}"
          </p>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/*                    SUMMARY + STATUTES + RIGHT PANE                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Executive Summary */}
            <motion.div
              variants={itemVars}
              className="bg-[#111114] p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <h3 className="text-lawzy-gold font-bold mb-4 flex items-center text-lg">
                <Info size={20} className="mr-3" /> Executive Summary
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed font-light">
                {data.plain_language_summary}
              </p>
            </motion.div>

            {/* Statutory Mapping */}
            <motion.div
              variants={itemVars}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <StatuteCard
                title="IPC Sections (Legacy)"
                sections={data.ipc_sections}
                color="red"
              />
              <StatuteCard
                title="BNS Sections (New Law)"
                sections={data.bns_sections}
                color="green"
              />
            </motion.div>
          </div>

          {/* RIGHT (1/3) */}
          <div className="space-y-6">
            {/* Missing Info */}
            <motion.div
              variants={itemVars}
              className="bg-yellow-500/5 p-6 rounded-3xl border border-yellow-500/20"
            >
              <h3 className="text-yellow-500 font-bold mb-4 flex items-center text-sm">
                <HelpCircle size={18} className="mr-2" /> Missing Details
              </h3>
              <ul className="space-y-3">
                {data.missing_information.map((info, i) => (
                  <li
                    key={i}
                    className="text-xs text-yellow-200/60 flex items-start gap-2 italic"
                  >
                    <Zap size={12} className="mt-0.5 shrink-0" /> {info}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Signals (Raw Checklist) */}
            <motion.div
              variants={itemVars}
              className="bg-[#16161a] p-6 rounded-3xl border border-white/10"
            >
              <h3 className="text-white font-bold mb-5 flex items-center">
                <ShieldCheck size={18} className="mr-2 text-lawzy-gold" />
                Legal Signals
              </h3>
              <div className="space-y-3">
                {Object.entries(data.legal_signal_checklist).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl"
                    >
                      <span className="capitalize text-xs text-gray-400">
                        {key.replace(/_/g, ' ')}
                      </span>
                      {val ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-gray-600" />
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              variants={itemVars}
              className="p-5 bg-red-500/[0.03] rounded-2xl border border-red-500/10"
            >
              <div className="flex items-center gap-2 mb-2 text-red-500">
                <AlertTriangle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Legal Notice
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed italic">
                {data.limitations}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/*                         STRATEGIC ROADMAP                           */}
        {/* ------------------------------------------------------------------ */}
        <motion.section variants={itemVars}>
          <div className="bg-gradient-to-b from-[#1c1c1f] to-[#0d0d0f] p-10 pb-32 rounded-[40px] border border-white/10 shadow-lg">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white flex items-center mb-12">
              <Activity size={28} className="mr-4 text-lawzy-gold" />
              Strategic Roadmap
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -z-10" />

              <PathBox
                title="Police Route"
                content={data.procedural_guidance.paths_explained.police_route}
                className="bg-[#1a1a1f] border border-white/20 rounded-2xl p-6 shadow-md hover:scale-[1.03] transition-transform duration-300 w-full md:w-80"
              />
              <PathBox
                title="Court Route"
                content={data.procedural_guidance.paths_explained.court_route}
                className="bg-[#1a1a1f] border border-white/20 rounded-2xl p-6 shadow-md hover:scale-[1.03] transition-transform duration-300"
              />
              <PathBox
                title="Alternative Dispute Resolution"
                content={data.procedural_guidance.paths_explained.non_legal_resolution}
                className="bg-[#1a1a1f] border border-white/20 rounded-2xl p-6 shadow-md hover:scale-[1.03] transition-transform duration-300"
              />
            </div>
          </div>
        </motion.section>




      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/*                       FLOATING ACTION BAR                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center z-50 px-4">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-[#1a1a1e]/80 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-2xl flex items-center gap-2"
        >
          <button
            onClick={() => navigate('/generate-docs')}
            className="flex items-center gap-3 px-8 py-4 bg-lawzy-gold text-black font-black rounded-2xl"
          >
            <FileText size={20} /> Draft Documents
          </button>

          <div className="w-px h-8 bg-white/10 mx-2" />

          <button
            onClick={() => navigate('/practice')}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white font-bold rounded-2xl"
          >
            <GraduationCap size={20} /> Authority Prep
            <ArrowRight size={18} className="text-gray-500" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              SUB COMPONENTS                                */
/* -------------------------------------------------------------------------- */

const StatuteCard = ({ title, sections, color }) => (
  <div className={`bg-[#111114] p-6 rounded-3xl border border-${color}-500/20`}>
    <h4
      className={`text-${color}-400 font-black tracking-widest uppercase text-[10px] mb-6`}
    >
      {title}
    </h4>
    <div className="space-y-6">
      {sections.length > 0 ? (
        sections.map((s, i) => (
          <div key={i}>
            <div className="text-white font-bold text-lg">
              Section {s.section_number}
            </div>
            <div className="text-xs text-gray-400 font-semibold mb-2">
              {s.title}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed bg-white/5 p-3 rounded-xl">
              {s.explanation}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-xs italic">
          No relevant sections found.
        </p>
      )}
    </div>
  </div>
);

const PathBox = ({ title, content }) => (
  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 hover:border-lawzy-gold/30 transition-all">
    <h5 className="text-white font-black text-sm mb-3">{title}</h5>
    <p className="text-xs text-gray-400 leading-relaxed">{content}</p>
  </div>
);

export default Dashboard;
