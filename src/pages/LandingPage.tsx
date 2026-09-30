import { useState } from 'react';
import { Shield, ArrowRight, MapPin, Package, CheckCircle, AlertTriangle, BarChart3, Users } from 'lucide-react';
import type { UserRole, UserProfile } from '../types';

interface LandingPageProps {
  onEnter: (user: UserProfile) => void;
}

const ROLES: { role: UserRole; label: string; description: string; color: string }[] = [
  {
    role: 'COMMAND_OFFICER',
    label: 'Command Officer',
    description: 'Full platform access — dashboard, map, operations & analytics',
    color: 'border-blue-500/40 hover:border-blue-400/70',
  },
  {
    role: 'FIELD_INSPECTOR',
    label: 'Field Inspector',
    description: 'Assigned inspections, material passports & inspection workflows',
    color: 'border-amber-500/40 hover:border-amber-400/70',
  },
  {
    role: 'RECOVERY_COORDINATOR',
    label: 'Recovery Coordinator',
    description: 'Material inventory, matching engine & recovery operations',
    color: 'border-emerald-500/40 hover:border-emerald-400/70',
  },
];

const FEATURES = [
  { icon: MapPin,       title: 'Disaster Mapping',      desc: 'Real-time debris site mapping and hazard zone identification' },
  { icon: Package,      title: 'Material Traceability',  desc: 'Digital Salvage Passports for every material batch' },
  { icon: CheckCircle,  title: 'Human-in-the-Loop',     desc: 'AI assists — qualified professionals decide' },
  { icon: AlertTriangle,title: 'Emergency Priority',     desc: 'Safety and clearance always before material recovery' },
  { icon: BarChart3,    title: 'Impact Analytics',       desc: 'Recovery workflow progress and outcome tracking' },
  { icon: Users,        title: 'Coordinated Response',   desc: 'Unified platform for all response stakeholders' },
];

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('COMMAND_OFFICER');
  const [name, setName] = useState('Ayush Shah');

  const handleEnter = () => {
    onEnter({
      name: name || 'Demo User',
      role: selectedRole,
      unit: selectedRole === 'COMMAND_OFFICER' ? 'Incident Command' :
            selectedRole === 'FIELD_INSPECTOR' ? 'Engineering Inspection Unit' :
            'Recovery Coordination Team',
    });
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-black text-white tracking-wide">ReBuild</div>
            <div className="text-xs text-slate-500">AI-Powered Disaster Debris Intelligence</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 font-semibold">
            DEMO SCENARIO
          </span>
          <span>AeroVision · SSTC Bhilai</span>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left — hero content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 max-w-2xl">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-semibold text-orange-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Bhavapur Earthquake Response — Active Demo
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Re<span className="text-orange-400">Build</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-2">
              Map the Damage. Recover the Value.{' '}
              <span className="text-slate-300">Rebuild the Future.</span>
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-4 max-w-lg">
              An AI-assisted disaster recovery intelligence platform connecting debris mapping,
              emergency clearance, material verification and circular recovery planning — 
              keeping human professionals in control at every decision point.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-2.5 p-3 bg-[#0a1628] border border-slate-700/40 rounded-lg">
                <f.icon className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-300">{f.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety principle */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Safety Principle</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ReBuild is a <strong className="text-slate-300">decision-support system</strong>, not an autonomous authority.
              AI may classify materials and recommend actions, but final reuse decisions require
              appropriate inspection, testing and qualified human approval.
            </p>
          </div>
        </div>

        {/* Right — login panel */}
        <div className="lg:w-96 flex flex-col justify-center px-8 py-12 lg:border-l border-slate-800/60">
          <div className="bg-[#0a1628] border border-slate-700/40 rounded-2xl p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-100">Enter Demo Platform</h2>
              <p className="text-xs text-slate-500 mt-1">Select your role and enter the command center</p>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#0f2040] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
                placeholder="Enter your name"
              />
            </div>

            {/* Role selection */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-400 mb-2">Select Role</label>
              <div className="space-y-2">
                {ROLES.map(r => (
                  <button
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`w-full text-left p-3 rounded-xl border bg-[#0f2040] transition-all duration-150 ${
                      selectedRole === r.role
                        ? `${r.color} bg-slate-700/20`
                        : 'border-slate-700/40 hover:border-slate-600/60'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-200">{r.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enter button */}
            <button
              onClick={handleEnter}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl transition-all duration-150 shadow-lg shadow-orange-500/20"
            >
              Enter Command Center
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleEnter}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-400 mt-3 py-1 transition-colors"
            >
              Explore Demo →
            </button>

            <div className="mt-4 pt-4 border-t border-slate-700/40">
              <p className="text-xs text-slate-700 text-center">
                Simulated data only — not real disaster statistics
              </p>
            </div>
          </div>

          {/* Team info */}
          <div className="mt-5 text-center">
            <div className="text-xs font-bold text-slate-400">AeroVision</div>
            <div className="text-xs text-slate-600 mt-0.5">Ayush Shah · Varsha Barik</div>
            <div className="text-xs text-slate-700 mt-0.5">Shri Shankaracharya Technical Campus, Bhilai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
