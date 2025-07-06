import { OutageIncident, OutageSeverity, OutageCause, IncidentStatus } from '../types/outage';
import { OutageDataLoader } from '../utils/dataLoader';
import { Customer, CustomerPriority, CustomerType } from '../types/customer';
import { InfrastructureMap, Transformer, PowerLine, Substation } from '../types/infrastructure';

export class OutageDetectionService {
  private infrastructureMap: InfrastructureMap;
  private outageHistory: OutageIncident[];
  private customerDatabase: Customer[];

  constructor() {
    this.infrastructureMap = OutageDataLoader.loadInfrastructureMap();
    this.outageHistory = OutageDataLoader.loadOutageHistory();
    this.customerDatabase = OutageDataLoader.loadCustomerDatabase();
  }

  /**
   * Smart meter outage detection from communication failures.
   * When multiple meters in same area stop reporting, indicates equipment failure.
   * Cross-reference with infrastructure map to identify likely cause.
   * Hospital and emergency service outages trigger immediate CRITICAL classification.
   * @param meterAlerts An array of objects, each representing a smart meter alert.
   *                    Each object should have at least `meterId`, `latitude`, `longitude`.
   */
  createIncidentFromSmartMeterData(meterAlerts: any[]): OutageIncident {
    // TODO: Implement logic to create an OutageIncident from smart meter data.
    // Scenario: 150 smart meters in downtown area stop reporting simultaneously
    // Cross-reference meter locations with infrastructure map
    // Determine likely equipment failure (transformer vs power line)
    // Calculate estimated customers affected based on infrastructure capacity
    // Return OutageIncident with initial classification

    // For simplicity, let's assume a single incident for now.
    // In a real scenario, this would involve clustering meter alerts.
    const incidentId = `INC-${Date.now()}`;
    const detectedAt = new Date();
    const affectedRadiusKm = 0.5; // Example radius

    // Determine a central location from meter alerts
    const avgLat = meterAlerts.reduce((sum, m) => sum + m.latitude, 0) / meterAlerts.length;
    const avgLng = meterAlerts.reduce((sum, m) => sum + m.longitude, 0) / meterAlerts.length;

    // Identify affected equipment based on location (simplified)
    const affectedEquipmentIds: string[] = [];
    let estimatedCustomersAffected = 0;
    let likelyCause: OutageCause = OutageCause.EQUIPMENT_FAILURE;

    // Example: Find a transformer near the outage location
    const affectedTransformer = this.infrastructureMap.transformers.find(t =>
      this.calculateDistanceKm({ latitude: avgLat, longitude: avgLng }, t.location) < affectedRadiusKm
    );

    if (affectedTransformer) {
      affectedEquipmentIds.push(affectedTransformer.id);
      estimatedCustomersAffected = affectedTransformer.customers_served;
      // Check if any critical customers are served by this transformer
      const criticalCustomers = this.customerDatabase.filter(cust =>
        affectedTransformer.critical_customers.includes(cust.id) && cust.type === CustomerType.CRITICAL_INFRASTRUCTURE
      );
      if (criticalCustomers.length > 0) {
        // If critical infrastructure is affected, it's a critical incident
        return {
          id: incidentId,
          cause: likelyCause,
          severity: OutageSeverity.CRITICAL, // Automatically critical
          status: IncidentStatus.DETECTED,
          detectedAt: detectedAt,
          location: { latitude: avgLat, longitude: avgLng, affectedRadiusKm: affectedRadiusKm },
          equipmentIds: affectedEquipmentIds,
          estimatedCustomersAffected: estimatedCustomersAffected,
          priorityScore: 1000 // High priority for critical incidents
        };
      }
    } else {
      // If no specific transformer, assume a power line issue
      const affectedPowerLine = this.infrastructureMap.power_lines.find(pl =>
        this.calculateDistanceKm({ latitude: avgLat, longitude: avgLng }, pl.from_equipment) < affectedRadiusKm ||
        this.calculateDistanceKm({ latitude: avgLat, longitude: avgLng }, pl.to_equipment) < affectedRadiusKm
      );
      if (affectedPowerLine) {
        affectedEquipmentIds.push(affectedPowerLine.id);
        estimatedCustomersAffected = affectedPowerLine.customers_served;
      }
    }

    const newIncident: OutageIncident = {
      id: incidentId,
      cause: likelyCause,
      severity: OutageSeverity.MINOR, // Initial severity, will be classified later
      status: IncidentStatus.DETECTED,
      detectedAt: detectedAt,
      location: { latitude: avgLat, longitude: avgLng, affectedRadiusKm: affectedRadiusKm },
      equipmentIds: affectedEquipmentIds,
      estimatedCustomersAffected: estimatedCustomersAffected,
      priorityScore: 0 // Will be calculated by classifyIncidentSeverity
    };

    this.classifyIncidentSeverity(newIncident); // Classify severity after initial creation
    return newIncident;
  }

