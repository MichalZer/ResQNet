// Utility functions

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Get severity color based on level
 */
export const getSeverityColor = (severity) => {
  const colors = {
    low: 'bg-emergency-green text-white',
    medium: 'bg-emergency-yellow text-black',
    high: 'bg-emergency-orange text-white',
    critical: 'bg-emergency-red text-white',
    warning: 'bg-emergency-yellow text-black',
  };
  return colors[severity] || 'bg-gray-500 text-white';
};

/**
 * Get severity badge text color
 */
export const getSeverityTextColor = (severity) => {
  const colors = {
    low: 'text-emergency-green',
    medium: 'text-emergency-yellow',
    high: 'text-emergency-orange',
    critical: 'text-emergency-red',
    warning: 'text-emergency-yellow',
  };
  return colors[severity] || 'text-gray-400';
};

/**
 * Format coordinate display
 */
export const formatCoordinates = (lat, lon) => {
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
};

/**
 * Format timestamp
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Clamp value between min and max
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Interpolate between two values
 */
export const lerp = (a, b, t) => {
  return a + (b - a) * t;
};

/**
 * Get zone label with floor
 */
export const getZoneLabel = (zone) => {
  return `Floor ${zone.floor} - ${zone.name}`;
};

/**
 * Create a smooth easing function
 */
export const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
