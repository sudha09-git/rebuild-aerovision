import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Layers, PackageSearch, FileText,
  GitMerge, Truck, BarChart3, Bell, Search,
  ChevronLeft, ChevronRight, Shield, AlertTriangle,
  User, LogOut, RefreshCw, Settings, Wifi, Clock
} from 'lucide-react';
import { notifications, salvagePassports, debrisSites } from '../../data/mockData';
import type { UserProfile } from '../../types';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { path: '/dashboard',  label: 'Command Center',      icon: LayoutDashboard },
      { path: '/map',        label: 'Disaster Map',        icon: Map },
      { path: '/clearance',  label: 'Emergency Clearance', icon: AlertTriangle },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/debris',     label: 'Debris Intelligence', icon: Layers },
      { path: '/recovery',   label: 'Material Recovery',   icon: PackageSearch },
      { path: '/passports',  label: 'Salvage Passports',   icon: FileText },
    ],
  },
  {
    label: 'Recovery',
    items: [
      { path: '/matching',   label: 'Material Matching',   icon: GitMerge },
      { path: '/operations', label: 'Recovery Operations', icon: Truck },
      { path: '/analytics',  label: 'Impact Analytics',    icon: BarChart3 },
    ],
  },
];

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  COMMAND_OFFICER:      { label: 'Command Officer',      color: 'text-blue-400',    bg: 'bg-blue-500/15 border-blue-500/30' },
  FIELD_INSPECTOR:      { label: 'Field Inspector',      color: 'text-amber-400',   bg: 'bg-amber-500/15 border-amber-500/30' },
  RECOVERY_COORDINATOR: { label: 'Recovery Coordinator', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
};

interface AppLayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  onLogout: () => void;
}

