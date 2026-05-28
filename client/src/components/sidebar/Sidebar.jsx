import { MapPin, Users } from 'lucide-react';
import { useZonesStore } from '../../store';
import { getSeverityTextColor, getZoneLabel } from '../../utils';

export function Sidebar() {
  const zones = useZonesStore((state) => state.zones);

  return (
    <div className="flex h-full w-full max-w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1726]/85 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#4FD1FF]">Operations Feed</p>
        <p className="mt-1 text-lg font-semibold text-white">Priority Zones</p>
      </div>

      {/* Zones List */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {zones.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p className="text-sm">Awaiting simulation data...</p>
          </div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-[#4FD1FF]/45 hover:bg-white/[0.055]"
            >
              {/* Zone Header */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold leading-tight text-slate-100 transition-colors group-hover:text-[#4FD1FF]">
                    {getZoneLabel(zone)}
                  </h3>
                </div>
                <div
                  className={`rounded-md bg-[#07111F]/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${getSeverityTextColor(
                    zone.riskLevel
                  )}`}
                >
                  {zone.riskLevel}
                </div>
              </div>

              {/* Zone Info Grid */}
              <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
                {/* Priority Score */}
                <div className="rounded-lg bg-[#07111F]/55 p-3">
                  <p className="mb-1 uppercase tracking-[0.16em] text-slate-500">Priority</p>
                  <p className="font-mono text-base font-bold text-[#4FD1FF]">
                    {Math.round(zone.priorityScore)}%
                  </p>
                </div>

                {/* Estimated Trapped */}
                <div className="rounded-lg bg-[#07111F]/55 p-3">
                  <p className="mb-1 flex items-center gap-1 uppercase tracking-[0.16em] text-slate-500">
                    <Users className="w-3 h-3" />
                    Trapped
                  </p>
                  <p className="font-mono text-base font-bold text-amber-300">
                    {zone.estimatedTrapped}
                  </p>
                </div>
              </div>

              {/* Signals */}
              <div className="space-y-1.5 text-xs">
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
              <div className="mt-3 border-t border-white/10 pt-3 font-mono text-xs text-slate-500">
                <MapPin className="w-3 h-3 inline mr-1" />
                X:{zone.coordinates.x}, Y:{zone.coordinates.y}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-white/10 bg-[#07111F]/45 p-4 text-xs">
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
