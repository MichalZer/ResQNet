import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { Sparkles } from 'lucide-react';
import { useMapStore } from '../../store';
import MapEffects from './MapEffects';
import 'leaflet/dist/leaflet.css';

const riskColor = (riskLevel) => {
  switch (riskLevel) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#FBBF24';
    default: return '#10B981';
  }
};

const toLeafletCenter = ([lng, lat]) => [lat, lng];

const clampZoom = (zoom) => Math.min(Math.max(zoom, 7.8), 18);

const getMarkerPercent = (position = {}) => ({
  left: Number.parseFloat(position.left) || 50,
  top: Number.parseFloat(position.top) || 50,
});

const coordinateFromPercent = (center, position, scale = 0.018) => {
  const { left, top } = getMarkerPercent(position);
  const [lat, lng] = center;

  return [
    lat - ((top - 50) * scale),
    lng + ((left - 50) * scale),
  ];
};

const coordinateFromPixels = (center, position, scale = 0.00055) => {
  const x = Number(position?.x) || 150;
  const y = Number(position?.y) || 150;
  const [lat, lng] = center;

  return [
    lat - ((y - 150) * scale),
    lng + ((x - 150) * scale),
  ];
};

const createBuildingIcon = (building) => L.divIcon({
  className: '',
  html: `
    <div class="flex items-center gap-2 rounded-full bg-[#0F1524]/90 px-3 py-2 border border-[#151D30] shadow-lg text-xs font-semibold text-slate-100 whitespace-nowrap">
      <span class="block h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"></span>
      <span>${building.name}</span>
    </div>
  `,
  iconSize: [120, 34],
  iconAnchor: [60, 17],
});

function MapViewController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, clampZoom(zoom), {
      animate: true,
      duration: 1.4,
    });
  }, [center, map, zoom]);

  return null;
}

/**
 * MapViewport Component
 * Renders an OpenStreetMap-backed Leaflet map of Israel with:
 * - Interactive city/incident/building markers
 * - Smooth fly-to transitions through react-leaflet
 */
export function MapViewport({
  mode: propMode,
  cities = [],
  buildings = [],
  incidentZones = [],
  onCitySelect,
  onBuildingSelect,
}) {
  const {
    currentView,
    zoom,
    pitch,
    bearing,
    mapCenter,
    selectedCity,
  } = useMapStore();

  const mode = propMode || currentView;
  const leafletCenter = useMemo(() => toLeafletCenter(mapCenter), [mapCenter]);
  const cityCenter = selectedCity?.coordinates || leafletCenter;

  const cityMarkers = useMemo(
    () => (mode === 'world' || mode === 'overview') ? cities.map((city) => ({
      ...city,
      color: riskColor(city.riskLevel),
    })) : [],
    [cities, mode]
  );

  const renderMapLayers = () => {
    if (mode === 'world' || mode === 'overview') {
      return cityMarkers.map((item) => (
        <CircleMarker
          key={item.id}
          center={item.coordinates}
          radius={8}
          pathOptions={{
            color: item.color,
            fillColor: item.color,
            fillOpacity: 0.9,
            opacity: 0.85,
            weight: 2,
          }}
          eventHandlers={{ click: () => onCitySelect?.(item) }}
        >
          <Tooltip direction="right" offset={[12, 0]} permanent>
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {item.name}
            </span>
          </Tooltip>
        </CircleMarker>
      ));
    }

    if (mode === 'city') {
      return (
        <>
          {incidentZones.map((zone) => (
            <Circle
              key={zone.id}
              center={coordinateFromPixels(cityCenter, zone.coordinates)}
              radius={zone.radius * 8}
              pathOptions={{
                color: riskColor(zone.riskLevel),
                fillColor: riskColor(zone.riskLevel),
                fillOpacity: 0.22,
                opacity: 0.65,
                weight: 2,
              }}
            >
              <Tooltip direction="top">{zone.name}</Tooltip>
            </Circle>
          ))}
          {buildings.map((building) => (
            <Marker
              key={building.id}
              position={coordinateFromPercent(cityCenter, building.markerPosition, 0.0024)}
              icon={createBuildingIcon(building)}
              eventHandlers={{ click: () => onBuildingSelect?.(building) }}
            />
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F19] overflow-hidden">
      <MapContainer
        center={leafletCenter}
        zoom={clampZoom(zoom)}
        minZoom={3}
        maxZoom={18}
        zoomControl={false}
        className="absolute inset-0 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewController center={leafletCenter} zoom={zoom} />
        {renderMapLayers()}
      </MapContainer>

      <MapEffects isActive mode={mode} />

      {mode === 'building' && (
        <div className="absolute inset-0 z-10 p-6 pointer-events-none">
          <div className="absolute inset-x-10 top-10 rounded-2xl border border-cyan-500/30 bg-[#0F1524]/90 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200">Building Tactical Heatmap - High Precision Vector</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute left-6 top-6 z-20 rounded-2xl border border-[#151D30] bg-[#0F1524]/95 p-4 shadow-2xl w-72 backdrop-blur-md pointer-events-auto">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">
          {mode === 'world' || mode === 'overview' ? 'Israel Emergency Command' : mode === 'city' ? selectedCity?.name || 'City Detail' : 'Building Rescue Operation'}
        </div>
        <div className="text-sm text-white font-semibold">
          {mode === 'world' || mode === 'overview' ? 'National tactical overview' : mode === 'city' ? selectedCity?.summary : 'Tactical rescue vector'}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 rounded-2xl border border-[#151D30] bg-[#0F1524]/95 px-4 py-3 text-xs text-slate-400 backdrop-blur-md pointer-events-auto">
        <div className="text-slate-300 font-mono">
          OpenStreetMap + Leaflet
        </div>
        <div className="font-mono mt-1">
          Z: {zoom.toFixed(1)} | P: {pitch.toFixed(0)} deg | B: {bearing.toFixed(0)} deg
        </div>
      </div>
    </div>
  );
}

export default MapViewport;
