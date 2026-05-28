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
    return new Promise((resolve) => {
      setTimeout(() => resolve(cityData), 300);
    });
  },

  /**
   * Fetch details for a specific city including buildings and incident zones
   */
  async fetchCityDetails(cityId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const city = cityData.find((item) => item.id === cityId);
        resolve({
          ...city,
          buildings: cityBuildings[cityId] || [],
          incidentZones: cityIncidentZones[cityId] || [],
        });
      }, 300);
    });
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
  async getSimulationPhase(simulationTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let zones = [];
        let alerts = [];

        // Phase 0: 00:00-10:00 - Normal state
        if (simulationTime < 10) {
          zones = [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: Math.max(45, 45 + Math.random() * 5),
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
          ];
        }
        // Phase 1: 10:00-20:00 - Minor seismic activity
        else if (simulationTime < 20) {
          zones = [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: 55 + Math.random() * 10,
              riskLevel: 'high',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 1,
                wifiOffline: false,
                electricityUsage: 'elevated',
                wearableAlert: true,
              },
              coordinates: { x: 120, y: 80 },
            },
            {
              id: 'F3-ZB',
              floor: 3,
              name: 'Zone B',
              priorityScore: 45 + Math.random() * 5,
              riskLevel: 'medium',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 0,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 200, y: 150 },
            },
          ];
          alerts = [
            {
              id: 'ALERT-1',
              severity: 'warning',
              message: 'Minor seismic activity detected',
              timestamp: new Date().toISOString(),
            },
          ];
        }
        // Phase 2: 20:00-30:00 - Structural damage
        else if (simulationTime < 30) {
          zones = [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: 75 + Math.random() * 10,
              riskLevel: 'critical',
              estimatedTrapped: 2,
              signals: {
                phonesDisconnected: 3,
                wifiOffline: true,
                electricityUsage: 'high',
                wearableAlert: true,
              },
              coordinates: { x: 120, y: 80 },
            },
            {
              id: 'F3-ZB',
              floor: 3,
              name: 'Zone B',
              priorityScore: 60 + Math.random() * 10,
              riskLevel: 'high',
              estimatedTrapped: 1,
              signals: {
                phonesDisconnected: 2,
                wifiOffline: false,
                electricityUsage: 'high',
                wearableAlert: true,
              },
              coordinates: { x: 200, y: 150 },
            },
            {
              id: 'F2-ZC',
              floor: 2,
              name: 'Zone C',
              priorityScore: 40 + Math.random() * 5,
              riskLevel: 'medium',
              estimatedTrapped: 0,
              signals: {
                phonesDisconnected: 1,
                wifiOffline: false,
                electricityUsage: 'normal',
                wearableAlert: false,
              },
              coordinates: { x: 80, y: 200 },
            },
          ];
          alerts = [
            {
              id: 'ALERT-2',
              severity: 'high',
              message: 'Structural damage detected in Floor 4 - Zone A',
              timestamp: new Date().toISOString(),
            },
            {
              id: 'ALERT-3',
              severity: 'warning',
              message: 'Signal loss in multiple zones',
              timestamp: new Date().toISOString(),
            },
          ];
        }
        // Phase 3: 30:00-40:00 - Multiple signals lost
        else if (simulationTime < 40) {
          zones = [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: 92 + Math.random() * 5,
              riskLevel: 'critical',
              estimatedTrapped: 4,
              signals: {
                phonesDisconnected: 4,
                wifiOffline: true,
                electricityUsage: 'high',
                wearableAlert: true,
              },
              coordinates: { x: 120, y: 80 },
            },
            {
              id: 'F3-ZB',
              floor: 3,
              name: 'Zone B',
              priorityScore: 75 + Math.random() * 10,
              riskLevel: 'critical',
              estimatedTrapped: 3,
              signals: {
                phonesDisconnected: 3,
                wifiOffline: true,
                electricityUsage: 'high',
                wearableAlert: true,
              },
              coordinates: { x: 200, y: 150 },
            },
            {
              id: 'F2-ZC',
              floor: 2,
              name: 'Zone C',
              priorityScore: 55 + Math.random() * 10,
              riskLevel: 'high',
              estimatedTrapped: 1,
              signals: {
                phonesDisconnected: 2,
                wifiOffline: false,
                electricityUsage: 'high',
                wearableAlert: true,
              },
              coordinates: { x: 80, y: 200 },
            },
          ];
          alerts = [
            {
              id: 'ALERT-4',
              severity: 'critical',
              message: 'CRITICAL: Multiple signals lost in Floor 4 - Zone A',
              timestamp: new Date().toISOString(),
            },
            {
              id: 'ALERT-5',
              severity: 'high',
              message: 'Estimated 4 civilians trapped in Zone A',
              timestamp: new Date().toISOString(),
            },
          ];
        }
        // Phase 4: 40:00-70:00 - Escalating crisis
        else {
          zones = [
            {
              id: 'F4-ZA',
              floor: 4,
              name: 'Zone A',
              priorityScore: 95 + Math.random() * 3,
              riskLevel: 'critical',
              estimatedTrapped: 4,
              signals: {
                phonesDisconnected: 4,
                wifiOffline: true,
                electricityUsage: 'critical',
                wearableAlert: true,
              },
              coordinates: { x: 120, y: 80 },
            },
            {
              id: 'F3-ZB',
              floor: 3,
              name: 'Zone B',
              priorityScore: 85 + Math.random() * 8,
              riskLevel: 'critical',
              estimatedTrapped: 3,
              signals: {
                phonesDisconnected: 3,
                wifiOffline: true,
                electricityUsage: 'critical',
                wearableAlert: true,
              },
              coordinates: { x: 200, y: 150 },
            },
            {
              id: 'F2-ZC',
              floor: 2,
              name: 'Zone C',
              priorityScore: 70 + Math.random() * 10,
              riskLevel: 'high',
              estimatedTrapped: 2,
              signals: {
                phonesDisconnected: 2,
                wifiOffline: true,
                electricityUsage: 'critical',
                wearableAlert: true,
              },
              coordinates: { x: 80, y: 200 },
            },
          ];
          alerts = [
            {
              id: 'ALERT-6',
              severity: 'critical',
              message: 'ESCALATING CRISIS: Structural integrity failing',
              timestamp: new Date().toISOString(),
            },
            {
              id: 'ALERT-7',
              severity: 'critical',
              message: 'BREAK GLASS MODE RECOMMENDED',
              timestamp: new Date().toISOString(),
            },
          ];
        }

        resolve({
          zones,
          alerts,
          timestamp: new Date().toISOString(),
        });
      }, 100);
    });
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
