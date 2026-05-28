import { useEffect } from 'react';
import TopNavigation from '../components/ui/TopNavigation';
import Sidebar from '../components/sidebar/Sidebar';
import MapViewport from '../components/map/MapViewport';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import AlertsPanel from '../components/alerts/AlertsPanel';
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
  } = useSimulationStore();

  const { setZones } = useZonesStore();
  const { addAlert } = useAlertsStore();

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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#07111F] text-slate-100">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Layout */}
      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="relative flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          {/* Map Viewport */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1726]/80 shadow-2xl">
            <MapViewport />
            {/* Info Panel */}
            <InfoPanel />
            {/* Alerts */}
            <AlertsPanel />
          </div>

          {/* Analytics Panel */}
          <div className="h-36 shrink-0 rounded-2xl border border-white/10 bg-[#0D1726]/85 p-3 shadow-2xl backdrop-blur-xl">
            <div className="h-full overflow-hidden rounded-xl bg-[#07111F]/40">
              <AnalyticsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
