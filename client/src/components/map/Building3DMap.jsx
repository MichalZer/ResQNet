import React, { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';

const Building3DMap = ({ buildingData }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    maptilersdk.config.apiKey = 'Q7kq818tlmaa1ZQSl3IE';

    const lng = buildingData?.lng ?? 35.2137;
    const lat = buildingData?.lat ?? 31.7683;
    const floorsCount = Number(buildingData?.floors ?? 15);
    const criticalFloors = new Set(buildingData?.criticalFloors ?? []);

    mapRef.current = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [lng, lat],
      zoom: 18,
      pitch: 65,
      bearing: -20,
      antialias: true,
    });

  mapRef.current.on('load', () => {
  // remove any previous floor layers if they exist
  for (let i = 1; i <= floorsCount; i++) {
    const existingId = `building-floor-${i}`;
    if (mapRef.current.getLayer(existingId)) {
      mapRef.current.removeLayer(existingId);
    }
  }

  for (let floorIndex = 0; floorIndex < floorsCount; floorIndex += 1) {
    const floorNumber = floorIndex + 1;
    const base = floorIndex * (3.5 + 0.5); // 3.5m floor + 0.5m gap
    const height = base + 3.5;
    const isCritical = criticalFloors.has(floorNumber);
    const layerId = `building-floor-${floorNumber}`;

    mapRef.current.addLayer({
      id: layerId,
      type: 'fill-extrusion',
      source: 'v3',                 // use the v3 vector tiles source for MapTiler DARK
      'source-layer': 'building',   // keep building source-layer
      filter: ['==', '$type', 'Polygon'], // apply to building footprints only
      paint: {
        'fill-extrusion-color': isCritical ? '#EF4444' : '#1E293B',
        'fill-extrusion-height': height,
        'fill-extrusion-base': base,
        'fill-extrusion-opacity': 0.85,
      },
    });
  }
});

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [buildingData]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#151D30] bg-[#07111F]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default Building3DMap;