# Effective Prompting Examples for SQL with GitHub Copilot

This document provides examples of effective prompts to guide GitHub Copilot when working with SQL, especially in the context of the Power Outage Management database.

## 1. Descriptive Comments for Schema Generation

**Goal**: Generate a `CREATE TABLE` statement for a new table.

**Bad Prompt**:
```sql
-- Create a table for incidents
```

**Good Prompt**:
```sql
-- TODO: Create a table named 'outage_incidents' to store details about power outage events.
-- It should include columns for: incident_id (VARCHAR, PRIMARY KEY), created_time (DATETIME, NOT NULL),
-- outage_cause (ENUM: EQUIPMENT_FAILURE, WEATHER, VEHICLE_ACCIDENT, VEGETATION, PLANNED_MAINTENANCE),
-- severity_level (ENUM: MINOR, MODERATE, MAJOR, CRITICAL), estimated_customers_affected (INT),
-- actual_customers_affected (INT), estimated_restoration_time (DATETIME),
-- actual_restoration_time (DATETIME), incident_status (ENUM: DETECTED, ASSIGNED, IN_PROGRESS, RESOLVED, CANCELLED),
-- geographic_lat (DECIMAL), geographic_lng (DECIMAL), and affected_radius_km (DECIMAL).
```
**Why it's good**: Provides all necessary details including data types, constraints, and enum values, allowing Copilot to generate a precise `CREATE TABLE` statement.

## 2. Guiding Complex Queries with Business Rules

**Goal**: Calculate a comprehensive impact score for incidents.

**Bad Prompt**:
```sql
-- Calculate incident score
```

**Good Prompt**:
```sql
-- TODO: Calculate comprehensive impact score for each active incident
-- Business Rules:
-- Priority scoring: CRITICAL customers = 100 points, HIGH = 50 points, STANDARD = 10 points
-- Type multipliers: CRITICAL_INFRASTRUCTURE = 5x, INDUSTRIAL = 3x, COMMERCIAL = 2x, RESIDENTIAL = 1x
-- Duration penalty: +20 points per hour since incident creation
-- Severity multipliers: CRITICAL = 4x, MAJOR = 3x, MODERATE = 2x, MINOR = 1x

-- Copilot prompt: "Create query incident_priority_scores using the scoring rules above"
-- Expected output: incident_id, total_score, customer_breakdown, duration_hours
```
**Why it's good**: Clearly defines the business logic, scoring rules, and expected output, enabling Copilot to construct a complex query with multiple calculations and aggregations.

## 3. Iterative Refinement for Stored Procedures

**Goal**: Create a stored procedure for SAIDI/SAIFI reliability metrics.

**Initial Prompt**:
```sql
DELIMITER //
CREATE PROCEDURE calculate_reliability_metrics(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    -- TODO: Implement SAIDI/SAIFI calculations
END //
DELIMITER ;
```

**Refined Prompt (after initial generation)**:
```sql
DELIMITER //
CREATE PROCEDURE calculate_reliability_metrics(
    IN start_date DATE,
    IN end_date DATE,
    IN exclude_planned BOOLEAN DEFAULT TRUE,
    IN geographic_region VARCHAR(50) DEFAULT NULL
)
BEGIN
    DECLARE total_customers INT DEFAULT 0;
    DECLARE total_interruptions INT DEFAULT 0;
    DECLARE total_duration_hours DECIMAL(10,2) DEFAULT 0;
    
    -- Guide with: "Calculate total customers served in the date range"
    -- Guide with: "Sum interruption durations excluding planned maintenance"
    -- Guide with: "Return results as a result set with SAIDI and SAIFI values"
    
END //
DELIMITER ;
```
**Why it's good**: Start with the procedure signature, then add `DECLARE` statements and specific instructions for each calculation step. This allows Copilot to build the procedure incrementally and accurately.

## 4. Using Domain-Specific Terminology

**Goal**: Optimize crew dispatch.

**Bad Prompt**:
```sql
-- Find best crew for incident
```

**Good Prompt**:
```sql
-- TODO: Calculate optimal crew assignments for all active incidents
-- Constraints:
-- 1. Crew specialization must match incident requirements:
--    - EQUIPMENT_FAILURE requires LINE_WORKER or SUBSTATION_TECH
--    - WEATHER/VEGETATION requires TREE_REMOVAL or LINE_WORKER  
--    - VEHICLE_ACCIDENT requires EMERGENCY_RESPONSE
-- 2. No crew can work more than 16 hours total (8 regular + 8 overtime)
-- 3. Travel time calculated using the distance function from Task 1
-- 4. Prefer crews with EXPERT/SUPERVISOR skill level for CRITICAL incidents

-- Copilot prompt: "Create CTE crew_incident_compatibility with travel times and skill matches"
```
**Why it's good**: Incorporates terms like "specialization," "overtime," "travel time," and "skill level" which are directly relevant to the domain, helping Copilot understand the context and generate more accurate SQL.

## 5. Specifying Output Format and Columns

**Goal**: Generate a crew dispatch report.

**Bad Prompt**:
```sql
-- Generate report
```

**Good Prompt**:
```sql
-- TODO: Generate crew dispatch report with ETAs and workload
-- Business context: Operations center needs real-time dispatch status
-- Include: crew assignments, estimated arrival times, remaining capacity
-- Calculate: total workload hours, overtime implications, backup crew availability
-- Copilot prompt: "Create dispatch summary with crew utilization and ETAs"
```
**Why it's good**: Explicitly lists the columns and calculations required in the final output, guiding Copilot to select and process the correct data.
