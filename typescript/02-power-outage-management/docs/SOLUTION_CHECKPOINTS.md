# Power Outage Management (TypeScript) – Solution Checkpoints

This document provides validation steps and success criteria for each task in the TypeScript Power Outage Management exercise. Use these checkpoints to verify your progress and ensure your implementations are correct.

## General Verification Steps

- **Run the Application**: After each task, run the main entry point (e.g., `npm start` or `ts-node src/index.ts`). Check for errors or unexpected behavior.
- **Check Logging Output**: Review `console.log`, `console.warn`, and `console.error` for workflow, dispatch, and alert messages.
- **Review Data Changes**: Inspect any generated or modified data files (e.g., incident logs, crew assignments).

---

## Task 1: Outage Detection and Classification

**Objective**: Build outage incident management with clear data context.

**Guided Steps:**
1. **Parse Input Data**: Implement a function to read outage reports from a data source (e.g., JSON or CSV).
2. **IncidentManager Class**:
    - Create an `IncidentManager` class with a method `detectOutages()` that scans the input data for new incidents.
    - Implement `classifyIncident()` to assign a severity level (e.g., minor, major, critical) based on affected customers or area.
    - Store detected incidents in an internal list or map.
3. **Validation**:
    - Ensure the system skips or logs malformed records without crashing.
    - Add logging for each detected and classified incident.

**Verification Steps:**
- Run the script and check that incidents are detected and classified with correct severity.
- Test with missing fields or corrupted data to confirm graceful error handling.

---

## Task 2: Crew Dispatch Optimization

**Objective**: Implement intelligent crew assignment.

**Guided Steps:**
1. **CrewDispatcher Class**:
    - Implement a `CrewDispatcher` class with a method `assignCrewsToIncidents()`.
    - For each incident, select the nearest available crew using the Haversine formula for distance.
    - Factor in crew skills and current workload (e.g., max concurrent jobs).
2. **Assignment Logic**:
    - Prioritize critical incidents for immediate dispatch.
    - Ensure no crew is double-booked.
    - Log each assignment with crew ID, incident ID, and estimated arrival time.

**Verification Steps:**
- Run the script and verify that each incident is assigned to an appropriate crew.
- Change crew locations or workloads and observe assignment changes.

---

## Task 3: Restoration Planning with Dependencies

**Objective**: Build restoration sequencing with constraints.

**Guided Steps:**
1. **RestorationPlanner Class**:
    - Implement a `RestorationPlanner` class with a method `planRestorationSequence()`.
    - Model dependencies (e.g., some repairs must be completed before others can start).
    - Use topological sorting or similar to order tasks.
2. **Time Estimation**:
    - For each task, estimate restoration time based on crew skills, equipment, and incident severity.
    - Handle circular or missing dependencies by logging warnings and skipping invalid tasks.

**Verification Steps:**
- Run the script and print the planned restoration order.
- Add or modify dependencies to test the planner’s robustness.

---

## Task 4: Customer Communication System

**Objective**: Implement automated customer notifications.

**Guided Steps:**
1. **NotificationSystem Class**:
    - Implement a `NotificationSystem` class with a method `sendNotifications()`.
    - For each incident, generate a message including estimated restoration time and contact info.
    - Simulate message delivery (e.g., print to console or write to a log).
2. **Queue and Retry**:
    - Implement a queue for pending notifications.
    - If delivery fails (simulate with random errors), retry up to a set number of times and log failures.

**Verification Steps:**
- Run the script and check that all affected customers receive notifications.
- Simulate delivery failures and confirm retry logic works.

---

## Task 5: Emergency Response Coordination

**Objective**: Handle critical scenarios and escalation.

**Guided Steps:**
1. **EmergencyCoordinator Class**:
    - Implement an `EmergencyCoordinator` class with a method `escalateIncident()` for critical or widespread outages.
    - Integrate with other modules to trigger load shedding or request external assistance.
    - Log all emergency actions and generate a summary report.
2. **Reporting**:
    - At the end of a run, output a report listing all escalated incidents, actions taken, and current grid status.

**Verification Steps:**
- Trigger a critical incident and verify escalation and reporting.
- Review the summary report for completeness and accuracy.

---

By successfully completing these checkpoints, you will have built a robust Power Outage Management system in TypeScript and demonstrated strong AI collaboration skills with GitHub Copilot!