  classifyIncidentSeverity(incident: OutageIncident): void {
    // TODO: Implement logic to classify incident severity and calculate priorityScore.
    // Business Rules: < 100 customers = MINOR, 100-1000 = MODERATE, 1000-10000 = MAJOR, >10000 = CRITICAL
    // Critical Infrastructure Rule: Any incident affecting hospitals/fire stations automatically becomes CRITICAL
    // Weather Factor: During storms, increase severity by one level
    // Calculate priorityScore using formula: (customersAffected * priorityWeight) + durationMinutes

    let severity: OutageSeverity;
    const affectedCustomersCount = incident.estimatedCustomersAffected;

    if (affectedCustomersCount < 100) {
      severity = OutageSeverity.MINOR;
    } else if (affectedCustomersCount >= 100 && affectedCustomersCount < 1000) {
      severity = OutageSeverity.MODERATE;
    } else if (affectedCustomersCount >= 1000 && affectedCustomersCount < 10000) {
      severity = OutageSeverity.MAJOR;
    } else {
      severity = OutageSeverity.CRITICAL;
    }

    // Critical Infrastructure Rule
    const affectedCriticalCustomers = this.customerDatabase.filter(customer =>
      incident.equipmentIds.some(eqId => {
        const transformer = this.infrastructureMap.transformers.find(t => t.id === eqId);
        return transformer && transformer.critical_customers.includes(customer.id) && customer.type === CustomerType.CRITICAL_INFRASTRUCTURE;
      })
    );

    if (affectedCriticalCustomers.length > 0) {
      severity = OutageSeverity.CRITICAL;
    }

    // Weather Factor (simplified: assume a storm is ongoing if cause is WEATHER)
    if (incident.cause === OutageCause.WEATHER) {
      switch (severity) {
        case OutageSeverity.MINOR: severity = OutageSeverity.MODERATE; break;
        case OutageSeverity.MODERATE: severity = OutageSeverity.MAJOR; break;
        case OutageSeverity.MAJOR: severity = OutageSeverity.CRITICAL; break;
        case OutageSeverity.CRITICAL: severity = OutageSeverity.CATASTROPHIC; break;
        default: break;
      }
    }

    incident.severity = severity;

    // Calculate priorityScore
    let priorityWeight = 1;
    switch (severity) {
      case OutageSeverity.MINOR: priorityWeight = 1; break;
      case OutageSeverity.MODERATE: priorityWeight = 5; break;
      case OutageSeverity.MAJOR: priorityWeight = 10; break;
      case OutageSeverity.CRITICAL: priorityWeight = 50; break;
      case OutageSeverity.CATASTROPHIC: priorityWeight = 100; break;
    }

    // For durationMinutes, we'll use a placeholder or estimate if actual restoration time is not available
    const durationMinutes = incident.estimatedRestorationTime ?
      (incident.estimatedRestorationTime.getTime() - incident.detectedAt.getTime()) / (1000 * 60) :
      0; // Placeholder

    incident.priorityScore = (affectedCustomersCount * priorityWeight) + durationMinutes;
  }

