import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import TopNavigation from '../components/ui/TopNavigation';
import AlertsPanel from '../components/alerts/AlertsPanel';
import Building3DMap from '../components/map/Building3DMap';
import mockAPI from '../services/api';
import { getSeverityTextColor } from '../utils';
import { useMapStore } from '../store';

const riskScoreColor = (score = 0) => {
  if (score >= 85) return '#EF4444';
  if (score >= 70) return '#F97316';
  if (score >= 50) return '#FBBF24';
  return '#10B981';
};

export function BuildingPage() {
  const { cityId, buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const { setView, currentView, selectedBuilding: storeBuilding } = useMapStore();

  useEffect(() => {
    const fetchData = async () => {
      const [cityData, buildingData] = await Promise.all([
        mockAPI.fetchCityDetails(cityId),
        mockAPI.fetchBuilding(buildingId),
      ]);
      const cityBuilding = cityData?.buildings?.find((item) => item.id === buildingId);

      // Normalize/enrich building data for the map component
      const floorsArray = buildingData?.floors ?? [];
      const floorsCount = floorsArray?.length || buildingData?.maxFloors || 10;
      const criticalFloors = (floorsArray || [])
        .map((f, i) => (f?.score >= 80 ? i + 1 : null))
        .filter(Boolean);

      const focusedBuilding = {
        ...cityBuilding,
        ...buildingData,
        // Top-level coordinates used by Building3DMap (convenience)
        lng: buildingData?.coordinates?.lng || cityData?.coordinates?.lng || 35.2137,
        lat: buildingData?.coordinates?.lat || cityData?.coordinates?.lat || 31.7683,
        // Ensure there's a floors array and counts for downstream logic
        floors: floorsArray,
        floorsCount,
        criticalFloors,
      };

      setBuilding(focusedBuilding);

      // Sync store only if we are not already in building view for THIS building
      if (currentView !== 'building' || storeBuilding?.id !== buildingId) {
        setView('building', { city: cityData, building: focusedBuilding });
      }
    };

    fetchData();
  }, [cityId, buildingId, currentView, setView, storeBuilding?.id]);

  const floorData = building?.floors || [];
  const buildingChart = floorData.map((item) => ({
    name: `F${item.level}`,
    score: item.score,
  }));

  return (
    <div className="flex h-screen w-screen m-0 p-0 bg-[#0B0F19] text-slate-100 overflow-hidden flex-col">
      <TopNavigation />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="relative flex-1 min-h-0 overflow-hidden">
            {/* 3D Building Visualization */}
            <Building3DMap buildingData={building} />
            <AlertsPanel />
          </div>

          <section className="border-t border-[#151D30] bg-[#0F1524] p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="rounded-3xl border border-[#151D30] bg-[#08121e] p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Building Rescue Overview
                      </p>
                      <h2 className="text-xl font-bold text-white">
                        {building?.name || 'Rescue Matrix'}
                      </h2>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>Estimated trapped</p>
                      <p className="font-semibold text-white">{building?.estimatedTrapped ?? '--'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {floorData.map((floor) => {
                      const isCriticalFloor = building?.criticalFloors?.includes(floor.level);
                      return (
                        <div
                          key={floor.level}
                          className={`rounded-3xl border p-4 text-center ${
                            isCriticalFloor ? 'border-[#FF5A5A] bg-[#3d1512]' : 'border-[#151D30] bg-[#0c1721]'
                          }`}
                        >
                          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                            Floor {floor.level}
                          </p>
                          <div
                            className={`mt-4 flex h-24 flex-col items-center justify-center rounded-3xl border ${
                              isCriticalFloor ? 'border-[#FF5A5A]/30 bg-[#1a0f0a]' : 'border-white/5 bg-[#07111F]'
                            }`}
                            style={{ boxShadow: `inset 0 0 42px ${riskScoreColor(floor.score)}24` }}
                          >
                            <div className="font-mono text-3xl font-bold text-white">{floor.score}%</div>
                            <div
                              className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                                isCriticalFloor ? 'text-[#FF5A5A]' : 'text-slate-500'
                              }`}
                            >
                              {isCriticalFloor ? 'CRITICAL' : 'Risk'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-[#151D30] bg-[#08121e] p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">
                      Rescue priority heatmap
                    </p>

                    {/* FIX: Ensure parent has fixed height so ResponsiveContainer can measure */}
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={buildingChart} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#19202d" />
                          <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #273449' }} />
                          <Bar dataKey="score" fill="#06b6d4">
                            {buildingChart.map((entry) => (
                              <Cell key={entry.name} fill={riskScoreColor(entry.score)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#151D30] bg-[#08121e] p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Signal & Rescue Status</p>
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-[#0b1524] p-4">
                        <p className="text-[11px] text-gray-500">Rescue score</p>
                        <p className="text-3xl font-bold text-emergency-cyan">{building?.rescueScore ?? '--'}%</p>
                      </div>
                      <div className="rounded-2xl bg-[#0b1524] p-4 text-sm text-gray-300">
                        <p className="font-semibold text-white">Signal loss</p>
                        <p>{building?.signalLoss || 'Unknown'}</p>
                      </div>
                      <div className="rounded-2xl bg-[#0b1524] p-4 text-sm text-gray-300">
                        <p className="font-semibold text-white">Recommendation</p>
                        <p>{building?.recommendation || 'Awaiting sensor update.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-3xl border border-[#151D30] bg-[#08121e] p-6">
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <ShieldAlert className="w-4 h-4 text-emergency-yellow" />
                  <p className="text-xs uppercase tracking-[0.24em]">Live alerts</p>
                </div>
                <div className="space-y-4">
                  {building?.alerts?.length ? (
                    building.alerts.map((alert) => (
                      <div key={alert.id} className="rounded-3xl bg-[#0b1524] p-4 border border-[#151D30]">
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold text-white mb-2">
                          <span>{alert.message}</span>
                          <span className={`text-[10px] uppercase ${getSeverityTextColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No live building alerts at this moment.</p>
                  )}
                </div>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BuildingPage;
