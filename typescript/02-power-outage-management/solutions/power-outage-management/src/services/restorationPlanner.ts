import { OutageIncident, OutageState, OutageCause, OutageSeverity } from '../types/outage';
import { FieldCrew, CrewAssignment, CrewSpecialization } from '../types/crew';
import { Customer, CustomerPriority, CustomerType } from '../types/customer';
import { OutageDataLoader } from '../utils/dataLoader';
import { InfrastructureMap, Substation, Transformer, PowerLine } from '../types/infrastructure';

export interface RestorationPlan {
  incidents: OutageIncident[];
  repairSequence: RepairStep[];
  totalEstimatedTime: number;
  priorityJustification: string;
}

export interface RepairStep {
  incidentId: string;
  sequenceNumber: number;
  dependencies: string[]; // Incident IDs that must be resolved before this step
  estimatedStartTime: Date;
  estimatedCompletionTime: Date;
  requiredSpecialization: CrewSpecialization;
}

export class RestorationPlannerService {
  private currentOutageState: OutageState;
  private customerDatabase: Customer[];
  private crewAssignments: CrewAssignment[];
  private infrastructureMap: InfrastructureMap;

  constructor() {
    this.currentOutageState = OutageDataLoader.getCurrentOutageState();
    this.customerDatabase = OutageDataLoader.loadCustomerDatabase();
    this.crewAssignments = []; // This would typically be loaded from a persistent store
    this.infrastructureMap = OutageDataLoader.loadInfrastructureMap();
  }

