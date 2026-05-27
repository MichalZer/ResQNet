import { create } from 'zustand';

export const useMapStore = create((set) => ({
  // Map state
  zoom: 13,
  pitch: 45,
  bearing: 0,
  selectedBuilding: null,
  selectedZone: null,
  mapCenter: [-118.2437, 34.0522], // LA default

  // Actions
  setZoom: (zoom) => set({ zoom }),
  setPitch: (pitch) => set({ pitch }),
  setBearing: (bearing) => set({ bearing }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setMapCenter: (center) => set({ mapCenter: center }),
  resetMap: () => set({
    zoom: 13,
    pitch: 45,
    bearing: 0,
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
