import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, Users } from 'lucide-react';
import { recoveryOperations } from '../data/mockData';
import type { RecoveryOperation } from '../types';
import {
  Card, DemoBanner, PriorityBadge, OperationStatusBadge,
  ProgressBar, Button
} from '../components/ui';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  CLEARANCE:  <span className="text-red-400">⚡</span>,
  INSPECTION: <span className="text-amber-400">🔍</span>,
  TRANSPORT:  <span className="text-blue-400">🚛</span>,
  RECOVERY:   <span className="text-emerald-400">♻</span>,
  ASSESSMENT: <span className="text-purple-400">📋</span>,
};

export default function RecoveryOperations() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<RecoveryOperation | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = recoveryOperations.filter(op => {
    const matchType = typeFilter === 'ALL' || op.type === typeFilter;
    const matchStatus = statusFilter === 'ALL' || op.status === statusFilter;
    return matchType && matchStatus;
  });

  const inProgress = recoveryOperations.filter(o => o.status === 'IN_PROGRESS').length;
  const planned = recoveryOperations.filter(o => o.status === 'PLANNED').length;
  const completed = recoveryOperations.filter(o => o.status === 'COMPLETED').length;

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Recovery Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Active clearance, inspection, transport and recovery operations</p>
        </div>
        <DemoBanner />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Operations', value: recoveryOperations.length, color: 'text-slate-100' },
          { label: 'In Progress', value: inProgress, color: 'text-amber-400' },
          { label: 'Planned', value: planned, color: 'text-blue-400' },
          { label: 'Completed', value: completed, color: 'text-emerald-400' },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="CLEARANCE">Clearance</option>
          <option value="INSPECTION">Inspection</option>
          <option value="TRANSPORT">Transport</option>
          <option value="RECOVERY">Recovery</option>
          <option value="ASSESSMENT">Assessment</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="PLANNED">Planned</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Operations list */}
        <div className="xl:col-span-3 space-y-3">
          {filtered.map(op => (
            <Card
              key={op.id}
              hover
              onClick={() => setSelected(op === selected ? null : op)}
              className={`p-4 ${selected?.id === op.id ? 'border-blue-500/50 bg-[#162a54]' : ''}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{TYPE_ICONS[op.type]}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold text-slate-400">{op.id}</span>
                      <span className="text-xs text-slate-600">{op.type}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{op.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{op.description}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <PriorityBadge priority={op.priority} />
                  <OperationStatusBadge status={op.status} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />{op.assignedTeam}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />ETC: {new Date(op.estimatedCompletion).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ProgressBar
                  value={op.progressPercent}
                  color={
                    op.priority === 'CRITICAL' ? 'bg-red-500' :
                    op.priority === 'HIGH' ? 'bg-orange-500' :
                    op.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500'
                  }
                  className="flex-1"
                />
                <span className="text-xs font-mono text-slate-500 w-10 text-right">{op.progressPercent}%</span>
              </div>

              {op.notes && (
                <div className="mt-2 text-xs text-slate-600 italic border-t border-slate-700/30 pt-2">{op.notes}</div>
              )}
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">No operations match the current filters.</div>
          )}
        </div>

        {/* Detail / workflow panel */}
        <div className="xl:col-span-2">
          {selected ? (
            <OperationDetail op={selected} navigate={navigate} />
          ) : (
            <Card className="p-6 text-center">
              <Truck className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Select an operation to view details and workflow</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function OperationDetail({ op, navigate }: { op: RecoveryOperation; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="space-y-4 sticky top-0">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs text-orange-400 font-bold uppercase tracking-wide mb-0.5">Operation Detail</div>
            <h3 className="text-base font-bold text-slate-100">{op.name}</h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{op.id}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <PriorityBadge priority={op.priority} />
            <OperationStatusBadge status={op.status} />
          </div>
        </div>

        <div className="space-y-0 mb-4">
          {[
            { label: 'Type', value: op.type },
            { label: 'Assigned Team', value: op.assignedTeam },
            { label: 'Start Date', value: new Date(op.startDate).toLocaleDateString('en-IN') },
            { label: 'Est. Completion', value: new Date(op.estimatedCompletion).toLocaleDateString('en-IN') },
            ...(op.relatedSiteId ? [{ label: 'Related Site', value: op.relatedSiteId }] : []),
            ...(op.relatedBatchId ? [{ label: 'Related Batch', value: op.relatedBatchId }] : []),
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b border-slate-700/20 last:border-0">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className="text-xs font-mono text-slate-300">{r.value}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Progress</span>
            <span className="text-xs font-mono text-slate-300">{op.progressPercent}%</span>
          </div>
          <ProgressBar
            value={op.progressPercent}
            color={op.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}
          />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-3">{op.description}</p>

        {op.notes && (
          <div className="p-2.5 bg-slate-800/40 rounded-lg text-xs text-slate-500 italic">{op.notes}</div>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          {op.relatedBatchId && (
            <Button size="sm" variant="primary" onClick={() => navigate('/passports')}>
              View Passport
            </Button>
          )}
          {op.relatedSiteId && (
            <Button size="sm" variant="secondary" onClick={() => navigate('/debris')}>
              View Site
            </Button>
          )}
          <Button size="sm" variant="ghost">Update Status</Button>
        </div>
      </Card>
    </div>
  );
}
