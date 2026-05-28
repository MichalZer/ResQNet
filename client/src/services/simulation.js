// Simulation Service - Manages the real-time simulation flow

import mockAPI from './api';

export const simulationService = {
  updateInterval: null,

  /**
   * Start the simulation
   */
  startSimulation(onUpdate, updateInterval = 100) {
    this.updateInterval = setInterval(onUpdate, updateInterval);
  },

  /**
   * Stop the simulation
   */
  stopSimulation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  },

  /**
   * Get data for current simulation time
   */
  async getSimulationData(simulationTime) {
    return await mockAPI.getSimulationPhase(simulationTime);
  },

  /**
   * Get alert based on current state
   */
  getAlert(phase, zones) {
    if (phase < 10) return null;
    if (phase < 20) {
      return {
        id: `ALERT-${phase}`,
        severity: 'warning',
        message: 'Minor seismic activity detected',
        timestamp: new Date().toISOString(),
      };
    }
    if (phase < 30) {
      return {
        id: `ALERT-${phase}`,
        severity: 'high',
        message: 'Structural damage detected - rescue teams dispatch recommended',
        timestamp: new Date().toISOString(),
      };
    }
    if (phase < 40) {
      return {
        id: `ALERT-${phase}`,
        severity: 'critical',
        message: 'CRITICAL: Multiple signals lost - emergency protocols activated',
        timestamp: new Date().toISOString(),
      };
    }
    return {
      id: `ALERT-${phase}`,
      severity: 'critical',
      message: 'ESCALATION: System integrity compromised',
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Calculate heatmap intensity from zone scores
   */
  calculateHeatmap(zones) {
    const heatmap = {};
    zones.forEach((zone) => {
      heatmap[zone.id] = {
        intensity: zone.priorityScore / 100,
        color: this.getSeverityColor(zone.riskLevel),
        radius: 50 + (zone.priorityScore / 100) * 50,
      };
    });
    return heatmap;
  },

  /**
   * Get color for severity level
   */
  getSeverityColor(riskLevel) {
    const colors = {
      low: '#10B981',      // green
      medium: '#FBBF24',   // yellow
      high: '#F97316',     // orange
      critical: '#EF4444', // red
    };
    return colors[riskLevel] || '#10B981';
  },
};

export default simulationService;
