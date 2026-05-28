import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useAlertsStore } from '../../store';
import { getSeverityColor } from '../../utils';

export function AlertsPanel() {
  const activeAlerts = useAlertsStore((state) => state.activeAlerts);
  const dismissAlert = useAlertsStore((state) => state.dismissAlert);

  return (
    <div className="fixed top-24 right-8 space-y-3 max-w-md z-50">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`${getSeverityColor(alert.severity)} px-4 py-3 rounded-lg border-l-4 ${
            alert.severity === 'critical'
              ? 'border-emergency-red animate-pulse'
              : alert.severity === 'high'
              ? 'border-emergency-orange'
              : alert.severity === 'warning'
              ? 'border-emergency-yellow'
              : 'border-emergency-green'
          } shadow-lg backdrop-blur-sm`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {alert.severity === 'critical' && (
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 animate-pulse" />
              )}
              {alert.severity === 'high' && (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{alert.message}</p>
                <p className="text-xs opacity-75 mt-1 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-current hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertsPanel;
