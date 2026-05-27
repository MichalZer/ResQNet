import { Menu, Search, Radio, Settings } from 'lucide-react';
import { useUIStore, useSimulationStore, useZonesStore, useAlertsStore } from '../../store';

export function TopNavigation() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleAnalytics = useUIStore((state) => state.toggleAnalytics);
  const zones = useZonesStore((state) => state.zones);
  const criticalAlerts = useAlertsStore((state) => state.criticalAlerts);
  const isRunning = useSimulationStore((state) => state.isRunning);

  const totalIncidents = zones.length;
  const activeRescueZones = zones.filter((z) => z.riskLevel === 'critical').length;
  const avgSignalLoss =
    zones.length > 0
      ? Math.round(
          (zones.reduce((sum, z) => sum + z.signals.phonesDisconnected, 0) / zones.length)
        )
      : 0;
  const maxPriority = zones.length > 0 ? Math.max(...zones.map((z) => z.priorityScore)) : 0;

  return (
    <nav className="h-16 bg-dark-card bg-opacity-80 backdrop-blur-md border-b border-dark-border flex items-center px-6 gap-6">
      {/* Left Section - Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-dark-bg rounded-lg transition-colors text-gray-400 hover:text-dark-text"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-emergency-cyan animate-pulse" />
          <h1 className="text-lg font-bold text-dark-text">ResQNet</h1>
        </div>
      </div>

      {/* Center - Tabs */}
      <div className="flex-1 flex gap-6 ml-8">
        {['Overview', 'Real-Time Activity', 'Prediction', 'History', 'Comparison'].map((tab) => (
          <button
            key={tab}
            className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
              tab === 'Overview'
                ? 'text-emergency-cyan border-emergency-cyan'
                : 'text-gray-400 border-transparent hover:text-dark-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right Section - Stats & Controls */}
      <div className="flex items-center gap-6">
        {/* Stats */}
        <div className="flex gap-6 text-xs">
          <div className="text-center">
            <p className="text-gray-400 mb-1">Total Incidents</p>
            <p className="text-emergency-cyan font-mono font-bold text-lg">{totalIncidents}</p>
          </div>
          <div className="text-center border-l border-dark-border pl-6">
            <p className="text-gray-400 mb-1">Active Rescue Zones</p>
            <p className="text-emergency-orange font-mono font-bold text-lg">{activeRescueZones}</p>
          </div>
          <div className="text-center border-l border-dark-border pl-6">
            <p className="text-gray-400 mb-1">Avg Signal Loss</p>
            <p className="text-emergency-yellow font-mono font-bold text-lg">{avgSignalLoss}</p>
          </div>
          <div className="text-center border-l border-dark-border pl-6">
            <p className="text-gray-400 mb-1">Max Priority</p>
            <p className={`font-mono font-bold text-lg ${
              maxPriority > 80 ? 'text-emergency-red' : 'text-emergency-cyan'
            }`}>
              {Math.round(maxPriority)}
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-bg border border-dark-border">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isRunning ? 'bg-emergency-green' : 'bg-gray-500'
          }`} />
          <span className="text-xs font-semibold text-gray-400">
            {isRunning ? 'LIVE' : 'STANDBY'}
          </span>
        </div>

        {/* Controls */}
        <button
          onClick={toggleAnalytics}
          className="p-2 hover:bg-dark-bg rounded-lg transition-colors text-gray-400 hover:text-dark-text"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

export default TopNavigation;
