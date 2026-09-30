import { notifications } from '../data/mockData';
import { Card, DemoBanner, AlertLevelBadge } from '../components/ui';

export default function Notifications() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">System alerts and recovery updates</p>
        </div>
        <DemoBanner />
      </div>

      <Card>
        <div className="divide-y divide-slate-700/30">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-4 p-4 ${!n.read ? 'bg-slate-700/10' : ''}`}>
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                n.level === 'CRITICAL' ? 'bg-red-400' :
                n.level === 'WARNING' ? 'bg-orange-400' :
                n.level === 'RECOVERY' ? 'bg-emerald-400' : 'bg-blue-400'
              } ${!n.read ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertLevelBadge level={n.level} />
                  <span className="text-sm font-semibold text-slate-200">{n.title}</span>
                  {!n.read && <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-bold">NEW</span>}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                <p className="text-xs text-slate-600 mt-1.5">{new Date(n.timestamp).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
