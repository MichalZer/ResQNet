// Mock API Service - Simulates backend responses
import { cityData, cityBuildings, cityIncidentZones, buildingDetails } from '../data/mockData';

const API_BASE_URL = "http://127.0.0.1:8000";

const liveCity = {
  id: "telaviv",
  name: "Tel Aviv",
  region: "Coastal Israel",
  coordinates: [32.0853, 34.7818],
  markerPosition: { left: "55%", top: "40%" },
  summary: "Live rescue data from Fusion Engine.",
  detail: "Buildings are prioritized by live multi-signal rescue scoring.",
};

// const areaToBuilding = {
//   floor4_zoneA: {
//     id: "telaviv-A",
//     name: "Building A",
//     floors: 4,
//     markerPosition: { left: "57%", top: "42%" },
//   },

//   floor5_zoneC: {
//     id: "telaviv-B",
//     name: "Building B",
//     floors: 5,
//     markerPosition: { left: "54%", top: "38%" },
//   },
// };

async function fetchRescueScores() {
  const response = await fetch(
    `${API_BASE_URL}/simulation/rescue-scores`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch rescue scores");
  }

  return response.json();
}

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
  const scores = await fetchRescueScores();

  const maxScore = Math.max(
    ...scores.map((item) => item.priorityScore)
  );

  const highestRisk = scores[0]?.riskLevel ?? "low";

  const totalTrapped = scores.reduce(
    (sum, item) => sum + (item.estimatedTrapped ?? 0),
    0
  );

  return [
    {
      ...liveCity,
      riskLevel: highestRisk,
      priorityScore: maxScore,
      incidentCount: totalTrapped,
    },
  ];
},

  /**
   * Fetch details for a specific city including buildings and incident zones
   */
 async fetchCityDetails(cityId) {
  const scores = await fetchRescueScores();

  const buildings = scores.map((zone, index) => {
    const floorNumber =
      Number(zone.areaId?.match(/floor(\d+)/)?.[1]) || index + 1;

    return {
      id: `telaviv-building-${index + 1}`,
      name: `Building ${index + 1}`,

      priorityScore: zone.priorityScore,
      riskLevel: zone.riskLevel,
      trapped: zone.estimatedTrapped ?? 0,
      floors: floorNumber,

      markerPosition: {
        left: `${54 + index * 3}%`,
        top: `${38 + index * 4}%`,
      },

      summary: zone.evidence?.[0] ?? "Live fusion signal detected.",
      areaId: zone.areaId,
      evidence: zone.evidence ?? [],
    };
  });

  return {
    ...liveCity,
    buildings,
    incidentZones: [],
  };
},
  /**
   * Fetch building details
   */
 async fetchBuilding(buildingId = "B1") {

  const scores = await fetchRescueScores();

  const buildingIndex =
    Number(buildingId.split("-").pop()) - 1;

  const zone = scores[buildingIndex];

  if (!zone) {
    throw new Error("Building not found");
  }

  const floorNumber =
    Number(zone.areaId?.match(/floor(\d+)/)?.[1]) ||
    buildingIndex + 1;

  return {
    id: buildingId,

    name: `Building ${buildingIndex + 1}`,

    cityId: "telaviv",

    rescueScore:
      zone.priorityScore,

    estimatedTrapped:
      zone.estimatedTrapped ?? 0,

    signalLoss: "42%",

    recommendation:
      zone.evidence?.[0] ??
      "Deploy rescue team.",

    evidence:
      zone.evidence ?? [],

    alerts:
      zone.evidence?.map((item, index) => ({
        id: index,
        message: item,
      })) ?? [],

    floors: [
      {
        level: floorNumber,

        risk: zone.riskLevel,

        status:
          zone.evidence?.[0] ??
          "Live signal detected",

        score:
          zone.priorityScore,
      },
    ],

    timestamp:
      new Date().toISOString(),
  };
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
