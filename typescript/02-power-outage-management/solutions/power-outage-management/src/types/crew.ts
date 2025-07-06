// TODO: Define crew types with specializations and availability
// Different crew types: line workers (power lines), tree removal (vegetation), substation techs (equipment), emergency response (safety)
// Each crew has GPS location, skills, equipment, and current availability status
// Crews work shifts and have overtime limitations for safety

export enum CrewSpecialization {
  LINE_WORKER = 'LINE_WORKER',
  TREE_REMOVAL = 'TREE_REMOVAL', 
  SUBSTATION_TECH = 'SUBSTATION_TECH',
  EMERGENCY_RESPONSE = 'EMERGENCY_RESPONSE'
}

export enum CrewStatus {
  AVAILABLE = 'AVAILABLE',
  DISPATCHED = 'DISPATCHED',
  ON_SITE = 'ON_SITE',
  RETURNING = 'RETURNING',
  OFF_DUTY = 'OFF_DUTY'
}

export interface FieldCrew {
  id: string;
  name: string;
  specialization: CrewSpecialization;
  skillLevel: 'JUNIOR' | 'SENIOR' | 'EXPERT';
  teamSize: number;
  currentLocation: {
    latitude: number;
    longitude: number;
    lastUpdate: Date;
  };
  status: CrewStatus;
  shiftEndTime: Date;
  assignedEquipment: string[];
  currentIncidentId?: string;
  estimatedCompletionTime?: Date;
}

export interface CrewAssignment {
  crewId: string;
  incidentId: string;
  assignedAt: Date;
  estimatedArrivalTime: Date;
  actualArrivalTime?: Date;
  role: 'LEAD' | 'SUPPORT' | 'SPECIALIST';
  estimatedWorkDuration: number; // minutes
}
