import { MapPin, AlertTriangle, Users, Signal } from 'lucide-react';
import { getSeverityColor, getZoneLabel } from '../../utils';

export function MapViewport() {
  return (
    <div className="relative w-full h-full bg-dark-bg overflow-hidden">
      {/* Placeholder for Mapbox GL JS integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-emergency-cyan mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-dark-text mb-2">Interactive Map Viewport</h2>
          <p className="text-gray-400">Mapbox GL JS integration will render here</p>
          <p className="text-gray-500 text-sm mt-4">
            Map layers: Buildings • Heatmaps • Event Markers • Danger Zones
          </p>
        </div>
      </div>

      {/* Map control indicators */}
      <div className="absolute bottom-8 right-8 space-y-2 text-xs text-gray-400 font-mono">
        <div className="bg-dark-card bg-opacity-80 px-3 py-1 rounded border border-dark-border">
          Zoom: 13
        </div>
        <div className="bg-dark-card bg-opacity-80 px-3 py-1 rounded border border-dark-border">
          Pitch: 45°
        </div>
        <div className="bg-dark-card bg-opacity-80 px-3 py-1 rounded border border-dark-border">
          Bearing: 0°
        </div>
      </div>
    </div>
  );
}

export default MapViewport;
