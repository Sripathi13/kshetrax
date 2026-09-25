import React, { useState } from 'react';
import { User, DistrictGISData } from '../types';
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Layers,
  MapPin,
  Cpu,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PolicymakerDashboardProps {
  currentUser: User;
  onSelectTab: (tab: string, params?: any) => void;
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  currentUser,
  onSelectTab,
}) => {
  const [selectedDisputeType, setSelectedDisputeType] = useState<string | null>(null);
  const [showProblemDrilldown, setShowProblemDrilldown] = useState<boolean>(true);

  // 5-Year Trends Data
  const trendYears = ['2021', '2022', '2023', '2024', '2025'];
  const disputeCounts = [12200, 13100, 13780, 14800, 15432];
  const maxDisputes = 17000;

  // Comparison with similar districts
  const districtComparisons = [
    { name: 'Nashik (My District)', disputes: 15432, trend: '+12%', status: 'Critical Surge', flag: 'red', resolutionTime: '7.2 yrs' },
    { name: 'Aurangabad (Neighbor)', disputes: 13120, trend: '+9.4%', status: 'High Pendency', flag: 'red', resolutionTime: '6.8 yrs' },
    { name: 'Kolhapur', disputes: 11250, trend: '+8.1%', status: 'Moderate High', flag: 'amber', resolutionTime: '6.1 yrs' },
    { name: 'Pune (Solved via Mediation)', disputes: 8940, trend: '-4.2%', status: 'Controlled', flag: 'emerald', resolutionTime: '3.8 yrs' },
    { name: 'Nagpur', disputes: 7210, trend: '-1.8%', status: 'Stable', flag: 'emerald', resolutionTime: '4.2 yrs' },
    { name: 'Coimbatore (TN Digitized)', disputes: 4950, trend: '-6.8%', status: 'Best in Class', flag: 'emerald', resolutionTime: '2.9 yrs' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Executive Policy Intelligence Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Jurisdiction: <span className="font-semibold text-white">Maharashtra State • District Nashik</span> | Department of Revenue & Land Administration
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onSelectTab('solutions', { query: 'reduce land disputes' })}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Find Solutions</span>
          </button>
          <button
            onClick={() => onSelectTab('simulation')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition shadow-xs cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Run Policy Simulation</span>
          </button>
          <button
            onClick={() => onSelectTab('gis-viewer', { district: 'Nashik' })}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 border border-white/20 transition cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>District GIS Map</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Disputes (Alert) */}
        <div
          onClick={() => setShowProblemDrilldown(true)}
          className="bg-white border-2 border-red-500 rounded-xl p-4 shadow-xs hover:shadow-md transition cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-bl">
            CRITICAL ALERT
          </div>
          <div className="text-xs text-slate-500 font-semibold">Pending Land Disputes</div>
          <div className="text-2xl font-black text-slate-900 mt-1">15,432</div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs font-bold text-red-600">
            <TrendingUp className="w-4 h-4" />
            <span>↑ 12.0% YoY Surge</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Baseline: 13,780 in 2023</div>
        </div>

        {/* Card 2: Resolution Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="text-xs text-slate-500 font-semibold">Avg Resolution Time</div>
          <div className="text-2xl font-black text-amber-700 mt-1">7.2 Years</div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-emerald-700">
            <TrendingDown className="w-4 h-4" />
            <span>↓ 5.2% YoY (Modest gain)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Target: &lt; 4.0 Years</div>
        </div>

        {/* Card 3: Urban Expansion */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="text-xs text-slate-500 font-semibold">Urban Expansion Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-1">2.1% p.a.</div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-amber-700">
            <TrendingUp className="w-4 h-4" />
            <span>↑ High Peri-Urban Sprawl</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Godavari Wine Valley corridor</div>
        </div>

        {/* Card 4: Agricultural Land Loss */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="text-xs text-slate-500 font-semibold">Agricultural Land Loss</div>
          <div className="text-2xl font-black text-slate-900 mt-1">1.8% p.a.</div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-red-600">
            <TrendingUp className="w-4 h-4" />
            <span>↑ Prime Farmland Lost</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">60.3% (2015) → 50.2% (2025)</div>
        </div>

        {/* Card 5: Forest & Water */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="text-xs text-slate-500 font-semibold">Active Mediation Centers</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">8 Centers</div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Phase 1 Deployed</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Resolving ~120 cases/mo</div>
        </div>
      </div>

      {/* Problem Recognition Deep-Dive Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Problem Recognition: Nashik Land Dispute Crisis</span>
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Dispute Dynamics, Hotspots & Typology Breakdown
            </h2>
          </div>

          <button
            onClick={() => onSelectTab('solutions', { query: 'reduce land disputes' })}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition self-start md:self-auto cursor-pointer shadow-xs"
          >
            <span>Search Solutions for Nashik</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: 5-Year Historical Trend Chart (SVG) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>5-Year Dispute Pendency Escalation (2021–2025)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Source: DoLR & Revenue Courts</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              {/* SVG Line / Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
                {trendYears.map((yr, idx) => {
                  const count = disputeCounts[idx];
                  const heightPct = Math.round((count / maxDisputes) * 100);
                  const isLatest = idx === trendYears.length - 1;

                  return (
                    <div key={yr} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip on hover */}
                      <div className="text-[10px] font-bold text-slate-600 mb-1 group-hover:text-amber-700 transition">
                        {count.toLocaleString()}
                      </div>
                      {/* Bar */}
                      <div className="w-full max-w-[48px] bg-slate-200 rounded-t-md overflow-hidden relative h-32 flex items-end">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full transition-all duration-500 rounded-t-md ${
                            isLatest
                              ? 'bg-gradient-to-t from-red-600 to-red-500'
                              : 'bg-gradient-to-t from-blue-600 to-blue-500'
                          }`}
                        />
                      </div>
                      {/* X label */}
                      <span className={`text-xs mt-2 font-medium ${isLatest ? 'text-red-700 font-bold' : 'text-slate-600'}`}>
                        {yr}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Total Accumulated Pendency: <strong className="text-slate-900 font-bold">15,432 Cases</strong></span>
                <span className="text-red-700 font-bold">+26.5% Net 5-Year Growth</span>
              </div>
            </div>

            {/* Dispute Typology */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dispute Typology Breakdown
              </h4>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-800">1. Boundary Conflicts & Fencing Encroachments</span>
                    <span className="font-bold text-amber-700">40% (6,172 cases)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Solvable via: <strong className="text-slate-900">High-Precision Drone Cadastral Resurvey (Tamil Nadu model)</strong>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-800">2. Title Ambiguities & Mutation Delays</span>
                    <span className="font-bold text-blue-700">35% (5,401 cases)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Solvable via: <strong className="text-slate-900">Single-Window Title Deed & Registry Synchronization</strong>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-800">3. Family Partition & Succession Claims</span>
                    <span className="font-bold text-emerald-700">25% (3,859 cases)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '25%' }} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Solvable via: <strong className="text-slate-900">Sub-District Community Mediation Centers (Pune model)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Benchmarking Matrix */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Benchmarking: Nashik vs. Similar Districts</span>
              </h3>
              <button
                onClick={() => onSelectTab('solutions')}
                className="text-xs text-blue-700 hover:text-blue-800 font-bold cursor-pointer"
              >
                View Case Studies →
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Pending Cases</th>
                      <th className="py-2.5 px-3">YoY Trend</th>
                      <th className="py-2.5 px-3">Avg Resolution</th>
                      <th className="py-2.5 px-3">Governance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {districtComparisons.map((dist, i) => (
                      <tr
                        key={dist.name}
                        className={`hover:bg-slate-50 transition ${
                          i === 0 ? 'bg-red-50/50 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-900 flex items-center space-x-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dist.flag === 'red'
                                ? 'bg-red-500'
                                : dist.flag === 'amber'
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span>{dist.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{dist.disputes.toLocaleString()}</td>
                        <td className={`py-2.5 px-3 font-semibold ${dist.trend.startsWith('+') ? 'text-red-600' : 'text-emerald-700'}`}>
                          {dist.trend}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{dist.resolutionTime}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              dist.flag === 'red'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : dist.flag === 'amber'
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {dist.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insight Box */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                <Info className="w-4 h-4 text-blue-700" />
                <span>Empirical Evidence Insight</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Pune District</strong> had a nearly identical dispute profile in 2015 (12,400 cases). Through its ₹45 Cr <strong>Community Mediation initiative</strong>, it reduced disputes by 25% and cut resolution time from 7.4 to 3.8 years. Similarly, <strong>Tamil Nadu’s Cadastral Modernization</strong> reduced boundary disputes by 40%.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-amber-900 font-bold">
                  Recommended: Synthesize Pune Mediation + Tamil Nadu Digitization
                </span>
                <button
                  onClick={() =>
                    onSelectTab('simulation', {
                      baseCases: ['cs-tamil-nadu-digital', 'cs-pune-mediation'],
                      budget: 150,
                      timeline: 3,
                    })
                  }
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded text-xs transition cursor-pointer shadow-xs"
                >
                  Simulate Hybrid Policy →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Approved Policy Card (Nashik Combined Mission) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
              Approved & Under Implementation
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Nashik District Comprehensive Land Dispute Reduction & Cadastral Resurvey Mission
            </h3>
            <p className="text-xs text-slate-500">
              Approved by: Mr. Rajesh Patel, IAS • Approved Outlay: ₹150 Crore • Horizon: 36 Months (2025–2027)
            </p>
          </div>

          <button
            onClick={() => onSelectTab('tracking')}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <span>Open Telemetry Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 font-medium">Implementation Stage</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Month 12 / 36</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '33%' }} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 font-medium">Disputes Resolved to Date</span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">1,232 Cases (-8.0%)</div>
            <span className="text-[10px] text-slate-500">Current Pendency: 14,200</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 font-medium">Budget Spent</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">₹42.0 Cr / ₹150 Cr</div>
            <span className="text-[10px] text-emerald-700 font-semibold">28% Burn (On Plan)</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] text-slate-500 font-medium">Predicted Target (Month 36)</span>
            <div className="text-sm font-bold text-amber-700 mt-0.5">55% Reduction (6,944 Cases)</div>
            <span className="text-[10px] text-emerald-700 font-semibold">85% Model Confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
