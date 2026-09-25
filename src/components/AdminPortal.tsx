import React, { useState } from 'react';
import { User, ResearchPaper, Dataset } from '../types';
import { SEED_PAPERS, SEED_DATASETS, SEED_USERS } from '../data/seedData';
import {
  ShieldCheck,
  Server,
  Activity,
  Upload,
  RefreshCw,
  Users,
  CheckCircle2,
  HardDrive,
  Clock,
  Sparkles,
  Search,
  Database,
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: User;
  onSelectTab: (tab: string, params?: any) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onSelectTab,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'ingestion' | 'users'>('health');

  // Ingestion form state
  const [ingestTitle, setIngestTitle] = useState('');
  const [ingestAuthors, setIngestAuthors] = useState('');
  const [ingestAbstract, setIngestAbstract] = useState('');
  const [ingestTopic, setIngestTopic] = useState('land_disputes');
  const [ingestSuccess, setIngestSuccess] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('All national data pipelines synchronized.');

  const handleIngestPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestTitle || !ingestAbstract) return;

    const paper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: ingestTitle,
      authors: ingestAuthors ? ingestAuthors.split(',').map((a) => a.trim()) : ['National Land Governance Contributor'],
      abstract: ingestAbstract,
      publicationDate: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear(),
      journal: 'DoLR Land Modernization Ingestion Archive',
      doi: `10.2139/dolr.${Date.now()}`,
      keywords: ['land governance', 'policy innovation'],
      citationCount: 0,
      downloads: 1,
      views: 14,
      datasetsUsed: ['ds-land-records-cadastral'],
      topic: ingestTopic,
      relevanceScore: 99,
    };

    SEED_PAPERS.unshift(paper);
    setIngestSuccess(true);
    setIngestTitle('');
    setIngestAuthors('');
    setIngestAbstract('');
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(`Pipeline refresh completed at ${new Date().toLocaleTimeString()} (50.42M parcels verified).`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Government Administration & Ingestion Console</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            System Infrastructure & Data Management
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Officer: <strong className="text-white font-bold">{currentUser.fullName}</strong> • Department of Land Resources (DoLR), Ministry of Rural Development
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeTab === 'health'
                ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            System Health
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeTab === 'ingestion'
                ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            Data Ingestion
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            RBAC Users ({SEED_USERS.length})
          </button>
        </div>
      </div>

      {/* TAB 1: System Health */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Health Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">System Uptime</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">99.98%</div>
              <span className="text-[10px] text-slate-500">Tier-3 National Cloud (NIC)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Avg Semantic Latency</span>
              <div className="text-2xl font-black text-blue-700 mt-1">42 ms</div>
              <span className="text-[10px] text-slate-500">Elasticsearch 8.11 Cluster</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Parcels Indexed</span>
              <div className="text-2xl font-black text-slate-900 mt-1">50.42 Million</div>
              <span className="text-[10px] text-emerald-700 font-semibold">94.2% Pan-India Digitized</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Daily Query Volume</span>
              <div className="text-2xl font-black text-amber-700 mt-1">24,500</div>
              <span className="text-[10px] text-slate-500">Across 718 District Portals</span>
            </div>
          </div>

          {/* Connected Pipelines */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Government API Integrations & Data Freshness</h3>
                <p className="text-xs text-slate-500 mt-0.5">{syncStatus}</p>
              </div>
              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Trigger Refresh Job</span>
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'DoLR Land Cadastral Database (50M Parcels)', status: 'Connected', latency: '18ms', lastSync: 'Today, 02:15 AM' },
                { name: 'ISRO Bhuvan Satellite Earth Observation (Landsat/Sentinel)', status: 'Connected', latency: '65ms', lastSync: 'Yesterday, 11:30 PM' },
                { name: 'IMD High-Resolution Precipitation Grids (0.25°)', status: 'Connected', latency: '24ms', lastSync: 'Today, 00:00 AM' },
                { name: 'National Judicial Data Grid (NJDG) Revenue Cases', status: 'Connected', latency: '38ms', lastSync: 'Today, 01:45 AM' },
                { name: 'Survey of India CORS Ground Station Network', status: 'Connected', latency: '12ms', lastSync: 'Continuous Live' },
              ].map((pipe, i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{pipe.name}</span>
                    <span className="text-[10px] text-slate-500 block">Last Synced: {pipe.lastSync}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-600 text-[11px] font-mono">{pipe.latency}</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {pipe.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Data Ingestion */}
      {activeTab === 'ingestion' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Ingest New Research Paper or State Policy Document</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload PDF or enter metadata. Semantic embedding pipeline extracts concepts and indexes within 500ms.
            </p>
          </div>

          {ingestSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Document successfully parsed and semantic vector generated! Now live in national search.
              </span>
            </div>
          )}

          <form onSubmit={handleIngestPaper} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Document / Paper Title *
              </label>
              <input
                type="text"
                value={ingestTitle}
                onChange={(e) => setIngestTitle(e.target.value)}
                placeholder="e.g. Drone Resurvey Impact in Uttar Pradesh Revenue Divisions"
                required
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Authors / Sponsoring Department
                </label>
                <input
                  type="text"
                  value={ingestAuthors}
                  onChange={(e) => setIngestAuthors(e.target.value)}
                  placeholder="e.g. Dr. K. Sharma, Revenue Department UP"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Thematic Classification
                </label>
                <select
                  value={ingestTopic}
                  onChange={(e) => setIngestTopic(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 shadow-xs"
                >
                  <option value="land_disputes">Land Disputes & ADR Mediation</option>
                  <option value="urban_expansion">Urban Expansion & Farmland Loss</option>
                  <option value="cadastral_survey">Cadastral Survey & SVAMITVA</option>
                  <option value="climate_adaptation">Climate Adaptation</option>
                  <option value="forest_rights">Forest Rights Act</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Executive Abstract / Key Findings *
              </label>
              <textarea
                rows={4}
                value={ingestAbstract}
                onChange={(e) => setIngestAbstract(e.target.value)}
                placeholder="Provide a synthesis of empirical methodology, sample size, and policy recommendations..."
                required
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Ingest & Index Document</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Users & RBAC */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Role-Based Access Control (RBAC) Registry</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforcing security boundaries: Researchers access anonymized/aggregate data; Policymakers access live cadastral records and policy simulation; Citizens view public statistics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Jurisdiction</th>
                  <th className="p-3">Security Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SEED_USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                      <img src={u.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span>{u.fullName}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-700">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          u.role === 'Policymaker'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : u.role === 'Researcher'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : u.role === 'Admin'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      {u.district ? `${u.district}, ${u.state}` : u.state || 'National'}
                    </td>
                    <td className="p-3 text-[11px] text-slate-600">
                      {u.role === 'Policymaker' ? 'Full Cadastral Access + Simulation' : u.role === 'Researcher' ? 'Anonymized Research Access' : u.role === 'Admin' ? 'Super Admin' : 'Public Dashboards'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
