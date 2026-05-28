import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../components/ui/TopNavigation";
import AnalyticsPanel from "../components/analytics/AnalyticsPanel";
import AlertsPanel from "../components/alerts/AlertsPanel";
import MapViewport from "../components/map/MapViewport";
import mockAPI from "../services/api";
import { AlertTriangle, Crosshair } from "lucide-react";
import { getSeverityTextColor } from "../utils";
import { useMapStore } from "../store";

export function OverviewPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setView, selectedCity: storeSelectedCity } = useMapStore();
  const [selectedCityId, setSelectedCityId] = useState(
    storeSelectedCity?.id || "jerusalem",
  );

  useEffect(() => {
    // Ensure map is in world view when this page mounts
    setView("world");

    const fetchCities = async () => {
      const data = await mockAPI.fetchCities();
      setCities(data);
      setLoading(false);
      setSelectedCityId((currentCityId) =>
        data.find((city) => city.id === currentCityId)
          ? currentCityId
          : data[0]?.id || "jerusalem",
      );
    };
    fetchCities();
  }, [setView]);

  const sortedCities = [...cities].sort(
    (a, b) => b.priorityScore - a.priorityScore,
  );

  const focusCity = (city) => {
    setSelectedCityId(city.id);
    setView("city", { city });
    window.setTimeout(() => {
      navigate(`/city/${city.id}`);
    }, 1050);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#07111F] text-slate-100">
      <TopNavigation />

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
        <aside className="flex w-full max-w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1726]/85 shadow-2xl backdrop-blur-xl max-lg:hidden">
          <div className="border-b border-white/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#4FD1FF]">National Triage</p>
            <p className="mt-1 text-lg font-semibold text-white">City Priority</p>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {loading ? (
              <div className="text-gray-400 text-sm">
                Loading city overview...
              </div>
            ) : (
              sortedCities.map((city, index) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => focusCity(city)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    city.id === selectedCityId
                      ? "border-[#4FD1FF]/70 bg-[#4FD1FF]/10 shadow-[0_0_0_1px_rgba(79,209,255,0.16)]"
                      : "border-white/10 bg-white/[0.035] hover:border-[#4FD1FF]/45 hover:bg-white/[0.055]"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold leading-tight text-slate-100">
                      {index + 1}. {city.name}
                    </span>
                    <span
                      className={`rounded-md bg-[#07111F]/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${getSeverityTextColor(city.riskLevel)}`}
                    >
                      {city.riskLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="uppercase tracking-[0.16em] text-slate-500">Incidents</p>
                      <p className="mt-1 font-mono text-base font-bold text-white">{city.incidentCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="uppercase tracking-[0.16em] text-slate-500">Score</p>
                      <p className="mt-1 font-mono text-base font-bold text-[#4FD1FF]">{city.priorityScore}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-white/10 bg-[#07111F]/45 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <AlertTriangle className="mb-2 h-4 w-4 text-[#FF5A5A]" />
                <p className="font-mono text-lg font-bold text-[#FF5A5A]">
                  {cities.filter((city) => city.riskLevel === "critical").length}
                </p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">Critical</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <Crosshair className="mb-2 h-4 w-4 text-[#4FD1FF]" />
                <p className="font-mono text-lg font-bold text-[#4FD1FF]">{cities.length}</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">Cities</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1726]/80 shadow-2xl">
            <MapViewport
              mode="world"
              cities={cities}
              onCitySelect={focusCity}
            />
            <AlertsPanel />
          
          </div>

          <div className="h-36 shrink-0 rounded-2xl border border-white/10 bg-[#0D1726]/85 p-3 shadow-2xl backdrop-blur-xl">
            <div className="h-full overflow-hidden rounded-xl bg-[#07111F]/40">
              <AnalyticsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OverviewPage;
