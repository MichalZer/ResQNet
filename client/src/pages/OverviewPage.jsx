import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/ui/TopNavigation';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import AlertsPanel from '../components/alerts/AlertsPanel';
import SimulationControls from '../components/ui/SimulationControls';
import MapViewport from '../components/map/MapViewport';
import mockAPI from '../services/api';
import { getSeverityTextColor } from '../utils';
import { useMapStore } from '../store';

export function OverviewPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setView, selectedCity: storeSelectedCity } = useMapStore();
  const [selectedCityId, setSelectedCityId] = useState(storeSelectedCity?.id || 'jerusalem');

  useEffect(() => {
    // Ensure map is in world view when this page mounts
    setView('world');
    
    const fetchCities = async () => {
      const data = await mockAPI.fetchCities();
      setCities(data);
      setLoading(false);
      if (!data.find((city) => city.id === selectedCityId)) {
        setSelectedCityId(data[0]?.id || 'jerusalem');
      }
    };
    fetchCities();
  }, [setView]);

  const selectedCity = cities.find((city) => city.id === selectedCityId);
  const sortedCities = [...cities].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="flex h-screen w-screen m-0 p-0 bg-[#0B0F19] text-slate-100 overflow-hidden flex-col">
      <TopNavigation />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <aside className="w-80 min-w-[20rem] bg-[#0F1524] border-r border-[#151D30] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-[#151D30] bg-[#151D30]/30">
            <h2 className="text-lg font-bold text-white">City Rank</h2>
            <p className="text-xs text-slate-400">Tap any marker to inspect a city.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {loading ? (
              <div className="text-gray-400 text-sm">Loading city overview…</div>
            ) : (
              sortedCities.map((city, index) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    setSelectedCityId(city.id);
                    setView('city', { city });
                    navigate(`/city/${city.id}`);
                  }}
                  className={`w-full text-left p-4 rounded-3xl border ${
                    city.id === selectedCityId ? 'border-emergency-cyan bg-[#0A1626]' : 'border-[#24303f] bg-[#151D30] hover:border-emergency-cyan/80'
                  } shadow-sm transition-all`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-100">{index + 1}. {city.name}</span>
                    <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${getSeverityTextColor(city.riskLevel)}`}>
                      {city.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">{city.summary}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{city.incidentCount} active incidents</span>
                    <span>Score {city.priorityScore}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#151D30] text-xs text-slate-400 space-y-2 bg-[#08121e]">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-[#08121e] p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Critical</p>
                <p className="text-emergency-red font-semibold">Red alerts</p>
              </div>
              <div className="rounded-2xl bg-[#08121e] p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Monitoring</p>
                <p className="text-emergency-cyan font-semibold">Live emergency feed</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <MapViewport
              mode="world"
              cities={cities}
              onCitySelect={(city) => {
                setSelectedCityId(city.id);
                setView('city', { city });
                navigate(`/city/${city.id}`);
              }}
            />

            <div className="absolute left-8 top-8 rounded-3xl border border-[#151D30] bg-[#0F1524]/95 p-5 max-w-sm shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Israel City Overview</p>
              <h1 className="text-2xl font-bold text-white">{selectedCity?.name || 'Jerusalem'}</h1>
              <p className="mt-3 text-sm text-slate-300">{selectedCity?.detail || 'Default tactical focus on Jerusalem command sectors.'}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-gray-400">
                <div className="rounded-2xl bg-[#08121e] p-3">
                  <p>Risk</p>
                  <p className="mt-2 font-semibold text-white">{selectedCity?.riskLevel?.toUpperCase()}</p>
                </div>
                <div className="rounded-2xl bg-[#08121e] p-3">
                  <p>Active zones</p>
                  <p className="mt-2 font-semibold text-white">{selectedCity?.incidentCount || 0}</p>
                </div>
              </div>
            </div>

            <AlertsPanel />
            <SimulationControls />
          </div>

          <div className="h-44 border-t border-[#151D30] bg-[#0F1524]">
            <div className="h-full rounded-3xl bg-[#151D30] border border-[#24303f] p-4">
              <AnalyticsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OverviewPage;
