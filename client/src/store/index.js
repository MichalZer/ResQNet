import { create } from 'zustand';

const getMarkerPercent = (position = {}) => ({
  left: Number.parseFloat(position.left) || 50,
  top: Number.parseFloat(position.top) || 50,
});

const buildingCoordinateFromCity = (city, building, scale = 0.00045) => {
  if (!city?.coordinates || !building?.markerPosition) return null;
  if (building.coordinates) return building.coordinates;

  const { left, top } = getMarkerPercent(building.markerPosition);
  const [lat, lng] = city.coordinates;

  return [
    lng + ((left - 50) * scale),
    lat - ((top - 50) * scale),
  ];
};

export const useMapStore = create((set, get) => ({
  // Navigation & View State
  currentView: 'world', // 'world' | 'city' | 'building'
  viewStack: [], // Tracks navigation history for back-button popping
  
  // Map configuration state
  zoom: 5.5,
  pitch: 45,
  bearing: 20,
  mapCenter: [34.8854, 31.7844], // Default Israel center (lon, lat)
  
  // Selection state
  selectedCity: null,
  selectedBuilding: null,
  selectedZone: null,

  // Actions
  setZoom: (zoom) => set({ zoom }),
  setPitch: (pitch) => set({ pitch }),
  setBearing: (bearing) => set({ bearing }),
  setMapCenter: (center) => set({ mapCenter: center }),

  /**
   * Set the current view level and update the map viewport accordingly
   * @param {'world' | 'city' | 'building'} view 
   * @param {Object} data Associated data (city, building)
   */
  setView: (view, data = {}) => {
    const { currentView, viewStack, zoom, pitch, bearing, mapCenter, selectedCity, selectedBuilding } = get();
    
    // Don't push to stack if we're already at this view
    const newStack = [...viewStack];
    if (currentView !== view) {
      newStack.push({
        view: currentView,
        data: { city: selectedCity, building: selectedBuilding },
        viewport: { zoom, pitch, bearing, center: mapCenter }
      });
    }

    let newViewport = { zoom: 5.5, pitch: 45, bearing: 20, center: [34.8854, 31.7844] };

    if (view === 'city' && data.city) {
      // Convert [lat, lon] to [lon, lat] without mutation
      const coords = [...data.city.coordinates].reverse();
      newViewport = { zoom: 13.2, pitch: 48, bearing: 20, center: coords };
    } else if (view === 'building' && data.building) {
      const city = data.city || selectedCity;
      const coords =
        data.building.coordinates ||
        buildingCoordinateFromCity(city, data.building) ||
        mapCenter;
      newViewport = { zoom: 17.35, pitch: 60, bearing: bearing || -15, center: coords };
    }

    set({
      currentView: view,
      viewStack: newStack,
      selectedCity: data.city || null,
      selectedBuilding: data.building || null,
      ...newViewport,
      mapCenter: newViewport.center
    });
  },

  /**
   * Pop the last state from the stack to navigate back one level
   */
  popView: () => {
    const { viewStack } = get();
    if (viewStack.length === 0) return null;

    const lastState = viewStack[viewStack.length - 1];
    const newStack = viewStack.slice(0, -1);

    set({
      currentView: lastState.view,
      viewStack: newStack,
      selectedCity: lastState.data.city,
      selectedBuilding: lastState.data.building,
      ...lastState.viewport,
      mapCenter: lastState.viewport.center
    });

    return lastState;
  },

  resetMap: () => set({
    currentView: 'world',
    viewStack: [],
    zoom: 5.5,
    pitch: 45,
    bearing: 20,
    mapCenter: [34.8854, 31.7844],
    selectedCity: null,
    selectedBuilding: null,
    selectedZone: null,
  }),
}));

export const useSimulationStore = create((set) => ({
  // Simulation state
  currentPhase: 0,
  simulationTime: 0,
  isRunning: false,
  playbackSpeed: 1,
  totalDuration: 70, // 70 seconds demo

  // Actions
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setSimulationTime: (time) => set({ simulationTime: time }),
  setIsRunning: (running) => set({ isRunning: running }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  resetSimulation: () => set({
    currentPhase: 0,
    simulationTime: 0,
    isRunning: false,
  }),
  incrementTime: () => set((state) => ({
    simulationTime: Math.min(state.simulationTime + 0.1, state.totalDuration),
  })),
}));

export const useZonesStore = create((set) => ({
  // Zones state
  zones: [],
  heatmapData: {},
  rescueScores: {},

  // Actions
  setZones: (zones) => set({ zones }),
  updateZone: (zoneId, updates) => set((state) => ({
    zones: state.zones.map(z => z.id === zoneId ? { ...z, ...updates } : z),
  })),
  setHeatmapData: (data) => set({ heatmapData: data }),
  setRescueScores: (scores) => set({ rescueScores: scores }),
  updateRescueScore: (zoneId, score) => set((state) => ({
    rescueScores: { ...state.rescueScores, [zoneId]: score },
  })),
}));

export const useAlertsStore = create((set) => ({
  // Alerts state
  activeAlerts: [],
  criticalAlerts: [],
  dismissedAlerts: [],

  // Actions
  addAlert: (alert) => set((state) => {
    const alerts = [alert, ...state.activeAlerts];
    const isCritical = alert.severity === 'critical';
    return {
      activeAlerts: alerts,
      criticalAlerts: isCritical ? [alert, ...state.criticalAlerts] : state.criticalAlerts,
    };
  }),
  dismissAlert: (alertId) => set((state) => ({
    activeAlerts: state.activeAlerts.filter(a => a.id !== alertId),
    dismissedAlerts: [...state.dismissedAlerts, alertId],
  })),
  clearAlerts: () => set({
    activeAlerts: [],
    criticalAlerts: [],
  }),
}));

export const useUIStore = create((set) => ({
  // UI state
  sidebarOpen: true,
  analyticsVisible: true,
  breakGlassEnabled: false,
  infoPanel: null,

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAnalyticsVisible: (visible) => set({ analyticsVisible: visible }),
  setBreakGlassEnabled: (enabled) => set({ breakGlassEnabled: enabled }),
  setInfoPanel: (panel) => set({ infoPanel: panel }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAnalytics: () => set((state) => ({ analyticsVisible: !state.analyticsVisible })),
}));

export const useRealtimeStore = create((set) => ({
  // Realtime state
  websocketConnected: false,
  latestUpdate: null,
  liveEvents: [],

  // Actions
  setWebsocketConnected: (connected) => set({ websocketConnected: connected }),
  setLatestUpdate: (update) => set({ latestUpdate: update }),
  addLiveEvent: (event) => set((state) => ({
    liveEvents: [event, ...state.liveEvents].slice(0, 100),
  })),
  clearLiveEvents: () => set({ liveEvents: [] }),
}));