export default function AppLayout({ children, user, onLogout }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => !n.read && n.level === 'CRITICAL').length;
  const allNavItems = NAV_GROUPS.flatMap(g => g.items);
  const currentPage = allNavItems.find(n => location.pathname === n.path);
  const role = ROLE_CONFIG[user.role] ?? ROLE_CONFIG['COMMAND_OFFICER'];

  // Current time display
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#050d1a' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className={`
        relative flex flex-col flex-shrink-0 transition-all duration-200
        border-r border-slate-700/50
        ${collapsed ? 'w-[60px]' : 'w-[220px]'}
      `} style={{ background: '#07111f' }}>

        {/* Logo block */}
        <div className={`flex items-center border-b border-slate-700/50 flex-shrink-0 ${collapsed ? 'justify-center px-3 py-4' : 'px-4 py-4 gap-3'}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-black tracking-widest text-white">ReBuild</div>
              <div className="text-[10px] text-slate-500 leading-none tracking-wide uppercase">Disaster Intelligence</div>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{group.label}</span>
                </div>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={`
                      w-full flex items-center text-sm font-medium transition-all duration-150 relative
                      ${collapsed ? 'justify-center px-3 py-2.5 mx-0' : 'gap-3 px-4 py-2.5'}
                      ${active
                        ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/20'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {/* Critical indicator for Emergency Clearance */}
                    {!collapsed && item.path === '/clearance' && criticalCount > 0 && (
                      <span className="ml-auto w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {criticalCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Settings at bottom of nav */}
          {!collapsed && <div className="px-4 pt-3 pb-1"><span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">System</span></div>}
          <button
            onClick={() => navigate('/settings')}
            title={collapsed ? 'Settings' : undefined}
            className={`w-full flex items-center text-sm font-medium transition-all duration-150
              ${collapsed ? 'justify-center px-3 py-2.5' : 'gap-3 px-4 py-2.5'}
              ${location.pathname === '/settings' ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/20'}
            `}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
        </nav>

        {/* User block */}
        <div className="border-t border-slate-700/50 p-3 flex-shrink-0">
          {!collapsed && (
            <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg border mb-2 ${role.bg}`}>
              <div className="w-6 h-6 rounded-full bg-slate-600/50 border border-slate-500/40 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-slate-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
                <div className={`text-[10px] font-medium truncate ${role.color}`}>{role.label}</div>
              </div>
            </div>
          )}
          <div className={`flex items-center ${collapsed ? 'flex-col gap-1.5 items-center' : 'gap-1 justify-end'}`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-slate-700/40 transition-colors"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── TOP BAR ───────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-5 py-0 flex-shrink-0 border-b border-slate-700/50" style={{ background: '#07111f', height: '52px' }}>

          {/* Left — page title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-100 leading-tight">{currentPage?.label ?? 'ReBuild'}</div>
              <div className="text-[10px] text-slate-600 leading-tight truncate">Bhavapur Earthquake Response</div>
            </div>
            {/* Demo banner */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest" style={{ background: 'rgba(245,158,11,0.07)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Demo · Simulated Data
            </div>
          </div>

          {/* Right — controls */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* System status */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold pr-3 border-r border-slate-700/50">
              <Wifi className="w-3 h-3" />
              <span>LIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Time */}
            <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-600 font-mono pr-3 border-r border-slate-700/50">
              <Clock className="w-3 h-3" />
              <span>{timeStr}</span>
            </div>

            {/* Search */}
            <GlobalSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} navigate={navigate} />

            {/* Refresh */}
            <button className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-slate-700/30 rounded-md transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 text-slate-600 hover:text-slate-300 hover:bg-slate-700/30 rounded-md transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl z-50 border border-slate-700/50 overflow-hidden" style={{ background: '#0a1628' }}>
                  <div className="px-4 py-3 border-b border-slate-700/40 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-slate-100">Alerts</span>
                      {unreadCount > 0 && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-bold">{unreadCount} new</span>
                      )}
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-600 hover:text-slate-400 text-xs">✕</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/20">
                    {notifications.slice(0, 6).map(n => (
                      <div key={n.id} className={`px-4 py-3 transition-colors hover:bg-slate-700/10 ${!n.read ? '' : 'opacity-60'}`}>
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            n.level === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
                            n.level === 'WARNING'  ? 'bg-orange-400' :
                            n.level === 'RECOVERY' ? 'bg-emerald-400' : 'bg-blue-400'
                          }`} />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-200">{n.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-slate-700 mt-1">
                              {new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-700/40" style={{ background: 'rgba(5,13,26,0.5)' }}>
                    <button
                      onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User pill */}
            <div className={`flex items-center gap-2 pl-2.5 border-l border-slate-700/50 ml-0.5`}>
              <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 bg-blue-500/15 border-blue-500/40">
                <User className="w-3 h-3 text-blue-400" />
              </div>
              <div className="hidden sm:block text-xs leading-tight">
                <div className="text-slate-300 font-semibold">{user.name}</div>
                <div className={`${role.color} text-[10px] font-medium`}>{role.label}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ─────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#050d1a' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Global Search Component ─────────────────────────────────
function GlobalSearch({
  searchQuery, setSearchQuery, navigate
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const q = searchQuery.toLowerCase().trim();

  const passportResults = q.length >= 2
    ? salvagePassports.filter(p =>
        p.batchId.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        p.sourceDebrisSiteId.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const siteResults = q.length >= 2
    ? debrisSites.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults = passportResults.length > 0 || siteResults.length > 0;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600 z-10" />
      <input
        type="text"
        placeholder="Search Detection Code, site…"
        value={searchQuery}
        onChange={e => { setSearchQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="pl-7 pr-3 py-1.5 w-48 lg:w-56 rounded-lg text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 border border-slate-700/50 transition-all"
        style={{ background: 'rgba(15,32,64,0.8)' }}
      />
      {open && hasResults && (
        <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#0a1628] border border-slate-700/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          {passportResults.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wide border-b border-slate-700/30">Salvage Passports</div>
              {passportResults.map(p => (
                <button
                  key={p.batchId}
                  className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-slate-700/30 transition-colors text-left"
                  onClick={() => { navigate('/passports'); setOpen(false); setSearchQuery(''); }}
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono font-bold text-orange-300">{p.batchId}</div>
                    <div className="text-xs text-slate-400">{p.material} · {p.zone}</div>
                  </div>
                </button>
              ))}
            </>
          )}
          {siteResults.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wide border-b border-slate-700/30 border-t border-slate-700/30">Debris Sites</div>
              {siteResults.map(s => (
                <button
                  key={s.id}
                  className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-slate-700/30 transition-colors text-left"
                  onClick={() => { navigate('/debris'); setOpen(false); setSearchQuery(''); }}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-200">{s.id}</div>
                    <div className="text-xs text-slate-400">{s.zone}</div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

