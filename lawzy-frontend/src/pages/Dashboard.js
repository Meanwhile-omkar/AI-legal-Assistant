import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, FileText, GraduationCap, ArrowRight, 
  AlertCircle, ListChecks, HelpCircle, Scale, Info 
} from 'lucide-react';

const Dashboard = ({ data }) => {
  const navigate = useNavigate();
  if (!data) return <div className="p-10 text-center">No data found. Please go back.</div>;

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      transition={{ staggerChildren: 0.1 }}
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      {/* 1. Header Section */}
      <div className="border-b border-gray-800 pb-6">
        <h2 className="text-3xl font-bold text-lawzy-gold mb-2">Legal Analysis</h2>
        <p className="text-gray-400 italic">"{data.normalized_query.english_version}"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Statutes & Summary */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Layman Summary */}
          <motion.div variants={item} className="bg-lawzy-slate p-6 rounded-2xl border border-gray-700 shadow-lg">
            <h3 className="text-lawzy-gold font-bold mb-3 flex items-center">
              <Info size={20} className="mr-2"/> Simple Explanation
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              {data.plain_language_summary}
            </p>
          </motion.div>

          {/* Statutes Grid (IPC vs BNS) */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-5 rounded-2xl border border-red-900/30">
              <h4 className="text-red-400 font-bold mb-4 flex items-center tracking-widest uppercase text-xs">
                <Scale size={14} className="mr-2"/> IPC Sections (Existing)
              </h4>
              {data.ipc_sections.length > 0 ? data.ipc_sections.map(s => (
                <div key={s.section_number} className="mb-4 last:mb-0">
                  <div className="text-white font-bold">Section {s.section_number}</div>
                  <div className="text-sm text-gray-300 font-semibold mb-1">{s.title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.explanation}</p>
                </div>
              )) : <p className="text-gray-600 text-sm italic">No specific IPC sections applicable.</p>}
            </div>

            <div className="bg-black/30 p-5 rounded-2xl border border-green-900/30">
              <h4 className="text-green-400 font-bold mb-4 flex items-center tracking-widest uppercase text-xs">
                <Scale size={14} className="mr-2"/> BNS Sections (New Law)
              </h4>
              {data.bns_sections.length > 0 ? data.bns_sections.map(s => (
                <div key={s.section_number} className="mb-4 last:mb-0">
                  <div className="text-white font-bold">Section {s.section_number}</div>
                  <div className="text-sm text-gray-300 font-semibold mb-1">{s.title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.explanation}</p>
                </div>
              )) : <p className="text-gray-600 text-sm italic">No specific BNS sections applicable.</p>}
            </div>
          </motion.div>

          {/* Procedural Guidance Section */}
          <motion.div variants={item} className="bg-lawzy-slate p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lawzy-gold font-bold mb-5 flex items-center">
              <ListChecks size={20} className="mr-2"/> Recommended Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/40 rounded-xl">
                <h5 className="text-blue-400 text-sm font-bold mb-2">Police Route</h5>
                <p className="text-xs text-gray-400">{data.procedural_guidance.paths_explained.police_route}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl">
                <h5 className="text-purple-400 text-sm font-bold mb-2">Court Route</h5>
                <p className="text-xs text-gray-400">{data.procedural_guidance.paths_explained.court_route}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl">
                <h5 className="text-emerald-400 text-sm font-bold mb-2">Alternative</h5>
                <p className="text-xs text-gray-400">{data.procedural_guidance.paths_explained.non_legal_resolution}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.procedural_guidance.possible_actions.map((act, i) => (
                <span key={i} className="text-[10px] bg-lawzy-gold/10 text-lawzy-gold border border-lawzy-gold/20 px-2 py-1 rounded-full">
                  • {act}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Checklist, Missing Info & Limitations */}
        <div className="space-y-6">
          
          {/* Checklist */}
          <motion.div variants={item} className="bg-lawzy-slate p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lawzy-gold font-bold mb-4 flex items-center">
              <ShieldCheck size={18} className="mr-2"/> Legal Signals
            </h3>
            <div className="space-y-2">
              {Object.entries(data.legal_signal_checklist).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                  <span className="capitalize text-xs text-gray-300">{key.replace(/_/g, ' ')}</span>
                  {val ? <span className="text-green-400 font-bold text-xs uppercase tracking-widest">Yes</span> : <span className="text-gray-500 text-xs">No</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Missing Information */}
          <motion.div variants={item} className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-700/30">
            <h3 className="text-yellow-500 font-bold mb-4 flex items-center">
              <HelpCircle size={18} className="mr-2"/> Clarifications Needed
            </h3>
            <ul className="space-y-2">
              {data.missing_information.map((info, i) => (
                <li key={i} className="text-xs text-yellow-200/70 flex items-start italic">
                  <span className="mr-2 opacity-50">?</span> {info}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Limitations Disclaimer */}
          <motion.div variants={item} className="p-4 bg-red-900/5 rounded-xl border border-red-900/20 text-center">
             <p className="text-sm font-bold uppercase tracking-wider text-red-600">
  ⚠ Attention
</p>
             <p className="text-[13px] text-red-400/80 leading-tight">
               {data.limitations}
             </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button 
              onClick={() => navigate('/generate-docs')}
              className="w-full flex items-center justify-between p-4 bg-lawzy-gold text-black font-bold rounded-xl hover:shadow-lawzy-gold/20 hover:shadow-lg transition-all"
            >
              <div className="flex items-center"><FileText size={18} className="mr-2"/> Draft Docs</div>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/practice')}
              className="w-full flex items-center justify-between p-4 bg-transparent border border-gray-700 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="flex items-center"><GraduationCap size={18} className="mr-2"/> Authority Prep</div>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;