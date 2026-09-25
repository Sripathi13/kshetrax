import React from 'react';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Clock,
  Coins,
  Share2,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Database,
  Search,
  MapPin,
  Cpu,
  TrendingUp,
  FileCheck,
  Building2,
  GraduationCap,
} from 'lucide-react';

interface LandingHeroProps {
  onSwitchUser: (role: UserRole) => void;
  onSelectTab: (tab: string) => void;
  onOpenDemoTour: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSwitchUser,
  onSelectTab,
  onOpenDemoTour,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full text-xs text-blue-900 font-bold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>National Digital Platform for Evidence-Based Land Governance</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Transforming Land Policy from <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">Opinion to Evidence</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                India loses ₹5,000+ Crore annually with a 2–3 year decision lag while 40% of land policies fail. Kshetra-X bridges the divide—unifying 50M+ cadastral records, 30 years of satellite earth observations, and 100+ research papers into an intelligent policy simulation and decision engine.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    onSwitchUser('Policymaker');
                    onSelectTab('policymaker-dashboard');
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center space-x-2 transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Building2 className="w-5 h-5 text-slate-950" />
                  <span>Enter as Policymaker (Collector Nashik)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('Researcher');
                    onSelectTab('researcher-dashboard');
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 rounded-xl flex items-center space-x-2 border border-slate-300 transition shadow-xs cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Enter as Researcher (IIT Delhi)</span>
                </button>

                <button
                  onClick={onOpenDemoTour}
                  className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-5 py-3 rounded-xl flex items-center space-x-2 transition cursor-pointer shadow-md"
                >
                  <PlayCircle className="w-5 h-5 text-amber-300" />
                  <span>Launch 15-Step Demo Script</span>
                </button>
              </div>

              {/* Key target outcomes */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 text-left">
                <div>
                  <div className="text-2xl font-black text-amber-600">Weeks</div>
                  <div className="text-xs text-slate-500 font-medium">Decision Lag (down from 2-3 yrs)</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">85%+</div>
                  <div className="text-xs text-slate-500 font-medium">Policy Success Rate (up from 60%)</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-700">50M+</div>
                  <div className="text-xs text-slate-500 font-medium">Digitized Cadastral Records</div>
                </div>
              </div>
            </div>

            {/* Right Card: The Problem vs Solution Matrix */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  The National Problem We Are Solving
                </span>
                <span className="text-[11px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
                  Critical Challenge
                </span>
              </div>

              {/* 4 Pain Points */}
              <div className="space-y-3.5">
                <div className="flex items-start space-x-3 bg-red-50/70 border border-red-200 p-3 rounded-xl">
                  <Coins className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950">₹5,000+ Crore Wasted Annually</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Policies formulated without empirical validation frequently stall in litigation or fail to resolve root causes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-red-50/70 border border-red-200 p-3 rounded-xl">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950">~40% Policies Produce Poor Outcomes</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Subjective opinions and anecdotal traditions override longitudinal empirical evidence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-red-50/70 border border-red-200 p-3 rounded-xl">
                  <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950">2 to 3 Years Lag in Adoption</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Groundbreaking university research gathers dust in academic silos before reaching field collectors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-red-50/70 border border-red-200 p-3 rounded-xl">
                  <Share2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950">Information Silos Across 50+ Sources</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Researchers spend 6+ months just assembling disparate datasets across revenue, forestry, and space agencies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Solution Ribbon */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-emerald-950">The Kshetra-X Solution:</span>
                  <p className="text-[11px] text-slate-600">Centralize • Discover with AI • Simulate • Monitor</p>
                </div>
                <button
                  onClick={() => {
                    onSwitchUser('Policymaker');
                    onSelectTab('simulation');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                >
                  Test Simulator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            End-to-End Governance Architecture
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered specifically to fulfill national research and evidence-based policy formulation standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Intelligent Discovery</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Elasticsearch semantic retrieval with transformer embeddings. Find 50+ relevant papers and case studies in &lt;2 seconds instead of 6 months.
            </p>
            <button
              onClick={() => {
                onSwitchUser('Researcher');
                onSelectTab('paper-search');
              }}
              className="mt-4 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore Semantic Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-400 hover:shadow-md transition shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Geospatial Multitemporal GIS</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              30-year calibrated satellite imagery (1995–2025) with dynamic time slider, LULC classification, and district-level agricultural loss metrics.
            </p>
            <button
              onClick={() => onSelectTab('gis-viewer')}
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Launch GIS Viewer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Policy Outcome Simulator</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Case-based reasoning and regression bounds predict dispute reduction %, cost per case, and month-by-month trajectory with confidence scores.
            </p>
            <button
              onClick={() => {
                onSwitchUser('Policymaker');
                onSelectTab('simulation');
              }}
              className="mt-4 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Run Policy Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-md transition shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Telemetry & Tracking</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Post-approval accountability: Live comparison of actual metrics vs. predicted milestones at Month 12, budget expenditure, and variance audits.
            </p>
            <button
              onClick={() => {
                onSwitchUser('Policymaker');
                onSelectTab('tracking');
              }}
              className="mt-4 text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Tracking Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured National Datasets Banner */}
      <section className="py-12 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Connected National Registries
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Integrated with 50M+ Cadastral Records & Space Observations
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl font-normal">
              Standardized data pipelines from DoLR, Survey of India, ISRO Bhuvan, IMD Weather Grids, and Forest Survey of India.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onSelectTab('datasets')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-300 transition cursor-pointer"
            >
              Browse Datasets Hub
            </button>
            <button
              onClick={() => onSelectTab('solutions')}
              className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition cursor-pointer shadow-xs"
            >
              Explore 12+ Case Studies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
