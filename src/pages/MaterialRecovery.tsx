import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { salvagePassports } from '../data/mockData';
import {
  Card, DemoBanner, RecoveryStatusBadge, InspectionBadge,
  ConditionBadge, ConfidenceBar, Button, AIDisclaimer
} from '../components/ui';

const MATERIAL_STATS = [
  { material: 'Steel', batches: 2, totalTonnes: 4.0, color: 'text-blue-400' },
  { material: 'Concrete Rubble', batches: 1, totalTonnes: 18.0, color: 'text-slate-400' },
  { material: 'Timber', batches: 1, totalTonnes: 0.9, color: 'text-amber-400' },
  { material: 'Brick/Masonry', batches: 1, totalTonnes: 5.4, color: 'text-orange-400' },
  { material: 'Mixed Waste', batches: 1, totalTonnes: 1.1, color: 'text-red-400' },
];

export default function MaterialRecovery() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = salvagePassports.filter(p => {
    const matchSearch = search === '' ||
      p.batchId.toLowerCase().includes(search.toLowerCase()) ||
      p.material.toLowerCase().includes(search.toLowerCase()) ||
      p.zone.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.recoveryStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Material Recovery</h1>
          <p className="text-xs text-slate-500 mt-0.5">Inventory of potentially recoverable material batches</p>
        </div>
        <DemoBanner />
      </div>

      {/* Material summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MATERIAL_STATS.map(m => (
          <Card key={m.material} className="p-3 text-center">
            <div className={`text-xl font-bold font-mono ${m.color}`}>{m.batches}</div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">{m.material}</div>
            <div className="text-xs text-slate-600">{m.totalTonnes}t tracked</div>
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
            placeholder="Search by Batch ID, material or zone…"
            className="w-full pl-8 pr-3 py-2 bg-[#0f2040] border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="POTENTIALLY_RECOVERABLE">Potentially Recoverable</option>
          <option value="UNDER_INSPECTION">Under Inspection</option>
          <option value="APPROVED_SPECIFIC_REUSE">Approved for Reuse</option>
          <option value="HAZARDOUS">Hazardous</option>
        </select>
      </div>

      <AIDisclaimer compact />

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Batch ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Material</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Condition</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">AI Conf.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Inspection</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.batchId} className="border-b border-slate-700/20 hover:bg-slate-700/10 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-slate-200">{p.batchId}</span>
                    {p.hazardous && (
                      <div className="text-xs text-red-400 font-semibold">⚠ HAZMAT</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-semibold text-slate-300">{p.material}</div>
                    <div className="text-xs text-slate-600">{p.currentLocation}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-slate-400">{p.sourceName}</div>
                    <div className="text-xs font-mono text-slate-600">{p.sourceDebrisSiteId}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-mono font-semibold text-slate-200">{p.estimatedQuantity}</span>
                    <span className="text-xs text-slate-500"> {p.quantityUnit}</span>
                  </td>
                  <td className="px-4 py-3"><ConditionBadge condition={p.condition} /></td>
                  <td className="px-4 py-3 min-w-28">
                    <ConfidenceBar value={p.aiClassificationConfidence} />
                  </td>
                  <td className="px-4 py-3"><InspectionBadge status={p.visualInspection} /></td>
                  <td className="px-4 py-3"><RecoveryStatusBadge status={p.recoveryStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate('/passports')}
                      >
                        Passport
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate('/inspection')}
                      >
                        Inspect
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">No batches match the current filters.</div>
          )}
        </div>
      </Card>

      {/* Bottom note */}
      <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl">
        <p className="text-xs text-slate-600">
          <strong className="text-slate-500">Note:</strong> Material batches listed here are <em>potentially recoverable</em>.
          All reuse decisions require appropriate inspection, testing and qualified professional approval.
          Do not use material until the verification workflow is completed and approval recorded.
        </p>
      </div>
    </div>
  );
}
