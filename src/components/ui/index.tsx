import React from 'react';
import type { ClearancePriority, RecoveryStatus, InspectionStatus, OperationStatus, AlertLevel, MaterialCondition } from '../../types';

// ─── StatusBadge ─────────────────────────────────────────────
interface BadgeProps { label: string; color: string; dot?: boolean; pulse?: boolean }
export function Badge({ label, color, dot = false, pulse = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />}
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ClearancePriority }) {
  const map: Record<ClearancePriority, { label: string; color: string }> = {
    CRITICAL: { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    HIGH:     { label: 'HIGH',     color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    MEDIUM:   { label: 'MEDIUM',   color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    LOW:      { label: 'LOW',      color: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
  };
  const { label, color } = map[priority];
  return <Badge label={label} color={color} dot pulse={priority === 'CRITICAL'} />;
}

export function RecoveryStatusBadge({ status }: { status: RecoveryStatus }) {
  const map: Record<RecoveryStatus, { label: string; color: string }> = {
    DETECTED:              { label: 'Detected',             color: 'bg-slate-500/20 text-slate-300 border border-slate-500/30' },
    MAPPED:                { label: 'Mapped',               color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    POTENTIALLY_RECOVERABLE: { label: 'Potentially Recoverable', color: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
    UNDER_INSPECTION:      { label: 'Under Inspection',     color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    TESTING_REQUIRED:      { label: 'Testing Required',     color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    APPROVED_SPECIFIC_REUSE: { label: 'Approved for Specific Reuse', color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    RESTRICTED:            { label: 'Restricted',           color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    HAZARDOUS:             { label: 'Hazardous',            color: 'bg-red-600/30 text-red-300 border border-red-600/40' },
    RECOVERED:             { label: 'Recovered',            color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    PROCESSED:             { label: 'Processed',            color: 'bg-teal-500/20 text-teal-400 border border-teal-500/30' },
  };
  const { label, color } = map[status];
  return <Badge label={label} color={color} dot />;
}

export function InspectionBadge({ status }: { status: InspectionStatus }) {
  const map: Record<InspectionStatus, { label: string; color: string }> = {
    NOT_STARTED:  { label: 'Not Started',  color: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
    SCHEDULED:    { label: 'Scheduled',    color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    IN_PROGRESS:  { label: 'In Progress',  color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    COMPLETED:    { label: 'Completed',    color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    RESTRICTED:   { label: 'Restricted',   color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  };
  const { label, color } = map[status];
  return <Badge label={label} color={color} dot />;
}

export function OperationStatusBadge({ status }: { status: OperationStatus }) {
  const map: Record<OperationStatus, { label: string; color: string }> = {
    PLANNED:    { label: 'Planned',     color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    IN_PROGRESS:{ label: 'In Progress', color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    ON_HOLD:    { label: 'On Hold',     color: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
    COMPLETED:  { label: 'Completed',   color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    CANCELLED:  { label: 'Cancelled',   color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  };
  const { label, color } = map[status];
  return <Badge label={label} color={color} dot />;
}

export function ConditionBadge({ condition }: { condition: MaterialCondition }) {
  const map: Record<MaterialCondition, { label: string; color: string }> = {
    GOOD:      { label: 'Good',     color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    FAIR:      { label: 'Fair',     color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    POOR:      { label: 'Poor',     color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    HAZARDOUS: { label: 'Hazardous',color: 'bg-red-600/30 text-red-300 border border-red-600/40' },
    UNKNOWN:   { label: 'Unknown',  color: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
  };
  const { label, color } = map[condition];
  return <Badge label={label} color={color} dot />;
}

export function AlertLevelBadge({ level }: { level: AlertLevel }) {
  const map: Record<AlertLevel, { label: string; color: string }> = {
    CRITICAL: { label: 'Critical', color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    WARNING:  { label: 'Warning',  color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    INFO:     { label: 'Info',     color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    RECOVERY: { label: 'Recovery', color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  };
  const { label, color } = map[level];
  return <Badge label={label} color={color} dot />;
}

// ─── Card ────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}
export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      className={`bg-[#0f2040] border border-slate-700/40 rounded-xl ${hover ? 'cursor-pointer hover:border-slate-500/60 hover:bg-[#162a54] transition-all duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────
interface SectionHeaderProps { title: string; subtitle?: string; action?: React.ReactNode }
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────
interface ProgressBarProps { value: number; color?: string; className?: string }
export function ProgressBar({ value, color = 'bg-blue-500', className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-slate-700/50 rounded-full h-1.5 ${className}`}>
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// ─── Confidence Bar ───────────────────────────────────────────
export function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 85 ? 'bg-emerald-500' : value >= 70 ? 'bg-amber-500' : 'bg-orange-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-700/50 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-mono font-semibold ${value >= 85 ? 'text-emerald-400' : value >= 70 ? 'text-amber-400' : 'text-orange-400'}`}>
        {value}%
      </span>
    </div>
  );
}

// ─── Demo Banner ─────────────────────────────────────────────
export function DemoBanner() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-400 font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      DEMO SCENARIO — SIMULATED DATA
    </div>
  );
}

// ─── AI Disclaimer ────────────────────────────────────────────
export function AIDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-amber-400/80 italic">
        Simulated AI classification — field verification required.
      </p>
    );
  }
  return (
    <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
      <p className="text-xs text-amber-400/90 leading-relaxed">
        <strong>Important:</strong> AI classification does not constitute structural certification.
        Reuse requires appropriate testing and qualified professional approval.
        All AI outputs are recommendations only — human verification is required.
      </p>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-slate-600 mb-3">{icon}</div>
      <p className="text-slate-400 font-medium">{title}</p>
      <p className="text-slate-600 text-sm mt-1">{message}</p>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────
interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
  description?: string;
  accent?: string;
}
export function KPICard({ title, value, icon, trend, trendColor = 'text-slate-500', description, accent = 'text-slate-100' }: KPICardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-slate-700/40 rounded-lg text-slate-400">{icon}</div>
        {trend && <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>}
      </div>
      <div className={`text-2xl font-bold font-mono ${accent}`}>{value}</div>
      <div className="text-xs text-slate-400 font-medium mt-1">{title}</div>
      {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
    </Card>
  );
}

// ─── Detail Row ───────────────────────────────────────────────
export function DetailRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-700/30 last:border-0">
      <span className="text-xs text-slate-500 flex-shrink-0 w-40">{label}</span>
      <span className={`text-xs text-slate-200 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

// ─── Section Divider ─────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-slate-700/40 my-4" />;
  return (
    <div className="flex items-center gap-3 my-4">
      <hr className="flex-1 border-slate-700/40" />
      <span className="text-xs text-slate-600 uppercase tracking-wider">{label}</span>
      <hr className="flex-1 border-slate-700/40" />
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'success';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}
export function Button({ variant = 'secondary', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  const variantClasses: Record<BtnVariant, string> = {
    primary:   'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50',
    secondary: 'bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50',
    danger:    'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40',
    ghost:     'bg-transparent hover:bg-slate-700/40 text-slate-400 border border-transparent',
    warning:   'bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/40',
    success:   'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40',
  };
  const sizeClasses = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-1.5 text-sm', lg: 'px-5 py-2.5 text-base' };
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// ─── Tab Bar ─────────────────────────────────────────────────
interface Tab { id: string; label: string; count?: number }
interface TabBarProps { tabs: Tab[]; active: string; onChange: (id: string) => void }
export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/40">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
            active === tab.id
              ? 'bg-[#0f2040] text-slate-100 shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${active === tab.id ? 'bg-slate-700 text-slate-300' : 'bg-slate-700/40 text-slate-500'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────
interface SearchBarProps { value: string; onChange: (v: string) => void; placeholder?: string }
export function SearchBar({ value, onChange, placeholder = 'Search…' }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
    />
  );
}
