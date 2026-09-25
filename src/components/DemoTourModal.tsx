import React from 'react';
import { UserRole } from '../types';
import {
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  X,
  Compass,
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (stepIndex: number, role: UserRole, tab: string, customParams?: any) => void;
  currentStepIndex: number;
}

export const DEMO_STEPS = [
  {
    stepNumber: 1,
    title: 'Login as Policymaker (Mr. Rajesh Patel, IAS)',
    actor: 'Policymaker' as UserRole,
    tab: 'policymaker-dashboard',
    description:
      'Log into the Maharashtra executive portal as the District Collector of Nashik. System loads localized land governance data and pendency indicators.',
    talkingPoint:
      '"Government officials often lack synthesized, immediate evidence. Here, District Collector Rajesh Patel accesses his district’s pulse immediately."',
  },
  {
    stepNumber: 2,
    title: 'Review Problem Recognition on District Dashboard',
    actor: 'Policymaker' as UserRole,
    tab: 'policymaker-dashboard',
    description:
      'Inspect Nashik’s KPI cards: 15,432 pending land disputes (up 12% YoY alert), average resolution time of 7.2 years, and 1.8% annual agricultural land loss.',
    talkingPoint:
      '"The dashboard immediately highlights a critical bottleneck: 15,432 pending disputes trending upwards by 12% annually, costing farmers years of uncertainty."',
  },
  {
    stepNumber: 3,
    title: 'Search for Solutions ("How to reduce land disputes?")',
    actor: 'Policymaker' as UserRole,
    tab: 'solutions',
    customParams: { query: 'reduce land disputes' },
    description:
      'Click "Find Solutions" and trigger semantic search over 100+ research papers and 12+ empirical state case studies.',
    talkingPoint:
      '"Instead of 6 months of bureaucratic committee reports, semantic search surfaces empirical solutions in 2 seconds."',
  },
  {
    stepNumber: 4,
    title: 'Review Case Studies & Programs from Other States',
    actor: 'Policymaker' as UserRole,
    tab: 'solutions',
    description:
      'Inspect Tamil Nadu Digitization (40% dispute cut), Karnataka Digital Land Records System (50% cut), and Pune Mediation (25% cut in 3 years at ₹45 Cr).',
    talkingPoint:
      '"Policymakers can inspect documented outcomes from peer states rather than inventing policy in the dark."',
  },
  {
    stepNumber: 5,
    title: 'Compare Programs in the Decision Matrix',
    actor: 'Policymaker' as UserRole,
    tab: 'solutions',
    customParams: { viewCompare: true },
    description:
      'Open the side-by-side comparison table to inspect budgets, resolution time gains, and key success factors.',
    talkingPoint:
      '"Direct benchmarking shows that digitization solves boundary mapping, while community mediation cuts family partition disputes in half."',
  },
  {
    stepNumber: 6,
    title: 'Launch Policy Simulation Engine',
    actor: 'Policymaker' as UserRole,
    tab: 'simulation',
    customParams: {
      budget: 150,
      timeline: 3,
      baseCases: ['cs-tamil-nadu-digital', 'cs-pune-mediation'],
    },
    description:
      'Configure a hybrid policy: Combine Tamil Nadu Cadastral Resurvey + Pune Mediation Centers with ₹150 Crore budget over 3 years for Nashik.',
    talkingPoint:
      '"We combine the spatial precision of cadastral resurvey with the speed of grassroots mediation."',
  },
  {
    stepNumber: 7,
    title: 'Run Simulation & Review ML Prediction Curves',
    actor: 'Policymaker' as UserRole,
    tab: 'simulation',
    description:
      'System calculates case-based regression prediction: 55% dispute reduction, 45% resolution time cut, and 85% confidence score with month-by-month trajectory.',
    talkingPoint:
      '"Our predictive model forecasts a 55% reduction (down to 6,944 pending cases) with 85% statistical confidence, backed by Month 1-36 milestones."',
  },
  {
    stepNumber: 8,
    title: 'Contrast with the "Do Nothing" Scenario',
    actor: 'Policymaker' as UserRole,
    tab: 'simulation',
    description:
      'Review comparison cards: Doing nothing leads to disputes swelling by +12%/year (21,600+ cases). Approve policy into the national registry!',
    talkingPoint:
      '"Clear evidence of consequence: Inaction will cost thousands more litigations, while this approved policy sets concrete accountability."',
  },
  {
    stepNumber: 9,
    title: 'Track Live Implementation (Nashik Combined Mission)',
    actor: 'Policymaker' as UserRole,
    tab: 'tracking',
    description:
      'View ongoing Month 12 tracking: 1,232 disputes resolved (8% reduction), ₹42 Cr budget spent, actual disputes (14,200) vs predicted (14,100) on track.',
    talkingPoint:
      '"Policy doesn’t stop at approval. Real-time telemetry verifies whether Month 12 milestones match simulation predictions within 0.7% variance."',
  },
  {
    stepNumber: 10,
    title: 'Open GIS Satellite Viewer & Multi-Decadal Time Slider',
    actor: 'Policymaker' as UserRole,
    tab: 'gis-viewer',
    customParams: { district: 'Nashik' },
    description:
      'Examine spatial dispute hotspots and animate 30 years of land use change (1995 to 2025) showing urban expansion from 7.5% to 22.4%.',
    talkingPoint:
      '"Spatial ground truth: The time slider visually animates how peri-urban growth along transport corridors triggered high dispute density."',
  },
  {
    stepNumber: 11,
    title: 'Switch Persona to Researcher (Dr. Priya Sharma, IIT Delhi)',
    actor: 'Researcher' as UserRole,
    tab: 'researcher-dashboard',
    description:
      'Seamlessly switch to the academic researcher perspective. View Dr. Sharma’s projects, reading lists, and policy impact metrics.',
    talkingPoint:
      '"Now let’s look at the researcher side: How academics find data, conduct GIS analysis, and see their work directly inform government policy."',
  },
  {
    stepNumber: 12,
    title: 'Search Research Papers with Semantic Retrieval',
    actor: 'Researcher' as UserRole,
    tab: 'paper-search',
    customParams: { query: 'urban expansion agricultural land' },
    description:
      'Search for "urban expansion agricultural land" across 105+ indexed papers with semantic scoring, DOI references, and citation counts.',
    talkingPoint:
      '"Our semantic retrieval matches concepts like urban sprawl and agricultural displacement even with varied terminology."',
  },
  {
    stepNumber: 13,
    title: 'Explore Datasets Hub & Sample Data Previews',
    actor: 'Researcher' as UserRole,
    tab: 'datasets',
    customParams: { category: 'Satellite' },
    description:
      'Inspect 50M+ Cadastral Land Records, 30-Year Satellite Rasters, and IMD Climate Grids with real tabular sample records and export tools.',
    talkingPoint:
      '"Instead of 6 months requesting data from silos, researchers preview real cadastral and satellite records instantly."',
  },
  {
    stepNumber: 14,
    title: 'Collaborative Research Workspace & Publishing',
    actor: 'Researcher' as UserRole,
    tab: 'researcher-dashboard',
    description:
      'View project "Urban Growth Study", collaborator discussions with Dr. Arvind & Dr. Meera, and test the "Publish Research" workflow.',
    talkingPoint:
      '"Collaborative project workspaces bridge academic analysis directly to published papers that become searchable for state governments."',
  },
  {
    stepNumber: 15,
    title: 'Conclude: Bridging Research to Policy Action',
    actor: 'Admin' as UserRole,
    tab: 'landing',
    description:
      'Summary of national impact: Lag reduced from 3 years to weeks, policy success rate improved from 60% to 85%+, saving thousands of crores.',
    talkingPoint:
      '"Kshetra-X solves the national fragmentation crisis: connecting researchers, datasets, and policymakers to deliver evidence-based governance."',
  },
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToStep,
  currentStepIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 border-b border-blue-950/20 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-xs font-bold">
              <PlayCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Guided Prototype Evaluation Script (15 Steps)</span>
                <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow-xs">
                  Demo Ready
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Click any step to instantly set the persona, load the view, and execute the workflow.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="overflow-y-auto p-6 space-y-3.5 divide-y divide-slate-100">
          {DEMO_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step.stepNumber}
                className={`pt-3.5 first:pt-0 rounded-xl transition ${
                  isCurrent ? 'bg-blue-50/70 p-3 border border-blue-200' : 'hover:bg-slate-50 p-2'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                            step.actor === 'Policymaker'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : step.actor === 'Researcher'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-purple-50 text-purple-800 border-purple-300'
                          }`}
                        >
                          {step.actor}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                      <div className="mt-2 bg-amber-50/70 border border-amber-200 rounded-lg p-2 text-xs text-amber-900 italic flex items-start space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{step.talkingPoint}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onJumpToStep(idx, step.actor, step.tab, step.customParams);
                      onClose();
                    }}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                  >
                    <span>Run Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Total Evaluation Time: ~10 to 15 minutes • Covers all 3 complete workflows
          </p>
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
