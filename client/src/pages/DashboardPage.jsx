import { useEffect } from 'react';
import TopNavigation from '../components/ui/TopNavigation';
import Sidebar from '../components/sidebar/Sidebar';
import MapViewport from '../components/map/MapViewport';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import AlertsPanel from '../components/alerts/AlertsPanel';
import SimulationControls from '../components/ui/SimulationControls';
import InfoPanel from '../components/building/InfoPanel';
import { useSimulationStore, useZonesStore, useAlertsStore } from '../store';
import simulationService from '../services/simulation';
import mockAPI from '../services/api';

export function DashboardPage() {
  const {
    isRunning,
    simulationTime,
    playbackSpeed,
    setSimulationTime,
    incrementTime,
  } = useSimulationStore();

  const { setZones } = useZonesStore();
  const { addAlert, clearAlerts } = useAlertsStore();

  // Initialize simulation
  useEffect(() => {
    const initializeData = async () => {
      const data = await mockAPI.fetchBuilding();
      setZones(data.zones);
    };
    initializeData();
  }, [setZones]);

  // Handle simulation updates
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSimulationTime(
        (prev) => Math.min(prev + (0.1 * playbackSpeed), 70)
      );
    }, 100 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isRunning, playbackSpeed, setSimulationTime]);

  // Fetch simulation phase data
  useEffect(() => {
    const updateSimulation = async () => {
      const data = await simulationService.getSimulationData(simulationTime);
      setZones(data.zones);

      // Add alerts if any
      if (data.alerts.length > 0) {
        data.alerts.forEach((alert) => {
          addAlert({
            ...alert,
            id: `${alert.id}-${simulationTime}`,
          });
        });
      }
    };

    updateSimulation();
  }, [simulationTime, setZones, addAlert]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Map Viewport */}
          <div className="flex-1 overflow-hidden">
            <MapViewport />
            {/* Info Panel */}
            <InfoPanel />
            {/* Alerts */}
            <AlertsPanel />
            {/* Simulation Controls */}
            <SimulationControls />
          </div>

          {/* Analytics Panel */}
          <div className="h-40 overflow-hidden">
            <AnalyticsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
