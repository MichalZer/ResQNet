// Mock API Service - Simulates backend responses
import { cityData, cityBuildings, cityIncidentZones, buildingDetails } from '../data/mockData';

export const mockAPI = {
  /**
   * Fetch initial building data
   */
  async fetchBuilding(buildingId = 'B1') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          buildingId,
          timestamp: new Date().toISOString(),
          zones: [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: 45,
              riskLevel: 'medium',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 120, y: 80 },
            },
            {
              id: 'F3-ZB',
              floor: 3,
              name: 'Zone B',
              priorityScore: 30,
              riskLevel: 'low',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 200, y: 150 },
            },
            {
              id: 'F2-ZC',
              floor: 2,
              name: 'Zone C',
              priorityScore: 20,
              riskLevel: 'low',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 80, y: 200 },
            },
          ],
          alerts: [],
        });
      }, 500);
    });
  },

  /**
   * Fetch overview list of cities
   */
  async fetchCities() {
  const response = await fetch("http://127.0.0.1:8000/simulation/rescue-scores");

  if (!response.ok) {
    throw new Error("Failed to fetch rescue scores");
  }

  const data = await response.json();

 return data.map((zone, index) => ({
  id: zone.areaId,
  name: zone.areaId,
  region: "Live Fusion Zone",
  riskLevel: zone.riskLevel,
  priorityScore: zone.priorityScore,
  incidentCount: zone.estimatedTrapped ?? 0,
  estimatedTrapped: zone.estimatedTrapped ?? 0,
  evidence: zone.evidence ?? [],
  coordinates:
    index === 0
      ? [31.7683, 35.2137]
      : [32.0853, 34.7818],
  markerPosition: {
    left: `${45 + index * 8}%`,
    top: `${35 + index * 8}%`,
  },
}));
},

  /**
   * Fetch details for a specific city including buildings and incident zones
   */
 async fetchCityDetails(cityId) {
  const cities = await this.fetchCities();

  const city = cities.find((item) => item.id === cityId) || cities[0];

  return {
    ...city,
    buildings: [],
    incidentZones: [],
  };
},

  /**
   * Fetch building details
   */
  async fetchBuilding(buildingId = 'B1') {
    const building = buildingDetails[buildingId];
    if (building) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          ...building,
          timestamp: new Date().toISOString(),
        }), 400);
      });
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          buildingId,
          timestamp: new Date().toISOString(),
          zones: [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: 45,
              riskLevel: 'medium',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 120, y: 80 },
            },
            {
              id: 'F3-ZB',
              floor: 3,
              name: 'Zone B',
              priorityScore: 30,
              riskLevel: 'low',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 200, y: 150 },
            },
            {
              id: 'F2-ZC',
              floor: 2,
              name: 'Zone C',
              priorityScore: 20,
              riskLevel: 'low',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 80, y: 200 },
            },
          ],
          alerts: [],
        });
      }, 500);
    });
  },

  /**
   * Get simulation phase data based on time
   */
  async getSimulationPhase() {

  const response = await fetch(
    "http://127.0.0.1:8000/simulation/rescue-scores"
  );

  const zones = await response.json();

  const formattedZones = zones.map(zone => ({
    ...zone,
    id: zone.areaId
  }));

  return {
    zones: formattedZones,
    alerts: [],
    timestamp: new Date().toISOString(),
  };
},
  /**
   * Get analytics timeline data
   */
  async getAnalyticsTimeline(hours = 24) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timeline = [];
        for (let i = 0; i < hours; i++) {
          timeline.push({
            time: `${String(i).padStart(2, '0')}:00`,
            incidents: Math.floor(Math.random() * 10),
            priority: Math.floor(Math.random() * 100),
            signals: Math.floor(Math.random() * 50),
          });
        }
        resolve(timeline);
      }, 300);
    });
  },

  /**
   * Subscribe to real-time updates (simulated)
   */
  subscribeToUpdates(callback) {
    const interval = setInterval(() => {
      callback({
        type: 'update',
        data: {
          timestamp: new Date().toISOString(),
          zone: 'F4-ZA',
          priority: Math.random() * 100,
        },
      });
    }, 1000);

    return () => clearInterval(interval);
  },
};

export default mockAPI;
