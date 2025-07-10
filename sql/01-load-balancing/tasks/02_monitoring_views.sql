-- TODO: Guide Copilot to create these views with detailed business context

-- View 1: segment_health_dashboard
-- Purpose: Real-time operational dashboard for grid operators
-- Business rules: 
--   - CRITICAL: >= safety threshold (red alert, immediate action needed)
--   - WARNING: within 10% of safety threshold (yellow alert, monitor closely)  
--   - HEALTHY: below warning level (green, normal operation)
-- Data needed: segment details, current load, utilization %, status, last update time
-- Sorting: Critical segments first, then by utilization percentage
-- Filtering: Only include segments with recent measurements (last 2 hours)
CREATE VIEW segment_health_dashboard AS
-- Guide Copilot with: "Create dashboard view showing segment health status with color-coded alerts"

-- View 2: power_dispatch_optimizer
-- Purpose: Economic dispatch planning for power generation
-- Business rules:
--   - Available capacity = max capacity - current output
--   - Cost effectiveness = available_capacity_mw / cost_per_mwh
--   - Reliability adjustment = available_capacity * reliability_score
-- Data needed: source details, availability, costs, adjusted capacity
-- Sorting: Most cost-effective sources first (highest cost effectiveness ratio)
-- Filtering: Only available sources (not in maintenance, has spare capacity)
CREATE VIEW power_dispatch_optimizer AS
-- Guide Copilot with: "Rank power sources by cost effectiveness for economic dispatch"

-- View 3: emergency_response_priority
-- Purpose: Customer prioritization during outages and emergencies
-- Business rules:
--   - Critical customers (hospitals, emergency services) = absolute priority
--   - Commercial impact = number of commercial customers * 10 priority points each
--   - Residential impact = number of residential customers * 1 priority point each
-- Data needed: segment info, customer counts by type, total priority score, current status
-- Sorting: Highest total priority score first
-- Calculations: SUM(customer_priority_score) as total_impact_score
CREATE VIEW emergency_response_priority AS
-- Guide Copilot with: "Calculate customer impact scores for emergency response prioritization"