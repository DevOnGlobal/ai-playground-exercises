// TODO: Define customer types with communication preferences and priority
// Critical infrastructure: hospitals, fire stations, police stations, emergency services
// Commercial: businesses, data centers, manufacturing facilities  
// Residential: homes, apartments, residential complexes

export enum CustomerType {
  CRITICAL_INFRASTRUCTURE = 'CRITICAL_INFRASTRUCTURE',
  COMMERCIAL = 'COMMERCIAL',
  RESIDENTIAL = 'RESIDENTIAL'
}

export enum CustomerPriority {
  CRITICAL = 'CRITICAL',     // Hospitals, emergency services - never lose power
  HIGH = 'HIGH',             // Data centers, large businesses
  MEDIUM = 'MEDIUM',         // Small businesses, commercial
  LOW = 'LOW'                // Residential customers
}

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  priority: CustomerPriority;
  serviceAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  gridSegmentId: string;
  communicationPreferences: ('SMS' | 'EMAIL' | 'PHONE')[];
  contactInfo: {
    phone?: string;
    email?: string;
  };
  hasBackupPower: boolean;
  typicalLoadKW: number;
}

export interface CustomerImpact {
  customerId: string;
  incidentId: string;
  outageStartTime: Date;
  estimatedRestoreTime?: Date;
  actualRestoreTime?: Date;
  notificationsSent: number;
  lastNotificationTime?: Date;
}
