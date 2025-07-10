-- Task 3: Crew Dispatch Optimization
-- GitHub Copilot Learning Focus: Optimization algorithms and constraint-based queries

-- Objective:
-- Use Copilot to implement crew assignment logic with multiple business constraints and geographic calculations.

-- Instructions:
-- Build the optimization system step by step:

-- TODO: Calculate optimal crew assignments for all active incidents
-- Constraints (provide these to Copilot):
-- 1. Crew specialization must match incident requirements:
--    - EQUIPMENT_FAILURE requires LINE_WORKER or SUBSTATION_TECH
--    - WEATHER/VEGETATION requires TREE_REMOVAL or LINE_WORKER  
--    - VEHICLE_ACCIDENT requires EMERGENCY_RESPONSE
-- 2. No crew can work more than 16 hours total (8 regular + 8 overtime)
-- 3. Travel time calculated using the distance function from Task 1
-- 4. Prefer crews with EXPERT/SUPERVISOR skill level for CRITICAL incidents

-- Step 1: Calculate travel times and specialization matches
-- Copilot prompt: "Create CTE crew_incident_compatibility with travel times and skill matches"
WITH crew_incident_compatibility AS (
    SELECT 
        fc.crew_id,
        fc.crew_name,
        fc.specialization,
        fc.skill_level,
        oi.incident_id,
        oi.severity_level,
        oi.outage_cause,
        -- Let Copilot use the distance function
        calculate_distance_km(
            fc.current_latitude, fc.current_longitude,
            oi.geographic_lat, oi.geographic_lng
        ) as travel_distance_km,
        -- Let Copilot calculate travel time (assume 60 km/h average speed)
        -- Let Copilot determine specialization compatibility
        CASE 
            WHEN oi.outage_cause = 'EQUIPMENT_FAILURE' AND fc.specialization IN ('LINE_WORKER', 'SUBSTATION_TECH') THEN 1
            -- Let Copilot complete the compatibility logic
        END as specialization_match
    FROM available_crews_detailed fc
    CROSS JOIN active_incidents_with_impact oi
),

-- Step 2: Rank crew options for each incident
-- Copilot prompt: "Rank crews by: 1) specialization match, 2) skill level, 3) travel time"
crew_rankings AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY incident_id 
            ORDER BY 
                specialization_match DESC,
                CASE skill_level 
                    WHEN 'SUPERVISOR' THEN 4
                    WHEN 'EXPERT' THEN 3
                    WHEN 'SENIOR' THEN 2
                    ELSE 1
                END DESC,
                travel_distance_km ASC
        ) as crew_rank
    FROM crew_incident_compatibility
    WHERE specialization_match = 1
),

-- Step 3: Prevent double-assignment of crews
-- Copilot prompt: "Assign each crew to only their highest-priority incident"
optimal_assignments AS (
    -- Let Copilot implement assignment logic preventing conflicts
)

SELECT 
    incident_id,
    crew_id,
    crew_name,
    specialization,
    travel_distance_km,
    estimated_arrival_time,
    assignment_priority_reason
FROM optimal_assignments
ORDER BY incident_id;

-- TODO: Generate crew dispatch report with ETAs and workload
-- Business context: Operations center needs real-time dispatch status
-- Include: crew assignments, estimated arrival times, remaining capacity
-- Calculate: total workload hours, overtime implications, backup crew availability
-- Copilot prompt: "Create dispatch summary with crew utilization and ETAs"
