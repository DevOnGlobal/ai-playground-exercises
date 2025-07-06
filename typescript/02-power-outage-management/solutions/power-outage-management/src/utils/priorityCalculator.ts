// TODO: Implement priority calculation utilities.
// This file can contain helper functions for calculating priority scores for incidents,
// customers, and crew assignments based on various business rules.

import { OutageIncident, OutageSeverity } from '../types/outage';
import { Customer, CustomerPriority, CustomerType } from '../types/customer';
import { InfrastructureMap, Transformer } from '../types/infrastructure';

export class PriorityCalculator {
  /**
   * Calculates a priority score for an outage incident.
   * Higher score means higher priority.
   * @param incident The outage incident.
   * @param customers The full list of customers in the system.
   * @param infrastructure The infrastructure map.
   * @returns The calculated priority score.
   */
  public static calculateIncidentPriority(incident: OutageIncident, customers: Customer[], infrastructure: InfrastructureMap): number {
    let score = 0;

    // Factor 1: Number of estimated customers affected
    score += incident.estimatedCustomersAffected * 0.1; // 0.1 point per customer

    // Factor 2: Impact on critical infrastructure
    const affectedCriticalCustomers = customers.filter(customer =>
      customer.type === CustomerType.CRITICAL_INFRASTRUCTURE &&
      incident.equipmentIds.some(eqId => {
        const transformer = infrastructure.transformers.find(t => t.id === eqId);
        return transformer && transformer.critical_customers.includes(customer.id);
      })
    );
    score += affectedCriticalCustomers.length * 500; // High bonus for critical infrastructure

    // Factor 3: Incident Severity
    switch (incident.severity) {
      case OutageSeverity.MINOR: score += 10; break;
      case OutageSeverity.MODERATE: score += 50; break;
      case OutageSeverity.MAJOR: score += 200; break;
      case OutageSeverity.CRITICAL: score += 1000; break;
      case OutageSeverity.CATASTROPHIC: score += 5000; break;
    }

    // Factor 4: Duration (if estimated restoration time is available)
    if (incident.estimatedRestorationTime && incident.detectedAt) {
      const durationMinutes = (incident.estimatedRestorationTime.getTime() - incident.detectedAt.getTime()) / (1000 * 60);
      score += durationMinutes * 0.5; // Longer duration, higher priority
    }

    return score;
  }

  /**
   * Calculates a priority score for a customer.
   * @param customer The customer object.
   * @returns The calculated customer priority score.
   */
  public static calculateCustomerPriorityScore(customer: Customer): number {
    switch (customer.priority) {
      case CustomerPriority.CRITICAL: return 1000;
      case CustomerPriority.HIGH: return 500;
      case CustomerPriority.MEDIUM: return 100;
      case CustomerPriority.LOW: return 10;
      default: return 0;
    }
  }
}
