import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SimulationResult, SimulationParams, CaseStudy, Policy } from '../types';
import { SEED_CASE_STUDIES } from '../data/seedData';
import {
  Cpu,
  Play,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Layers,
  Coins,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  Award,
} from 'lucide-react';

interface PolicySimulatorProps {
  onSelectTab: (tab: string, params?: any) => void;
  initialParams?: Partial<SimulationParams>;
}

export const PolicySimulator: React.FC<PolicySimulatorProps> = ({
  onSelectTab,
  initialParams,
}) => {
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>(
    initialParams?.baseCaseStudies || ['cs-tamil-nadu-digital', 'cs-pune-mediation']
  );
  const [budgetCrores, setBudgetCrores] = useState<number>(initialParams?.budgetCrores || 150);
  const [timelineYears, setTimelineYears] = useState<number>(initialParams?.timelineYears || 3);
  const [targetDisputeReduction, setTargetDisputeReduction] = useState<number>(
    initialParams?.targetDisputeReduction || 50
  );
  const [includeDigitization, setIncludeDigitization] = useState<boolean>(true);
  const [surveyCompletionTarget, setSurveyCompletionTarget] = useState<number>(90);
  const [mediationCenters, setMediationCenters] = useState<number>(8);
  const [trainingBudgetCrores, setTrainingBudgetCrores] = useState<number>(15);
  const [district, setDistrict] = useState<string>('Nashik');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(() => {
    // Initial default pre-computed run for immediate evaluation
    return computeSimulationLocally({
      baseCaseStudies: ['cs-tamil-nadu-digital', 'cs-pune-mediation'],
      budgetCrores: 150,
      timelineYears: 3,
      targetDisputeReduction: 50,
      district: 'Nashik',
      state: 'Maharashtra',
      includeDigitization: true,
      surveyCompletionTarget: 90,
      mediationCenters: 8,
      trainingBudgetCrores: 15,
    });
  });

  const [isPolicyApproved, setIsPolicyApproved] = useState<boolean>(false);
  const [approvedPolicyName, setApprovedPolicyName] = useState<string>(
    'Nashik District Comprehensive Land Dispute Reduction & Cadastral Resurvey Mission'
  );

  function computeSimulationLocally(params: SimulationParams): SimulationResult {
    const baselineDisputes = 15432;
    const selectedCases = SEED_CASE_STUDIES.filter((c) => params.baseCaseStudies.includes(c.id));
    const avgHistorical =
      selectedCases.length > 0
        ? selectedCases.reduce((acc, c) => acc + c.disputeReductionPercent, 0) / selectedCases.length
        : 40;

    let synergy = params.baseCaseStudies.length >= 2 ? 1.18 : 1.0;
    const budgetFactor = Math.min(Math.max(params.budgetCrores / 150, 0.6), 1.25);
    const surveyFactor = params.surveyCompletionTarget / 100;
    const medFactor = Math.min(params.mediationCenters / 6, 1.3);

    let reduction = Math.round(avgHistorical * synergy * (0.4 * budgetFactor + 0.35 * surveyFactor + 0.25 * medFactor));
    reduction = Math.min(Math.max(reduction, 20), 85);

    let confidence = 75;
    if (selectedCases.some((c) => c.sourceState === 'Maharashtra')) confidence += 10;
    if (params.baseCaseStudies.length >= 2) confidence += 5;
    confidence = Math.min(confidence, 92);

    const resReduction = Math.round(reduction * 0.82);
    const newDisputes = Math.round(baselineDisputes * (1 - reduction / 100));
    const totalMonths = params.timelineYears * 12;

    const timelineProgression = [];
    for (let m = 1; m <= totalMonths; m += 3) {
      const frac = Math.pow(m / totalMonths, 1.7);
      const currentPct = Math.round(reduction * frac * 10) / 10;
      const activeCases = Math.round(baselineDisputes * (1 - currentPct / 100));
      let milestone = '';
      if (m === 3) milestone = 'Setup mediation sites & onboard survey teams';
      else if (m === 6) milestone = 'Launch Sub-District Conciliation Forums';
      else if (m === 12) milestone = '500k Cadastral Records Resurveyed (Milestone 1)';
      else if (m === 24) milestone = 'District-wide digital registry synchronization';
      else if (m === totalMonths) milestone = `Target ${reduction}% net reduction reached`;

      timelineProgression.push({
        month: m,
        disputeReductionPct: currentPct,
        activeCases,
        milestone,
      });
    }

    return {
      id: `sim-${Date.now()}`,
      params,
      predictedDisputeReduction: reduction,
      confidenceScore: confidence,
      predictedResolutionTimeReduction: resReduction,
      predictedNewDisputesYear3: newDisputes,
      costPerCaseResolved: Math.round((params.budgetCrores * 10000000) / (baselineDisputes - newDisputes)),
      timelineProgression,
      scenarios: {
        doNothing: {
          disputeChange: '+12% per year',
          outcomeDescription: 'Disputes swell to 21,680+ by Year 3, average resolution extends to 9.2 years',
        },
        singleProgram: {
          disputeReductionPct: Math.round(reduction * 0.65),
          outcomeDescription: 'Resolves boundary or family claims in isolation, leaving systemic backlog intact',
        },
        proposedCombined: {
          disputeReductionPct: reduction,
          outcomeDescription: `Integrates Tamil Nadu spatial cadastral precision with Pune community mediation for sustainable ${reduction}% resolution`,
        },
      },
      riskAssessment: {
        implementationRisk: 'Medium',
        fundingRisk: 'Low',
        adoptionRisk: 'Medium',
        mitigationStrategy:
          'Establish quarterly District Collector review; mandate mobile revenue dispute clinics at sub-district level; provide standardized mediator honorariums.',
      },
      similarHistoricalCasesCount: selectedCases.length,
      createdAt: new Date().toISOString(),
    };
  }

  const handleRunSimulation = () => {
    setIsLoading(true);
    setIsPolicyApproved(false);

    setTimeout(() => {
      const res = computeSimulationLocally({
        baseCaseStudies: selectedCaseIds,
        budgetCrores,
        timelineYears,
        targetDisputeReduction,
        district,
        state: 'Maharashtra',
        includeDigitization,
        surveyCompletionTarget,
        mediationCenters,
        trainingBudgetCrores,
      });
      setSimulationResult(res);
      setIsLoading(false);
    }, 600);
  };

  const handleApprovePolicy = () => {
    setIsPolicyApproved(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const toggleCaseStudy = (id: string) => {
    if (selectedCaseIds.includes(id)) {
      if (selectedCaseIds.length > 1) {
        setSelectedCaseIds(selectedCaseIds.filter((x) => x !== id));
      }
    } else {
      if (selectedCaseIds.length < 3) {
        setSelectedCaseIds([...selectedCaseIds, id]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Predictive ML Policy Engine</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Simulate Land Policy Outcomes Before Sanctioning Funds
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Combines multi-state historical outcomes (Tamil Nadu, Karnataka, Pune) with Nashik’s baseline statistics to project reduction rates, confidence intervals, and month-by-month trajectory.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs flex items-center space-x-3 shrink-0">
          <div>
            <div className="text-slate-300">Target District</div>
            <div className="font-bold text-white">Nashik, Maharashtra</div>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <div className="text-slate-300">Baseline Pendency</div>
            <div className="font-bold text-amber-300">15,432 Cases</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Predictions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Configuration Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>1. Select Base Programs to Combine</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Synthesize empirical models from other state implementations
            </p>
          </div>

          {/* Program Checkboxes */}
          <div className="space-y-2.5">
            {SEED_CASE_STUDIES.slice(0, 4).map((cs) => {
              const checked = selectedCaseIds.includes(cs.id);
              return (
                <div
                  key={cs.id}
                  onClick={() => toggleCaseStudy(cs.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                    checked
                      ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="mt-1 accent-amber-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{cs.title}</span>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                        ↓ {cs.disputeReductionPercent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {cs.solutionImplemented}
                    </p>
                    <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-500">
                      <span>Outlay: ₹{cs.costCrores} Cr</span>
                      <span>•</span>
                      <span>Timeline: {Math.round(cs.durationMonths / 12)} Yrs</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Parameter Sliders */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Adjust Intervention Parameters
            </h3>

            {/* Budget Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Financial Outlay</span>
                <span className="text-amber-700 font-bold">₹{budgetCrores} Crore</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={budgetCrores}
                onChange={(e) => setBudgetCrores(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>₹30 Cr (Pilot)</span>
                <span>₹150 Cr (Recommended)</span>
                <span>₹300 Cr (Full State)</span>
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Implementation Horizon</span>
                <span className="text-blue-700 font-bold">{timelineYears} Years ({timelineYears * 12} Months)</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={timelineYears}
                onChange={(e) => setTimelineYears(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
              </div>
            </div>

            {/* Survey Target & Mediation Centers */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Cadastral Resurvey Target
                </label>
                <select
                  value={surveyCompletionTarget}
                  onChange={(e) => setSurveyCompletionTarget(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-900 font-medium shadow-xs"
                >
                  <option value={80}>80% Coverage</option>
                  <option value={90}>90% Coverage (High)</option>
                  <option value={100}>100% Complete Resurvey</option>
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Sub-District Mediation Centers
                </label>
                <select
                  value={mediationCenters}
                  onChange={(e) => setMediationCenters(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-900 font-medium shadow-xs"
                >
                  <option value={6}>6 Centers (Sub-Div)</option>
                  <option value={8}>8 Centers (Recommended)</option>
                  <option value={15}>15 Centers (All Sub-Districts)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Simulating ML Outcome Curves...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-slate-950" />
                <span>Run Policy Simulation Model</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Prediction Results */}
        {simulationResult && (
          <div className="lg:col-span-7 space-y-6">
            {/* Top Prediction Summary Banner */}
            <div className="bg-white border-2 border-emerald-500/50 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Simulation Complete • Model Ver. 2.4
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Predicted Outcome of Combined Policy
                  </h2>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-600 font-medium">Confidence Score:</span>
                  <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full shadow-xs">
                    {simulationResult.confidenceScore}% (High)
                  </span>
                </div>
              </div>

              {/* 4 Outcome Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
                  <span className="text-[11px] text-emerald-800 font-semibold">Dispute Reduction</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    ↓ {simulationResult.predictedDisputeReduction}%
                  </div>
                  <span className="text-[10px] text-slate-500">Year 3 Target</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[11px] text-slate-500 font-medium">Remaining Disputes</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {simulationResult.predictedNewDisputesYear3.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">Down from 15,432</span>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                  <span className="text-[11px] text-blue-800 font-semibold">Resolution Speed</span>
                  <div className="text-2xl font-black text-blue-700 mt-1">
                    ↓ {simulationResult.predictedResolutionTimeReduction}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">~3.9 yrs (from 7.2)</span>
                </div>

                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3">
                  <span className="text-[11px] text-amber-800 font-semibold">Cost / Case Resolved</span>
                  <div className="text-2xl font-black text-amber-700 mt-1">
                    ₹{Math.round(simulationResult.costPerCaseResolved / 1000)}k
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">vs ₹240k litigation</span>
                </div>
              </div>

              {/* Trajectory Timeline Curve (Months 1 to 36) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Projected Month-by-Month Trajectory (Months 1–36)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">S-Curve Empirical Dispersion</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {/* Timeline Bar Progression */}
                  <div className="space-y-3">
                    {simulationResult.timelineProgression.slice(0, 5).map((step) => (
                      <div key={step.month} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-900">
                            Month {step.month}: {step.milestone}
                          </span>
                          <span className="font-bold text-emerald-700">
                            {step.disputeReductionPct}% Reduction ({step.activeCases.toLocaleString()} remaining)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${(step.disputeReductionPct / simulationResult.predictedDisputeReduction) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scenario Comparisons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Do Nothing */}
                <div className="bg-red-50/70 border border-red-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-red-700 uppercase">Scenario A: Do Nothing</span>
                  <div className="text-base font-black text-red-950 mt-1">+12% p.a. Growth</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Pending disputes surge to 21,680+ by Year 3 with resolution time exceeding 9 years.
                  </p>
                </div>

                {/* Single Program */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Scenario B: Single Program</span>
                  <div className="text-base font-black text-slate-900 mt-1">
                    ↓ {simulationResult.scenarios.singleProgram.disputeReductionPct}% Reduction
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Addresses either boundary or family disputes in isolation; incomplete impact.
                  </p>
                </div>

                {/* Proposed Combined */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Scenario C: Proposed Combined</span>
                  <div className="text-base font-black text-emerald-800 mt-1">
                    ↓ {simulationResult.predictedDisputeReduction}% Reduction
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Optimal synergy between spatial survey ground truthing and grassroots conciliation.
                  </p>
                </div>
              </div>

              {/* Risk Assessment Matrix */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Risk Assessment & Strategic Mitigation</span>
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 block font-medium">Implementation</span>
                    <span className="font-bold text-amber-700">Medium Risk</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 block font-medium">Funding</span>
                    <span className="font-bold text-emerald-700">Low Risk (Allocated)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 block font-medium">Adoption</span>
                    <span className="font-bold text-amber-700">Medium Risk</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 italic pt-1">
                  Mitigation: {simulationResult.riskAssessment.mitigationStrategy}
                </p>
              </div>

              {/* Action Buttons: Approve Policy */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                {isPolicyApproved ? (
                  <div className="w-full bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>
                        <strong>Policy Approved & Enacted!</strong> Registered in National Innovation Database.
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectTab('tracking')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition shadow-xs"
                    >
                      View Live Tracking →
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-slate-500">
                      Collector Authority: Ready for administrative sanction under MLRC Section 14
                    </span>
                    <button
                      onClick={handleApprovePolicy}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition shadow-md cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Approve & Enact Policy</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
