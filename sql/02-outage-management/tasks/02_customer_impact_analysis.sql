-- Task 2: Customer Impact Analysis
-- GitHub Copilot Learning Focus: Complex multi-table queries with business logic calculations

-- Objective:
-- Learn to guide Copilot through complex analytical queries by providing specific business rules and calculation formulas.

-- Instructions:
-- Implement these queries using the data access helpers from Task 1:

-- TODO: Calculate comprehensive impact score for each active incident
-- Business Rules (provide these to Copilot):
-- Priority scoring: CRITICAL customers = 100 points, HIGH = 50 points, STANDARD = 10 points
-- Type multipliers: CRITICAL_INFRASTRUCTURE = 5x, INDUSTRIAL = 3x, COMMERCIAL = 2x, RESIDENTIAL = 1x
-- Duration penalty: +20 points per hour since incident creation
-- Severity multipliers: CRITICAL = 4x, MAJOR = 3x, MODERATE = 2x, MINOR = 1x

-- Copilot prompt: "Create query incident_priority_scores using the scoring rules above"
-- Expected output: incident_id, total_score, customer_breakdown, duration_hours

WITH incident_scoring AS (
    SELECT 
        oi.incident_id,
        oi.severity_level,
        oi.created_time,
        -- Let Copilot calculate time elapsed
        TIMESTAMPDIFF(HOUR, oi.created_time, NOW()) as hours_elapsed,
        -- Let Copilot implement customer scoring logic
        COUNT(c.customer_id) as total_customers,
        SUM(CASE 
            WHEN c.priority_level = 'CRITICAL' THEN 100
            WHEN c.priority_level = 'HIGH' THEN 50
            ELSE 10
        END) as priority_score,
        -- Additional scoring calculations guided by Copilot
    FROM active_incidents_with_impact oi
    -- Let Copilot complete the joins and calculations
),
final_scores AS (
    -- Let Copilot calculate final weighted scores
)
SELECT * FROM final_scores ORDER BY total_score DESC;

-- TODO: Find incidents that would restore power to the most customers per repair hour
-- Business context: Some repairs restore power to many customers quickly, others take longer
-- Calculate: customers_restored / estimated_repair_hours for each incident
-- Include: incident details, customer count, estimated repair time, efficiency ratio
-- Copilot prompt: "Rank incidents by restoration efficiency - customers restored per hour"

-- TODO: Identify cascading outage scenarios
-- Business context: When multiple incidents affect the same customers through different equipment
-- Find: customers served by multiple failed equipment pieces
-- Calculate: total outage impact including overlapping service areas
-- Copilot prompt: "Find customers affected by multiple simultaneous outages"
