import { AlertTriangle, Gauge, Menu, Radio, Settings, Signal, Target } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMapStore, useUIStore, useSimulationStore, useZonesStore } from '../../store';

export function TopNavigation() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleAnalytics = useUIStore((state) => state.toggleAnalytics);
  const resetMap = useMapStore((state) => state.resetMap);
  const zones = useZonesStore((state) => state.zones);
  const isRunning = useSimulationStore((state) => state.isRunning);
  const navigate = useNavigate();
  const location = useLocation();

  const totalIncidents = zones.length;
  const activeRescueZones = zones.filter((z) => z.riskLevel === 'critical').length;
  const avgSignalLoss =
    zones.length > 0
      ? Math.round(
          (zones.reduce((sum, z) => sum + z.signals.phonesDisconnected, 0) / zones.length)
        )
      : 0;
  const maxPriority = zones.length > 0 ? Math.max(...zones.map((z) => z.priorityScore)) : 0;
  const isHome = location.pathname === '/';

  const metrics = [
    {
      label: 'Incidents',
      value: totalIncidents,
      icon: AlertTriangle,
      tone: 'text-[#4FD1FF]',
    },
    {
      label: 'Rescue Zones',
      value: activeRescueZones,
      icon: Target,
      tone: 'text-[#FF5A5A]',
    },
    {
      label: 'Signal Loss',
      value: avgSignalLoss,
      icon: Signal,
      tone: 'text-amber-300',
    },
    {
      label: 'Max Priority',
      value: Math.round(maxPriority),
      icon: Gauge,
      tone: maxPriority > 80 ? 'text-[#FF5A5A]' : 'text-[#4FD1FF]',
    },
  ];

  return (
    <nav className="h-16 shrink-0 border-b border-white/10 bg-[#07111F]/90 px-4 backdrop-blur-xl">
      <div className="flex h-full items-center gap-4">
        {/* Left Section - Controls */}
        <div className="flex min-w-[220px] items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-[#4FD1FF]"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 animate-pulse text-[#4FD1FF]" />
          <div className="leading-none">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">ResQNet</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Command</p>
          </div>
        </div>
      </div>

      {/* Center - Status Modes */}
      <div className="hidden flex-1 items-center gap-2 lg:flex">
        {[ 'Real-Time Activity', 'Prediction', 'Comparison'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              if (tab === 'Real-Time Activity') {
                resetMap();
                navigate('/');
              }
            }}
            className={`rounded-lg border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              tab === 'Real-Time Activity' && isHome
                ? 'border-[#4FD1FF]/45 bg-[#4FD1FF]/12 text-[#4FD1FF] shadow-[0_0_24px_rgba(79,209,255,0.14)]'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-[#4FD1FF]/30 hover:bg-[#4FD1FF]/8 hover:text-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right Section - Stats & Controls */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 xl:flex">
          {metrics.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="flex h-12 min-w-28 items-center gap-3 rounded-xl border border-white/10 bg-[#0D1726]/80 px-3 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
            >
              <Icon className={`h-4 w-4 ${tone}`} />
              <div className="leading-none">
                <p className={`font-mono text-lg font-bold ${tone}`}>{value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#0D1726] px-3">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isRunning ? 'bg-emergency-green' : 'bg-gray-500'
          }`} />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {isRunning ? 'LIVE' : 'STANDBY'}
          </span>
        </div>

        <button
          onClick={toggleAnalytics}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-[#4FD1FF]"
          aria-label="Toggle analytics"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
