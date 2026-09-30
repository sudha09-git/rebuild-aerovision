import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle, Package, Navigation2,
  Filter, Layers, X, MapPin, Info
} from 'lucide-react';
import { debrisSites } from '../data/mockData';
import type { DebrisSite } from '../types';
import {
  DemoBanner, PriorityBadge, InspectionBadge, AIDisclaimer
} from '../components/ui';

// Demo extra map points
const STORAGE_YARDS = [
  { id: 'SY-01', name: 'Recovery Storage Yard 01', lat: 21.2320, lng: 81.4100, type: 'storage' },
  { id: 'SY-02', name: 'Recovery Storage Yard 02', lat: 21.1940, lng: 81.4460, type: 'storage' },
];
const PROCESSING = [
  { id: 'PF-01', name: 'Processing Facility 01', lat: 21.2000, lng: 81.4200, type: 'processing' },
];
const EMERGENCY_ROUTES = [
  { id: 'ER-01', name: 'Emergency Route Alpha (Clear)', lat: 21.2150, lng: 81.4320 },
  { id: 'ER-02', name: 'Emergency Route Beta (Partial Block)', lat: 21.2070, lng: 81.4500 },
];

function getMarkerColor(site: DebrisSite): string {
  if (site.clearancePriority === 'CRITICAL') return '#ef4444';
  if (site.clearancePriority === 'HIGH' && site.inspectionStatus === 'NOT_STARTED') return '#f97316';
  if (site.inspectionStatus === 'COMPLETED') return '#10b981';
  if (site.inspectionStatus === 'IN_PROGRESS' || site.inspectionStatus === 'SCHEDULED') return '#f59e0b';
  return '#3b82f6';
}

