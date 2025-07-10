-- Current operational state - use this instead of complex joins
CREATE VIEW current_grid_status AS
SELECT 
    gs.segment_id,
    gs.name,
    gs.max_capacity_mw,
    gs.safety_threshold_pct,
    latest.current_load_mw,
    ROUND((latest.current_load_mw / gs.max_capacity_mw) * 100, 2) as utilization_pct,
    latest.measurement_time as last_updated,
    CASE 
        WHEN (latest.current_load_mw / gs.max_capacity_mw) * 100 >= gs.safety_threshold_pct THEN 'CRITICAL'
        WHEN (latest.current_load_mw / gs.max_capacity_mw) * 100 >= (gs.safety_threshold_pct - 10) THEN 'WARNING'
        ELSE 'HEALTHY'
    END as status
FROM grid_segments gs
JOIN (
    SELECT segment_id, load_mw as current_load_mw, measurement_time,
           ROW_NUMBER() OVER (PARTITION BY segment_id ORDER BY measurement_time DESC) as rn
    FROM load_measurements 
    WHERE measurement_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
) latest ON gs.segment_id = latest.segment_id AND latest.rn = 1;

-- Available power sources - ready to use for optimization queries
CREATE VIEW available_power_sources AS
SELECT 
    source_id,
    name,
    source_type,
    max_capacity_mw,
    current_output_mw,
    (max_capacity_mw - current_output_mw) as available_capacity_mw,
    cost_per_mwh,
    reliability_score,
    CASE WHEN maintenance_until IS NULL OR maintenance_until < CURDATE() 
         THEN 'AVAILABLE' ELSE 'MAINTENANCE' END as availability_status
FROM power_sources
WHERE current_output_mw < max_capacity_mw;

-- Validation queries
SELECT * FROM current_grid_status LIMIT 5;
SELECT * FROM available_power_sources LIMIT 5;