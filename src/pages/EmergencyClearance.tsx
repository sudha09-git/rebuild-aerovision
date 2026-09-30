import { useState } from 'react';
import { AlertTriangle, Shield, Users, Zap } from 'lucide-react';
import { debrisSites } from '../data/mockData';
import { Card, DemoBanner, PriorityBadge, InspectionBadge, Button } from '../components/ui';

export default function EmergencyClearance() {
  const [assigned, setAssigned] = useState<Record<string, boolean>>({});

  const criticalSites = debrisSites.filter(s => s.clearancePriority === 'CRITICAL');
  const highPrioritySites = debrisSites.filter(s => s.clearancePriority === 'HIGH');
  const blockedRoutes = debrisSites.filter(s => s.blockedRoute);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Emergency Clearance</h1>
          <p className="text-xs text-slate-500 mt-0.5">Priority emergency access clearance operations</p>
        </div>
        <DemoBanner />
      </div>

      {/* Safety principle banner */}
      <div className="flex items-center gap-3 p-4 bg-red-500/8 border border-red-500/30 rounded-xl">
        <Shield className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-400">Emergency Access and Public Safety Always Take Priority</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Material recovery is secondary to emergency clearance. Do not delay access route clearance for material recovery considerations.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Critical Sites', value: criticalSites.length, color: 'text-red-400' },
          { label: 'Blocked Routes', value: blockedRoutes.length, color: 'text-orange-400' },
          { label: 'High Priority', value: highPrioritySites.length, color: 'text-amber-400' },
          { label: 'Teams Deployed', value: 3, color: 'text-blue-400' },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Critical access routes */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-100">Critical Access Route Blockages</h3>
        </div>
        <div className="space-y-3">
          {blockedRoutes.map(site => (
            <div key={site.id} className="p-4 bg-red-500/8 border border-red-500/25 rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-mono font-bold text-red-400">{site.id}</span>
                    <span className="text-xs text-slate-500">{site.zone}</span>
                    <PriorityBadge priority={site.clearancePriority} />
                    <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded font-bold">ROUTE BLOCKED</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mb-1">Problem</div>
                  <p className="text-xs text-slate-400 mb-3">{site.reason}</p>

                  <div className="text-xs font-semibold text-amber-400 mb-1">Recommended Action</div>
                  <p className="text-xs text-slate-400 mb-3">
                    Immediate assessment and controlled clearance required. Prioritize emergency vehicle access above all other considerations.
                  </p>

                  <div className="p-2 bg-amber-500/8 border border-amber-500/20 rounded-lg mb-3">
                    <p className="text-xs text-amber-400/90">
                      <strong>Material Recovery Note:</strong> Material recovery is <em>secondary</em> to clearance.
                      Any potentially recoverable materials identified during clearance should be catalogued but clearance takes absolute priority.
                    </p>
                  </div>

                  {site.hazards.map((h, i) => (
                    <div key={i} className="text-xs text-slate-500 mb-1">⚠ {h.type}: {h.description}</div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <InspectionBadge status={site.inspectionStatus} />
                  <span className="text-xs text-slate-500">{site.estimatedTonnes}t debris</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {!assigned[site.id] ? (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Users className="w-3.5 h-3.5" />}
                    onClick={() => setAssigned(prev => ({ ...prev, [site.id]: true }))}
                  >
                    Assign Clearance Team
                  </Button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 px-3 py-1.5">
                    ✓ Clearance Team Assigned
                  </span>
                )}
                <Button variant="ghost" size="sm">View on Map</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* All critical sites */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-slate-100">All Critical Clearance Sites</h3>
        </div>
        <div className="space-y-2">
          {criticalSites.map(site => (
            <div key={site.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse mt-1.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-200">{site.id}</div>
                  <div className="text-xs text-slate-500">{site.zone} · {site.estimatedTonnes}t</div>
                  <div className="text-xs text-slate-600 mt-0.5">{site.reason}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={site.clearancePriority} />
                <InspectionBadge status={site.inspectionStatus} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* High priority */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">High Priority Sites</h3>
        </div>
        <div className="space-y-2">
          {highPrioritySites.map(site => (
            <div key={site.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-xs font-mono font-semibold text-slate-200">{site.id}</div>
                <div className="text-xs text-slate-500">{site.zone} · {site.estimatedTonnes}t</div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={site.clearancePriority} />
                <InspectionBadge status={site.inspectionStatus} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
