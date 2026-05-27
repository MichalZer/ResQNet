import { AlertTriangle, Users, Clock, MapPin } from 'lucide-react';
import { useZonesStore } from '../../store';
import { getSeverityTextColor, getZoneLabel, formatTimestamp } from '../../utils';

export function Sidebar() {
  const zones = useZonesStore((state) => state.zones);

  return (
    <div className="h-full w-80 bg-dark-card border-r border-dark-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-bold text-dark-text mb-1">Event Feed</h2>
        <p className="text-xs text-gray-400">Real-time rescue activity log</p>
      </div>

      {/* Zones List */}
      <div className="flex-1 overflow-y-auto">
        {zones.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p className="text-sm">Awaiting simulation data...</p>
          </div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className="p-4 border-b border-dark-border hover:bg-dark-bg transition-colors cursor-pointer group"
            >
              {/* Zone Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-dark-text group-hover:text-emergency-cyan transition-colors">
                    {getZoneLabel(zone)}
                  </h3>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-bold ${getSeverityTextColor(
                    zone.riskLevel
                  )}`}
                >
                  {zone.riskLevel.toUpperCase()}
                </div>
              </div>

              {/* Zone Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                {/* Priority Score */}
                <div className="bg-dark-card bg-opacity-50 p-2 rounded border border-dark-border">
                  <p className="text-gray-400 mb-1">Priority</p>
                  <p className="text-emergency-cyan font-mono font-bold">
                    {Math.round(zone.priorityScore)}%
                  </p>
                </div>

                {/* Estimated Trapped */}
                <div className="bg-dark-card bg-opacity-50 p-2 rounded border border-dark-border">
                  <p className="text-gray-400 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Trapped
                  </p>
                  <p className="text-emergency-yellow font-mono font-bold">
                    {zone.estimatedTrapped}
                  </p>
                </div>
              </div>

              {/* Signals */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      zone.signals.phonesDisconnected > 0
                        ? 'bg-emergency-red'
                        : 'bg-emergency-green'
                    }`}
                  />
                  Phones: {zone.signals.phonesDisconnected} disconnected
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      zone.signals.wifiOffline
                        ? 'bg-emergency-red'
                        : 'bg-emergency-green'
                    }`}
                  />
                  WiFi: {zone.signals.wifiOffline ? 'OFFLINE' : 'Online'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      zone.signals.wearableAlert
                        ? 'bg-emergency-red'
                        : 'bg-emergency-green'
                    }`}
                  />
                  Wearables: {zone.signals.wearableAlert ? 'Alert' : 'Normal'}
                </div>
              </div>

              {/* Coordinates */}
              <div className="mt-3 pt-3 border-t border-dark-border text-xs text-gray-500 font-mono">
                <MapPin className="w-3 h-3 inline mr-1" />
                X:{zone.coordinates.x}, Y:{zone.coordinates.y}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-dark-border bg-dark-bg text-xs">
        <div className="text-gray-400">
          <p>Total Zones: <span className="text-emergency-cyan font-bold">{zones.length}</span></p>
          <p>Critical Count: <span className="text-emergency-red font-bold">
            {zones.filter(z => z.riskLevel === 'critical').length}
          </span></p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
