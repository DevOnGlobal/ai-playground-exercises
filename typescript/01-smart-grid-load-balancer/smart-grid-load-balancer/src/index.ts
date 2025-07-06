// Main entry point for the smart grid load balancer application.

import { LoadBalancer } from './services/loadBalancer';
import { EmergencyResponseSystem } from './services/emergencyResponse';
import { AlertSystem } from './services/alertSystem';

// Create instances of the main services.
const loadBalancer = new LoadBalancer();
const emergencyResponse = new EmergencyResponseSystem();
const alertSystem = new AlertSystem();

// Get the current health of the grid.
const gridHealth = loadBalancer.checkGridHealth();

// Redistribute power if necessary.
if (gridHealth.overloadedSegments.length > 0) {
  const redistributionPlan = loadBalancer.redistributePower(gridHealth);
  console.log('Power Redistribution Plan:', redistributionPlan);
}

// Check for any alerts.
const alerts = alertSystem.monitorGridSegments();
if (alerts.length > 0) {
  console.log('Alerts:', alerts);
}

// Simulate an equipment failure.
const emergencyResponsePlan = emergencyResponse.handleEquipmentFailure('GRID_003');
console.log('Emergency Response Plan:', emergencyResponsePlan);
