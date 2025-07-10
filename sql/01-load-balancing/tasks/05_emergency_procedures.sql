-- TODO: Convert emergency procedures into specific SQL queries with Copilot

-- Emergency 1: Transformer failure affecting critical infrastructure
-- Incident: GRID_DT01 transformer explosion, 1,200 customers affected including Metro General Hospital
-- Response procedure:
--   1. Identify all affected customers and prioritize critical infrastructure
--   2. Find alternative power sources with immediate capacity
--   3. Calculate emergency power transfer routes and capacity requirements
--   4. Generate restoration timeline with customer priority sequence

-- Step 1: Affected customer assessment
-- Guide Copilot: "Find all customers in failed segment with priority classification"
SELECT 
    c.customer_id,
    c.name,
    c.customer_type,
    c.priority_score,
    gs.name as affected_segment,
    -- Calculate total customers affected by type
    -- Identify critical infrastructure requiring immediate backup
FROM customers c
WHERE -- Segment failure condition

-- Step 2: Emergency power backup identification  
-- Guide Copilot: "Find power sources with immediate available capacity for emergency response"
SELECT
    ps.source_id,
    ps.name,
    ps.source_type,
    ps.available_capacity_mw,
    ps.reliability_score,
    -- Calculate emergency response time (immediate availability vs preparation time)
    -- Prioritize sources that can respond within 15 minutes
FROM available_power_sources ps
WHERE -- Emergency response criteria

-- Step 3: Alternative connection routing
-- Guide Copilot: "Calculate emergency power transfer routes to restore critical customers"
WITH emergency_routes AS (
    SELECT 
        sc.from_segment,
        sc.to_segment,
        sc.max_transfer_mw,
        sc.power_loss_pct,
        -- Calculate if route can handle emergency load transfer
        -- Consider power loss in emergency capacity calculations
    FROM segment_connections sc
    WHERE -- Routes that can serve affected area
),

restoration_sequence AS (
    -- Guide Copilot: "Create customer restoration sequence by priority"
    SELECT 
        customer_type,
        COUNT(*) as customer_count,
        SUM(priority_score) as total_priority,
        -- Calculate restoration time estimates by priority group
        -- Critical customers: 0-30 minutes, Commercial: 30-120 minutes, Residential: 2-8 hours
)

SELECT 
    -- Final emergency response plan with timeline and priorities
FROM restoration_sequence 
ORDER BY total_priority DESC;

-- Emergency 2: Multiple segment cascade failure prevention
-- Incident: High demand day with GRID_IS03 at 94% capacity threatening cascade failure
-- Response procedure: 
--   1. Calculate load reduction needed to prevent failure
--   2. Identify non-critical loads that can be temporarily reduced  
--   3. Find segments with capacity to accept transferred load
--   4. Implement controlled load shedding to prevent cascade

-- Cascade failure prevention query
-- Guide Copilot: "Calculate load shedding requirements to prevent cascade failure"
SELECT 
    gs.segment_id,
    gs.name,
    cgs.current_load_mw,
    gs.max_capacity_mw,
    cgs.utilization_pct,
    -- Calculate load reduction needed to reach safe level (80%)
    -- Identify customers for temporary load reduction (start with non-critical)
    -- Calculate impact on customer groups
FROM current_grid_status cgs
JOIN grid_segments gs ON cgs.segment_id = gs.segment_id
WHERE cgs.utilization_pct > 90.0 -- Critical threshold for cascade risk