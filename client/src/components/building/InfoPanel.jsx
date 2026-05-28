import { X, Users, AlertTriangle, Zap, Radio } from 'lucide-react';
import { useMapStore, useUIStore } from '../../store';
import { formatTimestamp, getZoneLabel } from '../../utils';

export function InfoPanel() {
  const selectedZone = useMapStore((state) => state.selectedZone);
  const setSelectedZone = useMapStore((state) => state.setSelectedZone);

  if (!selectedZone) return null;

  return (
    <div className="absolute right-8 top-24 w-96 bg-dark-card border border-dark-border rounded-lg p-6 shadow-2xl z-40 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-dark-text">{getZoneLabel(selectedZone)}</h2>
          <p className="text-xs text-gray-400 mt-1">Zone Details</p>
        </div>
        <button
          onClick={() => setSelectedZone(null)}
          className="p-1 hover:bg-dark-bg rounded transition-colors text-gray-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Metrics */}
      <div className="space-y-3 mb-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Priority Score</span>
          <span className="text-2xl font-bold text-emergency-cyan">
            {Math.round(selectedZone.priorityScore)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Risk Level</span>
          <span
            className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              selectedZone.riskLevel === 'critical'
                ? 'bg-emergency-red text-white'
                : selectedZone.riskLevel === 'high'
                ? 'bg-emergency-orange text-white'
                : selectedZone.riskLevel === 'medium'
                ? 'bg-emergency-yellow text-black'
                : 'bg-emergency-green text-white'
            }`}
          >
            {selectedZone.riskLevel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Estimated Trapped
          </span>
          <span className="text-lg font-bold text-emergency-yellow">
            {selectedZone.estimatedTrapped}
          </span>
        </div>
      </div>

      {/* Evidence Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-dark-text mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-emergency-orange" />
          Evidence
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <div
              className={`w-2 h-2 rounded-full ${
                selectedZone.signals.phonesDisconnected > 0
                  ? 'bg-emergency-red'
                  : 'bg-emergency-green'
              }`}
            />
            {selectedZone.signals.phonesDisconnected} phones disconnected
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div
              className={`w-2 h-2 rounded-full ${
                selectedZone.signals.wifiOffline
                  ? 'bg-emergency-red'
                  : 'bg-emergency-green'
              }`}
            />
            WiFi router {selectedZone.signals.wifiOffline ? 'OFFLINE' : 'online'}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-4 h-4" />
            Electricity usage: {selectedZone.signals.electricityUsage}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Radio className="w-4 h-4" />
            Wearable alerts: {selectedZone.signals.wearableAlert ? 'YES' : 'No'}
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="mb-6 p-3 bg-dark-bg rounded-lg border border-dark-border text-xs font-mono">
        <p className="text-gray-400">Zone Coordinates</p>
        <p className="text-emergency-cyan font-bold mt-1">
          X: {selectedZone.coordinates.x}, Y: {selectedZone.coordinates.y}
        </p>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-500">
        Updated: {formatTimestamp(selectedZone.timestamp)}
      </div>
    </div>
  );
}

export default InfoPanel;
