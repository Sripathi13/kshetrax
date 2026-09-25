import React from 'react';
import { User, UserRole } from '../types';
import {
  Compass,
  FileText,
  Database,
  MapPin,
  TrendingUp,
  Cpu,
  Shield,
  UserCheck,
  PlayCircle,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDemoTour: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  currentTab,
  onSelectTab,
  onOpenDemoTour,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Policymaker':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Researcher':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Admin':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Citizen':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-slate-800 border-b border-slate-200 shadow-xs">
      {/* Top Government Banner */}
      <div className="bg-[#0b2447] px-4 py-1.5 text-xs text-slate-200 flex justify-between items-center border-b border-[#071933]">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-amber-400">Government of India</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-200 font-medium">National Land Governance & Policy Innovation Mission</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600 font-medium">
            System Live: 99.98% Uptime
          </span>
          <button
            onClick={onOpenDemoTour}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-2.5 py-0.5 rounded text-xs hover:from-amber-400 hover:to-orange-400 transition cursor-pointer shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Interactive Demo Tour</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-md">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
                Kshetra-X
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Evidence-Based Land Governance & Spatial Innovation Portal
            </p>
          </div>
        </div>

        {/* Navigation Tabs based on Role */}
        <nav className="hidden lg:flex items-center space-x-1">
          {currentUser.role === 'Policymaker' && (
            <>
              <button
                onClick={() => onSelectTab('policymaker-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'policymaker-dashboard'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                District Dashboard
              </button>
              <button
                onClick={() => onSelectTab('solutions')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'solutions'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Find Solutions
              </button>
              <button
                onClick={() => onSelectTab('simulation')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition ${
                  currentTab === 'simulation'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Policy Simulator</span>
              </button>
              <button
                onClick={() => onSelectTab('tracking')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'tracking'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Implementation Tracker
              </button>
            </>
          )}

          {currentUser.role === 'Researcher' && (
            <>
              <button
                onClick={() => onSelectTab('researcher-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'researcher-dashboard'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Workspace & Impact
              </button>
              <button
                onClick={() => onSelectTab('paper-search')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'paper-search'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Paper Search (Semantic)
              </button>
              <button
                onClick={() => onSelectTab('datasets')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'datasets'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Datasets Hub
              </button>
            </>
          )}

          {currentUser.role === 'Admin' && (
            <>
              <button
                onClick={() => onSelectTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-purple-700 hover:bg-slate-100'
                }`}
              >
                Administration & Ingestion
              </button>
              <button
                onClick={() => onSelectTab('solutions')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'solutions'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                State Policy Analytics
              </button>
            </>
          )}

          {currentUser.role === 'Citizen' && (
            <>
              <button
                onClick={() => onSelectTab('citizen')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'citizen'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100'
                }`}
              >
                Public Transparency
              </button>
              <button
                onClick={() => onSelectTab('paper-search')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentTab === 'paper-search'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Open Research
              </button>
            </>
          )}

          {/* Common Map Tab */}
          <button
            onClick={() => onSelectTab('gis-viewer')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition ${
              currentTab === 'gis-viewer'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>GIS Satellite Viewer</span>
          </button>
        </nav>

        {/* User Persona Switcher & Profile */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition text-left cursor-pointer shadow-xs"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover border border-amber-500"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center space-x-1">
                <span>{currentUser.fullName}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${getRoleBadgeColor(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role}
                </span>
                {currentUser.district && (
                  <span className="text-[10px] text-slate-500 font-medium">{currentUser.district}</span>
                )}
              </div>
            </div>
          </button>

          {/* Dropdown Menu for Switch Persona */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-slate-800">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Switch Active Persona
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Test role-based access & workflows instantly
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSwitchUser('Policymaker');
                    onSelectTab('policymaker-dashboard');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-amber-50/60 transition ${
                    currentUser.role === 'Policymaker' ? 'bg-amber-50 border-l-4 border-amber-500' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    IAS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Mr. Rajesh Patel, IAS</p>
                    <p className="text-[11px] text-amber-700 font-medium">Policymaker • Collector Nashik</p>
                    <p className="text-[10px] text-slate-500">Can run simulations, approve policies</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('Researcher');
                    onSelectTab('researcher-dashboard');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-blue-50/60 transition ${
                    currentUser.role === 'Researcher' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    IIT
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Dr. Priya Sharma</p>
                    <p className="text-[11px] text-blue-700 font-medium">Researcher • Urban Planner, IIT Delhi</p>
                    <p className="text-[10px] text-slate-500">Can search papers, GIS datasets, publish</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('Admin');
                    onSelectTab('admin');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-purple-50/60 transition ${
                    currentUser.role === 'Admin' ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ADM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Priya Desai</p>
                    <p className="text-[11px] text-purple-700 font-medium">State Administrator • DoLR Maharashtra</p>
                    <p className="text-[10px] text-slate-500">Data quality, system health & ingestion</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('Citizen');
                    onSelectTab('citizen');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-emerald-50/60 transition ${
                    currentUser.role === 'Citizen' ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    CIT
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Arun Kumar Verma</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Citizen • Public Transparency View</p>
                    <p className="text-[10px] text-slate-500">Aggregated statistics, open research</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden bg-slate-50 px-4 py-2 border-t border-slate-200 flex overflow-x-auto space-x-2 text-xs">
        {currentUser.role === 'Policymaker' && (
          <>
            <button
              onClick={() => onSelectTab('policymaker-dashboard')}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === 'policymaker-dashboard' ? 'bg-blue-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('solutions')}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === 'solutions' ? 'bg-blue-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
              }`}
            >
              Find Solutions
            </button>
            <button
              onClick={() => onSelectTab('simulation')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${
                currentTab === 'simulation' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-800 bg-amber-50 border border-amber-200 font-medium'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => onSelectTab('tracking')}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === 'tracking' ? 'bg-blue-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
              }`}
            >
              Tracker
            </button>
          </>
        )}
        {currentUser.role === 'Researcher' && (
          <>
            <button
              onClick={() => onSelectTab('researcher-dashboard')}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === 'researcher-dashboard' ? 'bg-blue-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => onSelectTab('paper-search')}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === 'paper-search' ? 'bg-blue-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
              }`}
            >
              Paper Search
            </button>
            <button
              onClick={() => onSelectTab('datasets')}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === 'datasets' ? 'bg-blue-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
              }`}
            >
              Datasets
            </button>
          </>
        )}
        <button
          onClick={() => onSelectTab('gis-viewer')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
            currentTab === 'gis-viewer' ? 'bg-emerald-700 text-white' : 'text-slate-700 bg-white border border-slate-200'
          }`}
        >
          GIS Viewer
        </button>
      </div>
    </header>
  );
};
