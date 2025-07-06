# Effective Prompting Examples for Power Outage Management Exercise

This document provides examples of effective prompts you can use with GitHub Copilot to complete the tasks in the Power Outage Management exercise. The key is to be specific, provide context, and break down complex problems into smaller, manageable steps.

---

## General Tips for Prompting

1.  **Be Specific**: Instead of "write a function", say "write a TypeScript function `calculateDistanceKm` that uses the Haversine formula to calculate the distance between two lat/lng points in kilometers."
2.  **Provide Context**: Include relevant interfaces, enums, or class structures in your comments or above your cursor.
3.  **Define Business Rules**: Clearly state any business logic, thresholds, or formulas directly in your comments. Copilot is excellent at translating these into code.
4.  **Break Down Tasks**: For complex methods, outline the steps in comments. Copilot can often generate code for each step sequentially.
5.  **Iterate and Refine**: If Copilot's initial suggestion isn't perfect, don't just delete it. Add more comments, modify the existing code slightly, or accept parts and then refine.

---

## Task 1: Outage Detection and Classification

### Example 1: Generating `createIncidentFromSmartMeterData` Method Structure

**Goal**: Get Copilot to generate the basic structure of the method, including parameters and a return type, based on the `// TODO` comment.

```typescript
// src/services/outageDetection.ts

// ... (existing imports and class definition)

export class OutageDetectionService {
  // ... (constructor and other properties)

  /**
   * Smart meter outage detection from communication failures.
   * When multiple meters in same area stop reporting, indicates equipment failure.
   * Cross-reference with infrastructure map to identify likely cause.
   * Hospital and emergency service outages trigger immediate CRITICAL classification.
   * @param meterAlerts An array of objects, each representing a smart meter alert.
   *                    Each object should have at least `meterId`, `latitude`, `longitude`.
   */
  // TODO: Implement logic to create an OutageIncident from smart meter data.
  // Scenario: 150 smart meters in downtown area stop reporting simultaneously
  // Cross-reference meter locations with infrastructure map
  // Determine likely equipment failure (transformer vs power line)
  // Calculate estimated customers affected based on infrastructure capacity
  // Return OutageIncident with initial classification
  createIncidentFromSmartMeterData(meterAlerts: any[]): OutageIncident {
    // Copilot will likely suggest the method signature and some initial variables.
    // You can then add more specific comments for each step.
  }
}
```

### Example 2: Implementing Severity Classification Logic

**Goal**: Translate business rules into `if/else if` statements for severity.

```typescript
// src/services/outageDetection.ts

// ... (inside classifyIncidentSeverity method)

    // Business Rules: < 100 customers = MINOR, 100-1000 = MODERATE, 1000-10000 = MAJOR, >10000 = CRITICAL
    let severity: OutageSeverity;
    const affectedCustomersCount = incident.estimatedCustomersAffected;

    if (affectedCustomersCount < 100) {
      severity = OutageSeverity.MINOR;
    }
    // Copilot will likely suggest the next `else if` block.
    // Continue adding comments for the remaining rules.
    else if (affectedCustomersCount >= 100 && affectedCustomersCount < 1000) {
      severity = OutageSeverity.MODERATE;
    }
    // ... and so on
```

---

## Task 2: Crew Dispatch Optimization

### Example 3: Prompting for Haversine Formula

**Goal**: Get Copilot to write the `calculateDistanceKm` helper function.

```typescript
// src/services/crewDispatch.ts

// ... (inside CrewDispatchService class)

  // Helper for distance calculation
  // TODO: Implement Haversine formula for great circle distance
  // Convert latitude/longitude differences to radians
  // Apply standard Haversine calculation
  // Return distance in kilometers for travel time estimation
  private calculateDistanceKm(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
    // Copilot should suggest the Haversine implementation here.
  }
```

### Example 4: Scoring Crews Based on Specialization

**Goal**: Implement the scoring logic for crew specialization.

```typescript
// src/services/crewDispatch.ts

// ... (inside findOptimalCrewForIncident method)

      let matchScore = 0;
      let justification = '';

      // 1. Specialization Match
      // Score crews based on specialization match (exact = 100%, related = 75%, other = 50%)
      // Assume requiredSpecialization is already determined.
      if (crew.specialization === requiredSpecialization) {
        matchScore += 100;
        justification += `Exact specialization match (${crew.specialization}). `;
      } else if (this.isRelatedSpecialization(crew.specialization, requiredSpecialization)) { // Assuming isRelatedSpecialization helper exists
        matchScore += 75;
        justification += `Related specialization match (${crew.specialization}). `;
      } else {
        matchScore += 50;
        justification += `General specialization match (${crew.specialization}). `;
      }
      // Copilot can help complete the `else if` and `else` blocks.
```

---

## Task 3: Restoration Planning with Dependencies

### Example 5: Sorting Incidents by Priority

**Goal**: Sort incidents based on multiple criteria.

```typescript
// src/services/restorationPlanner.ts

// ... (inside createRestorationPlan method)

    // 2. Sort incidents by priority (highest first)
    // Also consider estimated customers affected (more customers = higher priority)
    const sortedIncidents = [...incidents].sort((a, b) => {
      // Higher priority score first
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      // Then, more customers first
      return b.estimatedCustomersAffected - a.estimatedCustomersAffected;
    });
    // Copilot can help complete the sorting logic.
```

### Example 6: Implementing Cascading Outages Logic

**Goal**: Recursively identify downstream affected equipment.

