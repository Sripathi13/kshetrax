import React, { useState } from 'react';
import { CaseStudy } from '../types';
import { SEED_CASE_STUDIES } from '../data/seedData';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Cpu,
  ArrowRight,
  TrendingDown,
  Building,
  Coins,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Scale,
} from 'lucide-react';

interface SolutionFinderProps {
  onSelectTab: (tab: string, params?: any) => void;
  initialQuery?: string;
}

export const SolutionFinder: React.FC<SolutionFinderProps> = ({
  onSelectTab,
  initialQuery = 'reduce land disputes',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([
    'cs-tamil-nadu-digital',
    'cs-pune-mediation',
  ]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'case-studies' | 'compare-matrix'>('case-studies');

  // Filtered case studies
  const caseStudies = SEED_CASE_STUDIES.filter((cs) => {
    if (selectedState !== 'All' && cs.sourceState !== selectedState) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cs.title.toLowerCase().includes(q) ||
      cs.problemStatement.toLowerCase().includes(q) ||
      cs.solutionImplemented.toLowerCase().includes(q) ||
      cs.similarProblems.some((sp) => sp.toLowerCase().includes(q))
    );
  });

  const toggleSelectCase = (id: string) => {
    if (selectedCaseIds.includes(id)) {
      setSelectedCaseIds(selectedCaseIds.filter((item) => item !== id));
    } else {
      if (selectedCaseIds.length < 3) {
        setSelectedCaseIds([...selectedCaseIds, id]);
      }
    }
  };

  const handleLaunchSimulation = () => {
    onSelectTab('simulation', {
      baseCases: selectedCaseIds,
      budget: 150,
      timeline: 3,
    });
  };

  const states = ['All', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Telangana', 'Haryana', 'Odisha', 'Rajasthan'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md text-white">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence-Based Solution Discovery</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Find Proven Land Governance Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Search documented case studies and peer state initiatives. Benchmark outcomes, select successful programs, and simulate combined policies for your district.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask a policy question (e.g. 'How to reduce land disputes?', 'cadastral digitization')..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition shadow-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Source States' : st}
                </option>
              ))}
            </select>

            <button
              onClick={() => setActiveTab(activeTab === 'case-studies' ? 'compare-matrix' : 'case-studies')}
              className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer border shadow-xs ${
                activeTab === 'compare-matrix'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{activeTab === 'compare-matrix' ? 'Show Cards' : 'Compare Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Selected Cases Action Bar */}
        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-200">Selected for Policy Simulation:</span>
            <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-400/30">
              {selectedCaseIds.length} Program{selectedCaseIds.length === 1 ? '' : 's'} Selected (Max 3)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              disabled={selectedCaseIds.length === 0}
              onClick={handleLaunchSimulation}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition shadow-md cursor-pointer disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>Test Combined Policy in Simulator ({selectedCaseIds.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Comparison Matrix Table */}
      {activeTab === 'compare-matrix' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <span>Multi-Program Comparison Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Benchmarking verified outcomes, budgets, durations, and core institutional elements
              </p>
            </div>
            <button
              onClick={handleLaunchSimulation}
              className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-amber-400 transition cursor-pointer shadow-xs"
            >
              Simulate Selected ({selectedCaseIds.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 w-10">Select</th>
                  <th className="p-3">Program Title</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Dispute Reduction</th>
                  <th className="p-3">Resolution Time</th>
                  <th className="p-3">Key Strategic Elements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SEED_CASE_STUDIES.map((cs) => {
                  const isSelected = selectedCaseIds.includes(cs.id);
                  return (
                    <tr
                      key={cs.id}
                      className={`hover:bg-slate-50 transition ${
                        isSelected ? 'bg-amber-50/70' : ''
                      }`}
                    >
                      <td className="p-3">
                        <button
                          onClick={() => toggleSelectCase(cs.id)}
                          className="text-amber-600 hover:text-amber-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 fill-amber-500 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-bold text-slate-900 max-w-xs">{cs.title}</td>
                      <td className="p-3 text-slate-700 font-semibold">{cs.sourceState}</td>
                      <td className="p-3 text-slate-600">{Math.round(cs.durationMonths / 12)} Years</td>
                      <td className="p-3 font-bold text-amber-700">₹{cs.costCrores} Cr</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[11px]">
                          ↓ {cs.disputeReductionPercent}%
                        </span>
                      </td>
                      <td className="p-3 font-bold text-blue-700">
                        Improved {cs.resolutionTimeReductionPercent}%
                      </td>
                      <td className="p-3 text-slate-600 max-w-sm text-[11px]">
                        {cs.solutionImplemented}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Case Studies Cards Grid */}
      {activeTab === 'case-studies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((cs) => {
            const isSelected = selectedCaseIds.includes(cs.id);
            return (
              <div
                key={cs.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/20'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {cs.sourceState} • {cs.sourceDistrict || 'Statewide'}
                    </span>
                    <button
                      onClick={() => toggleSelectCase(cs.id)}
                      className="flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                    >
                      {isSelected ? (
                        <span className="text-amber-700 flex items-center space-x-1 font-bold">
                          <CheckSquare className="w-4 h-4 fill-amber-500 text-white" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 hover:text-slate-700 flex items-center space-x-1">
                          <Square className="w-4 h-4" />
                          <span>Select to Simulate</span>
                        </span>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{cs.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cs.solutionImplemented}
                  </p>

                  {/* Metrics Badge Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-medium">Reduction</span>
                      <span className="text-sm font-extrabold text-emerald-700">
                        ↓ {cs.disputeReductionPercent}%
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-medium">Duration</span>
                      <span className="text-sm font-extrabold text-slate-800">
                        {Math.round(cs.durationMonths / 12)} Yrs
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-medium">Outlay</span>
                      <span className="text-sm font-extrabold text-amber-700">
                        ₹{cs.costCrores} Cr
                      </span>
                    </div>
                  </div>

                  {/* Key Success Factors */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Key Success Factors:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {cs.keySuccessFactors.slice(0, 2).map((factor, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span className="line-clamp-2">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Resolution Time: <strong className="text-blue-700">-{cs.resolutionTimeReductionPercent}%</strong>
                  </span>
                  <button
                    onClick={() => {
                      if (!selectedCaseIds.includes(cs.id)) {
                        setSelectedCaseIds([...selectedCaseIds, cs.id]);
                      }
                      onSelectTab('simulation', { baseCases: [cs.id], budget: cs.costCrores, timeline: Math.round(cs.durationMonths / 12) });
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition cursor-pointer border border-slate-200"
                  >
                    <span>Test Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