export default function DisasterMap() {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState<DebrisSite | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [showLegend, setShowLegend] = useState(true);

  const filtered = filterPriority === 'ALL'
    ? debrisSites
    : debrisSites.filter(s => s.clearancePriority === filterPriority);

  return (
    <div className="flex h-full gap-0">
      {/* Map */}
      <div className="flex-1 relative">
        {/* Map header */}
        <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-[#0a1628]/95 border border-slate-700/60 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-slate-100">Disaster Map</span>
                <span className="text-xs text-slate-500">· Bhavapur Demo</span>
              </div>
            </div>
            <DemoBanner />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0a1628]/95 border border-slate-700/60 rounded-xl backdrop-blur-sm">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Sites</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="absolute bottom-6 left-4 z-[1000] bg-[#0a1628]/95 border border-slate-700/60 rounded-xl p-3 backdrop-blur-sm min-w-44">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Map Legend</span>
              <button onClick={() => setShowLegend(false)} className="text-slate-600 hover:text-slate-400">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1.5">
              {[
                { color: '#ef4444', label: 'Critical Clearance' },
                { color: '#f97316', label: 'Inspection Required' },
                { color: '#f59e0b', label: 'Under Assessment' },
                { color: '#3b82f6', label: 'Potential Recovery' },
                { color: '#10b981', label: 'Verified / Completed' },
                { color: '#6366f1', label: 'Storage Yard' },
                { color: '#8b5cf6', label: 'Processing Facility' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                  <span className="text-xs text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <MapContainer
          center={[21.210, 81.435]}
          zoom={13}
          className="w-full h-full"
          zoomControl={true}
          style={{ minHeight: '100vh' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Debris site markers */}
          {filtered.map(site => {
            const color = getMarkerColor(site);
            return (
              <CircleMarker
                key={site.id}
                center={[site.geoPoint.lat, site.geoPoint.lng]}
                radius={site.clearancePriority === 'CRITICAL' ? 12 : 9}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: site.clearancePriority === 'CRITICAL' ? 2.5 : 1.5,
                }}
                eventHandlers={{ click: () => setSelectedSite(site) }}
              >
                <Popup>
                  <div className="min-w-48">
                    <div className="font-bold text-slate-100 mb-1">{site.id}</div>
                    <div className="text-slate-400 text-xs mb-2">{site.zone}</div>
                    <div className="text-xs text-slate-300">
                      <div><span className="text-slate-500">Est. debris:</span> {site.estimatedTonnes}t</div>
                      <div><span className="text-slate-500">Priority:</span> {site.clearancePriority}</div>
                      {site.blockedRoute && <div className="text-red-400 font-semibold mt-1">⚠ Route Blocked</div>}
                    </div>
                    <button
                      onClick={() => setSelectedSite(site)}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                      View details →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Storage yards */}
          {STORAGE_YARDS.map(sy => (
            <CircleMarker
              key={sy.id}
              center={[sy.lat, sy.lng]}
              radius={8}
              pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.7, weight: 1.5 }}
            >
              <Popup>
                <div className="text-slate-100 text-sm font-bold">{sy.name}</div>
                <div className="text-slate-400 text-xs">{sy.id}</div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Processing facilities */}
          {PROCESSING.map(pf => (
            <CircleMarker
              key={pf.id}
              center={[pf.lat, pf.lng]}
              radius={8}
              pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.7, weight: 1.5 }}
            >
              <Popup>
                <div className="text-slate-100 text-sm font-bold">{pf.name}</div>
                <div className="text-slate-400 text-xs">{pf.id}</div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Emergency routes */}
          {EMERGENCY_ROUTES.map(er => (
            <CircleMarker
              key={er.id}
              center={[er.lat, er.lng]}
              radius={6}
              pathOptions={{ color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.6, weight: 1.5, dashArray: '4,4' }}
            >
              <Popup>
                <div className="text-slate-100 text-sm font-bold">{er.name}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Right detail panel */}
      <div className="w-80 bg-[#0a1628] border-l border-slate-700/40 flex flex-col overflow-hidden">
        {selectedSite ? (
          <SiteDetailPanel site={selectedSite} onClose={() => setSelectedSite(null)} navigate={navigate} />
        ) : (
          <SiteListPanel sites={filtered} onSelect={setSelectedSite} />
        )}
      </div>
    </div>
  );
}

function SiteListPanel({ sites, onSelect }: { sites: DebrisSite[]; onSelect: (s: DebrisSite) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/40">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Debris Sites</h3>
          <span className="ml-auto text-xs text-slate-500">{sites.length} sites</span>
        </div>
        <p className="text-xs text-slate-600">Click a site to view details</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sites.map(site => {
          const color = getMarkerColor(site);
          return (
            <button
              key={site.id}
              onClick={() => onSelect(site)}
              className="w-full text-left p-3 bg-slate-800/30 hover:bg-slate-700/30 border border-slate-700/30 hover:border-slate-600/50 rounded-lg transition-all"
            >
              <div className="flex items-start gap-2">
                <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-semibold text-slate-300">{site.id}</span>
                    <PriorityBadge priority={site.clearancePriority} />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{site.zone}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{site.estimatedTonnes}t · AI Conf: {site.aiConfidence}%</div>
                  {site.blockedRoute && (
                    <span className="inline-block text-xs text-red-400 font-semibold mt-1">⚠ Route Blocked</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SiteDetailPanel({
  site, onClose
}: { site: DebrisSite; onClose: () => void; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/40">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Debris Site</span>
              {site.blockedRoute && (
                <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-bold">ROUTE BLOCKED</span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-100 font-mono mt-0.5">{site.id}</h3>
            <p className="text-xs text-slate-500">{site.zone}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status row */}
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={site.clearancePriority} />
          <InspectionBadge status={site.inspectionStatus} />
        </div>

        {/* Key info */}
        <div className="space-y-0">
          {[
            { label: 'Est. Debris', value: `${site.estimatedTonnes} tonnes` },
            { label: 'AI Confidence', value: `${site.aiConfidence}% (Simulated)` },
            { label: 'Last Updated', value: new Date(site.lastUpdated).toLocaleString('en-IN') },
            { label: 'Assigned Team', value: site.assignedTeam || 'Unassigned' },
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2 border-b border-slate-700/20 last:border-0">
              <span className="text-xs text-slate-500">{row.label}</span>
              <span className="text-xs text-slate-300 font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div className="p-3 bg-slate-800/40 rounded-lg">
          <div className="text-xs font-semibold text-slate-400 mb-1">Reason</div>
          <p className="text-xs text-slate-400 leading-relaxed">{site.reason}</p>
        </div>

        {/* Materials */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-400">AI Material Classification</span>
          </div>
          <AIDisclaimer compact />
          <div className="mt-2 space-y-2">
            {site.materials.map(m => (
              <div key={m.material}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{m.material}</span>
                  <span className="text-xs font-mono text-slate-300">{m.percentage}% · ~{m.estimatedTonnes}t</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hazards */}
        {site.hazards.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-semibold text-slate-400">Hazard Indicators</span>
            </div>
            <div className="space-y-2">
              {site.hazards.map((h, i) => (
                <div key={i} className={`p-2.5 rounded-lg border ${
                  h.severity === 'HIGH' ? 'bg-red-500/8 border-red-500/25' :
                  h.severity === 'MEDIUM' ? 'bg-amber-500/8 border-amber-500/25' :
                  'bg-slate-800/40 border-slate-700/40'
                }`}>
                  <div className="text-xs font-semibold text-slate-300">{h.type}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{h.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-700/40 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-lg transition-colors">
          <Navigation2 className="w-3.5 h-3.5" />
          Assign Inspector
        </button>
        {site.clearancePriority === 'CRITICAL' && (
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-semibold rounded-lg transition-colors">
            <AlertTriangle className="w-3.5 h-3.5" />
            Request Clearance Team
          </button>
        )}
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-lg transition-colors">
          <Package className="w-3.5 h-3.5" />
          View Material Batches
        </button>
      </div>
    </div>
  );
}