  estimateRestorationTime(incident: OutageIncident): Date {
    // TODO: Implement logic to estimate restoration time based on cause and historical data.
    // Time Estimates: Equipment failure = 2-4 hours, Tree on line = 1-2 hours, Substation = 4-8 hours
    // Weather Multiplier: Rain = 1.5x time, Snow/Ice = 2x time, High winds = 1.8x time
    // Crew Experience Factor: Expert = 1.0x, Senior = 1.2x, Junior = 1.5x (This will be used in restorationPlanner)
    // Complexity Factor: Multiple equipment = +50% time, Safety hazards = +30% time (This will be used in restorationPlanner)

    let baseHours: number;
    switch (incident.cause) {
      case OutageCause.EQUIPMENT_FAILURE:
        baseHours = 3; // Average of 2-4 hours
        break;
      case OutageCause.VEGETATION: // Assuming "Tree on line" falls under vegetation
        baseHours = 1.5; // Average of 1-2 hours
        break;
      // For substation, we need to identify if the equipment is a substation
      case OutageCause.WEATHER: // Weather might cause various issues, use a general estimate
      case OutageCause.VEHICLE_ACCIDENT:
      case OutageCause.CYBER_ATTACK:
      case OutageCause.PLANNED_MAINTENANCE:
      default:
        baseHours = 4; // Default estimate
        break;
    }

    // Check if any affected equipment is a substation
    const isSubstationOutage = incident.equipmentIds.some(eqId =>
      this.infrastructureMap.substations.some(sub => sub.id === eqId)
    );
    if (isSubstationOutage) {
      baseHours = 6; // Average of 4-8 hours for substation
    }

    // Apply weather multiplier (simplified: if cause is weather, apply a general multiplier)
    let weatherMultiplier = 1;
    if (incident.cause === OutageCause.WEATHER) {
      // This would ideally be more nuanced based on specific weather conditions
      weatherMultiplier = 1.5; // General multiplier for weather
    }

    let estimatedTimeMs = incident.detectedAt.getTime() + (baseHours * weatherMultiplier * 60 * 60 * 1000);
    return new Date(estimatedTimeMs);
  }

  identifyAffectedEquipment(location: { latitude: number; longitude: number; affectedRadiusKm: number }): string[] {
    // TODO: Implement logic to identify affected equipment using infrastructure topology.
    // This is a simplified version. A real system would use spatial indexing and network analysis.
    const affectedEquipment: string[] = [];

    // Check transformers
    this.infrastructureMap.transformers.forEach(t => {
      if (this.calculateDistanceKm(location, t.location) < location.affectedRadiusKm) {
        affectedEquipment.push(t.id);
      }
    });

    // Check power lines (simplified: check if start/end points are within radius)
    this.infrastructureMap.power_lines.forEach(pl => {
      const fromLocation = this.getEquipmentLocation(pl.from_equipment);
      const toLocation = this.getEquipmentLocation(pl.to_equipment);

      if (fromLocation && this.calculateDistanceKm(location, fromLocation) < location.affectedRadiusKm) {
        affectedEquipment.push(pl.id);
      }
      if (toLocation && this.calculateDistanceKm(location, toLocation) < location.affectedRadiusKm) {
        affectedEquipment.push(pl.id);
      }
    });

    return Array.from(new Set(affectedEquipment)); // Return unique IDs
  }

  calculateCustomerImpact(incident: OutageIncident): { customerId: string; priority: CustomerPriority }[] {
    // TODO: Implement logic to calculate customer impact with priority weighting.
    const affectedCustomers: { customerId: string; priority: CustomerPriority }[] = [];

    // Find customers affected by the equipment in the incident
    const customersInvolved = this.customerDatabase.filter(customer =>
      incident.equipmentIds.some(eqId => {
        const transformer = this.infrastructureMap.transformers.find(t => t.id === eqId);
        const powerLine = this.infrastructureMap.power_lines.find(pl => pl.id === eqId);

        // If the customer's grid segment matches an affected transformer or power line
        return (transformer && customer.gridSegmentId === transformer.id) ||
               (powerLine && customer.gridSegmentId === powerLine.id);
      })
    );

    customersInvolved.forEach(customer => {
      affectedCustomers.push({
        customerId: customer.id,
        priority: customer.priority
      });
    });

    return affectedCustomers;
  }

  // Helper to get equipment location (simplified)
  private getEquipmentLocation(equipmentId: string): { latitude: number; longitude: number } | undefined {
    let location: { latitude: number; longitude: number } | undefined;

    const transformer = this.infrastructureMap.transformers.find(t => t.id === equipmentId);
    if (transformer) {
      location = transformer.location;
    } else {
      const substation = this.infrastructureMap.substations.find(s => s.id === equipmentId);
      if (substation) {
        location = substation.location;
      }
    }
    return location;
  }

  // Helper for distance calculation (Haversine formula - simplified for quick implementation)
  private calculateDistanceKm(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLon = this.deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
