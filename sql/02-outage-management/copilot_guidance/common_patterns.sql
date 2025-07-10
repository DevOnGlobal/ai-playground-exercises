-- Common SQL Patterns for Power Outage Management with GitHub Copilot

-- This file provides reusable SQL code patterns and best practices for working with the
-- Power Outage Management database, designed to be easily extended and guided by GitHub Copilot.

-- 1. Pattern: Selecting Active Incidents
-- Use this pattern to filter for incidents that are currently ongoing.
SELECT
    incident_id,
    created_time,
    outage_cause,
    severity_level,
    incident_status
FROM
    outage_incidents
WHERE
    incident_status IN ('DETECTED', 'ASSIGNED', 'IN_PROGRESS');

-- Copilot Prompt: "Select all active incidents with their cause and severity"

-- 2. Pattern: Joining Incidents with Affected Customers (Conceptual)
-- This is a conceptual pattern. Actual implementation will depend on geographic calculations
-- or explicit links (e.g., via grid_equipment and customer_service_points).
-- Use this when you need to relate incidents to the customers they impact.
SELECT
    oi.incident_id,
    c.customer_id,
    c.name AS customer_name,
    c.priority_level
FROM
    outage_incidents oi
JOIN
    customer_service_points csp ON calculate_distance_km(oi.geographic_lat, oi.geographic_lng, (SELECT latitude FROM customers WHERE customer_id = csp.customer_id), (SELECT longitude FROM customers WHERE customer_id = csp.customer_id)) <= oi.affected_radius_km
JOIN
    customers c ON csp.customer_id = c.customer_id
WHERE
    oi.incident_status IN ('DETECTED', 'ASSIGNED', 'IN_PROGRESS');

-- Copilot Prompt: "Join active incidents with affected customers and their priority levels"

-- 3. Pattern: Calculating Time Differences
-- Useful for determining incident duration, crew response times, or remaining shift hours.
-- Use TIMESTAMPDIFF for precise time calculations.

-- Example: Incident duration in hours
SELECT
    incident_id,
    TIMESTAMPDIFF(HOUR, created_time, actual_restoration_time) AS duration_hours
FROM
    outage_incidents
WHERE
    actual_restoration_time IS NOT NULL;

-- Copilot Prompt: "Calculate the duration of incidents in hours"

-- 4. Pattern: Conditional Logic with CASE Statements
-- Apply different logic or values based on specific conditions, such as severity levels or customer types.

-- Example: Assigning a numerical value based on severity
SELECT
    incident_id,
    severity_level,
    CASE severity_level
        WHEN 'CRITICAL' THEN 4
        WHEN 'MAJOR' THEN 3
        WHEN 'MODERATE' THEN 2
        WHEN 'MINOR' THEN 1
        ELSE 0
    END AS severity_score
FROM
    outage_incidents;

-- Copilot Prompt: "Assign a numerical score to incidents based on their severity level"

-- 5. Pattern: Aggregating Data with GROUP BY
-- Summarize data across groups, such as counting incidents by cause or summing affected customers by region.

-- Example: Count incidents by outage cause
SELECT
    outage_cause,
    COUNT(incident_id) AS total_incidents
FROM
    outage_incidents
GROUP BY
    outage_cause;

-- Copilot Prompt: "Count the total number of incidents for each outage cause"

-- 6. Pattern: Using Common Table Expressions (CTEs)
-- Break down complex queries into logical, readable steps. This greatly helps Copilot understand
-- the query's intent and generate accurate subsequent parts.

-- Example: First CTE for active incidents, second for joining with crews
WITH ActiveIncidents AS (
    SELECT
        incident_id,
        geographic_lat,
        geographic_lng
    FROM
        outage_incidents
    WHERE
        incident_status IN ('DETECTED', 'ASSIGNED', 'IN_PROGRESS')
),
CrewsNearIncidents AS (
    SELECT
        ai.incident_id,
        fc.crew_id,
        calculate_distance_km(ai.geographic_lat, ai.geographic_lng, fc.current_latitude, fc.current_longitude) AS distance_km
    FROM
        ActiveIncidents ai
    JOIN
        field_crews fc ON fc.status = 'AVAILABLE'
)
SELECT * FROM CrewsNearIncidents WHERE distance_km < 50;

-- Copilot Prompt: "Create a CTE for active incidents, then another CTE to find available crews near these incidents"

-- 7. Pattern: Stored Procedure Structure
-- Basic structure for creating a stored procedure with input parameters and local variables.
DELIMITER //
CREATE PROCEDURE my_procedure_name(
    IN param1 VARCHAR(50),
    OUT result_count INT
)
BEGIN
    DECLARE var1 INT DEFAULT 0;
    -- Your logic here
    SELECT COUNT(*) INTO var1 FROM customers WHERE customer_type = param1;
    SET result_count = var1;
END //
DELIMITER ;

-- Copilot Prompt: "Create a stored procedure that counts customers of a given type"
