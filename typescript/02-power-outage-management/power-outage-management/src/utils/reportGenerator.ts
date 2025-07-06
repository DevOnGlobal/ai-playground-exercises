// TODO: Implement report generation utilities.
// This file can contain functions to generate various reports for analysis,
// compliance, and continuous improvement.

import { OutageIncident, OutageState, IncidentStatus } from '../types/outage';
import { FieldCrew, CrewAssignment } from '../types/crew';
import { Customer, CustomerImpact } from '../types/customer';

export class ReportGenerator {
  /**
   * Generates a summary report for a given outage incident.
   * @param incident The outage incident to summarize.
   * @param affectedCustomers A list of customers affected by the incident.
   * @param assignedCrews A list of crews assigned to the incident.
   * @returns A formatted string summary of the incident.
   */
  public static generateIncidentSummary(incident: OutageIncident, affectedCustomers: Customer[], assignedCrews: FieldCrew[]): string {
    let summary = `--- Incident Summary: ${incident.id} ---\n`;
    summary += `Cause: ${incident.cause}\n`;
    summary += `Severity: ${incident.severity}\n`;
    summary += `Status: ${incident.status}\n`;
    summary += `Detected At: ${incident.detectedAt.toLocaleString()}\n`;
    summary += `Location: Lat ${incident.location.latitude.toFixed(4)}, Lng ${incident.location.longitude.toFixed(4)} (Radius: ${incident.location.affectedRadiusKm} km)\n`;
    summary += `Estimated Customers Affected: ${incident.estimatedCustomersAffected}\n`;
    if (incident.actualCustomersAffected !== undefined) {
      summary += `Actual Customers Affected: ${incident.actualCustomersAffected}\n`;
    }
    if (incident.estimatedRestorationTime) {
      summary += `Estimated Restoration: ${incident.estimatedRestorationTime.toLocaleString()}\n`;
    }
    if (incident.actualRestorationTime) {
      summary += `Actual Restoration: ${incident.actualRestorationTime.toLocaleString()}\n`;
    }
    summary += `Priority Score: ${incident.priorityScore.toFixed(2)}\n`;
    summary += `Assigned Crews: ${assignedCrews.map(c => c.name).join(', ') || 'None'}\n`;
    summary += `Affected Equipment IDs: ${incident.equipmentIds.join(', ')}\n`;

    summary += `\n--- Affected Customers (${affectedCustomers.length}) ---\n`;
    affectedCustomers.forEach(customer => {
      summary += `  - ${customer.name} (ID: ${customer.id}, Type: ${customer.type}, Priority: ${customer.priority})\n`;
    });

    return summary;
  }

  /**
   * Calculates reliability metrics based on a list of resolved incidents.
   * @param resolvedIncidents A list of incidents that have been resolved.
   * @returns An object containing key reliability metrics.
   */
  public static calculateReliabilityMetrics(resolvedIncidents: OutageIncident[]): {
    totalOutages: number;
    averageRestorationTimeHours: number;
    totalCustomersImpacted: number;
    saidi: number; // System Average Interruption Duration Index
    saifi: number; // System Average Interruption Frequency Index
  } {
    let totalRestorationTimeMs = 0;
    let totalCustomersImpacted = 0;
    let totalCustomerMinutesInterrupted = 0; // For SAIDI
    let totalCustomersServed = 100000; // Placeholder: total number of customers in the system for SAIFI/SAIDI calculation

    resolvedIncidents.forEach(incident => {
      if (incident.actualRestorationTime && incident.detectedAt && incident.actualCustomersAffected !== undefined) {
        const durationMs = incident.actualRestorationTime.getTime() - incident.detectedAt.getTime();
        totalRestorationTimeMs += durationMs;
        totalCustomersImpacted += incident.actualCustomersAffected;
        totalCustomerMinutesInterrupted += (durationMs / (1000 * 60)) * incident.actualCustomersAffected;
      }
    });

    const totalOutages = resolvedIncidents.length;
    const averageRestorationTimeHours = totalOutages > 0 ?
      (totalRestorationTimeMs / totalOutages) / (1000 * 60 * 60) : 0;

    // SAIDI: Sum of all customer interruption durations / Total number of customers served
    const saidi = totalCustomersServed > 0 ? totalCustomerMinutesInterrupted / totalCustomersServed : 0;

    // SAIFI: Total number of customer interruptions / Total number of customers served
    const saifi = totalCustomersServed > 0 ? totalCustomersImpacted / totalCustomersServed : 0;


    return {
      totalOutages: totalOutages,
      averageRestorationTimeHours: averageRestorationTimeHours,
      totalCustomersImpacted: totalCustomersImpacted,
      saidi: saidi,
      saifi: saifi
    };
  }

  /**
   * Generates a "Lessons Learned" report for continuous improvement.
   * @param incidents A list of incidents to analyze.
   * @returns A formatted string report.
   */
  public static createLessonsLearnedReport(incidents: OutageIncident[]): string {
    let report = `--- Lessons Learned Report (${new Date().toLocaleDateString()}) ---\n`;
    report += `Total Incidents Analyzed: ${incidents.length}\n\n`;

    const causeBreakdown: { [key: string]: number } = {};
    const severityBreakdown: { [key: string]: number } = {};
    let totalCriticalIncidents = 0;

    incidents.forEach(inc => {
      causeBreakdown[inc.cause] = (causeBreakdown[inc.cause] || 0) + 1;
      severityBreakdown[inc.severity] = (severityBreakdown[inc.severity] || 0) + 1;
      if (inc.severity === OutageSeverity.CRITICAL || inc.severity === OutageSeverity.CATASTROPHIC) {
        totalCriticalIncidents++;
      }
    });

    report += `Cause Breakdown:\n`;
    for (const cause in causeBreakdown) {
      report += `  - ${cause}: ${causeBreakdown[cause]} incidents\n`;
    }

    report += `\nSeverity Breakdown:\n`;
    for (const severity in severityBreakdown) {
      report += `  - ${severity}: ${severityBreakdown[severity]} incidents\n`;
    }

    report += `\nTotal Critical/Catastrophic Incidents: ${totalCriticalIncidents}\n`;

    // Identify common issues or areas for improvement
    if (causeBreakdown.WEATHER && causeBreakdown.WEATHER > incidents.length * 0.3) {
      report += `\nRecommendation: Invest in weather-resilient infrastructure and vegetation management due to high incidence of weather-related outages.\n`;
    }
    if (totalCriticalIncidents > 0) {
      report += `Recommendation: Review emergency response protocols for critical incidents to identify areas for faster resolution.\n`;
    }

    report += `\n--- End of Report ---`;
    return report;
  }
}