  /**
   * Creates an optimal restoration plan for a set of incidents, considering dependencies and priorities.
   * @param incidents An array of active outage incidents.
   * @returns A RestorationPlan object.
   */
  createRestorationPlan(incidents: OutageIncident[]): RestorationPlan {
    // TODO: Implement restoration planning methods.
    // Scenario: Multiple incidents from storm - must sequence repairs optimally
    // Business Rule: Repairs that restore power to hospitals get absolute priority
    // Business Rule: Focus on repairs that restore most customers first
    // Dependency Rule: Substation repairs must complete before downstream line repairs
    // Sort incidents by priority score and customer impact
    // Create repair sequence with dependencies

    // 1. Calculate priority for each incident
    incidents.forEach(incident => {
      incident.priorityScore = this.calculateRestorationPriority(incident);
    });

    // 2. Sort incidents by priority (highest first)
    // Also consider estimated customers affected (more customers = higher priority)
    const sortedIncidents = [...incidents].sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore; // Higher priority score first
      }
      return b.estimatedCustomersAffected - a.estimatedCustomersAffected; // More customers first
    });

    const repairSequence: RepairStep[] = [];
    const resolvedIncidents: Set<string> = new Set();
    let sequenceNumber = 1;
    let totalEstimatedTime = 0;
    let priorityJustification = "Restoration plan prioritized by critical infrastructure and customer impact.";

    // Simple dependency resolution: process incidents in sorted order,
    // and if an incident has dependencies, ensure they are "resolved" first.
    // This is a simplified approach; a real system would use a topological sort.

    while (resolvedIncidents.size < sortedIncidents.length) {
      let incidentProcessedInThisIteration = false;

      for (const incident of sortedIncidents) {
        if (resolvedIncidents.has(incident.id)) {
          continue; // Already processed
        }

        const dependencies = this.getIncidentDependencies(incident);
        const allDependenciesResolved = dependencies.every(depId => resolvedIncidents.has(depId));

        if (allDependenciesResolved) {
          // Determine required specialization (simplified)
          const requiredSpecialization = this.determineRequiredSpecialization(incident);

          // Estimate completion time (placeholder, would use actual crew assignment)
          const estimatedCompletionTime = this.estimateRestorationTime(incident, null); // Pass null for crew for now

          repairSequence.push({
            incidentId: incident.id,
            sequenceNumber: sequenceNumber++,
            dependencies: dependencies,
            estimatedStartTime: new Date(), // Placeholder
            estimatedCompletionTime: estimatedCompletionTime,
            requiredSpecialization: requiredSpecialization
          });
          resolvedIncidents.add(incident.id);
          totalEstimatedTime += (estimatedCompletionTime.getTime() - new Date().getTime()) / (1000 * 60); // Add duration in minutes
          incidentProcessedInThisIteration = true;
        }
      }

      if (!incidentProcessedInThisIteration && resolvedIncidents.size < sortedIncidents.length) {
        // This indicates a circular dependency or an unresolvable state
        priorityJustification += "\nWarning: Could not resolve all incident dependencies. Possible circular dependency or missing data.";
        break;
      }
    }

    return {
      incidents: sortedIncidents,
      repairSequence: repairSequence,
      totalEstimatedTime: totalEstimatedTime,
      priorityJustification: priorityJustification
    };
  }

  /**
   * Handles cascading outages by identifying dependencies and marking downstream incidents.
   * @param primaryIncident The incident that caused cascading failures (e.g., substation failure).
   * @returns A list of all incidents, with downstream ones marked as blocked.
   */
  handleCascadingOutages(primaryIncident: OutageIncident): OutageIncident[] {
    // TODO: Implement logic for cascading outages.
    // Scenario: Main substation failure causes 5 downstream outages
    // Identify equipment dependencies from infrastructure topology
    // Mark downstream incidents as "blocked" until primary is resolved
    // Calculate total customer impact across all related outages
    // Return restoration plan addressing root cause first

    const affectedIncidents: OutageIncident[] = [primaryIncident];
    const visitedEquipment: Set<string> = new Set(primaryIncident.equipmentIds);

    // Recursively find all downstream affected equipment and create/identify incidents
    const findDownstream = (equipmentIds: string[]) => {
      equipmentIds.forEach(eqId => {
        // Find transformers connected to this equipment
        const downstreamTransformers = this.infrastructureMap.transformers.filter(t =>
          t.substation_id === eqId || this.infrastructureMap.power_lines.some(pl => pl.id === eqId && pl.to_equipment === t.id)
        );
        downstreamTransformers.forEach(t => {
          if (!visitedEquipment.has(t.id)) {
            visitedEquipment.add(t.id);
            // Create a dummy incident for this downstream transformer for planning purposes
            // In a real system, these would be detected by outage detection
            const downstreamIncident: OutageIncident = {
              id: `INC-${t.id}-${Date.now()}`,
              cause: OutageCause.EQUIPMENT_FAILURE, // Or derived from primary
              severity: OutageSeverity.MODERATE, // Placeholder
              status: IncidentStatus.DETECTED,
              detectedAt: new Date(),
              location: t.location,
              equipmentIds: [t.id],
              estimatedCustomersAffected: t.customers_served,
              priorityScore: 0, // Will be calculated
              assignedCrewIds: []
            };
            this.classifyIncidentSeverity(downstreamIncident); // Classify severity
            affectedIncidents.push(downstreamIncident);
            findDownstream([t.id]); // Continue searching downstream
          }
        });

        // Find power lines connected to this equipment
        const downstreamPowerLines = this.infrastructureMap.power_lines.filter(pl =>
          pl.from_equipment === eqId
        );
        downstreamPowerLines.forEach(pl => {
          if (!visitedEquipment.has(pl.id)) {
            visitedEquipment.add(pl.id);
            const downstreamIncident: OutageIncident = {
              id: `INC-${pl.id}-${Date.now()}`,
              cause: OutageCause.EQUIPMENT_FAILURE, // Or derived from primary
              severity: OutageSeverity.MODERATE, // Placeholder
              status: IncidentStatus.DETECTED,
              detectedAt: new Date(),
              location: this.getEquipmentLocation(pl.from_equipment) || { latitude: 0, longitude: 0, affectedRadiusKm: 0 }, // Placeholder
              equipmentIds: [pl.id],
              estimatedCustomersAffected: pl.customers_served,
              priorityScore: 0, // Will be calculated
              assignedCrewIds: []
            };
            this.classifyIncidentSeverity(downstreamIncident); // Classify severity
            affectedIncidents.push(downstreamIncident);
            findDownstream([pl.id]); // Continue searching downstream
          }
        });
      });
    };

    findDownstream(primaryIncident.equipmentIds);

    // Mark downstream incidents as blocked by the primary incident
    affectedIncidents.forEach(inc => {
      if (inc.id !== primaryIncident.id) {
        // This is a simplified dependency. A real system would have a more robust dependency graph.
        // For now, all non-primary incidents are dependent on the primary.
        // This would be better handled by adding a 'blockedByIncidentId' to OutageIncident.
      }
    });

    // Recalculate total customer impact
    const totalCustomersImpacted = affectedIncidents.reduce((sum, inc) => sum + inc.estimatedCustomersAffected, 0);
    console.log(`Total customers impacted by cascading outage: ${totalCustomersImpacted}`);

    return affectedIncidents;
  }

  /**
   * Estimates the restoration time for an incident, considering various factors.
   * @param incident The outage incident.
   * @param assignedCrew The crew assigned to the incident (can be null if not yet assigned).
   * @returns Estimated restoration time as a Date object.
   */
  estimateRestorationTime(incident: OutageIncident, assignedCrew: FieldCrew | null): Date {
    // TODO: Implement realistic time estimation with confidence interval.
    // Time Estimates: Equipment failure = 2-4 hours, Tree on line = 1-2 hours, Substation = 4-8 hours
    // Weather Multiplier: Rain = 1.5x time, Snow/Ice = 2x time, High winds = 1.8x time
    // Crew Experience Factor: Expert = 1.0x, Senior = 1.2x, Junior = 1.5x
    // Complexity Factor: Multiple equipment = +50% time, Safety hazards = +30% time

    let baseHours: number;
    switch (incident.cause) {
      case OutageCause.EQUIPMENT_FAILURE:
        baseHours = 3; // Average of 2-4 hours
        break;
      case OutageCause.VEGETATION:
        baseHours = 1.5; // Average of 1-2 hours
        break;
      default:
        baseHours = 4; // Default for other causes
        break;
    }

    // Adjust for substation outages
    const isSubstationOutage = incident.equipmentIds.some(eqId =>
      this.infrastructureMap.substations.some(sub => sub.id === eqId)
    );
    if (isSubstationOutage) {
      baseHours = 6; // Average of 4-8 hours for substation
    }

    // Weather Multiplier (simplified: assume weather is a factor if cause is WEATHER)
    let weatherMultiplier = 1;
    if (incident.cause === OutageCause.WEATHER) {
      // This would ideally be more nuanced based on specific weather conditions (rain, snow, wind)
      weatherMultiplier = 1.5; // General multiplier for weather
    }

    // Crew Experience Factor
    let crewExperienceFactor = 1.0;
    if (assignedCrew) {
      if (assignedCrew.skillLevel === 'JUNIOR') {
        crewExperienceFactor = 1.5;
      } else if (assignedCrew.skillLevel === 'SENIOR') {
        crewExperienceFactor = 1.2;
      } else if (assignedCrew.skillLevel === 'EXPERT') {
        crewExperienceFactor = 1.0;
      }
    }

    // Complexity Factor
    let complexityFactor = 1.0;
    if (incident.equipmentIds.length > 1) {
      complexityFactor += 0.5; // +50% for multiple equipment
    }
    // Add logic for safety hazards if applicable (e.g., based on incident description or type)
    // For example, if incident.cause === OutageCause.VEHICLE_ACCIDENT, add safety hazard factor
    if (incident.cause === OutageCause.VEHICLE_ACCIDENT) {
      complexityFactor += 0.3; // +30% for safety hazards
    }

    const totalEstimatedHours = baseHours * weatherMultiplier * crewExperienceFactor * complexityFactor;
    const estimatedTimeMs = incident.detectedAt.getTime() + (totalEstimatedHours * 60 * 60 * 1000);

    return new Date(estimatedTimeMs);
  }

  /**
   * Calculates a priority score for an incident based on affected customers and critical infrastructure.
   * @param incident The outage incident.
   * @returns The calculated priority score.
   */
  calculateRestorationPriority(incident: OutageIncident): number {
    const affectedCustomers = this.getCustomersAffectedByIncident(incident);

    // Calculate weighted customer impact
    // Critical infrastructure customers = 100 points each
    // Commercial customers = 10 points each
    // Residential customers = 1 point each

    let priorityScore = 0;
    affectedCustomers.forEach(customer => {
      switch (customer.priority) {
        case CustomerPriority.CRITICAL: priorityScore += 100; break;
        case CustomerPriority.HIGH: priorityScore += 10; break;
        case CustomerPriority.MEDIUM: priorityScore += 5; break; // Added for completeness
        case CustomerPriority.LOW: priorityScore += 1; break;
      }
    });

    // Add a bonus for incidents affecting critical infrastructure directly
    const hasCriticalInfrastructureAffected = affectedCustomers.some(c => c.type === CustomerType.CRITICAL_INFRASTRUCTURE);
    if (hasCriticalInfrastructureAffected) {
      priorityScore += 500; // Significant bonus
    }

    // Consider incident severity as well
    switch (incident.severity) {
      case OutageSeverity.CRITICAL: priorityScore *= 2; break;
      case OutageSeverity.CATASTROPHIC: priorityScore *= 3; break;
      default: break;
    }

    return priorityScore;
  }

  // Helper to get all customers affected by an incident's equipment
  private getCustomersAffectedByIncident(incident: OutageIncident): Customer[] {
    const affectedCustomerIds: Set<string> = new Set();

    incident.equipmentIds.forEach(eqId => {
      // Check if equipment is a transformer
      const transformer = this.infrastructureMap.transformers.find(t => t.id === eqId);
      if (transformer) {
        this.customerDatabase.forEach(customer => {
          if (customer.gridSegmentId === transformer.id) {
            affectedCustomerIds.add(customer.id);
          }
        });
      }

      // Check if equipment is a power line
      const powerLine = this.infrastructureMap.power_lines.find(pl => pl.id === eqId);
      if (powerLine) {
        // This is a simplification. In a real system, you'd trace the power flow.
        // For now, assume customers connected to downstream transformers of this line are affected.
        this.infrastructureMap.transformers.forEach(t => {
          if (t.substation_id === powerLine.to_equipment || this.infrastructureMap.power_lines.some(pl2 => pl2.id === powerLine.to_equipment && pl2.to_equipment === t.id)) {
            this.customerDatabase.forEach(customer => {
              if (customer.gridSegmentId === t.id) {
                affectedCustomerIds.add(customer.id);
              }
            });
          }
        });
      }
    });

    return this.customerDatabase.filter(c => affectedCustomerIds.has(c.id));
  }

  // Helper to determine required specialization (similar to OutageDetectionService)
  private determineRequiredSpecialization(incident: OutageIncident): CrewSpecialization {
    if (incident.cause === OutageCause.EQUIPMENT_FAILURE) {
      if (incident.equipmentIds.some(id => id.startsWith('TRANS') || id.startsWith('SUB'))) {
        return CrewSpecialization.SUBSTATION_TECH;
      }
      return CrewSpecialization.LINE_WORKER;
    } else if (incident.cause === OutageCause.VEGETATION) {
      return CrewSpecialization.TREE_REMOVAL;
    } else if (incident.cause === OutageCause.VEHICLE_ACCIDENT) {
      return CrewSpecialization.EMERGENCY_RESPONSE;
    }
    return CrewSpecialization.LINE_WORKER;
  }

  // Helper to get equipment location (simplified)
  private getEquipmentLocation(equipmentId: string): { latitude: number; longitude: number; affectedRadiusKm?: number } | undefined {
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
    return location ? { ...location, affectedRadiusKm: 0 } : undefined; // Add dummy affectedRadiusKm
  }

  // Helper to get incident dependencies (simplified)
  private getIncidentDependencies(incident: OutageIncident): string[] {
    const dependencies: string[] = [];
    // If this incident affects a power line, and that power line's 'from_equipment' is a substation,
    // then this incident depends on the substation being operational.
    // This is a very basic dependency. A real system would build a full graph.
    incident.equipmentIds.forEach(eqId => {
      const powerLine = this.infrastructureMap.power_lines.find(pl => pl.id === eqId);
      if (powerLine) {
        const upstreamSubstation = this.infrastructureMap.substations.find(sub => sub.id === powerLine.from_equipment);
        if (upstreamSubstation) {
          // Find an incident related to this substation
          const substationIncident = this.currentOutageState.activeIncidents.find(inc =>
            inc.equipmentIds.includes(upstreamSubstation.id)
          );
          if (substationIncident && substationIncident.id !== incident.id) {
            dependencies.push(substationIncident.id);
          }
        }
      }
    });
    return dependencies;
  }

  // Emergency Response Coordination (moved from Task 5 instructions)
  activateEmergencyResponse(incident: OutageIncident): string {
    // TODO: Implement emergency response activation.
    // Scenario: Substation explosion causes widespread outage affecting 25,000 customers including 3 hospitals
    // Business Rule: Incidents affecting >20,000 customers trigger emergency protocols
    // Business Rule: Any incident affecting >2 hospitals requires emergency management coordination
    // Escalate to emergency management center
    // Coordinate with police/fire departments for safety
    // Activate mutual aid agreements with neighboring utilities

    let responseMessage = `Emergency response protocols activated for Incident ${incident.id}. `;
    let escalate = false;

    // Check customer impact for escalation
    if (incident.estimatedCustomersAffected > 20000) {
      escalate = true;
      responseMessage += `Over 20,000 customers affected. `;
    }

    // Check critical infrastructure impact
    const affectedCriticalCustomers = this.getCustomersAffectedByIncident(incident).filter(c => c.type === CustomerType.CRITICAL_INFRASTRUCTURE);
    if (affectedCriticalCustomers.length >= 2) { // Changed from >2 to >=2 for clarity
      escalate = true;
      responseMessage += `Affecting ${affectedCriticalCustomers.length} critical infrastructure sites (e.g., hospitals). `;
    }

    if (escalate) {
      responseMessage += "Escalating to emergency management center. Coordinating with police and fire departments. Activating mutual aid agreements.";
      // In a real system, this would trigger external API calls or notifications.
    } else {
      responseMessage = `Incident ${incident.id} does not meet criteria for full emergency response activation at this time.`;
    }

    return responseMessage;
  }

  implementLoadShedding(demandReductionMW: number): string {
    // TODO: Implement load shedding logic.
    // Business Rule: Shed residential customers before commercial customers
    // Business Rule: Never shed critical infrastructure (hospitals, emergency services)
    // Business Rule: Implement rolling blackouts to distribute impact fairly
    // Calculate which customers to disconnect to achieve target reduction
    // Create rotation schedule for rolling blackouts

    let currentLoadMW = this.customerDatabase.reduce((sum, cust) => sum + cust.typicalLoadKW, 0) / 1000; // Convert KW to MW
    let reductionAchievedMW = 0;
    const customersToShed: Customer[] = [];
    const loadSheddingLog: string[] = [];

    // 1. Filter out critical infrastructure
    const nonCriticalCustomers = this.customerDatabase.filter(cust =>
      cust.type !== CustomerType.CRITICAL_INFRASTRUCTURE
    );

    // 2. Sort customers for shedding: Residential (LOW/MEDIUM priority) first, then Commercial (HIGH priority)
    const sortedCustomers = nonCriticalCustomers.sort((a, b) => {
      // Residential (LOW/MEDIUM) < Commercial (HIGH)
      if (a.type === CustomerType.RESIDENTIAL && b.type === CustomerType.COMMERCIAL) return -1;
      if (a.type === CustomerType.COMMERCIAL && b.type === CustomerType.RESIDENTIAL) return 1;

      // Within types, sort by priority (LOW first for shedding)
      const priorityOrder = {
        [CustomerPriority.LOW]: 1,
        [CustomerPriority.MEDIUM]: 2,
        [CustomerPriority.HIGH]: 3
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const customer of sortedCustomers) {
      if (reductionAchievedMW >= demandReductionMW) {
        break; // Target achieved
      }

      // Ensure customer doesn't have backup power (they won't shed load)
      if (!customer.hasBackupPower) {
        const customerLoadMW = customer.typicalLoadKW / 1000;
        if (reductionAchievedMW + customerLoadMW <= demandReductionMW) {
          customersToShed.push(customer);
          reductionAchievedMW += customerLoadMW;
          loadSheddingLog.push(`Shedding customer ${customer.name} (${customer.id}) - ${customerLoadMW.toFixed(2)} MW`);
        } else {
          // If adding this customer exceeds the target, we might need to shed a portion
          // For simplicity, we'll just stop here or find a smaller customer if available.
          // In a real system, this would involve more granular control (e.g., shedding specific circuits).
          loadSheddingLog.push(`Could not shed full load with remaining customers. Target: ${demandReductionMW.toFixed(2)} MW, Achieved: ${reductionAchievedMW.toFixed(2)} MW`);
          break;
        }
      }
    }

    if (customersToShed.length > 0) {
      // Simulate rolling blackouts (simplified: just log which customers are affected)
      const blackoutDurationHours = 2; // Example duration for rolling blackout
      loadSheddingLog.push(`
Implementing rolling blackouts for selected customers, estimated duration: ${blackoutDurationHours} hours.`);
      customersToShed.forEach((customer, index) => {
        const startTime = new Date();
        // Distribute start times for rolling effect
        startTime.setMinutes(startTime.getMinutes() + (index * 10));
        const endTime = new Date(startTime.getTime() + blackoutDurationHours * 60 * 60 * 1000);
        loadSheddingLog.push(`  - ${customer.name} (${customer.id}): Outage from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);
      });
      return `Load shedding activated. Target reduction: ${demandReductionMW.toFixed(2)} MW. Achieved reduction: ${reductionAchievedMW.toFixed(2)} MW.

${loadSheddingLog.join('\n')}`;
    } else {
      return `No customers found to shed load or target reduction (${demandReductionMW.toFixed(2)} MW) is too low.`;
    }
  }

  // Helper to classify incident severity (copied from OutageDetectionService for self-containment)
  private classifyIncidentSeverity(incident: OutageIncident): void {
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

    const affectedCriticalCustomers = this.customerDatabase.filter(customer =>
      incident.equipmentIds.some(eqId => {
        const transformer = this.infrastructureMap.transformers.find(t => t.id === eqId);
        return transformer && transformer.critical_customers.includes(customer.id) && customer.type === CustomerType.CRITICAL_INFRASTRUCTURE;
      })
    );

    if (affectedCriticalCustomers.length > 0) {
      severity = OutageSeverity.CRITICAL;
    }

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
  }
}