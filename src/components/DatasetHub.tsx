import React, { useState } from 'react';
import { Dataset } from '../types';
import { SEED_DATASETS, SEED_PROJECTS } from '../data/seedData';
import {
  Database,
  Search,
  Filter,
  Download,
  FolderPlus,
  Table,
  Check,
  Calendar,
  Layers,
  HardDrive,
  MapPin,
  ExternalLink,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface DatasetHubProps {
  onSelectTab: (tab: string, params?: any) => void;
  initialCategory?: string;
  initialDatasetId?: string;
}

export const DatasetHub: React.FC<DatasetHubProps> = ({
  onSelectTab,
  initialCategory = 'All',
  initialDatasetId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(() => {
    if (initialDatasetId) {
      return SEED_DATASETS.find((d) => d.id === initialDatasetId) || null;
    }
    return null;
  });
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = ['All', 'Land Records', 'Satellite', 'Climate', 'Socio-Economic', 'Infrastructure', 'Policies'];

  const filteredDatasets = SEED_DATASETS.filter((d) => {
    if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
  });

  const handleAddToProject = (datasetId: string, name: string) => {
    const proj = SEED_PROJECTS[0];
    if (!proj.datasetsAdded.includes(datasetId)) {
      proj.datasetsAdded.push(datasetId);
    }
    setAddedNotice(`Dataset "${name}" added to project "${proj.title}"`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const handleDownloadDataset = (dataset: Dataset, format: 'csv' | 'json') => {
    const records = dataset.previewData.sampleRecords;
    let content = '';
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(records, null, 2);
      mimeType = 'application/json';
    } else {
      const headers = dataset.previewData.headers.join(',');
      const rows = records.map((r) => dataset.previewData.headers.map((h) => `"${r[h] || ''}"`).join(','));
      content = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.id}-sample-data.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md text-white">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>National Spatial & Governance Data Hub</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Unified Geospatial, Cadastral & Climate Datasets
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Consolidated data assets from Department of Land Resources (DoLR), Survey of India, ISRO Bhuvan, IMD Climate, and Ministry of Jal Shakti. Preview sample rows or export for localized Python/GIS analysis.
          </p>
        </div>

        {/* Search and Category Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets by keyword (e.g. 'cadastral', 'sentinel satellite', 'climate grid')..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Added to project notification */}
      {addedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">{addedNotice}</span>
        </div>
      )}

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <div
            key={dataset.id}
            className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 shadow-xs hover:shadow-md flex flex-col justify-between transition space-y-4"
          >
            <div className="space-y-3">
              {/* Category & Format Badges */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  {dataset.category} • {dataset.dataType}
                </span>
                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {dataset.accessLevel} Access
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">{dataset.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {dataset.description}
              </p>

              {/* Metadata Pills */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {dataset.timeCoverageStart.slice(0, 4)}–{dataset.timeCoverageEnd.slice(0, 4)}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dataset.sizeMb > 1000 ? `${(dataset.sizeMb / 1024).toFixed(1)} GB` : `${dataset.sizeMb} MB`}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600 col-span-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{dataset.geographicCoverage}</span>
                </div>
              </div>

              {/* Source Agency */}
              <div className="text-[10px] text-slate-500 truncate pt-1">
                Source: {dataset.source}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleAddToProject(dataset.id, dataset.name)}
                title="Add to active research project"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPreviewDataset(dataset)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 flex items-center space-x-1.5 transition cursor-pointer flex-1 justify-center"
              >
                <Table className="w-3.5 h-3.5 text-slate-600" />
                <span>Preview Rows</span>
              </button>

              <button
                onClick={() => handleDownloadDataset(dataset, 'csv')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SAMPLE DATA PREVIEW MODAL */}
      {previewDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                  {previewDataset.category} • {previewDataset.dataType} Sample Preview
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{previewDataset.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Source: {previewDataset.source} • Records Count: {previewDataset.recordsCount.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setPreviewDataset(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Statistics if available */}
            {previewDataset.statistics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {previewDataset.statistics.summaryMetrics.map((m, i) => (
                  <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block">{m.label}</span>
                    <span className="text-xs font-extrabold text-blue-800 mt-0.5 block">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tabular Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sample Tabular Records ({previewDataset.previewData.sampleRecords.length} Rows Displayed)
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      {previewDataset.previewData.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3 whitespace-nowrap font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {previewDataset.previewData.sampleRecords.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-blue-50/50 transition">
                        {previewDataset.previewData.headers.map((h, colIdx) => (
                          <td key={colIdx} className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                            {row[h] !== undefined ? String(row[h]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export and Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  handleAddToProject(previewDataset.id, previewDataset.name);
                  setPreviewDataset(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-300 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-slate-600" />
                <span>Add to Active Research Project</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadDataset(previewDataset, 'json')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-300 flex items-center space-x-1 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={() => handleDownloadDataset(previewDataset, 'csv')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Sample</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
