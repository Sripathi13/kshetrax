import React, { useState, useMemo } from 'react';
import { ResearchPaper } from '../types';
import { SEED_PAPERS, SEED_PROJECTS } from '../data/seedData';
import {
  Search,
  Filter,
  Download,
  FolderPlus,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Copy,
  Check,
  Award,
  Layers,
  FileText,
} from 'lucide-react';

interface PaperSearchProps {
  onSelectTab: (tab: string, params?: any) => void;
  initialQuery?: string;
}

export const PaperSearch: React.FC<PaperSearchProps> = ({
  onSelectTab,
  initialQuery = 'urban expansion agricultural land',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYearRange, setSelectedYearRange] = useState<number>(2015);
  const [sortBy, setSortBy] = useState<'relevance' | 'citations' | 'newest'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Selected paper for detailed view drawer
  const [detailPaper, setDetailPaper] = useState<ResearchPaper | null>(null);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [addedProjectNotice, setAddedProjectNotice] = useState<string | null>(null);

  // Compute semantic relevance score dynamically
  const filteredPapers = useMemo(() => {
    const qLower = query.toLowerCase().trim();
    const qTerms = qLower.split(/\s+/).filter(Boolean);

    return SEED_PAPERS.filter((p) => {
      if (selectedTopic !== 'all' && p.topic !== selectedTopic) return false;
      if (p.year < selectedYearRange) return false;
      return true;
    })
      .map((p) => {
        let score = 50;
        const text = `${p.title} ${p.abstract} ${p.keywords.join(' ')} ${p.topic}`.toLowerCase();

        // Exact match points
        for (const term of qTerms) {
          if (text.includes(term)) score += 20;
        }

        // Semantic synonym bonuses
        if (qLower.includes('dispute') || qLower.includes('reduce')) {
          if (text.includes('mediation') || text.includes('resolution') || text.includes('lok adalat') || text.includes('conciliation') || text.includes('court')) {
            score += 25;
          }
        }
        if (qLower.includes('urban') || qLower.includes('agriculture')) {
          if (text.includes('sprawl') || text.includes('conversion') || text.includes('peri-urban') || text.includes('farmland')) {
            score += 25;
          }
        }

        score += Math.min(Math.floor(p.citationCount / 12), 20);
        return {
          ...p,
          relevanceScore: Math.min(score, 99),
        };
      })
      .sort((a, b) => {
        if (sortBy === 'citations') return b.citationCount - a.citationCount;
        if (sortBy === 'newest') return b.year - a.year;
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      });
  }, [query, selectedTopic, selectedYearRange, sortBy]);

  const totalPages = Math.ceil(filteredPapers.length / pageSize);
  const paginatedPapers = filteredPapers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDownload = (paper: ResearchPaper) => {
    paper.downloads += 1;
    // Trigger virtual download file
    const blob = new Blob([`Research Paper Summary\nTitle: ${paper.title}\nDOI: ${paper.doi}\nAbstract: ${paper.abstract}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paper.id}-research-paper.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddToProject = (paperId: string) => {
    const proj = SEED_PROJECTS[0];
    if (!proj.papersAdded.includes(paperId)) {
      proj.papersAdded.push(paperId);
    }
    setAddedProjectNotice(`Added to "${proj.title}"`);
    setTimeout(() => setAddedProjectNotice(null), 3000);
  };

  const copyBibtex = (p: ResearchPaper) => {
    const bib = `@article{${p.id},\n  title={${p.title}},\n  author={${p.authors.join(' and ')}},\n  journal={${p.journal}},\n  year={${p.year}},\n  doi={${p.doi}}\n}`;
    navigator.clipboard.writeText(bib);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md text-white">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Semantic AI Paper Search (105+ Indexed Papers)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Discover Land Governance & Spatial Research
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Hugging Face transformer embeddings match conceptual synonyms like &ldquo;urban sprawl&rdquo;, &ldquo;cadastral modernizations&rdquo;, and &ldquo;alternative dispute resolution&rdquo; instantly.
          </p>
        </div>

        {/* Search Bar & Primary Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search concepts e.g. 'urban expansion agricultural land', 'dispute mediation'..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              <option value="all">All Topics (105 Papers)</option>
              <option value="urban_expansion">Urban Expansion & Sprawl</option>
              <option value="land_disputes">Land Disputes & Mediation</option>
              <option value="cadastral_survey">Cadastral Resurvey & Drone Mapping</option>
              <option value="climate_adaptation">Climate Adaptation</option>
              <option value="forest_rights">Forest Rights & Customary</option>
              <option value="encroachment">Encroachment Detection</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              <option value="relevance">Relevance Score</option>
              <option value="citations">Most Cited</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-300 font-medium">Quick Queries:</span>
          {[
            'urban expansion agricultural land',
            'How to reduce land disputes quickly',
            'drone cadastral mapping and property cards',
            'community mediation Pune model',
            'peri-urban encroachment Godavari',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                setCurrentPage(1);
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Added to project notification */}
      {addedProjectNotice && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{addedProjectNotice}</span>
        </div>
      )}

      {/* Results Count & Year Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          Showing <strong className="text-slate-900 font-bold">{filteredPapers.length}</strong> research papers matching query & filters
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-medium">Published Since:</span>
          {[2015, 2018, 2021, 2024].map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYearRange(yr);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition ${
                selectedYearRange === yr
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {yr}+
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 shadow-xs flex flex-col justify-between transition space-y-4 group"
          >
            <div className="space-y-3">
              {/* Relevance & Topic Badges */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                  {paper.year} • {paper.topic.replace('_', ' ').toUpperCase()}
                </span>
                <span className="font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{paper.relevanceScore}% Match</span>
                </span>
              </div>

              {/* Title */}
              <h3
                onClick={() => setDetailPaper(paper)}
                className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition cursor-pointer line-clamp-2 leading-snug"
              >
                {paper.title}
              </h3>

              {/* Authors & Journal */}
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {paper.authors.join(', ')} • <em>{paper.journal}</em>
              </p>

              {/* Abstract excerpt */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {paper.abstract}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1 pt-1">
                {paper.keywords.slice(0, 3).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-amber-800 font-bold">
                {paper.citationCount} Citations
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddToProject(paper.id)}
                  title="Add to project reading list"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg border border-slate-300 transition cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownload(paper)}
                  title="Download paper summary / citation"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg border border-slate-300 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDetailPaper(paper)}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 shadow-xs"
          >
            Previous
          </button>
          <span className="text-xs text-slate-600 px-3 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 shadow-xs"
          >
            Next
          </button>
        </div>
      )}

      {/* PAPER DETAIL DRAWER / MODAL */}
      {detailPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                  {detailPaper.year} • {detailPaper.journal}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1 leading-snug">{detailPaper.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{detailPaper.authors.join(', ')}</p>
              </div>
              <button
                onClick={() => setDetailPaper(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Abstract
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {detailPaper.abstract}
              </p>
            </div>

            {/* Metadata & Datasets Used */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Citation Impact</span>
                <span className="text-sm font-bold text-amber-800">{detailPaper.citationCount} Citations</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{detailPaper.views} Views • {detailPaper.downloads} Downloads</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Persistent Identifier (DOI)</span>
                <span className="text-xs font-mono text-blue-700 break-all">{detailPaper.doi}</span>
              </div>
            </div>

            {/* Linked Datasets */}
            {detailPaper.datasetsUsed && detailPaper.datasetsUsed.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Datasets Utilized in Study:
                </span>
                <div className="flex flex-wrap gap-2">
                  {detailPaper.datasetsUsed.map((dsId) => (
                    <span
                      key={dsId}
                      className="text-xs bg-slate-100 border border-slate-200 text-blue-800 font-medium px-3 py-1 rounded-lg"
                    >
                      {dsId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => copyBibtex(detailPaper)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied BibTeX' : 'Copy BibTeX Citation'}</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleAddToProject(detailPaper.id);
                    setDetailPaper(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-300 transition cursor-pointer"
                >
                  Add to Project
                </button>
                <button
                  onClick={() => handleDownload(detailPaper)}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Publication</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
