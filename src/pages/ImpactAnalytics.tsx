import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { dashboardKPIs } from '../data/mockData';
import { Card, DemoBanner } from '../components/ui';

const DEBRIS_STATUS = [
  { name: 'Critical', value: 8, color: '#ef4444' },
  { name: 'High', value: 34, color: '#f97316' },
  { name: 'Medium', value: 67, color: '#f59e0b' },
  { name: 'Low', value: 47, color: '#64748b' },
];

const MATERIAL_DIST = [
  { name: 'Concrete', value: 42, color: '#64748b' },
  { name: 'Steel', value: 18, color: '#3b82f6' },
  { name: 'Timber', value: 14, color: '#f59e0b' },
  { name: 'Brick/Masonry', value: 16, color: '#f97316' },
  { name: 'Other', value: 10, color: '#6366f1' },
];

const RECOVERY_WORKFLOW = [
  { stage: 'Detected', count: 156 },
  { stage: 'Mapped', count: 140 },
  { stage: 'Assessed', count: 89 },
  { stage: 'Inspected', count: 38 },
  { stage: 'Tested', count: 22 },
  { stage: 'Approved', count: 13 },
  { stage: 'Recovered', count: 7 },
];

const CLEARANCE_DIST = [
  { name: 'Critical', batches: 8, color: '#ef4444' },
  { name: 'High', batches: 19, color: '#f97316' },
  { name: 'Medium', batches: 28, color: '#f59e0b' },
  { name: 'Low', batches: 15, color: '#64748b' },
];

const MATERIAL_DEST = [
  { name: 'Pending Decision', value: 20, color: '#64748b' },
  { name: 'Approved Reuse', value: 13, color: '#10b981' },
  { name: 'Processing', value: 8, color: '#3b82f6' },
  { name: 'Restricted', value: 4, color: '#f59e0b' },
  { name: 'Hazardous Disposal', value: 6, color: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-xs">
        <p className="text-slate-300 font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ImpactAnalytics() {
  const impactStats = [
    { label: 'Debris Sites Assessed', value: 89, total: 156 },
    { label: 'Material Batches Tracked', value: dashboardKPIs.potentialRecoveryBatches, total: 50 },
    { label: 'Potentially Recoverable', value: 25, total: 38 },
    { label: 'Approved for Reuse', value: dashboardKPIs.verifiedBatches, total: 25 },
    { label: 'Sent for Processing', value: 8, total: 13 },
    { label: 'Hazardous Isolated', value: dashboardKPIs.hazardousIsolated, total: 10 },
    { label: 'Operations Completed', value: 3, total: dashboardKPIs.operationsActive },
  ];

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Impact Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Simulated impact dashboard — pilot validation required</p>
        </div>
        <DemoBanner />
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-amber-500/8 border border-amber-500/25 rounded-xl text-xs text-amber-400/90">
        <strong>Simulated impact dashboard — pilot validation required.</strong> All figures are demo data and do not represent real-world measurements or outcomes.
        Environmental benefit estimates are hypothetical only.
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {impactStats.slice(0, 4).map(s => (
          <Card key={s.label} className="p-4">
            <div className="text-2xl font-bold font-mono text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            <div className="mt-2 w-full bg-slate-700/50 rounded-full h-1">
              <div className="h-1 rounded-full bg-blue-500" style={{ width: `${(s.value / s.total) * 100}%` }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Debris status distribution */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">Debris Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={DEBRIS_STATUS}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {DEBRIS_STATUS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Material category distribution */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Material Category Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={MATERIAL_DIST}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {MATERIAL_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recovery workflow funnel */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-slate-100">Recovery Workflow Progress</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RECOVERY_WORKFLOW} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stage" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Batches" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Material destination */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-100">Material Destination Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MATERIAL_DEST} margin={{ left: 0, right: 20 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Batches">
                {MATERIAL_DEST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Clearance priority */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-100">Clearance Priority Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={CLEARANCE_DIST} margin={{ left: 0, right: 20, top: 5 }}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="batches" radius={[4, 4, 0, 0]} name="Sites">
              {CLEARANCE_DIST.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Hypothetical environmental note */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-2">Hypothetical Recovery Impact (Demo Estimates Only)</h3>
        <p className="text-xs text-amber-400/80 mb-3 italic">The following figures are rough illustrative estimates for demonstration purposes. They do not represent verified measurements.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Est. Material Potentially Recovered', value: '~32 tonnes', note: 'Hypothetical' },
            { label: 'Est. Landfill Diversion', value: '~18 tonnes', note: 'Hypothetical' },
            { label: 'Operational Efficiency Gain', value: 'TBD', note: 'Requires pilot data' },
            { label: 'CO₂ Reduction Estimate', value: 'Requires LCA', note: 'Not yet calculated' },
          ].map(s => (
            <div key={s.label} className="p-3 bg-slate-800/30 rounded-lg text-center">
              <div className="text-lg font-bold text-slate-300">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-xs text-amber-500/60 mt-0.5 italic">{s.note}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
