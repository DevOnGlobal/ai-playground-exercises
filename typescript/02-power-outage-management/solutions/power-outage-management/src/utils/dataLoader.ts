// TODO: Create data loading utilities to connect business logic with sample data
// This helper class loads JSON data and provides it to services for decision making
// Provides current system state including active incidents, available crews, and customer data

import { OutageIncident, OutageState } from '../types/outage';
import { FieldCrew, CrewAssignment, CrewSpecialization, CrewStatus } from '../types/crew';
import { Customer, CustomerImpact, CustomerType, CustomerPriority } from '../types/customer';
import { InfrastructureMap, Substation, Transformer, PowerLine } from '../types/infrastructure';

// For simplicity, we'll use hardcoded data here. In a real application,
// these would be loaded from JSON files or a database.
import infrastructureMapData from '../../data/infrastructure-map.json';
import crewRosterData from '../../data/crew-roster.json';
import customerDatabaseData from '../../data/customer-database.json';
// import outageHistoryData from '../../data/outage-history.json'; // Assuming this file might be empty initially

export class OutageDataLoader {
  // Load infrastructure and equipment data
  public static loadInfrastructureMap(): InfrastructureMap {
    // TODO: Load and parse infrastructure-map.json
    // Contains substations, power lines, and equipment locations
    return infrastructureMapData as InfrastructureMap;
  }

  // Load available crews and their current status
  public static loadCrewRoster(): FieldCrew[] {
    // TODO: Load and parse crew-roster.json
    // Contains crew specializations, locations, and availability
    // Ensure Date objects are correctly parsed if coming from JSON string
    return (crewRosterData as any).crews.map((crew: any) => ({
      ...crew,
      currentLocation: {
        ...crew.currentLocation,
        lastUpdate: new Date(crew.currentLocation.lastUpdate)
      },
      shiftEndTime: new Date(crew.shiftEndTime)
    })) as FieldCrew[];
  }

  // Load customer database with priorities and contact info
  public static loadCustomerDatabase(): Customer[] {
    // TODO: Load and parse customer-database.json
    // Contains customer types, priorities, and communication preferences
    return (customerDatabaseData as any).customers as Customer[];
  }

  // Load active incidents and outage history
  public static loadOutageHistory(): OutageIncident[] {
    // TODO: Load and parse outage-history.json
    // Contains recent incidents for pattern analysis and learning
    // For now, return an empty array or mock data if the file is empty/not yet created
    // return outageHistoryData as OutageIncident[];
    return []; // Placeholder
  }

  // Get current system state for decision making
  public static getCurrentOutageState(): OutageState {
    // TODO: Combine all data sources into current operational state
    // Calculate totals and metrics for dashboard display
    const activeIncidents: OutageIncident[] = this.loadOutageHistory().filter(inc => inc.status !== 'RESOLVED');
    const resolvedIncidents: OutageIncident[] = this.loadOutageHistory().filter(inc => inc.status === 'RESOLVED');

    let totalCustomersWithoutPower = 0;
    activeIncidents.forEach(incident => {
      totalCustomersWithoutPower += incident.estimatedCustomersAffected || 0;
    });

    let totalRestorationTimeMs = 0;
    let resolvedCount = 0;
    resolvedIncidents.forEach(incident => {
      if (incident.actualRestorationTime && incident.detectedAt) {
        totalRestorationTimeMs += (incident.actualRestorationTime.getTime() - incident.detectedAt.getTime());
        resolvedCount++;
      }
    });
    const averageRestorationTimeHours = resolvedCount > 0 ?
      (totalRestorationTimeMs / resolvedCount) / (1000 * 60 * 60) : 0;

    return {
      activeIncidents: activeIncidents,
      resolvedIncidents: resolvedIncidents,
      totalCustomersWithoutPower: totalCustomersWithoutPower,
      averageRestorationTimeHours: averageRestorationTimeHours
    };
  }

  // Find customers affected by specific equipment failures
  public static getCustomersAffectedByEquipment(equipmentIds: string[]): Customer[] {
    // TODO: Cross-reference equipment failures with customer service points
    // Return list of customers who will lose power when equipment fails
    const customers = this.loadCustomerDatabase();
    const infrastructure = this.loadInfrastructureMap();
    const affectedCustomers: Set<Customer> = new Set();

    equipmentIds.forEach(eqId => {
      // Check if the equipment is a transformer
      const transformer = infrastructure.transformers.find(t => t.id === eqId);
      if (transformer) {
        customers.forEach(customer => {
          if (customer.gridSegmentId === transformer.id) {
            affectedCustomers.add(customer);
          }
        });
      }

      // Check if the equipment is a power line
      const powerLine = infrastructure.power_lines.find(pl => pl.id === eqId);
      if (powerLine) {
        // This is a simplification. In a real system, you'd trace the power flow.
        // For now, assume customers connected to downstream transformers of this line are affected.
        infrastructure.transformers.forEach(t => {
          if (t.substation_id === powerLine.to_equipment || infrastructure.power_lines.some(pl2 => pl2.id === powerLine.to_equipment && pl2.to_equipment === t.id)) {
            customers.forEach(customer => {
              if (customer.gridSegmentId === t.id) {
                affectedCustomers.add(customer);
              }
            });
          }
        });
      }

      // Check if the equipment is a substation
      const substation = infrastructure.substations.find(s => s.id === eqId);
      if (substation) {
        // If a substation is out, all its downstream equipment and customers are affected
        substation.downstream_equipment.forEach(downstreamEqId => {
          const downstreamTransformer = infrastructure.transformers.find(t => t.id === downstreamEqId);
          if (downstreamTransformer) {
            customers.forEach(customer => {
              if (customer.gridSegmentId === downstreamTransformer.id) {
                affectedCustomers.add(customer);
              }
            });
          }
          const downstreamPowerLine = infrastructure.power_lines.find(pl => pl.id === downstreamEqId);
          if (downstreamPowerLine) {
            // Recursively find customers affected by this power line
            this.getCustomersAffectedByEquipment([downstreamPowerLine.id]).forEach(c => affectedCustomers.add(c));
          }
        });
      }
    });

    return Array.from(affectedCustomers);
  }

  // Get crews available for specific specialization
  public static getAvailableCrewsBySpecialization(specialization: CrewSpecialization): FieldCrew[] {
    // TODO: Filter crew roster by specialization and availability
    // Return crews that can be assigned to new incidents
    const crews = this.loadCrewRoster();
    return crews.filter(crew =>
      crew.specialization === specialization && crew.status === CrewStatus.AVAILABLE
    );
  }
}
