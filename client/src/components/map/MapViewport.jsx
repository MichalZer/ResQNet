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

    // Add 3D layers after map loads
    mapRef.current.on('load', () => {
      // Enable 3D buildings
      const buildingLayerId = 'building';
      const layers = mapRef.current.getStyle().layers;
      const labelLayerId = layers.find(layer => layer.type === 'symbol' && layer.layout['text-field'])?.id;

      // Add 3D building extrusion layer
      if (!mapRef.current.getLayer('3d-buildings')) {
        mapRef.current.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            type: 'fill-extrusion',
            paint: {
              'fill-extrusion-color': '#0F1524',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId
        );
      }

      // Add sky layer for atmospheric effect
      if (!mapRef.current.getLayer('sky')) {
        mapRef.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15,
          },
        });
      }
    });

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
      return cities.map((item) => {
        const color = riskColor(item.riskLevel);
        
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onCitySelect?.(item)}
            className="absolute flex items-center gap-3 transform -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: item.markerPosition.left, top: item.markerPosition.top }}
          >
            {/* Outer pulsing glow halo */}
            <span
              className="absolute w-8 h-8 rounded-full animate-pulse"
              style={{ 
                backgroundColor: color,
                opacity: 0.3,
                filter: 'blur(8px)',
                transform: 'translate(-50%, -50%)',
                left: '0',
                top: '0'
              }}
            />
            {/* Glowing ring */}
            <span
              className="absolute w-6 h-6 rounded-full border-2 opacity-60"
              style={{ 
                borderColor: color,
                filter: 'blur(0.5px)',
                transform: 'translate(-50%, -50%)',
                left: '0',
                top: '0'
              }}
            />
            {/* Core bright dot */}
            <span
              className="w-4 h-4 rounded-full group-hover:scale-125 transition-all duration-300 cursor-pointer flex-shrink-0"
              style={{ 
                backgroundColor: color,
                boxShadow: `0 0 15px ${color}dd, 0 0 30px ${color}77, 0 0 45px ${color}44`
              }}
            />
            {/* City label */}
            <span className="text-xs text-slate-100 font-bold uppercase tracking-[0.2em] drop-shadow-lg group-hover:text-white transition-all whitespace-nowrap flex-shrink-0">
              {item.name}
            </span>
          </button>
        );
      });
    }

    if (mode === 'city') {
      return (
        <>
          {incidentZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute rounded-full opacity-40 animate-pulse"
              style={{
                left: `${zone.coordinates.x}px`,
                top: `${zone.coordinates.y}px`,
                width: `${zone.radius}px`,
                height: `${zone.radius}px`,
                backgroundColor: riskColor(zone.riskLevel),
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 30px ${riskColor(zone.riskLevel)}99, inset 0 0 20px ${riskColor(zone.riskLevel)}55`
              }}
            />
          ))}
          {buildings.map((building) => (
            <button
              key={building.id}
              type="button"
              onClick={() => onBuildingSelect?.(building)}
              className="absolute flex items-center gap-2 rounded-full bg-[#0F1524]/90 px-3 py-2 border border-[#151D30] shadow-lg hover:shadow-xl text-xs font-semibold text-slate-100 hover:border-cyan-400 transition-all\"
              style={{ left: building.markerPosition.left, top: building.markerPosition.top, transform: 'translate(-50%, -50%)' }}
            >
              <MapPin className="w-3 h-3 text-cyan-400" />
              {building.name}
            </button>
          ))}
        </>
      );
    }

    if (mode === 'building') {
      return (
        <div className="absolute inset-0 p-6 pointer-events-none">
          <div className="absolute inset-x-10 top-10 rounded-2xl border border-cyan-500/30 bg-[#0F1524]/90 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200">Rescue heatmap overlay - High Accuracy Vector</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F19] overflow-hidden">
      {mapToken ? (
        <div ref={containerRef} className="absolute inset-0" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,164,233,0.12),_transparent_50%),linear-gradient(180deg,#0B0F19_0%,#0F1524_100%)]" />
      )}

      <div className="absolute inset-0 pointer-events-none">
        {renderMarkers()}
      </div>

      {/* Top-Left Info Card */}
      <div className="absolute left-6 top-6 rounded-2xl border border-[#151D30] bg-[#0F1524]/90 p-4 shadow-2xl w-72 backdrop-blur-md">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">
          {mode === 'world' || mode === 'overview' ? 'Israel Overview' : mode === 'city' ? selectedCity?.name || 'City Detail' : 'Rescue Operation'}
        </div>
        <div className="text-sm text-white font-semibold">
          {mode === 'world' || mode === 'overview' ? 'Emergency command center' : mode === 'city' ? selectedCity?.summary : 'Building rescue vector'}
        </div>
      </div>

      {/* Bottom-Right Metrics */}
      <div className="absolute bottom-6 right-6 rounded-2xl border border-[#151D30] bg-[#0F1524]/90 px-4 py-3 text-xs text-slate-400 backdrop-blur-md">
        <div className="text-slate-300">3D Map: {mapToken ? 'Mapbox GL' : 'Tactical'}</div>
        <div>Zoom: {zoom.toFixed(1)} | {mode.toUpperCase()}</div>
      </div>
    </div>
  );
}

export default MapViewport;
