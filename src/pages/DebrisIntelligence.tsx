import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers, Search, AlertTriangle, Eye,
  ClipboardCheck, Brain
} from 'lucide-react';
import { debrisSites } from '../data/mockData';
import type { DebrisSite } from '../types';
import {
  Card, DemoBanner, PriorityBadge, InspectionBadge,
  AIDisclaimer, ConfidenceBar, Button
} from '../components/ui';

export default function DebrisIntelligence() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selected, setSelected] = useState<DebrisSite | null>(null);

  const filtered = debrisSites.filter(s => {
    const matchSearch = search === '' ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.zone.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'ALL' || s.clearancePriority === priorityFilter;
    const matchStatus = statusFilter === 'ALL' || s.inspectionStatus === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Debris Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">AI-assisted debris site analysis — field verification required</p>
        </div>
        <DemoBanner />
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sites', value: debrisSites.length, color: 'text-slate-100' },
          { label: 'Critical', value: debrisSites.filter(s => s.clearancePriority === 'CRITICAL').length, color: 'text-red-400' },
          { label: 'Inspection Required', value: debrisSites.filter(s => s.inspectionStatus === 'NOT_STARTED' || s.inspectionStatus === 'SCHEDULED').length, color: 'text-amber-400' },
          { label: 'Completed', value: debrisSites.filter(s => s.inspectionStatus === 'COMPLETED').length, color: 'text-emerald-400' },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Site ID or Zone…"
            className="w-full pl-8 pr-3 py-2 bg-[#0f2040] border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
        >
          <option value="ALL">All Statuses</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* List */}
        <div className="xl:col-span-3">
          <div className="space-y-3">
            {filtered.map(site => (
              <Card
                key={site.id}
                hover
                onClick={() => setSelected(site === selected ? null : site)}
                className={`p-4 ${selected?.id === site.id ? 'border-blue-500/50 bg-[#162a54]' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-mono font-bold text-slate-200">{site.id}</span>
                      <span className="text-xs text-slate-500">{site.zone}</span>
                      {site.blockedRoute && (
                        <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-bold">ROUTE BLOCKED</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{site.reason}</p>

                    {/* Material breakdown */}
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      {site.materials.map(m => (
                        <div key={m.material} className="text-center p-1.5 bg-slate-800/40 rounded-lg">
                          <div className="text-xs font-bold text-slate-200">{m.percentage}%</div>
                          <div className="text-xs text-slate-600 truncate">{m.material}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span><span className="text-slate-300 font-semibold">{site.estimatedTonnes}t</span> estimated</span>
                      <span>AI confidence: <span className="font-mono">{site.aiConfidence}%</span></span>
                      {site.assignedTeam && <span>{site.assignedTeam}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <PriorityBadge priority={site.clearancePriority} />
                    <InspectionBadge status={site.inspectionStatus} />
                  </div>
                </div>

                {/* Hazards */}
                {site.hazards.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {site.hazards.map((h, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded font-medium ${
                        h.severity === 'HIGH' ? 'bg-red-500/15 text-red-400' :
                        h.severity === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-slate-700/50 text-slate-400'
                      }`}>
                        ⚠ {h.type}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/30">
                  <Button size="sm" variant="ghost" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setSelected(site)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="warning" icon={<ClipboardCheck className="w-3.5 h-3.5" />}>
                    Mark for Inspection
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Brain className="w-3.5 h-3.5" />}>
                    AI Analysis
                  </Button>
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">No sites match the current filters.</div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-2">
          {selected ? (
            <DebrisSiteDetail site={selected} navigate={navigate} />
          ) : (
            <Card className="p-6 text-center">
              <Layers className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Select a site to view detailed AI analysis</p>
              <p className="text-xs text-slate-700 mt-1">All AI classifications are simulated — field verification required</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DebrisSiteDetail({ site, navigate }: { site: DebrisSite; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="space-y-4 sticky top-0">
      <Card className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-orange-400 font-bold uppercase tracking-wide mb-0.5">Debris Site Analysis</div>
            <h3 className="text-base font-bold text-slate-100 font-mono">{site.id}</h3>
            <p className="text-xs text-slate-500">{site.zone}</p>
          </div>
          <PriorityBadge priority={site.clearancePriority} />
        </div>

        <div className="space-y-0 mb-4">
          {[
            { label: 'Estimated Debris', value: `${site.estimatedTonnes} tonnes` },
            { label: 'Route Blocked', value: site.blockedRoute ? '⚠ YES — Priority Clearance' : 'No' },
            { label: 'Assigned Team', value: site.assignedTeam || 'Unassigned' },
            { label: 'Last Updated', value: new Date(site.lastUpdated).toLocaleDateString('en-IN') },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b border-slate-700/20 last:border-0">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className={`text-xs font-medium ${r.value.includes('YES') ? 'text-red-400' : 'text-slate-300'}`}>{r.value}</span>
            </div>
          ))}
        </div>

        <InspectionBadge status={site.inspectionStatus} />
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-slate-100">AI Material Classification</h4>
        </div>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Classification Confidence</span>
          </div>
          <ConfidenceBar value={site.aiConfidence} />
        </div>
        <AIDisclaimer compact />
        <div className="mt-3 space-y-3">
          {site.materials.map(m => (
            <div key={m.material}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-300">{m.material}</span>
                <span className="text-xs font-mono text-slate-400">{m.percentage}% · ~{m.estimatedTonnes}t</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${m.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {site.hazards.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h4 className="text-sm font-semibold text-slate-100">Hazard Indicators</h4>
          </div>
          <div className="space-y-2">
            {site.hazards.map((h, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                h.severity === 'HIGH' ? 'bg-red-500/8 border-red-500/25' :
                'bg-amber-500/8 border-amber-500/25'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300">{h.type}</span>
                  <span className={`text-xs font-semibold ${h.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`}>{h.severity}</span>
                </div>
                <p className="text-xs text-slate-500">{h.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-amber-400/80 italic">
            Potential hazard detected — restrict access and request professional assessment.
          </p>
        </Card>
      )}

      <div className="space-y-2">
        <Button variant="warning" size="sm" className="w-full justify-center" icon={<ClipboardCheck className="w-3.5 h-3.5" />}>
          Assign Inspector
        </Button>
        <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => navigate('/passports')}>
          View Salvage Passports →
        </Button>
      </div>
    </div>
  );
}