```typescript
// src/services/restorationPlanner.ts

// ... (inside handleCascadingOutages method)

    const affectedIncidents: OutageIncident[] = [primaryIncident];
    const visitedEquipment: Set<string> = new Set(primaryIncident.equipmentIds);

    // Recursively find all downstream affected equipment and create/identify incidents
    const findDownstream = (equipmentIds: string[]) => {
      equipmentIds.forEach(eqId => {
        // Find transformers connected to this equipment
        // Copilot: help me find downstream transformers and add them to visitedEquipment
        const downstreamTransformers = this.infrastructureMap.transformers.filter(t =>
          t.substation_id === eqId || this.infrastructureMap.power_lines.some(pl => pl.id === eqId && pl.to_equipment === t.id)
        );
        downstreamTransformers.forEach(t => {
          if (!visitedEquipment.has(t.id)) {
            visitedEquipment.add(t.id);
            // Copilot: create a dummy incident for this transformer and add to affectedIncidents
            // ... (code for creating incident)
            findDownstream([t.id]); // Continue searching downstream
          }
        });
        // Copilot: now do the same for power lines
        // ... (code for finding downstream power lines)
      });
    };
    findDownstream(primaryIncident.equipmentIds);
```

---

## Task 4: Customer Communication System

### Example 7: Generating Personalized Messages

**Goal**: Create message templates based on customer type.

```typescript
// src/services/communicationService.ts

// ... (inside generatePersonalizedMessage method)

    const eta = incident.estimatedRestorationTime ?
      incident.estimatedRestorationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
      'an unknown time';
    const cause = incident.cause.replace(/_/g, ' ').toLowerCase();
    const location = customer.serviceAddress; // Simplified location

    const templates = {
      initial_outage: {
        // Critical Infrastructure: "PRIORITY ALERT: Power outage at [location]. Estimated restoration: [time]. Crew dispatched. Emergency backup recommended."
        CRITICAL_INFRASTRUCTURE: `PRIORITY ALERT: Power outage at ${location}. Estimated restoration: ${eta}. Crew dispatched. Emergency backup recommended. Incident ID: ${incident.id}.`,
        // Commercial: "Power outage affecting your business at [address]. Cause: [cause]. Estimated restoration: [time]. Updates every 2 hours."
        COMMERCIAL: `Power outage affecting your business at ${location}. Cause: ${cause}. Estimated restoration: ${eta}. Updates every 2 hours. Incident ID: ${incident.id}.`,
        // Residential: "Power outage in your area. We're working to restore service by [time]. Cause: [cause]. Check mobile app for updates."
        RESIDENTIAL: `Power outage in your area. We're working to restore service by ${eta}. Cause: ${cause}. Check mobile app for updates. Incident ID: ${incident.id}.`
      },
      // TODO: Add more message types like 'update', 'restored', etc.
    };
    // Copilot can help complete the template definitions.
```

### Example 8: Simulating Message Delivery

**Goal**: Implement realistic success rates and delays for different channels.

```typescript
// src/services/communicationService.ts

// ... (inside simulateMessageDelivery method)

      let successRate: number;
      let deliveryTimeMs: number;

      switch (channel) {
        case 'SMS':
          successRate = 0.95;
          deliveryTimeMs = 30 * 1000; // 30 seconds
          break;
        case 'EMAIL':
          successRate = 0.98;
          deliveryTimeMs = 2 * 60 * 1000; // 2 minutes
          break;
        case 'PHONE':
          successRate = 0.85;
          deliveryTimeMs = 5 * 60 * 1000; // 5 minutes
          break;
        default:
          successRate = 0;
          deliveryTimeMs = 0;
          attempt.failureReason = 'Unsupported channel';
          break;
      }
      // Copilot can help complete the switch statement and the `await new Promise` for delay.
```

---

## Task 5: Emergency Response Coordination

### Example 9: Activating Emergency Response

**Goal**: Implement escalation logic based on business rules.

```typescript
// src/services/restorationPlanner.ts

// ... (inside activateEmergencyResponse method)

    let responseMessage = `Emergency response protocols activated for Incident ${incident.id}. `;
    let escalate = false;

    // Business Rule: Incidents affecting >20,000 customers trigger emergency protocols
    if (incident.estimatedCustomersAffected > 20000) {
      escalate = true;
      responseMessage += `Over 20,000 customers affected. `;
    }

    // Business Rule: Any incident affecting >2 hospitals requires emergency management coordination
    // Assuming getCustomersAffectedByIncident is available and returns Customer objects
    const affectedCriticalCustomers = this.getCustomersAffectedByIncident(incident).filter(c => c.type === CustomerType.CRITICAL_INFRASTRUCTURE);
    if (affectedCriticalCustomers.length >= 2) { // Changed from >2 to >=2 for clarity
      escalate = true;
      responseMessage += `Affecting ${affectedCriticalCustomers.length} critical infrastructure sites (e.g., hospitals). `;
    }

    if (escalate) {
      responseMessage += "Escalating to emergency management center. Coordinating with police and fire departments. Activating mutual aid agreements.";
      // Copilot can help complete the actions for escalation.
    } else {
      responseMessage = `Incident ${incident.id} does not meet criteria for full emergency response activation at this time.`;
    }
    return responseMessage;
```

### Example 10: Implementing Load Shedding

**Goal**: Prioritize customers for load shedding based on type and backup power.

```typescript
// src/services/restorationPlanner.ts

// ... (inside implementLoadShedding method)

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

    // Copilot can help complete the iteration and shedding logic.
```
