-- TODO: Write precise business rules to guide Copilot alert generation

-- Alert Query 1: Capacity threshold violations
-- Business scenario: Segment GRID_DT01 is at 87% capacity (above 85% threshold)
-- Alert logic: current_load_mw / max_capacity_mw * 100 >= safety_threshold_pct
-- Required data: segment_id, name, current_load, capacity, utilization%, threshold%, minutes_over_threshold
-- Time calculation: minutes since first measurement above threshold
-- Action needed: Immediate load redistribution to prevent overload
SELECT 
    -- Guide Copilot: "Find segments exceeding safety thresholds with time since violation"

-- Alert Query 2: Power source failures and capacity shortfalls
-- Business scenario: Wind farm output dropped 30% in last hour, affecting supply
-- Alert logic: current_output_mw < (max_capacity_mw * 0.7) for normally reliable sources
-- Required data: source_id, name, current_output, expected_output, shortfall_mw, reliability_impact
-- Reliability threshold: Sources with reliability_score > 0.90 that drop below 70% output
-- Action needed: Activate backup power sources
SELECT
    -- Guide Copilot: "Detect power source performance degradation requiring backup activation"

-- Alert Query 3: Emergency customer impact assessment  
-- Business scenario: Segment maintenance will affect Metro General Hospital
-- Alert logic: segments in maintenance OR critical status that serve critical customers
-- Required data: segment_id, maintenance_status, critical_customer_count, customer_names, impact_score
-- Critical customer identification: customer_type = 'critical'
-- Action needed: Ensure backup power for critical infrastructure
SELECT
    -- Guide Copilot: "Identify maintenance or capacity issues affecting critical infrastructure"