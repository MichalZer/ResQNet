import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';
import mockAPI from '../../services/api';

export function AnalyticsPanel() {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockAPI.getAnalyticsTimeline(24);
      setTimelineData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-transparent p-3">
      {/* Header */}
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <h3 className="mb-1 text-sm font-bold text-white">Timeline Analytics</h3>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Last 24 hours</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#4FD1FF]">Auto update</p>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading analytics...</p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 gap-4">
          {/* Incidents Chart */}
          <div className="flex-1 min-h-0">
            <p className="mb-1 text-xs text-slate-400">Incidents</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#0D1726', border: '1px solid rgba(255,255,255,0.12)' }} />
                <Bar dataKey="incidents" fill="#4FD1FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Score Chart */}
          <div className="flex-1 min-h-0">
            <p className="mb-1 text-xs text-slate-400">Priority Score</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#0D1726', border: '1px solid rgba(255,255,255,0.12)' }} />
                <Area type="monotone" dataKey="priority" stroke="#FF5A5A" fill="#FF5A5A" fillOpacity={0.22} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPanel;
