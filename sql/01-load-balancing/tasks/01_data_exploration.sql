-- TODO: Use GitHub Copilot to generate these queries by writing descriptive comments

-- Query 1: Current grid utilization summary
-- Show each segment's name, current load, capacity, and utilization percentage
-- Order by utilization percentage descending to see most loaded segments first
-- Include only operational segments (not in maintenance)
-- Expected result: 4 rows showing DT01, IS03, WB04, RN02 with utilization percentages

-- Query 2: Power source availability analysis  
-- List all power sources with their current output vs maximum capacity
-- Calculate available capacity (max - current) for each source
-- Show cost per MWh and reliability score for economic dispatch planning
-- Exclude sources currently in maintenance
-- Expected result: 4 available sources with capacity calculations

-- Query 3: Critical customer impact assessment
-- Count critical, commercial, and residential customers in each segment
-- Calculate total priority score by segment (sum of all customer priority scores)
-- Show segment utilization status alongside customer counts
-- Order by total priority score descending
-- Expected result: 5 segments with customer breakdowns and priority totals