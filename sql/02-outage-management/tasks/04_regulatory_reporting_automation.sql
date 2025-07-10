-- Task 4: Regulatory Reporting Automation
-- GitHub Copilot Learning Focus: Stored procedures with complex calculations and business logic

-- Objective:
-- Create stored procedures that implement industry-standard utility metrics using GitHub Copilot's code generation capabilities.

-- Instructions:
-- Implement automated reporting procedures:

-- TODO: Create procedure for SAIDI/SAIFI reliability metrics
-- Business context: System Average Interruption Duration Index (SAIDI) and 
-- System Average Interruption Frequency Index (SAIFI) are required by utility regulators
-- SAIDI = Sum(Customer Interruption Durations) / Total Customers Served
-- SAIFI = Total Customer Interruptions / Total Customers Served
-- Exclude incidents marked as 'PLANNED_MAINTENANCE' and major weather events

-- Copilot prompt: "Create stored procedure calculate_reliability_metrics with date range parameters"
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
    
    -- Let Copilot implement the SAIDI/SAIFI calculations
    -- Guide with: "Calculate total customers served in the date range"
    -- Guide with: "Sum interruption durations excluding planned maintenance"
    -- Guide with: "Return results as a result set with SAIDI and SAIFI values"
    
END //
DELIMITER ;

-- TODO: Create procedure for incident performance analysis
-- Business context: Track crew response times and restoration effectiveness
-- Metrics needed: Average response time by incident type, restoration time trends
-- Include: crew performance ratings, equipment failure patterns, seasonal variations

-- Copilot prompt: "Create procedure analyze_incident_performance with comprehensive metrics"
DELIMITER //
CREATE PROCEDURE analyze_incident_performance(
    IN analysis_period_days INT DEFAULT 30,
    IN crew_specialization VARCHAR(50) DEFAULT NULL
)
BEGIN
    -- Let Copilot create performance analysis logic
    -- Guide with specific metrics to calculate:
    -- "Average time from incident detection to crew assignment"
    -- "Average time from crew arrival to power restoration"  
    -- "Success rate by crew specialization and incident type"
    -- "Equipment failure frequency by equipment type and age"
    
END //
DELIMITER ;

-- TODO: Create automated alert procedure for SLA violations
-- Business context: Critical customers must be restored within 4 hours
-- Commercial customers within 8 hours, residential within 24 hours
-- Generate escalation alerts when SLAs are at risk

-- Copilot prompt: "Create procedure check_sla_violations that identifies at-risk incidents"
DELIMITER //
CREATE PROCEDURE check_sla_violations()
BEGIN
    -- Let Copilot implement SLA monitoring logic
    -- Guide with: "Check elapsed time against customer type SLA thresholds"
    -- Guide with: "Generate alert records for incidents approaching SLA deadlines"
    -- Guide with: "Include escalation recommendations based on incident severity"
    
END //
DELIMITER ;
