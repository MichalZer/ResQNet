import React, { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';

const Building3DMap = ({ buildingData }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // הגדרת מפתח ה-API של המערכת
    maptilersdk.config.apiKey = 'Q7kq818tlmaa1ZQSl3IE';

    const lng = buildingData?.lng ?? 35.2137;
    const lat = buildingData?.lat ?? 31.7683;
    const floorsCount = Number(buildingData?.floors ?? 15);
    const criticalFloors = new Set(buildingData?.criticalFloors ?? []);

    // יצירת מפת הבסיס הטקטית בעיצוב כהה יציב
    mapRef.current = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.DARK, // תיקון: שינוי לסטייל הכהה הרשמי למניעת שגיאות טעינה
      center: [lng, lat],
      zoom: 18,
      pitch: 65,
      bearing: -20,
      antialias: true,
    });

    mapRef.current.on('load', () => {
      // הסרת שכבות קודמות במידה וקיימות למניעת כפילויות ברינדור
      for (let i = 1; i <= floorsCount; i++) {
        const existingId = `building-floor-${i}`;
        if (mapRef.current.getLayer(existingId)) {
          mapRef.current.removeLayer(existingId);
        }
      }

      // בניית מגדל קומות הלייזר בלולאה על גבי פוליגוני המבנים במפה
      for (let floorIndex = 0; floorIndex < floorsCount; floorIndex += 1) {
        const floorNumber = floorIndex + 1;
        const base = floorIndex * (3.5 + 0.5); // 3.5 מטר גובה קומה + 0.5 מטר מרווח אנכי
        const height = base + 3.5;
        const isCritical = criticalFloors.has(floorNumber);
        const layerId = `building-floor-${floorNumber}`;

        mapRef.current.addLayer({
          id: layerId,
          type: 'fill-extrusion',
          source: 'openmaptiles', // תיקון: שינוי קריטי למקור הנתונים הדיפולטיבי של המבנים במפה
          'source-layer': 'building',
          filter: ['==', '$type', 'Polygon'], // החלה על פוליגונים של מבנים בלבד
          paint: {
            // צבע אדום זוהר לקומות פגועות, וכחול-סייבר כהה לקומות רגילות
            'fill-extrusion-color': isCritical ? '#EF4444' : '#1E293B',
            'fill-extrusion-height': height,
            'fill-extrusion-base': base,
            'fill-extrusion-opacity': 0.85,
          },
        });
      }
    });

    // פונקציית ניקוי (Cleanup) בעת פירוק הקומפוננטה למניעת זליגות זיכרון
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