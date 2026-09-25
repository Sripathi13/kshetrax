import React, { useState } from 'react';
import { Policy } from '../types';
import { SEED_POLICIES } from '../data/seedData';
import {
  TrendingDown,
  CheckCircle2,
  Clock,
  Coins,
  Smile,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Send,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ImplementationTrackerProps {
  onSelectTab: (tab: string, params?: any) => void;
}

export const ImplementationTracker: React.FC<ImplementationTrackerProps> = ({
  onSelectTab,
}) => {
  const [activePolicy, setActivePolicy] = useState<Policy>(SEED_POLICIES[0]);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Tracking metrics from specification
  const baseline = 15432;
  const currentDisputes = 14200;
  const reductionCount = baseline - currentDisputes; // 1,232
  const reductionPct = 8.0;
  const targetYear3 = 6944;
  const targetReductionPct = 55;

  const budgetTotal = 150;
  const budgetSpent = 42;
  const budgetBurnPct = Math.round((budgetSpent / budgetTotal) * 100);

  const predictedMonth12 = 14100;
  const varianceCount = currentDisputes - predictedMonth12; // +100
  const variancePct = ((varianceCount / predictedMonth12) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600">
              Live Implementation Telemetry
            </span>
            <span className="text-xs text-slate-300">• Updated Today, 02:15 AM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {activePolicy.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Executive Sponsor: <strong className="text-white">{activePolicy.creatorName}</strong> • Jurisdiction: {activePolicy.district}, {activePolicy.state}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-semibold flex items-center space-x-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit Status: ON TRACK (0.7% Variance)</span>
          </span>
        </div>
      </div>

      {/* KPI Real-Time Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Disputes Current */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Current Pending Disputes</span>
          <div className="text-2xl font-black text-slate-900 mt-1">14,200 Cases</div>
          <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700 mt-1">
            <TrendingDown className="w-4 h-4" />
            <span>-1,232 Cases (-8.0% Net Reduction)</span>
          </div>
          <span className="text-[10px] text-slate-500">Down from 15,432 baseline</span>
        </div>

        {/* Card 2: Resolution Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Average Resolution Time</span>
          <div className="text-2xl font-black text-blue-700 mt-1">5.8 Years</div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 mt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Down from 7.2 Years (-19.4%)</span>
          </div>
          <span className="text-[10px] text-slate-500">Target by Month 36: &lt; 4.0 Years</span>
        </div>

        {/* Card 3: Financial Outlay */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Budget Expenditure</span>
          <div className="text-2xl font-black text-amber-700 mt-1">₹42.0 Cr / ₹150 Cr</div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${budgetBurnPct}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">28% Spent • Projected: ₹152 Cr</span>
        </div>

        {/* Card 4: Citizen Satisfaction */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Citizen Satisfaction (Survey)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">62% Favorable</div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 mt-1">
            <Smile className="w-4 h-4" />
            <span>Up from 45% pre-policy baseline</span>
          </div>
          <span className="text-[10px] text-slate-500">N=2,400 Rural Litigants</span>
        </div>
      </div>

      {/* Actual vs Predicted Deep-Dive Analysis */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Simulation Verification Audit
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Stage Performance: Month 12 Actual vs. Predicted
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Phase 1: Setup, Resurvey & Sub-District Mediation Centres
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="text-xs text-slate-500 font-medium">Simulation Predicted (Month 12)</span>
            <div className="text-xl font-bold text-slate-900">14,100 Pending Cases</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on historical S-curve from Pune mediation and Tamil Nadu cadastral rollout.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="text-xs text-slate-500 font-medium">Actual Recorded on Ground</span>
            <div className="text-xl font-bold text-emerald-700">14,200 Pending Cases</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified by Sub-Divisional Revenue Courts and Sub-District Mediation Centers.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <span className="text-xs text-slate-500 font-medium">Variance Audit</span>
            <div className="text-xl font-bold text-amber-700">+{varianceCount} Cases (+{variancePct}%)</div>
            <p className="text-xs text-emerald-700 font-semibold leading-relaxed">
              Within ±1.0% statistical tolerance limit. Policy execution remains fully on track for 55% Year 3 goal.
            </p>
          </div>
        </div>

        {/* Automated System Notification Quote */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-slate-700 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-blue-900">
              Monthly Automated Intelligence Report to District Collector:
            </span>
            <p className="italic text-slate-600">
              &ldquo;Your policy &lsquo;Nashik Comprehensive Land Dispute Reduction Mission&rsquo; is on track. 8% of expected dispute reduction has been achieved by Month 12. Resolution time for newly filed disputes has dropped to 5.8 years. Citizen satisfaction is up 17 points.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Phased Milestones Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Implementation Milestones & Departmental Accountability</span>
        </h2>

        <div className="space-y-4">
          {activePolicy.milestones.map((m) => (
            <div
              key={m.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {m.phase}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : m.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                <span className="text-xs text-slate-500">Target: Month {m.targetMonth}</span>
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-900 font-bold">{m.progressPct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      m.status === 'Completed'
                        ? 'bg-emerald-500'
                        : m.status === 'In Progress'
                        ? 'bg-blue-600'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${m.progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Departments */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Responsible Implementing Agencies:
          </span>
          <div className="flex flex-wrap gap-2">
            {activePolicy.responsibleDepartments.map((dept, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-medium shadow-xs"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
