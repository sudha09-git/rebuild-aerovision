import { useState } from 'react';
import { ClipboardCheck, CheckSquare, Square, Shield, AlertTriangle, Save } from 'lucide-react';
import { salvagePassports } from '../data/mockData';
import type { SalvagePassport } from '../types';
import {
  Card, DemoBanner, RecoveryStatusBadge, InspectionBadge,
  ConfidenceBar, Button, AIDisclaimer
} from '../components/ui';

const CHECKLIST_ITEMS = [
  { id: 'visual', label: 'Material visually identified and recorded' },
  { id: 'quantity', label: 'Estimated quantity verified by inspector' },
  { id: 'contamination', label: 'Contamination assessed (visual / field tests)' },
  { id: 'structural', label: 'Structural condition assessed by qualified engineer' },
  { id: 'laboratory', label: 'Laboratory testing completed where required' },
  { id: 'application', label: 'Approved application determined by responsible engineer' },
  { id: 'evidence', label: 'Supporting evidence uploaded / documented' },
  { id: 'approval', label: 'Professional approval recorded with authority name and date' },
];

export default function InspectionWorkflow() {
  const inspectionBatches = salvagePassports.filter(
    p => p.recoveryStatus === 'UNDER_INSPECTION' || p.recoveryStatus === 'POTENTIALLY_RECOVERABLE'
  );
  const [selectedBatch, setSelectedBatch] = useState<SalvagePassport>(inspectionBatches[0]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [approvedUse, setApprovedUse] = useState('');
  const [authority, setAuthority] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [restricted, setRestricted] = useState(false);

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === CHECKLIST_ITEMS.length;

  const handleRestrict = () => {
    setRestricted(true);
    setShowApproveForm(false);
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Inspection Workflow</h1>
          <p className="text-xs text-slate-500 mt-0.5">Human-in-the-loop material inspection and approval process</p>
        </div>
        <DemoBanner />
      </div>

      {/* Safety banner */}
      <div className="flex items-center gap-3 p-3 bg-blue-500/8 border border-blue-500/25 rounded-xl">
        <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <p className="text-xs text-blue-400/90">
          <strong>Human-in-the-Loop Process:</strong> AI classification is a starting point only.
          A qualified professional must complete this inspection checklist and provide approval.
          AI cannot certify material safety or approve structural use.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Batch selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
            Batches Awaiting Inspection
          </div>
          {inspectionBatches.map(p => (
            <button
              key={p.batchId}
              onClick={() => { setSelectedBatch(p); setChecked({}); setSubmitted(false); setRestricted(false); setShowApproveForm(false); }}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedBatch?.batchId === p.batchId
                  ? 'bg-[#162a54] border-blue-500/50'
                  : 'bg-[#0f2040] border-slate-700/40 hover:border-slate-600/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-slate-200">{p.batchId}</span>
                <RecoveryStatusBadge status={p.recoveryStatus} />
              </div>
              <div className="text-xs text-slate-400">{p.material}</div>
              <div className="text-xs text-slate-600">{p.estimatedQuantity} {p.quantityUnit} · {p.zone}</div>
            </button>
          ))}
        </div>

        {/* Inspection form */}
        <div className="xl:col-span-2 space-y-4">
          {selectedBatch && (
            <>
              {/* Batch info */}
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-orange-400 font-bold uppercase tracking-wide mb-0.5">Inspecting</div>
                    <h3 className="text-base font-bold font-mono text-slate-100">{selectedBatch.batchId}</h3>
                    <p className="text-sm text-slate-300">{selectedBatch.material}</p>
                  </div>
                  <InspectionBadge status={selectedBatch.visualInspection} />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-slate-800/40 rounded-lg">
                    <div className="text-xs text-slate-500">Quantity</div>
                    <div className="text-sm font-bold text-slate-200">{selectedBatch.estimatedQuantity} {selectedBatch.quantityUnit}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-800/40 rounded-lg">
                    <div className="text-xs text-slate-500">Source</div>
                    <div className="text-xs font-mono font-bold text-slate-200">{selectedBatch.sourceDebrisSiteId}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-800/40 rounded-lg">
                    <div className="text-xs text-slate-500">AI Confidence</div>
                    <div className="text-sm font-bold text-amber-400">{selectedBatch.aiClassificationConfidence}%</div>
                  </div>
                </div>
                <ConfidenceBar value={selectedBatch.aiClassificationConfidence} />
                <AIDisclaimer compact />
              </Card>

              {/* Checklist */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-100">Inspection Checklist</h3>
                  <span className="ml-auto text-xs font-mono text-slate-500">{checkedCount}/{CHECKLIST_ITEMS.length}</span>
                </div>

                {submitted ? (
                  <div className="py-6 text-center">
                    <div className="text-2xl mb-2">{restricted ? '🚫' : '✅'}</div>
                    <div className={`text-sm font-bold ${restricted ? 'text-red-400' : 'text-emerald-400'}`}>
                      {restricted ? 'Material Restricted' : 'Inspection Submitted for Review'}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {restricted
                        ? 'This batch has been flagged as restricted. It cannot be used until restriction is lifted by a qualified authority.'
                        : 'Inspection record submitted. Awaiting senior review and final approval decision.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {CHECKLIST_ITEMS.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                          checked[item.id]
                            ? 'bg-emerald-500/8 border-emerald-500/25 text-emerald-300'
                            : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
                        }`}
                      >
                        {checked[item.id]
                          ? <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          : <Square className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        }
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Inspector notes */}
              {!submitted && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-slate-100 mb-3">Inspector Notes</h3>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Enter inspection observations, measurements, concerns…"
                    rows={3}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </Card>
              )}

              {/* Approve form */}
              {showApproveForm && !submitted && (
                <Card className="p-4 border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-emerald-400">Approve for Specific Use</h3>
                  </div>
                  <p className="text-xs text-amber-400/80 mb-3 italic">
                    Approval must be provided by a qualified professional. This action constitutes a professional record.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Approved Application *</label>
                      <input
                        type="text"
                        value={approvedUse}
                        onChange={e => setApprovedUse(e.target.value)}
                        placeholder="e.g., Temporary structural support — non-load-bearing only"
                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Approval Authority *</label>
                      <input
                        type="text"
                        value={authority}
                        onChange={e => setAuthority(e.target.value)}
                        placeholder="Name, title and registration number"
                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Inspection Date *</label>
                      <input
                        type="date"
                        value={inspectionDate}
                        onChange={e => setInspectionDate(e.target.value)}
                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <Button
                      variant="success"
                      className="w-full justify-center"
                      disabled={!approvedUse || !authority || !inspectionDate}
                      onClick={() => setSubmitted(true)}
                    >
                      Approve for Specific Use
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowApproveForm(false)} className="w-full justify-center">
                      Cancel
                    </Button>
                  </div>
                </Card>
              )}

              {/* Action buttons */}
              {!submitted && !showApproveForm && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    icon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Inspection
                  </Button>
                  <Button variant="secondary" onClick={() => setSubmitted(true)}>
                    Submit for Review
                  </Button>
                  <Button
                    variant="danger"
                    icon={<AlertTriangle className="w-3.5 h-3.5" />}
                    onClick={handleRestrict}
                  >
                    Restrict Material
                  </Button>
                  <Button
                    variant="success"
                    disabled={!allChecked}
                    icon={<Shield className="w-3.5 h-3.5" />}
                    onClick={() => setShowApproveForm(true)}
                    title={!allChecked ? 'Complete all checklist items before approving' : undefined}
                  >
                    Approve for Specific Use
                  </Button>
                </div>
              )}

              {!allChecked && !submitted && (
                <p className="text-xs text-amber-400/70 italic">
                  Complete all {CHECKLIST_ITEMS.length} checklist items before approval is available.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
