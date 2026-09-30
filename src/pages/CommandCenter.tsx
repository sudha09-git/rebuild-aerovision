import { useNavigate } from 'react-router-dom';
import {
  MapPin, Layers, AlertTriangle, Package, ClipboardCheck,
  CheckCircle2, Shield, Brain, ChevronRight, Activity,
  Clock, ArrowUpRight, ArrowRight, Users, BarChart2
} from 'lucide-react';
import {
  dashboardKPIs, debrisSites, salvagePassports,
  recoveryOperations, notifications, SCENARIO_NAME
} from '../data/mockData';
import {
  PriorityBadge, RecoveryStatusBadge,
  OperationStatusBadge, ProgressBar
} from '../components/ui';

// ─── Inline mini-components ─────────────────────────────────

function KpiCard({
  title, value, icon, accent, trend, trendColor, desc, borderColor
}: {
  title: string; value: number | string; icon: React.ReactNode;
  accent: string; trend: string; trendColor: string;
  desc: string; borderColor?: string;
}) {
  return (
    <div className={`relative flex flex-col rounded-xl p-4 border transition-all hover:border-slate-500/50 group ${borderColor ?? 'border-slate-700/50'}`}
      style={{ background: 'linear-gradient(145deg, #0d1f3c, #0a1628)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg border border-slate-700/50" style={{ background: '#050d1a' }}>
          <span className="text-slate-400">{icon}</span>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${trendColor}`}>
          {trend}
        </span>
      </div>
      <div className={`text-3xl font-black font-mono tracking-tight ${accent}`}>{value}</div>
      <div className="text-xs font-semibold text-slate-300 mt-1">{title}</div>
      <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{desc}</p>
    </div>
  );
}

function ViewAllBtn({ label, to }: { label: string; to: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
    >
      {label} <ChevronRight className="w-3 h-3" />
    </button>
  );
}

export default function CommandCenter() {
  const navigate = useNavigate();

  const criticalSites    = debrisSites.filter(s => s.clearancePriority === 'CRITICAL');
  const blockedRoutes    = debrisSites.filter(s => s.blockedRoute);
  const underInspection  = salvagePassports.filter(s => s.recoveryStatus === 'UNDER_INSPECTION');
  const approvedBatches  = salvagePassports.filter(s => s.recoveryStatus === 'APPROVED_SPECIFIC_REUSE');
  const activeOps        = recoveryOperations.filter(o => o.status === 'IN_PROGRESS');
  const criticalAlerts   = notifications.filter(n => !n.read && n.level === 'CRITICAL');

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto">

      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-black text-white tracking-tight">Command Center</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-400 uppercase tracking-widest" style={{ background: 'rgba(16,185,129,0.08)' }}>
              ● System Active
            </span>
          </div>
          <p className="text-xs text-slate-500">{SCENARIO_NAME}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest" style={{ background: 'rgba(245,158,11,0.07)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Demo Scenario — Simulated Data
          </div>
        </div>
      </div>

      {/* ── CRITICAL ALERT BAR ───────────────────────────────── */}
      {criticalAlerts.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/30"
          style={{ background: 'rgba(239,68,68,0.06)' }}
        >
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-black text-red-400 uppercase tracking-wide">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} — </span>
            <span className="text-xs text-slate-400">{criticalAlerts[0]?.message}</span>
          </div>
          <button
            onClick={() => navigate('/clearance')}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
          >
            Emergency Clearance <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="flex-shrink-0 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            View All
          </button>
        </div>
      )}

      {/* ── KPI CARDS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard
          title="Affected Zones"
          value={dashboardKPIs.affectedZones}
          icon={<MapPin className="w-4 h-4" />}
          accent="text-white"
          trend="+3 since update"
          trendColor="text-orange-400"
          desc="Mapped disaster-affected zones"
        />
        <KpiCard
          title="Debris Sites"
          value={dashboardKPIs.debrisSites}
          icon={<Layers className="w-4 h-4" />}
          accent="text-white"
          trend="AI-mapped"
          trendColor="text-blue-400"
          desc="Identified & catalogued sites"
        />
        <KpiCard
          title="Critical Clearance"
          value={dashboardKPIs.criticalClearance}
          icon={<AlertTriangle className="w-4 h-4" />}
          accent="text-red-400"
          trend={`${blockedRoutes.length} routes blocked`}
          trendColor="text-red-400"
          desc="Emergency access required"
          borderColor="border-red-500/25"
        />
        <KpiCard
          title="Recovery Batches"
          value={dashboardKPIs.potentialRecoveryBatches}
          icon={<Package className="w-4 h-4" />}
          accent="text-sky-400"
          trend="Pending review"
          trendColor="text-slate-500"
          desc="Potential material recovery"
        />
        <KpiCard
          title="Under Inspection"
          value={dashboardKPIs.underInspection}
          icon={<ClipboardCheck className="w-4 h-4" />}
          accent="text-amber-400"
          trend="Action required"
          trendColor="text-amber-400"
          desc="Awaiting professional review"
          borderColor="border-amber-500/20"
        />
        <KpiCard
          title="Verified Batches"
          value={dashboardKPIs.verifiedBatches}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="text-emerald-400"
          trend="+2 today"
          trendColor="text-emerald-400"
          desc="Completed verification"
          borderColor="border-emerald-500/20"
        />
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* LEFT COLUMN — sites + operations */}
        <div className="xl:col-span-7 space-y-5">

          {/* Priority Debris Sites */}
          <div className="rounded-xl border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40" style={{ background: '#07111f' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-sm font-semibold text-slate-100">Priority Debris Sites</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded border border-red-500/20 font-mono">
                  {debrisSites.filter(s => s.clearancePriority === 'CRITICAL' || s.clearancePriority === 'HIGH').length} active
                </span>
              </div>
              <ViewAllBtn label="View All Sites" to="/debris" />
            </div>

            <div className="divide-y divide-slate-700/20">
              {debrisSites.slice(0, 6).map(site => (
                <div
                  key={site.id}
                  onClick={() => navigate('/debris')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/15 cursor-pointer transition-colors group"
                >
                  {/* Priority dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    site.clearancePriority === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
                    site.clearancePriority === 'HIGH'     ? 'bg-orange-400' :
                    site.clearancePriority === 'MEDIUM'   ? 'bg-amber-400' : 'bg-slate-600'
                  }`} />

                  {/* ID + zone */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-200">{site.id}</span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{site.zone}</span>
                      {site.blockedRoute && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-500/15 text-red-400 border border-red-500/25 rounded font-black tracking-wide">
                          ROUTE BLOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 truncate">{site.estimatedTonnes}t · {site.reason}</div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={site.clearancePriority} />
                    <ArrowUpRight className="w-3 h-3 text-slate-700 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-700/30" style={{ background: 'rgba(5,13,26,0.5)' }}>
              <button onClick={() => navigate('/debris')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                View all {debrisSites.length} debris sites →
              </button>
            </div>
          </div>

          {/* Active Operations */}
          <div className="rounded-xl border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40" style={{ background: '#07111f' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-slate-100">Active Operations</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded border border-blue-500/20 font-mono">
                  {activeOps.length} in progress
                </span>
              </div>
              <ViewAllBtn label="All Operations" to="/operations" />
            </div>

            <div className="divide-y divide-slate-700/20">
              {activeOps.slice(0, 4).map(op => (
                <div key={op.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-mono text-slate-600">{op.id}</span>
                        <span className="text-[10px] text-slate-700">·</span>
                        <span className="text-[10px] text-slate-600 uppercase tracking-wide">{op.type}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">{op.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3 h-3 text-slate-700" />
                        <span className="text-[11px] text-slate-500">{op.assignedTeam}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={op.priority} />
                      <OperationStatusBadge status={op.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={op.progressPercent}
                      color={
                        op.priority === 'CRITICAL' ? 'bg-red-500' :
                        op.priority === 'HIGH'     ? 'bg-orange-500' : 'bg-blue-500'
                      }
                      className="flex-1"
                    />
                    <span className="text-[11px] font-mono text-slate-500 w-8 text-right">{op.progressPercent}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-700/30" style={{ background: 'rgba(5,13,26,0.5)' }}>
              <button onClick={() => navigate('/operations')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                View all operations →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — AI panel + summary + principle */}
        <div className="xl:col-span-5 space-y-5">

          {/* AI Recovery Intelligence Panel */}
          <div className="rounded-xl border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-slate-700/40 flex items-center gap-2.5" style={{ background: '#07111f' }}>
              <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Brain className="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">AI Recovery Intelligence</div>
                <div className="text-[10px] text-slate-600">Simulated AI analysis — not real model output</div>
              </div>
            </div>

            <div className="p-4 space-y-2.5">
              {/* Critical */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
                <div className="w-6 h-6 rounded-md bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-400 mb-0.5">Priority Clearance Required</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">8 locations</strong> require priority clearance due to blocked emergency access routes. Immediate assessment recommended.
                  </p>
                </div>
              </div>

              {/* Inspection */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/20" style={{ background: 'rgba(245,158,11,0.05)' }}>
                <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ClipboardCheck className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-400 mb-0.5">Inspection Required</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">17 material batches</strong> require professional inspection before any reuse decision can be made.
                  </p>
                </div>
              </div>

              {/* Verified */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-500/20" style={{ background: 'rgba(16,185,129,0.05)' }}>
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 mb-0.5">Workflow Progress</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">13 batches</strong> have completed the required verification workflow and are approved for specific reuse.
                  </p>
                </div>
              </div>

              {/* Recovery opportunities */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-500/20" style={{ background: 'rgba(59,130,246,0.05)' }}>
                <div className="w-6 h-6 rounded-md bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="w-3 h-3 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-400 mb-0.5">Recovery Opportunities</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">3 recovery opportunities</strong> identified based on current material availability and project requirements.
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-1 px-3 py-2 rounded-lg border border-amber-500/15 text-[10px] text-amber-500/70 italic leading-relaxed" style={{ background: 'rgba(245,158,11,0.04)' }}>
                AI-assisted analysis — all recommendations require human professional verification. AI does not certify material safety or structural use.
              </div>

              {/* Action links */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => navigate('/matching')}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-blue-500/20 text-xs text-blue-400 font-semibold hover:bg-blue-500/8 transition-colors"
                  style={{ background: 'rgba(59,130,246,0.05)' }}
                >
                  <span>Recovery Matches</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/clearance')}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-red-500/20 text-xs text-red-400 font-semibold hover:bg-red-500/8 transition-colors"
                  style={{ background: 'rgba(239,68,68,0.05)' }}
                >
                  <span>Emergency Clearance</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Recovery progress summary */}
          <div className="rounded-xl border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
            <div className="px-4 py-3 border-b border-slate-700/40 flex items-center gap-2" style={{ background: '#07111f' }}>
              <div className="w-6 h-6 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <BarChart2 className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Recovery Summary</span>
            </div>
            <div className="p-4 space-y-3.5">
              {[
                { label: 'Sites Mapped',       value: dashboardKPIs.debrisSites,           total: 200, color: 'bg-blue-500',    pct: Math.round(dashboardKPIs.debrisSites / 200 * 100) },
                { label: 'Under Inspection',   value: dashboardKPIs.underInspection,       total: 38,  color: 'bg-amber-500',  pct: Math.round(dashboardKPIs.underInspection / 38 * 100) },
                { label: 'Verified & Approved',value: dashboardKPIs.verifiedBatches,       total: 38,  color: 'bg-emerald-500',pct: Math.round(dashboardKPIs.verifiedBatches / 38 * 100) },
                { label: 'Hazardous Isolated', value: dashboardKPIs.hazardousIsolated,     total: 10,  color: 'bg-red-500',    pct: Math.round(dashboardKPIs.hazardousIsolated / 10 * 100) },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-300">{row.value}</span>
                      <span className="text-[10px] text-slate-700">/ {row.total}</span>
                    </div>
                  </div>
                  <ProgressBar value={row.pct} color={row.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Safety principle */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-slate-700/30" style={{ background: 'rgba(7,17,31,0.8)' }}>
            <Shield className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Platform Principle</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Emergency rescue and public safety <strong className="text-slate-500">always</strong> take priority over material recovery.
                AI assists — qualified professionals decide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Emergency Clearance */}
        <div className="rounded-xl border border-red-500/20 overflow-hidden" style={{ background: '#0a1628' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-red-500/15" style={{ background: 'rgba(239,68,68,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Emergency Clearance</span>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/20">{criticalSites.length} CRITICAL</span>
          </div>
          <div className="divide-y divide-slate-700/20">
            {criticalSites.map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <div className="text-xs font-mono font-bold text-red-400">{s.id}</div>
                  <div className="text-[11px] text-slate-500">{s.zone}</div>
                </div>
                <div className="flex items-center gap-2">
                  {s.blockedRoute && <span className="text-[10px] text-red-400 font-bold">BLOCKED</span>}
                  <button
                    onClick={() => navigate('/clearance')}
                    className="text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded font-semibold transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-700/30">
            <button onClick={() => navigate('/clearance')} className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
              Emergency Clearance Center →
            </button>
          </div>
        </div>

        {/* Material Recovery */}
        <div className="rounded-xl border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40" style={{ background: '#07111f' }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Package className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Material Recovery</span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{underInspection.length} inspecting</span>
          </div>
          <div className="divide-y divide-slate-700/20">
            {underInspection.slice(0, 3).map(b => (
              <div key={b.batchId} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <div className="text-xs font-mono font-semibold text-amber-400">{b.batchId}</div>
                  <div className="text-[11px] text-slate-500">{b.material}</div>
                </div>
                <RecoveryStatusBadge status={b.recoveryStatus} />
              </div>
            ))}
            {approvedBatches.slice(0, 1).map(b => (
              <div key={b.batchId} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <div className="text-xs font-mono font-semibold text-emerald-400">{b.batchId}</div>
                  <div className="text-[11px] text-slate-500">{b.material}</div>
                </div>
                <RecoveryStatusBadge status={b.recoveryStatus} />
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-700/30">
            <button onClick={() => navigate('/recovery')} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Material Recovery Module →
            </button>
          </div>
        </div>

        {/* Active Operations mini */}
        <div className="rounded-xl border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40" style={{ background: '#07111f' }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                <Clock className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Operations</span>
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{activeOps.length} active</span>
          </div>
          <div className="divide-y divide-slate-700/20">
            {recoveryOperations.filter(o => o.status !== 'COMPLETED').slice(0, 3).map(op => (
              <div key={op.id} className="px-4 py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-[10px] font-mono text-slate-600">{op.id}</span>
                    <div className="text-xs text-slate-300 font-semibold truncate max-w-40">{op.name}</div>
                  </div>
                  <OperationStatusBadge status={op.status} />
                </div>
                <ProgressBar
                  value={op.progressPercent}
                  color={op.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}
                />
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-700/30">
            <button onClick={() => navigate('/operations')} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Recovery Operations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

