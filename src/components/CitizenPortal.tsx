import React, { useState } from 'react';
import { SEED_PAPERS, SEED_CASE_STUDIES } from '../data/seedData';
import {
  Shield,
  Search,
  CheckCircle2,
  FileText,
  MapPin,
  TrendingDown,
  ExternalLink,
  BookOpen,
  Scale,
  Award,
} from 'lucide-react';

interface CitizenPortalProps {
  onSelectTab: (tab: string, params?: any) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ onSelectTab }) => {
  const [publicSearch, setPublicSearch] = useState('');

  const publicPapers = SEED_PAPERS.filter((p) => {
    if (!publicSearch) return true;
    const q = publicSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q);
  }).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Public Transparency & Open Governance Portal</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            National Land Records & Dispute Transparency
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Empowering citizens with open data on land record digitization, court pendency reduction, and published academic research.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 p-3 rounded-xl text-xs space-y-0.5">
          <span className="text-blue-200 block text-[10px] uppercase font-bold">Public Verification</span>
          <span className="font-bold text-emerald-300">Open to All Indian Citizens</span>
        </div>
      </div>

      {/* National Transparency KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Cadastral Digitization Progress</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">94.2% Complete</div>
          <span className="text-[10px] text-slate-500">50.42M Parcels Across 36 States</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Villages Covered under SVAMITVA</span>
          <div className="text-2xl font-black text-blue-700 mt-1">310,000+ Villages</div>
          <span className="text-[10px] text-slate-500">Drone High-Precision Survey</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Active Alternative Dispute Centers</span>
          <div className="text-2xl font-black text-amber-700 mt-1">1,240 Centers</div>
          <span className="text-[10px] text-slate-500">Free Mediation for Smallholders</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Avg Resolution Speed Gain</span>
          <div className="text-2xl font-black text-slate-900 mt-1">↓ 35% Faster</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Post-Digitization Reform</span>
        </div>
      </div>

      {/* Citizen Rights & Reform Highlights */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Key Citizen Protections in Land Administration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How evidence-based policies in Tamil Nadu, Karnataka, and Maharashtra protect landholders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-emerald-800 block text-xs">
              1. Digital Land Title Deed & Instant Mutation
            </span>
            <p className="text-slate-600 leading-relaxed">
              Automatic mutation upon deed registration eliminates discretionary delays, middlemen bribes, and double sales.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-blue-800 block text-xs">
              2. Free Pre-Litigation Community Mediation
            </span>
            <p className="text-slate-600 leading-relaxed">
              Sub-District mediation centers resolve family division and boundary differences in under 95 days with zero court fees.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-amber-800 block text-xs">
              3. Drone Ortho-Rectified Ground Truth
            </span>
            <p className="text-slate-600 leading-relaxed">
              High-precision drone surveys provide irrefutable 5cm boundary accuracy, preventing encroachment along village residential boundaries.
            </p>
          </div>
        </div>
      </div>

      {/* Open Academic Research for Citizens */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Open Public Research Papers</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Peer-reviewed evidence accessible to all citizens and civic researchers
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={publicSearch}
              onChange={(e) => setPublicSearch(e.target.value)}
              placeholder="Search published research..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 hover:border-blue-300 transition"
            >
              <div className="flex justify-between items-start text-[10px]">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  {paper.year} • {paper.topic.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-amber-800 font-semibold">{paper.citationCount} Citations</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{paper.title}</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{paper.abstract}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>{paper.authors.join(', ')}</span>
                <button
                  onClick={() => onSelectTab('paper-search', { query: paper.title })}
                  className="text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <span>Read Paper</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
