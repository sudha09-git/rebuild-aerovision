import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle2, Clock, AlertTriangle,
  Shield, ChevronRight, Package
} from 'lucide-react';
import { salvagePassports } from '../data/mockData';
import type { SalvagePassport } from '../types';
import {
  Card, DemoBanner, RecoveryStatusBadge, InspectionBadge,
  ConditionBadge, ConfidenceBar, AIDisclaimer, Button, DetailRow
} from '../components/ui';

// Minimal SVG QR-code visual
function QRCodeVisual({ batchId }: { batchId: string }) {
  const seed = batchId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells: boolean[] = Array.from({ length: 49 }, (_, i) => ((seed * (i + 1) * 7 + i * 13) % 3) !== 0);
  return (
    <div className="inline-flex flex-col gap-0.5 p-2 bg-white rounded-lg">
      {Array.from({ length: 7 }, (_, row) => (
        <div key={row} className="flex gap-0.5">
          {Array.from({ length: 7 }, (_, col) => (
            <div
              key={col}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: cells[row * 7 + col] ? '#0a1628' : '#ffffff' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Timeline component
function PassportTimeline({ timeline }: { timeline: SalvagePassport['timeline'] }) {
  return (
    <div className="relative">
      {timeline.map((step, i) => (
        <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
          <div className="relative flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
              step.completed
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : 'bg-slate-700/50 border-slate-600 text-slate-600'
            }`}>
              {step.completed
                ? <CheckCircle2 className="w-3.5 h-3.5" />
                : <Clock className="w-3.5 h-3.5" />}
            </div>
            {i < timeline.length - 1 && (
              <div className={`w-0.5 h-6 mt-1 ${step.completed ? 'bg-emerald-500/40' : 'bg-slate-700/40'}`} />
            )}
          </div>
          <div className="pt-0.5 min-w-0">
            <div className={`text-xs font-semibold ${step.completed ? 'text-slate-200' : 'text-slate-600'}`}>
              {step.stage}
            </div>
            {step.date && <div className="text-xs text-slate-600 mt-0.5">{step.date}</div>}
            {step.notes && <div className="text-xs text-slate-500 mt-0.5 italic">{step.notes}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SalvagePassports() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SalvagePassport>(salvagePassports[0]);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Digital Salvage Passports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Material traceability records — not safety certifications</p>
        </div>
        <DemoBanner />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left — passport list */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
            {salvagePassports.length} Registered Batches
          </div>
          {salvagePassports.map(p => (
            <button
              key={p.batchId}
              onClick={() => setSelected(p)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                selected.batchId === p.batchId
                  ? 'bg-[#162a54] border-blue-500/50'
                  : 'bg-[#0f2040] border-slate-700/40 hover:border-slate-600/60 hover:bg-[#0f2040]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-slate-200">{p.batchId}</span>
                <RecoveryStatusBadge status={p.recoveryStatus} />
              </div>
              <div className="text-xs font-semibold text-slate-300 mb-1">{p.material}</div>
              <div className="text-xs text-slate-500">{p.estimatedQuantity} {p.quantityUnit} · {p.zone}</div>
              <div className="mt-2">
                <ConfidenceBar value={p.aiClassificationConfidence} />
              </div>
            </button>
          ))}
        </div>

        {/* Right — passport detail */}
        <div className="xl:col-span-2">
          <PassportCard passport={selected} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

function PassportCard({ passport: p, navigate }: { passport: SalvagePassport; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="space-y-4">
      {/* Passport header card */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Digital Salvage Passport</span>
            </div>
            <h2 className="text-xl font-black text-slate-100 font-mono">{p.batchId}</h2>
            <p className="text-sm font-semibold text-slate-300 mt-1">{p.material}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <RecoveryStatusBadge status={p.recoveryStatus} />
            <ConditionBadge condition={p.condition} />
            {p.hazardous && (
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> HAZMAT FLAGGED
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left details */}
          <div>
            <DetailRow label="Batch ID" value={<span className="font-mono">{p.batchId}</span>} />
            <DetailRow label="Material" value={p.material} />
            <DetailRow label="Estimated Quantity" value={`${p.estimatedQuantity} ${p.quantityUnit}`} />
            <DetailRow label="Source Site" value={<span className="font-mono">{p.sourceDebrisSiteId}</span>} />
            <DetailRow label="Source Name" value={p.sourceName} />
            <DetailRow label="Zone" value={p.zone} />
            <DetailRow label="GPS (Demo)" value={p.gpsCoordinates} />
            <DetailRow label="Current Location" value={p.currentLocation} />
            <DetailRow label="Condition" value={<ConditionBadge condition={p.condition} />} />
          </div>

          {/* Right — QR + confidence */}
          <div className="flex flex-col items-center justify-start gap-4">
            <div className="text-center">
              <QRCodeVisual batchId={p.batchId} />
              <p className="text-xs text-slate-600 mt-1.5">Traceability Reference</p>
              <p className="text-xs font-mono text-slate-500">{p.batchId}</p>
            </div>
            <div className="w-full p-3 bg-slate-800/40 rounded-xl">
              <div className="text-xs font-semibold text-slate-400 mb-2">AI Classification Confidence</div>
              <ConfidenceBar value={p.aiClassificationConfidence} />
              <AIDisclaimer compact />
            </div>
          </div>
        </div>
      </Card>

      {/* Inspection status */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-3">Verification Status</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Visual Inspection', status: p.visualInspection },
            { label: 'Material Testing', status: p.materialTesting },
            { label: 'Structural Assessment', status: p.structuralAssessment },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-500 mb-2">{item.label}</div>
              <InspectionBadge status={item.status} />
            </div>
          ))}
        </div>

        {p.approvedUse && (
          <div className="mt-3 p-3 bg-emerald-500/8 border border-emerald-500/25 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Approved for Specific Use</span>
            </div>
            <p className="text-xs text-slate-300">{p.approvedUse}</p>
            {p.approvalAuthority && <p className="text-xs text-slate-500 mt-1">Authority: {p.approvalAuthority}</p>}
            {p.approvalDate && <p className="text-xs text-slate-500">Date: {p.approvalDate}</p>}
          </div>
        )}

        {p.inspectionNotes && (
          <div className="mt-3 p-3 bg-slate-800/40 rounded-lg">
            <div className="text-xs font-semibold text-slate-400 mb-1">Inspector Notes</div>
            <p className="text-xs text-slate-400 leading-relaxed">{p.inspectionNotes}</p>
            {p.inspectorName && <p className="text-xs text-slate-600 mt-1">Inspector: {p.inspectorName}</p>}
          </div>
        )}

        {p.testingResults && (
          <div className="mt-3 p-3 bg-blue-500/8 border border-blue-500/20 rounded-lg">
            <div className="text-xs font-semibold text-blue-400 mb-1">Testing Results</div>
            <p className="text-xs text-slate-400 leading-relaxed">{p.testingResults}</p>
          </div>
        )}
      </Card>

      {/* Timeline */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-4">Recovery Timeline</h3>
        <PassportTimeline timeline={p.timeline} />
      </Card>

      {/* Disclaimer */}
      <AIDisclaimer />

      {/* Safety principle */}
      <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl flex items-start gap-2">
        <Shield className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          This passport is a <strong className="text-slate-500">traceability mechanism</strong>, not a safety certificate.
          AI classification does not constitute structural certification.
          Reuse requires appropriate testing and qualified professional approval.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/matching')}
          icon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Find Recovery Match
        </Button>
        <Button
          variant="warning"
          size="sm"
          icon={<Package className="w-3.5 h-3.5" />}
          onClick={() => navigate('/inspection')}
        >
          Open Inspection Workflow
        </Button>
        <Button variant="ghost" size="sm">
          Export Passport
        </Button>
      </div>
    </div>
  );
}
