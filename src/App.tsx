import React, { useState } from 'react';
import { User, UserRole } from './types';
import { SEED_USERS } from './data/seedData';
import { Navbar } from './components/Navbar';
import { DemoTourModal, DEMO_STEPS } from './components/DemoTourModal';
import { LandingHero } from './components/LandingHero';
import { PolicymakerDashboard } from './components/PolicymakerDashboard';
import { SolutionFinder } from './components/SolutionFinder';
import { PolicySimulator } from './components/PolicySimulator';
import { ImplementationTracker } from './components/ImplementationTracker';
import { ResearcherWorkspace } from './components/ResearcherWorkspace';
import { PaperSearch } from './components/PaperSearch';
import { DatasetHub } from './components/DatasetHub';
import { GISViewer } from './components/GISViewer';
import { AdminPortal } from './components/AdminPortal';
import { CitizenPortal } from './components/CitizenPortal';
import {
  Compass,
  PlayCircle,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Default to Mr. Rajesh Patel (Policymaker) for immediate demo-readiness
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[1]);
  const [currentTab, setCurrentTab] = useState<string>('policymaker-dashboard');

  // Parameters passed between tabs
  const [activeTabParams, setActiveTabParams] = useState<any>({});

  // Demo Tour State
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [currentDemoStepIndex, setCurrentDemoStepIndex] = useState<number>(0);

  // Switch User handler
  const handleSwitchUser = (role: UserRole) => {
    const user = SEED_USERS.find((u) => u.role === role) || SEED_USERS[0];
    setCurrentUser(user);

    // Sync default view to role
    if (role === 'Policymaker') setCurrentTab('policymaker-dashboard');
    else if (role === 'Researcher') setCurrentTab('researcher-dashboard');
    else if (role === 'Admin') setCurrentTab('admin');
    else if (role === 'Citizen') setCurrentTab('citizen');
  };

  const handleSelectTab = (tab: string, params?: any) => {
    setCurrentTab(tab);
    if (params) {
      setActiveTabParams(params);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to step in 15-step script
  const handleJumpToStep = (stepIndex: number, role: UserRole, tab: string, customParams?: any) => {
    setCurrentDemoStepIndex(stepIndex);
    const targetUser = SEED_USERS.find((u) => u.role === role) || currentUser;
    setCurrentUser(targetUser);
    setCurrentTab(tab);
    if (customParams) {
      setActiveTabParams(customParams);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingHero
            onSwitchUser={handleSwitchUser}
            onSelectTab={handleSelectTab}
            onOpenDemoTour={() => setIsDemoTourOpen(true)}
          />
        )}

        {currentTab === 'policymaker-dashboard' && (
          <PolicymakerDashboard
            currentUser={currentUser}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'solutions' && (
          <SolutionFinder
            onSelectTab={handleSelectTab}
            initialQuery={activeTabParams?.query || 'reduce land disputes'}
          />
        )}

        {currentTab === 'simulation' && (
          <PolicySimulator
            onSelectTab={handleSelectTab}
            initialParams={{
              baseCaseStudies: activeTabParams?.baseCases || ['cs-tamil-nadu-digital', 'cs-pune-mediation'],
              budgetCrores: activeTabParams?.budget || 150,
              timelineYears: activeTabParams?.timeline || 3,
            }}
          />
        )}

        {currentTab === 'tracking' && (
          <ImplementationTracker onSelectTab={handleSelectTab} />
        )}

        {currentTab === 'researcher-dashboard' && (
          <ResearcherWorkspace
            currentUser={currentUser}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'paper-search' && (
          <PaperSearch
            onSelectTab={handleSelectTab}
            initialQuery={activeTabParams?.query || 'urban expansion agricultural land'}
          />
        )}

        {currentTab === 'datasets' && (
          <DatasetHub
            onSelectTab={handleSelectTab}
            initialCategory={activeTabParams?.category || 'All'}
            initialDatasetId={activeTabParams?.datasetId}
          />
        )}

        {currentTab === 'gis-viewer' && (
          <GISViewer
            initialDistrict={activeTabParams?.district || 'Nashik'}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'citizen' && (
          <CitizenPortal onSelectTab={handleSelectTab} />
        )}
      </main>

      {/* Guided Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onJumpToStep={handleJumpToStep}
        currentStepIndex={currentDemoStepIndex}
      />

      {/* Footer */}
      <footer className="bg-[#0b1f38] border-t border-slate-200 text-slate-300 py-10 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-white font-bold">
              <span>Kshetra-X</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 text-xs font-normal">
                National Land Governance & Policy Innovation Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Department of Land Resources (DoLR), Ministry of Rural Development & Ministry of Electronics & IT (MeitY), Government of India
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => handleSelectTab('landing')}
              className="hover:text-white transition cursor-pointer"
            >
              Portal Overview
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold transition cursor-pointer flex items-center space-x-1"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>15-Step Demo Script</span>
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTab('gis-viewer')}
              className="hover:text-white transition cursor-pointer"
            >
              GIS Satellite Mosaics
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTab('datasets')}
              className="hover:text-white transition cursor-pointer"
            >
              50M+ Cadastral Database
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
