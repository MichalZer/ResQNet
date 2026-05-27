// Zone and Building Types
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Zone data structure
export class Zone {
  constructor(data) {
    this.id = data.id;
    this.floor = data.floor;
    this.name = data.name;
    this.priorityScore = data.priorityScore;
    this.riskLevel = data.riskLevel;
    this.estimatedTrapped = data.estimatedTrapped;
    this.signals = data.signals;
    this.coordinates = data.coordinates;
    this.timestamp = data.timestamp;
  }
}

// Building data structure
export class Building {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.timestamp = data.timestamp;
    this.zones = data.zones?.map(z => new Zone(z)) || [];
    this.alerts = data.alerts || [];
  }
}

// Alert structure
export class Alert {
  constructor(data) {
    this.id = data.id;
    this.severity = data.severity;
    this.message = data.message;
    this.timestamp = data.timestamp;
    this.buildingId = data.buildingId;
    this.zoneId = data.zoneId;
  }
}

// Sensor signal structure
export class Signal {
  constructor(data) {
    this.type = data.type;
    this.status = data.status;
    this.confidence = data.confidence;
    this.timestamp = data.timestamp;
  }
}
