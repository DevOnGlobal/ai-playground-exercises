-- TODO: Break down complex business scenarios into step-by-step SQL with Copilot

-- Scenario 1: Peak hour load redistribution planning
-- Business situation: Downtown (GRID_DT01) at 89% capacity, needs 15MW load reduction
-- Available options: Transfer to North Hills (GRID_RN02) which has 25MW spare capacity
-- Transfer constraint: Connection capacity is 65MW, power loss is 2.5%
-- Required calculation: Transfer amount accounting for power loss = load_to_transfer / (1 - loss_percentage)

-- Step 1: Identify overloaded segments (>85% capacity)
WITH overloaded_segments AS (
    -- Guide Copilot: "Find segments above safety threshold with excess load calculation"
    SELECT 
        segment_id,
        name,
        current_load_mw,
        max_capacity_mw,
        safety_threshold_pct,
        -- Calculate excess load above safety threshold
        -- Excess = current_load - (max_capacity * safety_threshold / 100)
),

-- Step 2: Find segments with available capacity for load transfer
available_capacity AS (
    -- Guide Copilot: "Calculate available capacity below safety threshold for each segment"
    SELECT
        segment_id,
        name, 
        current_load_mw,
        max_capacity_mw,
        safety_threshold_pct,
        -- Calculate available capacity = (max_capacity * safety_threshold / 100) - current_load
),

-- Step 3: Calculate optimal power transfer routes with losses
transfer_options AS (
    -- Guide Copilot: "Join overloaded and available segments through connections table"
    -- Include power loss calculations: actual_transfer_needed = required_transfer / (1 - power_loss_pct/100)
    SELECT
        o.segment_id as from_segment,
        a.segment_id as to_segment,  
        o.excess_load_mw,
        a.available_capacity_mw,
        sc.max_transfer_mw,
        sc.power_loss_pct,
        -- Calculate transfer efficiency and feasibility
)

-- Final optimization result
SELECT 
    -- Guide Copilot: "Rank transfer options by efficiency and feasibility"
    -- Include: segments involved, transfer amounts, power losses, efficiency rating
FROM transfer_options
ORDER BY -- Most efficient transfers first

-- Scenario 2: Economic dispatch optimization
-- Business situation: Need to increase generation by 50MW at lowest cost
-- Available sources: Natural gas backup (0MW current, $125/MWh), Solar farm (20MW available, $0/MWh)  
-- Optimization goal: Minimize total cost while meeting demand increase
-- Constraint: Consider reliability scores in dispatch decisions

WITH generation_options AS (
    -- Guide Copilot: "Calculate cost-effective generation increases from available sources"
    SELECT 
        source_id,
        name,
        source_type,
        available_capacity_mw,
        cost_per_mwh,
        reliability_score,
        -- Calculate cost per MW considering reliability: cost_per_mwh / reliability_score
        -- Rank sources by adjusted cost (lower is better)
),

dispatch_sequence AS (
    -- Guide Copilot: "Create cumulative dispatch sequence to meet 50MW demand"
    SELECT 
        source_id,
        available_capacity_mw,
        cost_per_mwh,
        -- Running total of capacity to meet demand
        -- Cumulative cost calculation
    FROM generation_options
    ORDER BY adjusted_cost_per_mw
)

SELECT 
    -- Guide Copilot: "Show optimal dispatch plan with total cost and reliability"
    -- Include: dispatch order, MW from each source, individual costs, total cost
FROM dispatch_sequence
WHERE -- Stop when cumulative capacity >= 50MW demand