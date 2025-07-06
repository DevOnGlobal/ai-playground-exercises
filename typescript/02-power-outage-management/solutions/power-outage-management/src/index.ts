// Main entry point for the Power Outage Management System.
// This file can be used to orchestrate the services and demonstrate their functionality.

import { OutageDetectionService } from './services/outageDetection';
import { CrewDispatchService } from './services/crewDispatch';
import { RestorationPlannerService } from './services/restorationPlanner';
import { CustomerCommunicationService } from './services/communicationService';
import { OutageDataLoader } from './utils/dataLoader';
import { OutageIncident, OutageCause, IncidentStatus, OutageSeverity } from './types/outage';
import { FieldCrew } from './types/crew';
import { Customer } from './types/customer';
import { ReportGenerator } from './utils/reportGenerator';

async function main() {
  console.log("Starting Power Outage Management System Simulation...");

  // Initialize services
  const outageDetectionService = new OutageDetectionService();
  const crewDispatchService = new CrewDispatchService();
  const restorationPlannerService = new RestorationPlannerService();
  const communicationService = new CustomerCommunicationService();

  // --- Scenario 1: Simulate a new outage detection ---
  console.log("\n--- Scenario 1: New Outage Detection ---");
  // Example smart meter data (simplified)
  const meterAlerts = [
    { meterId: 'METER_001', latitude: 40.7614, longitude: -73.9776 },
    { meterId: 'METER_002', latitude: 40.7615, longitude: -73.9775 },
    { meterId: 'METER_003', latitude: 40.7613, longitude: -73.9777 },
  ];
  const newOutageIncident = outageDetectionService.createIncidentFromSmartMeterData(meterAlerts);
  console.log("New Outage Incident Detected:", newOutageIncident);

  // --- Scenario 2: Classify and estimate restoration time ---
  console.log("\n--- Scenario 2: Classify Incident and Estimate Restoration ---");
  outageDetectionService.classifyIncidentSeverity(newOutageIncident);
  newOutageIncident.estimatedRestorationTime = outageDetectionService.estimateRestorationTime(newOutageIncident);
  console.log("Incident after classification and ETA:", newOutageIncident);

  // --- Scenario 3: Find optimal crew ---
  console.log("\n--- Scenario 3: Find Optimal Crew ---");
  const crewRecommendation = crewDispatchService.findOptimalCrewForIncident(newOutageIncident);
  if (crewRecommendation) {
    console.log("Recommended Crew:", crewRecommendation);
    // Assign the crew (simplified)
    newOutageIncident.assignedCrewIds.push(crewRecommendation.crewId);
    newOutageIncident.status = IncidentStatus.CREWS_ASSIGNED;
    console.log(`Crew ${crewRecommendation.crewId} assigned to incident ${newOutageIncident.id}.`);
  } else {
    console.log("No suitable crew found for the incident.");
  }

  // --- Scenario 4: Schedule customer notifications ---
  console.log("\n--- Scenario 4: Schedule Customer Notifications ---");
  communicationService.scheduleOutageNotifications(newOutageIncident);
  await communicationService.processNotificationQueue(); // Simulate sending

  // --- Scenario 5: Create a restoration plan (with a mock second incident for dependencies) ---
  console.log("\n--- Scenario 5: Create Restoration Plan ---");
  const mockIncident2: OutageIncident = {
    id: 'INC-MOCK-002',
    cause: OutageCause.EQUIPMENT_FAILURE,
    severity: OutageSeverity.MODERATE,
    status: IncidentStatus.DETECTED,
    detectedAt: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    location: { latitude: 40.7000, longitude: -74.0000, affectedRadiusKm: 0.8 },
    equipmentIds: ['TRANS_003'], // Assuming TRANS_003 exists and might depend on SUB_001
    estimatedCustomersAffected: 500,
    priorityScore: 0,
    assignedCrewIds: []
  };
  outageDetectionService.classifyIncidentSeverity(mockIncident2); // Classify severity
  mockIncident2.estimatedRestorationTime = outageDetectionService.estimateRestorationTime(mockIncident2);

  const incidentsForPlanning = [newOutageIncident, mockIncident2];
  const restorationPlan = restorationPlannerService.createRestorationPlan(incidentsForPlanning);
  console.log("Generated Restoration Plan:", JSON.stringify(restorationPlan, null, 2));

  // --- Scenario 6: Simulate cascading outage ---
  console.log("\n--- Scenario 6: Simulate Cascading Outage ---");
  // Let's assume newOutageIncident is a primary substation failure
  const cascadingIncidents = restorationPlannerService.handleCascadingOutages(newOutageIncident);
  console.log("Incidents after simulating cascading effects:", cascadingIncidents.map(inc => inc.id));

  // --- Scenario 7: Emergency Response Activation ---
  console.log("\n--- Scenario 7: Emergency Response Activation ---");
  // Create a high-impact incident to trigger emergency response
  const criticalIncident: OutageIncident = {
    id: 'INC-CRITICAL-001',
    cause: OutageCause.EQUIPMENT_FAILURE,
    severity: OutageSeverity.CRITICAL,
    status: IncidentStatus.DETECTED,
    detectedAt: new Date(),
    location: { latitude: 40.7589, longitude: -73.9851, affectedRadiusKm: 2.0 }, // Near Main Street Substation
    equipmentIds: ['SUB_001'], // Main Substation
    estimatedCustomersAffected: 25000, // High impact
    priorityScore: 0,
    assignedCrewIds: []
  };
  // Manually add critical customers to the mock incident for testing purposes
  // In a real scenario, this would be derived from dataLoader
  const customers = OutageDataLoader.loadCustomerDatabase();
  const hospital = customers.find(c => c.name === "Metropolitan Hospital");
  if (hospital) {
    // This is a hack for demonstration. In a real system, critical_customers would be linked to equipment.
    // For now, we'll just ensure the incident's impact is high enough.
    // The `activateEmergencyResponse` method checks for affected critical customers via `getCustomersAffectedByIncident`.
    // So, ensure the mock incident's equipment IDs are linked to critical customers in `infrastructure-map.json`.
    // SUB_001 -> TRANS_001 -> CUST_001 (Metropolitan Hospital)
    criticalIncident.equipmentIds.push('TRANS_001'); // Ensure transformer linked to hospital is affected
  }

  const emergencyResponseStatus = restorationPlannerService.activateEmergencyResponse(criticalIncident);
  console.log(emergencyResponseStatus);

  // --- Scenario 8: Implement Load Shedding ---
  console.log("\n--- Scenario 8: Implement Load Shedding ---");
  const demandToReduceMW = 5; // Example: need to reduce 5 MW of load
  const loadSheddingResult = restorationPlannerService.implementLoadShedding(demandToReduceMW);
  console.log(loadSheddingResult);

  // --- Scenario 9: Generate Reports ---
  console.log("\n--- Scenario 9: Generate Reports ---");
  const allIncidents: OutageIncident[] = [newOutageIncident, mockIncident2, criticalIncident];
  const resolvedIncidents: OutageIncident[] = allIncidents.filter(inc => inc.status === IncidentStatus.RESOLVED); // Assuming some are resolved

  const incidentSummary = ReportGenerator.generateIncidentSummary(
    newOutageIncident,
    OutageDataLoader.getCustomersAffectedByEquipment(newOutageIncident.equipmentIds),
    OutageDataLoader.loadCrewRoster().filter(crew => newOutageIncident.assignedCrewIds.includes(crew.id))
  );
  console.log("\n--- Incident Summary for New Outage Incident ---");
  console.log(incidentSummary);

  const reliabilityMetrics = ReportGenerator.calculateReliabilityMetrics(resolvedIncidents);
  console.log("\n--- Reliability Metrics ---");
  console.log(reliabilityMetrics);

  const lessonsLearnedReport = ReportGenerator.createLessonsLearnedReport(allIncidents);
  console.log("\n--- Lessons Learned Report ---");
  console.log(lessonsLearnedReport);

  console.log("\nPower Outage Management System Simulation Complete.");
}

main().catch(console.error);