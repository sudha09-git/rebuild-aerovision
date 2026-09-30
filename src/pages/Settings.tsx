import { Shield, Info } from 'lucide-react';
import { Card, DemoBanner } from '../components/ui';

export default function Settings() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Platform configuration — Demo mode</p>
        </div>
        <DemoBanner />
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Platform Information</h3>
        </div>
        <div className="space-y-0">
          {[
            { label: 'Platform', value: 'ReBuild v0.1 — Demo Prototype' },
            { label: 'Scenario', value: 'Bhavapur Earthquake Response — Simulated' },
            { label: 'Team', value: 'AeroVision' },
            { label: 'Institution', value: 'Shri Shankaracharya Technical Campus, Bhilai' },
            { label: 'Team Leader', value: 'Ayush Shah' },
            { label: 'Team Member', value: 'Varsha Barik' },
            { label: 'Data Mode', value: 'Simulated Demo Data — Not Real Disaster Statistics' },
            { label: 'AI Mode', value: 'Simulated AI Classification — Not Real Model Output' },
            { label: 'Map Data', value: 'OpenStreetMap (Demo Coordinates Only)' },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2.5 border-b border-slate-700/20 last:border-0">
              <span className="text-sm text-slate-500">{r.label}</span>
              <span className="text-sm text-slate-300 font-medium">{r.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-slate-100">Safety Principles</h3>
        </div>
        <div className="space-y-3">
          {[
            'Emergency rescue and public safety always take priority over material recovery.',
            'AI may classify visible materials and estimate quantities, but it must never independently certify structural safety.',
            'Final material reuse requires appropriate inspection, testing and qualified human approval.',
            'All AI outputs are recommendations only — human verification is required at every decision point.',
            'This platform is a decision-support system, not an autonomous authority.',
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-orange-400 font-bold flex-shrink-0">{i + 1}.</span>
              <p className="text-xs text-slate-400 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
