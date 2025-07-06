// TODO: Define comprehensive outage types and severity classifications
// Outages are caused by equipment failures, weather events, vehicle accidents, vegetation, cyber attacks
// Severity levels range from minor (few customers) to catastrophic (entire regions)
// Each incident has a lifecycle: detected -> confirmed -> crews assigned -> work in progress -> resolved

export enum OutageCause {
  EQUIPMENT_FAILURE = 'EQUIPMENT_FAILURE',
  WEATHER = 'WEATHER',
  VEHICLE_ACCIDENT = 'VEHICLE_ACCIDENT',
  VEGETATION = 'VEGETATION',
  CYBER_ATTACK = 'CYBER_ATTACK',
  PLANNED_MAINTENANCE = 'PLANNED_MAINTENANCE'
}

export enum OutageSeverity {
  MINOR = 'MINOR',           // < 100 customers, < 4 hours expected
  MODERATE = 'MODERATE',     // 100-1000 customers, 4-8 hours expected
  MAJOR = 'MAJOR',           // 1000-10000 customers, 8-24 hours expected
  CRITICAL = 'CRITICAL',     // > 10000 customers or critical infrastructure
  CATASTROPHIC = 'CATASTROPHIC' // Regional impact, multiple days
}

export enum IncidentStatus {
  DETECTED = 'DETECTED',
  CONFIRMED = 'CONFIRMED',
  CREWS_ASSIGNED = 'CREWS_ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export interface OutageIncident {
  id: string;
  cause: OutageCause;
  severity: OutageSeverity;
  status: IncidentStatus;
  detectedAt: Date;
  location: {
    latitude: number;
    longitude: number;
    affectedRadiusKm: number;
  };
  equipmentIds: string[];
  estimatedCustomersAffected: number;
  actualCustomersAffected?: number;
  estimatedRestorationTime?: Date;
  actualRestorationTime?: Date;
  priorityScore: number;
  assignedCrewIds: string[];
}

export interface OutageState {
  activeIncidents: OutageIncident[];
  resolvedIncidents: OutageIncident[];
  totalCustomersWithoutPower: number;
  averageRestorationTimeHours: number;
}
