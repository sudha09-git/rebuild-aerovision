import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitMerge, Package, Building2,
  AlertTriangle, CheckCircle2, Shield
} from 'lucide-react';
import { salvagePassports, recoveryRequirements, materialMatches } from '../data/mockData';
import type { MaterialMatch } from '../types';
import {
  Card, DemoBanner, RecoveryStatusBadge, PriorityBadge,
  Button, AIDisclaimer
} from '../components/ui';

function MatchScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#f97316';
  return (
    <div className="flex flex-col items-center">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle
          cx="36" cy="36" r="28"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 175.9} 175.9`}
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="36" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold" fontFamily="monospace">
          {score}%
        </text>
      </svg>
      <span className="text-xs text-slate-500 mt-1">Match Score</span>
    </div>
  );
}

export default function MaterialMatching() {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState<MaterialMatch>(materialMatches[0]);

  const getPassport = (id: string) => salvagePassports.find(p => p.batchId === id);
  const getRequirement = (id: string) => recoveryRequirements.find(r => r.id === id);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Recovery Match Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-assisted material matching — potential matches only, professional review required
          </p>
        </div>
        <DemoBanner />
      </div>

      {/* Header principle */}
      <div className="flex items-center gap-3 p-3 bg-amber-500/8 border border-amber-500/25 rounded-xl">
        <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-xs text-amber-400/90">
          <strong>Potential Match — Review Required.</strong> Match scores are AI-generated estimates only.
          All material suitability decisions require qualified professional verification before use.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Match list */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
            {materialMatches.length} Potential Matches
          </div>
          {materialMatches.map(match => {
            const passport = getPassport(match.passportBatchId);
            const req = getRequirement(match.requirementId);
            return (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                  selectedMatch.id === match.id
                    ? 'bg-[#162a54] border-blue-500/50'
                    : 'bg-[#0f2040] border-slate-700/40 hover:border-slate-600/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-200">{match.id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    match.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' :
                    match.status === 'UNDER_REVIEW' ? 'bg-amber-500/20 text-amber-400' :
                    match.status === 'POTENTIAL' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{match.status.replace('_', ' ')}</span>
                </div>
                <div className="text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300">{passport?.material}</span>
                  {' '}→ {req?.projectName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{passport?.estimatedQuantity} {passport?.quantityUnit}</span>
                  <span className={`text-xs font-bold font-mono ${
                    match.matchScore >= 85 ? 'text-emerald-400' :
                    match.matchScore >= 65 ? 'text-amber-400' : 'text-orange-400'
                  }`}>{match.matchScore}% match</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Match detail */}
        <div className="xl:col-span-2">
          <MatchDetail
            match={selectedMatch}
            passport={getPassport(selectedMatch.passportBatchId)}
            requirement={getRequirement(selectedMatch.requirementId)}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Available materials + requirements tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        {/* Available */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">Available Materials</h3>
          </div>
          <div className="space-y-2">
            {salvagePassports.filter(p => !p.hazardous).map(p => (
              <div key={p.batchId} className="flex items-center justify-between p-2.5 bg-slate-800/30 rounded-lg">
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-300">{p.batchId}</div>
                  <div className="text-xs text-slate-500">{p.material} · {p.estimatedQuantity} {p.quantityUnit}</div>
                </div>
                <RecoveryStatusBadge status={p.recoveryStatus} />
              </div>
            ))}
          </div>
        </Card>

        {/* Requirements */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Recovery Requirements</h3>
          </div>
          <div className="space-y-2">
            {recoveryRequirements.map(r => (
              <div key={r.id} className="flex items-center justify-between p-2.5 bg-slate-800/30 rounded-lg">
                <div>
                  <div className="text-xs font-semibold text-slate-300 max-w-48 truncate">{r.projectName}</div>
                  <div className="text-xs text-slate-500">{r.requiredMaterial} · {r.quantityNeeded} {r.quantityUnit}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <PriorityBadge priority={r.urgency} />
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    r.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' :
                    r.status === 'MATCHED' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MatchDetail({
  match, passport, requirement, navigate
}: {
  match: MaterialMatch;
  passport: ReturnType<typeof salvagePassports.find>;
  requirement: ReturnType<typeof recoveryRequirements.find>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  if (!passport || !requirement) return null;

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitMerge className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Potential Match — Review Required</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{match.id}</h3>
          </div>
          <MatchScoreRing score={match.matchScore} />
        </div>

        {/* Two columns: available / required */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-blue-500/8 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-bold text-blue-400">AVAILABLE MATERIAL</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{passport.material}</div>
            <div className="text-xs text-slate-400 mt-1">{passport.estimatedQuantity} {passport.quantityUnit}</div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">{passport.batchId}</div>
            <div className="mt-2"><RecoveryStatusBadge status={passport.recoveryStatus} /></div>
          </div>

          <div className="p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">RECOVERY NEED</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{requirement.projectName}</div>
            <div className="text-xs text-slate-400 mt-1">{requirement.requiredMaterial} · {requirement.quantityNeeded} {requirement.quantityUnit}</div>
            <div className="text-xs text-slate-500 mt-0.5">{requirement.organization}</div>
            <div className="mt-2"><PriorityBadge priority={requirement.urgency} /></div>
          </div>
        </div>

        {/* Match reasons */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-400">Match Factors</span>
          </div>
          <ul className="space-y-1">
            {match.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span className="text-xs text-slate-400">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        {match.warnings.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Review Requirements</span>
            </div>
            <ul className="space-y-1">
              {match.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  <span className="text-xs text-amber-400/80">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <AIDisclaimer compact />

        <div className="flex gap-2 mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/passports')}
          >
            View Material Passport
          </Button>
          <Button variant="warning" size="sm">
            Submit for Review
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/operations')}>
            Track Operation
          </Button>
        </div>
      </Card>

      <AIDisclaimer />
    </div>
  );
}
