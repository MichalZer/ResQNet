import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Sparkles } from 'lucide-react';
import { useMapStore } from '../../store';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
if (mapToken) {
  mapboxgl.accessToken = mapToken;
}

const riskColor = (riskLevel) => {
  switch (riskLevel) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#FBBF24';
    default: return '#10B981';
  }
};

export function MapViewport({
  mode: propMode,
  cities = [],
  buildings = [],
  incidentZones = [],
  onCitySelect,
  onBuildingSelect,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  // Bind to MapStore for reactive viewport updates
  const { 
    currentView, 
    zoom, 
    pitch, 
    bearing, 
    mapCenter, 
    selectedCity 
  } = useMapStore();

  const mode = propMode || currentView;

  // Initial Map Load
  useEffect(() => {
    if (!mapToken || !containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: mapCenter,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // Run only on mount

  // React to store changes for smooth flyTo transitions
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: mapCenter,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      essential: true,
      duration: 2000
    });
  }, [mapCenter, zoom, pitch, bearing]);

  const renderMarkers = () => {
    if (mode === 'world' || mode === 'overview') {
      return cities.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onCitySelect?.(item)}
          className="absolute flex items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: item.markerPosition.left, top: item.markerPosition.top }}
        >
          <span
            className="w-4 h-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:scale-125 transition-transform"
            style={{ backgroundColor: riskColor(item.riskLevel) }}
          />
          <span className="text-xs text-gray-300 font-semibold uppercase tracking-[0.18em] drop-shadow-sm group-hover:text-white transition-colors">
            {item.name}
          </span>
        </button>
      ));
    }

    if (mode === 'city') {
      return (
        <>
          {incidentZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute rounded-full opacity-30 animate-pulse"
              style={{
                left: `${zone.coordinates.x}px`,
                top: `${zone.coordinates.y}px`,
                width: `${zone.radius}px`,
                height: `${zone.radius}px`,
                backgroundColor: riskColor(zone.riskLevel),
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
          {buildings.map((building) => (
            <button
              key={building.id}
              type="button"
              onClick={() => onBuildingSelect?.(building)}
              className="absolute flex items-center gap-2 rounded-full bg-dark-card/90 px-3 py-2 border border-dark-border shadow-lg text-xs font-semibold text-gray-100 hover:border-emergency-cyan transition-all"
              style={{ left: building.markerPosition.left, top: building.markerPosition.top, transform: 'translate(-50%, -50%)' }}
            >
              <MapPin className="w-3 h-3 text-emergency-cyan" />
              {building.name}
            </button>
          ))}
        </>
      );
    }

    if (mode === 'building') {
      return (
        <div className="absolute inset-0 p-6 pointer-events-none">
          <div className="absolute inset-x-10 top-10 rounded-3xl border border-emergency-cyan/20 bg-[#06101f]/90 p-5 shadow-2xl">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Sparkles className="w-4 h-4 text-emergency-cyan" />
              <span>Rescue heatmap overlay - High Accuracy Vector</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full bg-dark-bg overflow-hidden rounded-3xl border border-dark-border shadow-xl">
      {mapToken ? (
        <div ref={containerRef} className="absolute inset-0" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,164,233,0.18),_transparent_38%),linear-gradient(180deg,#060b14_0%,#0f172a_100%)]" />
      )}

      <div className="absolute inset-0 pointer-events-none">
        {renderMarkers()}
      </div>

      <div className="absolute left-6 top-6 rounded-3xl border border-dark-border bg-dark-card/95 p-4 shadow-2xl w-80 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.24em] text-gray-400 mb-2">
          {mode === 'world' || mode === 'overview' ? 'National Overview' : mode === 'city' ? selectedCity?.name || 'City Detail' : 'Rescue Operation'}
        </div>
        <div className="text-sm text-gray-200 font-semibold">
          {mode === 'world' || mode === 'overview' ? 'National emergency command' : mode === 'city' ? selectedCity?.summary : 'Building rescue vector'}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 rounded-3xl border border-dark-border bg-dark-card/95 px-4 py-3 text-xs text-gray-400 backdrop-blur-xl">
        <div>Map Engine: {mapToken ? 'Mapbox 3D' : 'Tactical Fallback'}</div>
        <div>Zoom: {zoom.toFixed(1)} | {mode.toUpperCase()}</div>
      </div>
    </div>
  );
}

export default MapViewport;
