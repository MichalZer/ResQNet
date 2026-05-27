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
    <div className="h-full bg-dark-card border-t border-dark-border flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-dark-text mb-1">Timeline Analytics</h3>
        <p className="text-xs text-gray-400">Last 24 hours activity</p>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading analytics...</p>
        </div>
      ) : (
        <div className="flex-1 flex gap-4">
          {/* Incidents Chart */}
          <div className="flex-1 min-h-0">
            <p className="text-xs text-gray-400 mb-2">Incidents</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#0F1524', border: '1px solid #222' }} />
                <Bar dataKey="incidents" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Score Chart */}
          <div className="flex-1 min-h-0">
            <p className="text-xs text-gray-400 mb-2">Priority Score</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#0F1524', border: '1px solid #222' }} />
                <Area type="monotone" dataKey="priority" stroke="#F97316" fill="#F97316" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 text-xs text-gray-500 border-t border-dark-border pt-2">
        <p>Auto-updating every 5 seconds</p>
      </div>
    </div>
  );
}

export default AnalyticsPanel;
