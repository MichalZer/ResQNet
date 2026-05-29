import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const Building3DMap = ({ buildingData = {} }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ==========================================
  // אפקט 1: אתחול המפה פעם אחת בלבד
  // ==========================================
  useEffect(() => {
    if (mapRef.current) return;

    maptilersdk.config.apiKey = 'Q7kq818tlmaa1ZQSl3IE';

    const lng = buildingData?.lng ?? 35.2137;
    const lat = buildingData?.lat ?? 31.7683;

    mapRef.current = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.STREETS.DARK,
      center: [lng, lat],
      zoom: 18.5,
      pitch: 65,
      bearing: -20,
      antialias: true,
      // הגדרה קריטית שמונעת את קריסת ה-migrateProjection!
      projection: { type: 'mercator' } 
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ==========================================
  // אפקט 2: ציור הקומות בבטחה
  // ==========================================
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    // 1. החבאה (לא מחיקה!) של הבניינים המקוריים כדי למנוע קריסה
    try {
      const layers = map.getStyle()?.layers || [];
      layers.forEach((layer) => {
        if (layer.type === 'fill-extrusion' && !layer.id.includes('resqnet')) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    } catch (e) {}

    // 2. הוספת מקור נתונים *פרטי* לבניינים שלנו (עוקף את הבאגים שלהם)
    if (!map.getSource('custom-buildings-source')) {
      map.addSource('custom-buildings-source', {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=Q7kq818tlmaa1ZQSl3IE`
      });
    }

    const floorsCount = Number(buildingData?.floorsCount) || (Array.isArray(buildingData?.floors) ? buildingData.floors.length : 15);
    const criticalFloorsSet = new Set(buildingData?.criticalFloors ?? []);
    const floorHeight = 3.5;
    const floorGap = 0.5;

    map.resqnetCriticalFloors = criticalFloorsSet;

    // 3. בניית אבני הלגו
    for (let i = 0; i < Math.max(floorsCount, 30); i += 1) {
      const floorNumber = i + 1;
      const layerId = `resqnet-building-floor-${floorNumber}`;

      // הסתרת קומות עודפות אם הבניין התחלף לבניין נמוך יותר
      if (floorNumber > floorsCount) {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        continue;
      }

      const base = i * (floorHeight + floorGap);
      const height = base + floorHeight;
      const isCritical = criticalFloorsSet.has(floorNumber);
      const targetColor = isCritical ? '#EF4444' : '#1E293B';

      // אם הקומה קיימת - רק משנים לה צבע בטוח
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
        map.setPaintProperty(layerId, 'fill-extrusion-color', targetColor);
      } else {
        // אם היא לא קיימת, מציירים אותה דרך המקור הפרטי שלנו!
        map.addLayer({
          id: layerId,
          type: 'fill-extrusion',
          source: 'custom-buildings-source', 
          'source-layer': 'building',
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'fill-extrusion-color': targetColor,
            'fill-extrusion-height': height,
            'fill-extrusion-base': base,
            'fill-extrusion-opacity': 0.85,
          },
        });

        // הוספת אינטראקטיביות (Hover + Click)
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
          map.setPaintProperty(layerId, 'fill-extrusion-color', '#38BDF8');
        });
        
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
          const isCrit = map.resqnetCriticalFloors.has(floorNumber);
          map.setPaintProperty(layerId, 'fill-extrusion-color', isCrit ? '#EF4444' : '#1E293B');
        });
        
       
      }
    }
  }, [buildingData, mapLoaded]);

  return (
    <div style={{ minHeight: '500px', position: 'relative' }} className="w-full h-full rounded-2xl overflow-hidden border border-[#151D30] bg-[#0B0F19]">
      <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
    </div>
  );
};

export default Building3DMap;