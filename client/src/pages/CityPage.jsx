import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, LayoutGrid, Radio } from 'lucide-react';
import TopNavigation from '../components/ui/TopNavigation';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import AlertsPanel from '../components/alerts/AlertsPanel';
import SimulationControls from '../components/ui/SimulationControls';
import MapViewport from '../components/map/MapViewport';
import mockAPI from '../services/api';
import { getSeverityTextColor } from '../utils';
import { useMapStore } from '../store';

export function CityPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setView, resetMap, currentView, selectedCity: storeCity } = useMapStore();

  useEffect(() => {
    const fetchCity = async () => {
      const data = await mockAPI.fetchCityDetails(cityId);
      setCity(data);
      setLoading(false);
      
      // Sync store only if we are not already in city view for THIS city
      if (currentView !== 'city' || storeCity?.id !== cityId) {
        setView('city', { city: data });
      }
    };
    fetchCity();
  }, [cityId, setView, currentView, storeCity?.id]);

  const handleBack = (e) => {
    e?.preventDefault();
    // 1. Clear selected city and reset map viewport to national overview
    resetMap();
    // 2. Return to National Overview page
    navigate('/', { replace: true });
  };

  const buildings = city?.buildings || [];
  const sortedBuildings = [...buildings].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="flex h-screen w-screen m-0 p-0 bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Tactical Sidebar */}
          <aside className="w-80 min-w-[20rem] bg-[#0F1524] border-r border-[#151D30] flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-[#151D30] bg-[#151D30]/30">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="group rounded-full bg-[#151D30] p-2.5 text-gray-400 hover:text-emergency-cyan hover:bg-emergency-cyan/10 transition-all border border-[#273449] active:scale-95 flex items-center justify-center"
                title="Return to National Overview"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black text-white truncate tracking-tight uppercase leading-none">{city?.name || 'City Detail'}</h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emergency-cyan animate-pulse" />
                  <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Active Sector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Building Priority Stack */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <LayoutGrid className="w-3 h-3 text-slate-400" />
                Priority Stack
              </p>
              <span className="text-[9px] bg-emergency-cyan/10 text-emergency-cyan px-2 py-1 rounded border border-emergency-cyan/20 font-mono">
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
                  onClick={() => {
                    setView('building', { building });
                    navigate(`/city/${cityId}/building/${building.id}`);
                  }}
                  className="w-full group text-left p-4 rounded-3xl border border-[#24303f] bg-[#151D30] hover:bg-[#1e293b] hover:border-emergency-cyan/50 transition-all duration-300 relative overflow-hidden flex flex-col"
                >
                  {/* Rank Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-black text-emergency-cyan/70 uppercase tracking-tighter mb-0.5">Vector {index + 1}</span>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-white truncate transition-colors leading-tight">
                        {building.name}
                      </h3>
                    </div>
                    <div className={`shrink-0 px-2 py-1 rounded bg-[#0B0F19] border border-[#24303f] text-[9px] uppercase tracking-tighter font-black ${getSeverityTextColor(building.riskLevel)}`}>
                      {building.riskLevel}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 mb-4 group-hover:text-slate-100 transition-colors">
                    {building.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#24303f] text-[10px]">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Building2 className="w-3 h-3" />
                      <span className="font-medium">{building.floors} Floors</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-emergency-cyan font-bold text-xs">{building.priorityScore}%</span>
                      <span className="text-gray-600 uppercase text-[8px] font-bold">Priority</span>
                    </div>
                  </div>
                  
                  {/* Progress background track */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B0F19]">
                    <div 
                      className="h-full bg-emergency-cyan opacity-40 transition-all duration-500" 
                      style={{ width: `${building.priorityScore}%` }}
                    />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Quick Metrics Footer */}
          <div className="p-4 border-t border-[#151D30] bg-[#0B0F19]/50 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl bg-[#151D30]/60 p-3 border border-[#151D30] flex flex-col items-center justify-center text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">City Risk</p>
                <p className="text-emergency-red font-black text-xs uppercase">{city?.riskLevel || 'HIGH'}</p>
              </div>
              <div className="flex-1 rounded-xl bg-[#151D30]/60 p-3 border border-[#151D30] flex flex-col items-center justify-center text-center">
                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600 font-bold mb-1">Active Zones</p>
                <p className="text-emergency-yellow font-black text-xs">{city?.incidentZones?.length || 0}</p>
              </div>
            </div>
          </div>
        </aside>

          {/* Tactical Map Area */}
          <main className="flex-1 flex min-h-0 relative bg-[#060B14]">
            <div className="flex-1 h-full min-h-0 relative">
              <MapViewport
                mode="city"
                buildings={buildings}
                incidentZones={city?.incidentZones || []}
                onBuildingSelect={(building) => {
                  setView('building', { building });
                  navigate(`/city/${cityId}/building/${building.id}`);
                }}
              />

           
            <AlertsPanel />
            <SimulationControls />
          </div>

          {/* Analytics HUD */}
          <div className="h-48 border-t border-[#151D30] bg-[#0F1524] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10 relative px-4 py-3">
            <div className="h-full rounded-3xl bg-[#151D30] border border-[#24303f] p-4">
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
