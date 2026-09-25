import React, { useState, useEffect, useRef } from 'react';
import { DistrictGISData } from '../types';
import { SEED_DISTRICTS } from '../data/seedData';
import {
  MapPin,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Download,
  Info,
  Sliders,
  TrendingUp,
  TrendingDown,
  Building,
  Wheat,
  Trees,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface GISViewerProps {
  initialDistrict?: string;
  onSelectDistrict?: (dist: DistrictGISData) => void;
}

export const GISViewer: React.FC<GISViewerProps> = ({
  initialDistrict = 'Nashik',
  onSelectDistrict,
}) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialDistrict);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [layerSatellite, setLayerSatellite] = useState<boolean>(true);
  const [layerCadastral, setLayerCadastral] = useState<boolean>(true);
  const [layerUrban, setLayerUrban] = useState<boolean>(true);
  const [layerDisputes, setLayerDisputes] = useState<boolean>(true);
  const [layerForest, setLayerForest] = useState<boolean>(false);
  const [layerOpacity, setLayerOpacity] = useState<number>(85);

  const selectedDistrict =
    SEED_DISTRICTS.find((d) => d.name.toLowerCase() === selectedDistrictName.toLowerCase()) ||
    SEED_DISTRICTS[0];

  // Animation interval for 1995 -> 2025
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedYear((prev) => {
          if (prev >= 2025) return 1995;
          return prev + 5;
        });
      }, 1400);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getYearData = (dist: DistrictGISData, year: number) => {
    if (year <= 1995) return dist.landUse.year1995;
    if (year <= 2005) return dist.landUse.year2005;
    if (year <= 2015) return dist.landUse.year2015;
    return dist.landUse.year2025;
  };

  const currentLandUse = getYearData(selectedDistrict, selectedYear);

  // 10-Year change comparison (2015 vs 2025)
  const urbanChange10Yr = (
    selectedDistrict.landUse.year2025.urbanPct - selectedDistrict.landUse.year2015.urbanPct
  ).toFixed(1);
  const agChange10Yr = (
    selectedDistrict.landUse.year2025.agPct - selectedDistrict.landUse.year2015.agPct
  ).toFixed(1);

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: SEED_DISTRICTS.map((d) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.coordinates[1], d.coordinates[0]], // [lng, lat]
        },
        properties: {
          name: d.name,
          state: d.state,
          pendingDisputes: d.pendingDisputes,
          urbanPct2025: d.landUse.year2025.urbanPct,
          agPct2025: d.landUse.year2025.agPct,
          forestPct2025: d.landUse.year2025.forestPct,
          urbanLossRatePerYear: d.urbanLossRatePerYear,
          cadastralDigitizedPct: d.cadastralDigitizedPct,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kshetra-x-districts-spatial-${selectedYear}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-950/20 rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Multi-Temporal GIS Earth Observation Viewer</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Satellite Land Cover & Dispute Spatial Density
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            30-Year Calibrated Landsat-5/7/8 & Sentinel-2 Mosaics (1995–2025) with Cadastral Parcel Bounds and Real-Time Dispute Density Overlays.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportGeoJSON}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-300" />
            <span>Export GeoJSON Map</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Layer Controls */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Layer Visibility & Control</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200">
              <span className="text-slate-800 font-medium">True Color Satellite Base</span>
              <input
                type="checkbox"
                checked={layerSatellite}
                onChange={(e) => setLayerSatellite(e.target.checked)}
                className="accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200">
              <span className="text-slate-800 font-medium">Cadastral Parcels (50M)</span>
              <input
                type="checkbox"
                checked={layerCadastral}
                onChange={(e) => setLayerCadastral(e.target.checked)}
                className="accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200">
              <span className="text-slate-800 font-medium">Urban Built-Up (NDBI)</span>
              <input
                type="checkbox"
                checked={layerUrban}
                onChange={(e) => setLayerUrban(e.target.checked)}
                className="accent-amber-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200">
              <span className="text-slate-800 font-medium">Dispute Hotspots</span>
              <input
                type="checkbox"
                checked={layerDisputes}
                onChange={(e) => setLayerDisputes(e.target.checked)}
                className="accent-red-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200">
              <span className="text-slate-800 font-medium">Forest Canopy (FSI)</span>
              <input
                type="checkbox"
                checked={layerForest}
                onChange={(e) => setLayerForest(e.target.checked)}
                className="accent-emerald-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">Layer Opacity</span>
              <span className="text-slate-900 font-semibold">{layerOpacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={layerOpacity}
              onChange={(e) => setLayerOpacity(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px]">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">
              Classification Legend
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-xs" />
              <span className="text-slate-700 font-medium">High Dispute Density (&gt;10k cases)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
              <span className="text-slate-700 font-medium">Urban Built-Up Area</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-xs" />
              <span className="text-slate-700 font-medium">Agricultural / Farm Parcels</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-teal-700 shadow-xs" />
              <span className="text-slate-700 font-medium">Forest Canopy Cover</span>
            </div>
          </div>
        </div>

        {/* Center: Spatial Interactive Vector / Tile Canvas */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md flex flex-col">
          {/* Top Bar on Map */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-white">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">Spatial Extent:</span>
              <span className="bg-blue-800 text-blue-100 px-2 py-0.5 rounded border border-blue-700 font-medium">
                India • Western & Central Corridors
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-300">Sensor: Landsat/Sentinel-2 Composite</span>
            </div>
          </div>

          {/* Map Surface (Stylized Geospatial Surface) */}
          <div className="relative w-full h-[450px] bg-[#0c192c] overflow-hidden select-none">
            {/* Background Grid & Contours */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#1e3a8a 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Stylized State Boundary Polygons (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 450"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Coastal & India Boundary Outline Path */}
              <path
                d="M 180,60 L 250,50 L 320,70 L 380,120 L 420,180 L 390,260 L 340,340 L 280,410 L 240,360 L 210,290 L 170,220 L 150,150 Z"
                fill="url(#waterGrad)"
                stroke="#1e3a8a"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Internal State Lines */}
              <path
                d="M 180,180 Q 240,190 320,180 Q 360,220 340,280"
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <path
                d="M 210,290 Q 280,270 340,280"
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Cadastral Parcel Grid overlay when toggled */}
              {layerCadastral && (
                <g opacity={layerOpacity / 140}>
                  {[...Array(12)].map((_, i) => (
                    <line
                      key={i}
                      x1="180"
                      y1={120 + i * 20}
                      x2="380"
                      y2={120 + i * 20}
                      stroke="#0284c7"
                      strokeWidth="0.5"
                      strokeDasharray="2 3"
                    />
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <line
                      key={i}
                      x1={180 + i * 20}
                      y1="120"
                      x2={180 + i * 20}
                      y2="340"
                      stroke="#0284c7"
                      strokeWidth="0.5"
                      strokeDasharray="2 3"
                    />
                  ))}
                </g>
              )}
            </svg>

            {/* Interactive District Pins */}
            {SEED_DISTRICTS.map((dist) => {
              const isSelected = dist.name.toLowerCase() === selectedDistrictName.toLowerCase();
              // Projected pseudo-coordinates on SVG canvas
              // Nashik is around lat 19.99, lng 73.78 -> mapped to (x: 230, y: 220)
              const px = 230 + (dist.coordinates[1] - 73.78) * 14;
              const py = 220 - (dist.coordinates[0] - 19.99) * 14;

              const yearData = getYearData(dist, selectedYear);

              return (
                <div
                  key={dist.id}
                  onClick={() => setSelectedDistrictName(dist.name)}
                  style={{
                    left: `${Math.max(Math.min(px, 540), 60)}px`,
                    top: `${Math.max(Math.min(py, 400), 40)}px`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Pulse ring for high dispute hotspot */}
                  {layerDisputes && dist.pendingDisputes > 10000 && (
                    <span className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin */}
                  <div
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border transition-all shadow-md ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black border-amber-200 scale-110 ring-2 ring-amber-400'
                        : dist.pendingDisputes > 10000
                        ? 'bg-red-900/90 text-red-100 border-red-500 hover:scale-105'
                        : 'bg-slate-900/90 text-white border-slate-700 hover:scale-105'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[11px] whitespace-nowrap">{dist.name}</span>
                  </div>

                  {/* Tooltip Hover Badge */}
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-[10px] w-48 z-30 pointer-events-none text-white">
                    <p className="font-bold text-white text-xs">{dist.name}, {dist.state}</p>
                    <div className="mt-1 space-y-0.5 text-slate-300">
                      <div>Disputes: <strong className="text-red-400">{dist.pendingDisputes.toLocaleString()}</strong></div>
                      <div>Urban Built-Up: <strong className="text-amber-400">{yearData.urbanPct}%</strong></div>
                      <div>Agricultural: <strong className="text-emerald-400">{yearData.agPct}%</strong></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Selected District Callout Pill */}
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 p-3 rounded-xl shadow-lg z-20 text-xs max-w-xs space-y-1 backdrop-blur-xs text-white">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Selected Focus Target
              </span>
              <div className="text-sm font-black text-white">{selectedDistrict.name}, {selectedDistrict.state}</div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-300 pt-0.5">
                <span>Year: <strong className="text-blue-400">{selectedYear}</strong></span>
                <span>•</span>
                <span>Urban: <strong className="text-amber-300">{currentLandUse.urbanPct}%</strong></span>
                <span>•</span>
                <span>Farmland: <strong className="text-emerald-400">{currentLandUse.agPct}%</strong></span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: 30-Year Multitemporal Time Slider */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause Timeline</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play 30-Yr Animation</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setSelectedYear(1995);
                  }}
                  title="Reset to 1995"
                  className="bg-white hover:bg-slate-100 text-slate-700 p-1.5 rounded-lg border border-slate-300 transition cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <span className="text-slate-600 text-xs font-normal">Active Satellite Year:</span>
                <span className="bg-blue-600 px-3 py-0.5 rounded-lg text-white font-mono shadow-xs">
                  {selectedYear}
                </span>
              </div>
            </div>

            {/* Slider Track */}
            <div className="space-y-1">
              <input
                type="range"
                min="1995"
                max="2025"
                step="5"
                value={selectedYear}
                onChange={(e) => {
                  setIsPlaying(false);
                  setSelectedYear(parseInt(e.target.value, 10));
                }}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-600 font-medium">
                <span>1995 (Landsat-5)</span>
                <span>2005 (Landsat-7)</span>
                <span>2015 (Landsat-8)</span>
                <span className="text-amber-700 font-bold">2025 (Sentinel-2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Land Use Drilldown & Statistics Panel */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] text-blue-600 uppercase font-bold tracking-widest block">
              Spatial Intelligence Panel
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedDistrict.name} District</h3>
            <p className="text-xs text-slate-500">
              State: {selectedDistrict.state} • Cadastral Progress: {selectedDistrict.cadastralDigitizedPct}%
            </p>
          </div>

          {/* Dispute Count & Status */}
          <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-red-700">Pending Land Litigations</span>
            <div className="text-2xl font-black text-red-700">
              {selectedDistrict.pendingDisputes.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-red-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{selectedDistrict.disputeTrendYoY > 0 ? `+${selectedDistrict.disputeTrendYoY}%` : `${selectedDistrict.disputeTrendYoY}%`} YoY</span>
            </div>
          </div>

          {/* Land Cover Distribution (Year: selectedYear) */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Land Classification ({selectedYear}):
            </span>

            {/* Urban Area */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700 flex items-center space-x-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-amber-600" />
                  <span>Urban Built-Up Area</span>
                </span>
                <span className="font-bold text-amber-700">{currentLandUse.urbanPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${currentLandUse.urbanPct}%` }} />
              </div>
            </div>

            {/* Agricultural Farmland */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700 flex items-center space-x-1.5 font-medium">
                  <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Agricultural Farmland</span>
                </span>
                <span className="font-bold text-emerald-700">{currentLandUse.agPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${currentLandUse.agPct}%` }} />
              </div>
            </div>

            {/* Forest Canopy */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700 flex items-center space-x-1.5 font-medium">
                  <Trees className="w-3.5 h-3.5 text-teal-600" />
                  <span>Forest & Vegetation</span>
                </span>
                <span className="font-bold text-teal-700">{currentLandUse.forestPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${currentLandUse.forestPct}%` }} />
              </div>
            </div>
          </div>

          {/* 10-Year Decadal Change (2015 vs 2025) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
              10-Year Conversion Dynamics (2015 → 2025)
            </span>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Urban Sprawl:</span>
              <span className="font-bold text-amber-700">+{urbanChange10Yr}% Growth</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Farmland Loss:</span>
              <span className="font-bold text-red-600">{agChange10Yr}% Loss</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
              <span className="text-slate-600 font-medium">Annual Conversion Rate:</span>
              <span className="font-bold text-amber-700">
                {selectedDistrict.urbanLossRatePerYear}% p.a.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
