import React, { useState } from 'react';
import { User, ResearchProject, ResearchPaper, Dataset } from '../types';
import { SEED_PROJECTS, SEED_PAPERS, SEED_DATASETS } from '../data/seedData';
import {
  FolderPlus,
  FileText,
  Database,
  Users,
  MessageSquare,
  Upload,
  CheckCircle2,
  TrendingUp,
  Download,
  Share2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Send,
  Plus,
} from 'lucide-react';

interface ResearcherWorkspaceProps {
  currentUser: User;
  onSelectTab: (tab: string, params?: any) => void;
}

export const ResearcherWorkspace: React.FC<ResearcherWorkspaceProps> = ({
  currentUser,
  onSelectTab,
}) => {
  const [projects, setProjects] = useState<ResearchProject[]>(SEED_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'papers' | 'datasets' | 'notes' | 'publish'>('overview');

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');

  // Publish Form State
  const [publishTitle, setPublishTitle] = useState(
    'Spatial Dynamics of Peri-Urban Agricultural Conversion in Western India: A 30-Year Satellite Assessment'
  );
  const [publishAbstract, setPublishAbstract] = useState(
    'Using multi-temporal Landsat-5 and Sentinel-2 calibrated imagery (1995-2025), this study quantifies the loss of high-yield irrigated farmlands to peri-urban sprawl and speculative infrastructure corridors in the Godavari and Bhima basins. We formulate empirical greenbelt preservation zoning guidelines for district revenue administrations.'
  );
  const [publishKeywords, setPublishKeywords] = useState('peri-urban, agricultural land loss, remote sensing, spatial planning, Nashik');
  const [publishTopic, setPublishTopic] = useState('urban_expansion');
  const [isPublishedSuccess, setIsPublishedSuccess] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Retrieve papers and datasets linked to active project
  const linkedPapers = SEED_PAPERS.filter((p) => activeProject.papersAdded.includes(p.id));
  const linkedDatasets = SEED_DATASETS.filter((d) => activeProject.datasetsAdded.includes(d.id));

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `n-${Date.now()}`,
      author: currentUser.fullName,
      text: newNoteText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    activeProject.notes.unshift(newNote);
    setProjects([...projects]);
    setNewNoteText('');
  };

  const handlePublishPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTitle || !publishAbstract) return;

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: publishTitle,
      authors: [currentUser.fullName, 'Dr. Arvind Swaminathan', 'Dr. Meera Nambiar'],
      abstract: publishAbstract,
      publicationDate: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear(),
      journal: 'National Land Policy & Spatial Planning Journal',
      doi: `10.1016/j.kshetrax.${Date.now()}`,
      keywords: publishKeywords.split(',').map((k) => k.trim()),
      citationCount: 0,
      downloads: 4,
      views: 28,
      datasetsUsed: activeProject.datasetsAdded,
      topic: publishTopic,
      relevanceScore: 100,
    };

    SEED_PAPERS.unshift(newPaper);
    activeProject.publishedPaperId = newPaper.id;
    setIsPublishedSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-300" />
              <span>Academic Research & Policy Bridge Workspace</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            {currentUser.designation} • Department of Urban Planning & Spatial Sciences
          </p>
        </div>

        {/* Impact Badge */}
        <div className="bg-white/10 border border-white/20 p-3 rounded-xl flex items-center space-x-4 text-xs">
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Research Views</span>
            <span className="text-base font-black text-white">14,250+</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Downloads</span>
            <span className="text-base font-black text-blue-300">3,820+</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Policies Influenced</span>
            <span className="text-base font-black text-emerald-400">3 State Policies</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Projects List & Research Impact Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Projects Switcher */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>My Research Projects ({projects.length})</span>
              </h2>
              <button
                onClick={() => {
                  const newP: ResearchProject = {
                    id: `proj-${Date.now()}`,
                    title: 'Climate Resilience & Agricultural Land Tenure',
                    description: 'Investigating monsoon variability impact on land partition distress.',
                    createdBy: currentUser.id,
                    creatorName: currentUser.fullName,
                    members: [{ name: currentUser.fullName, role: 'Lead', email: currentUser.email }],
                    datasetsAdded: ['ds-climate-imd-grid'],
                    papersAdded: ['paper-3'],
                    notes: [],
                    status: 'Active',
                    createdAt: '2026-09-24',
                  };
                  setProjects([...projects, newP]);
                  setActiveProjectId(newP.id);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold px-2 py-1 rounded border border-slate-200 flex items-center space-x-1 cursor-pointer transition"
              >
                <Plus className="w-3 h-3" />
                <span>New Project</span>
              </button>
            </div>

            <div className="space-y-2">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      setIsPublishedSuccess(false);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {proj.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-500">
                      <span>{proj.papersAdded.length} Papers</span>
                      <span>•</span>
                      <span>{proj.datasetsAdded.length} Datasets</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Impact Widget */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Research-to-Policy Impact</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Your research paper <em>&ldquo;Urban Expansion and Agricultural Land Loss in India&rdquo;</em> directly informed:
            </p>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1 shadow-xs">
              <span className="font-bold text-amber-800">
                Nashik District Cadastral Resurvey Mission
              </span>
              <p className="text-[11px] text-slate-600">
                Sanctioned by Mr. Rajesh Patel, IAS • Utilized finding on 1.8% annual peri-urban conversion rate to mandate agricultural preservation zones.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Project Detail & Workspace Tabs */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Active Project Top Header */}
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                Active Collaborative Workspace
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{activeProject.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal Investigator: {activeProject.creatorName} • Collaborators: Dr. Arvind Swaminathan, Dr. Meera Nambiar
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onSelectTab('paper-search')}
                className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Papers</span>
              </button>
              <button
                onClick={() => onSelectTab('datasets')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 border border-slate-300 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Datasets</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold overflow-x-auto pb-1">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`pb-2 border-b-2 transition ${
                activeSubTab === 'overview'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('papers')}
              className={`pb-2 border-b-2 transition ${
                activeSubTab === 'papers'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Papers ({activeProject.papersAdded.length})
            </button>
            <button
              onClick={() => setActiveSubTab('datasets')}
              className={`pb-2 border-b-2 transition ${
                activeSubTab === 'datasets'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Datasets ({activeProject.datasetsAdded.length})
            </button>
            <button
              onClick={() => setActiveSubTab('notes')}
              className={`pb-2 border-b-2 transition ${
                activeSubTab === 'notes'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Collaborator Discussions ({activeProject.notes.length})
            </button>
            <button
              onClick={() => setActiveSubTab('publish')}
              className={`pb-2 border-b-2 flex items-center space-x-1.5 transition ${
                activeSubTab === 'publish'
                  ? 'border-amber-500 text-amber-700 font-bold'
                  : 'border-transparent text-amber-700 hover:text-amber-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Publish Research</span>
            </button>
          </div>

          {/* TAB 1: Overview */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Project Abstract & Hypothesis
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {activeProject.description}
                </p>
              </div>

              {/* Research Team Members */}
              <div className="space-y-2">
                <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  Collaborating Scientists & Investigators
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeProject.members.map((m, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900 block text-xs">{m.name}</span>
                      <span className="text-[10px] text-blue-700 font-medium">{m.role}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{m.email}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick GIS Map CTA */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">Satellite Multitemporal Analysis Ready</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Landsat and Sentinel-2 calibrated bands for Nashik basin are linked to this workspace.
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab('gis-viewer', { district: 'Nashik' })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                >
                  Open in GIS Map →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Added Papers */}
          {activeSubTab === 'papers' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Papers Linked to Study:</span>
                <button
                  onClick={() => onSelectTab('paper-search')}
                  className="text-blue-700 hover:text-blue-800 font-bold"
                >
                  Search & Add More Papers →
                </button>
              </div>

              {linkedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900">{paper.title}</h4>
                    <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {paper.year}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{paper.abstract}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>{paper.authors.join(', ')}</span>
                    <span className="text-amber-700 font-bold">{paper.citationCount} Citations</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Added Datasets */}
          {activeSubTab === 'datasets' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Datasets Linked to Workspace:</span>
                <button
                  onClick={() => onSelectTab('datasets')}
                  className="text-blue-700 hover:text-blue-800 font-bold"
                >
                  Browse Datasets Hub →
                </button>
              </div>

              {linkedDatasets.map((ds) => (
                <div
                  key={ds.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                        {ds.category} • {ds.dataType}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{ds.name}</h4>
                    </div>
                    <button
                      onClick={() => onSelectTab('datasets', { datasetId: ds.id })}
                      className="bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded border border-slate-300 shadow-xs"
                    >
                      Preview Rows
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600">{ds.description}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                    <span>Size: {ds.sizeMb} MB</span>
                    <span>•</span>
                    <span>Coverage: {ds.geographicCoverage}</span>
                    <span>•</span>
                    <span>Source: {ds.source}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Notes & Collaboration */}
          {activeSubTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Share a finding, methodological note, or question with co-researchers..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Discussion Note</span>
                  </button>
                </div>
              </form>

              {/* Discussion Feed */}
              <div className="space-y-3 pt-2">
                {activeProject.notes.map((note) => (
                  <div key={note.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-blue-900">{note.author}</span>
                      <span className="text-[10px] text-slate-500">{note.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Publish Findings */}
          {activeSubTab === 'publish' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Publish Research Findings into National Policy Repository</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published papers are instantly indexed for semantic search by State Revenue Departments and District Collectors.
                </p>
              </div>

              {isPublishedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-3 text-emerald-900 text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">Paper Successfully Published & Indexed!</span>
                  </div>
                  <p>
                    Your research has been assigned DOI <code className="text-amber-800 bg-amber-100 px-1 py-0.5 rounded font-mono">10.1016/j.kshetrax.2026</code> and made searchable across all 36 state portals.
                  </p>
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => onSelectTab('paper-search', { query: publishTitle })}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                    >
                      View in Semantic Search →
                    </button>
                    <button
                      onClick={() => setIsPublishedSuccess(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs border border-slate-300"
                    >
                      Publish Another Paper
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePublishPaper} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Paper Title *
                    </label>
                    <input
                      type="text"
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Abstract (Empirical Findings & Policy Recommendations) *
                    </label>
                    <textarea
                      rows={4}
                      value={publishAbstract}
                      onChange={(e) => setPublishAbstract(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Topic Classification
                      </label>
                      <select
                        value={publishTopic}
                        onChange={(e) => setPublishTopic(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900"
                      >
                        <option value="urban_expansion">Urban Expansion & Farmland Loss</option>
                        <option value="land_disputes">Land Disputes & ADR Mediation</option>
                        <option value="cadastral_survey">Cadastral Survey & Modernization</option>
                        <option value="climate_adaptation">Climate Adaptation & Soil</option>
                        <option value="forest_rights">Forest Rights Act & Customary Tenure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Keywords (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={publishKeywords}
                        onChange={(e) => setPublishKeywords(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Auto-populated datasets notice */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">Auto-Linked Datasets:</span>{' '}
                    {activeProject.datasetsAdded.join(', ')}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-md cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-slate-950" />
                      <span>Publish & Index Paper</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
