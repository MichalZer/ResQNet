import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, LayoutGrid } from 'lucide-react';
import TopNavigation from '../components/ui/TopNavigation';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import AlertsPanel from '../components/alerts/AlertsPanel';
import MapViewport from '../components/map/MapViewport';
import mockAPI from '../services/api';
import { getSeverityTextColor } from '../utils';
import { useMapStore } from '../store';

export function CityPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setView, resetMap } = useMapStore();

  useEffect(() => {
    const fetchCity = async () => {
      const data = await mockAPI.fetchCityDetails(cityId);
      setCity(data);
      setLoading(false);
      
      // Keep building focus intact during the cinematic transition into street view.
      if (useMapStore.getState().currentView !== 'building') {
        setView('city', { city: data });
      }
    };
    fetchCity();
  }, [cityId, setView]);

  const handleBack = (e) => {
    e?.preventDefault();
    // 1. Clear selected city and reset map viewport to national overview
    resetMap();
    // 2. Return to National Overview page
    navigate('/', { replace: true });
  };

  const buildings = city?.buildings || [];
  const sortedBuildings = [...buildings].sort((a, b) => b.priorityScore - a.priorityScore);

  const focusBuilding = (building) => {
    setView('building', { city, building });
    window.setTimeout(() => {
      navigate(`/city/${cityId}/building/${building.id}`);
    }, 950);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07111F] text-slate-100">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavigation />

        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
          {/* Tactical Sidebar */}
          <aside className="flex w-full max-w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1726]/85 shadow-2xl backdrop-blur-xl max-lg:hidden">
            <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="group flex items-center justify-center rounded-lg border border-white/10 bg-[#07111F]/70 p-2.5 text-slate-400 transition-all hover:bg-[#4FD1FF]/10 hover:text-[#4FD1FF] active:scale-95"
                title="Return to National Overview"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold leading-none text-white">{city?.name || 'City Detail'}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 animate-pulse rounded-full bg-[#4FD1FF]" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Active Sector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Building Priority Stack */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <LayoutGrid className="w-3 h-3 text-[#4FD1FF]" />
                Priority Stack
              </p>
              <span className="rounded-md border border-[#4FD1FF]/20 bg-[#4FD1FF]/10 px-2 py-1 font-mono text-[9px] text-[#4FD1FF]">
                {buildings.length} OBJ
              </span>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-3">
                <div className="w-8 h-8 border-2 border-emergency-cyan/30 border-t-emergency-cyan rounded-full animate-spin" />
                <span className="text-xs font-medium tracking-wide">Initializing tactical data...</span>
              </div>
            ) : (
              sortedBuildings.map((building, index) => (
                <button
                  key={building.id}
                  type="button"
                  onClick={() => focusBuilding(building)}
                  className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left transition-all duration-300 hover:border-[#4FD1FF]/45 hover:bg-white/[0.055]"
                >
                  {/* Rank Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-col min-w-0">
                      <span className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#4FD1FF]/80">Vector {index + 1}</span>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-white truncate transition-colors leading-tight">
                        {building.name}
                      </h3>
                    </div>
                    <div className={`shrink-0 rounded-md bg-[#07111F]/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${getSeverityTextColor(building.riskLevel)}`}>
                      {building.riskLevel}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-[10px]">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Building2 className="w-3 h-3" />
                      <span className="font-medium">{building.floors} Floors</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-xs font-bold text-[#4FD1FF]">{building.priorityScore}%</span>
                      <span className="text-gray-600 uppercase text-[8px] font-bold">Priority</span>
                    </div>
                  </div>
                  
                  {/* Progress background track */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B0F19]">
                    <div 
                      className="h-full bg-[#4FD1FF] opacity-50 transition-all duration-500" 
                      style={{ width: `${building.priorityScore}%` }}
                    />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Quick Metrics Footer */}
          <div className="space-y-3 border-t border-white/10 bg-[#07111F]/45 p-4">
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] p-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">City Risk</p>
                <p className="text-xs font-black uppercase text-[#FF5A5A]">{city?.riskLevel || 'HIGH'}</p>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] p-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">Active Zones</p>
                <p className="text-xs font-black text-amber-300">{city?.incidentZones?.length || 0}</p>
              </div>
            </div>
          </div>
        </aside>

          {/* Tactical Map Area */}
          <main className="relative flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1726]/80 shadow-2xl">
              <MapViewport
                mode="city"
                buildings={buildings}
                incidentZones={city?.incidentZones || []}
                onBuildingSelect={focusBuilding}
              />

           
            <AlertsPanel />
           
          </div>

          {/* Analytics HUD */}
          <div className="relative z-10 h-36 shrink-0 rounded-2xl border border-white/10 bg-[#0D1726]/85 p-3 shadow-2xl backdrop-blur-xl">
            <div className="h-full overflow-hidden rounded-xl bg-[#07111F]/40">
              <AnalyticsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
}

export default CityPage;
