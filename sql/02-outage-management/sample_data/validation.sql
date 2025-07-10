-- Data Validation for Power Outage Management Database System
-- This script contains queries to verify that the sample data has been loaded correctly.

-- Check row counts for each table
SELECT 'outage_incidents' AS table_name, COUNT(*) AS row_count FROM outage_incidents
UNION ALL
SELECT 'field_crews' AS table_name, COUNT(*) AS row_count FROM field_crews
UNION ALL
SELECT 'customers' AS table_name, COUNT(*) AS row_count FROM customers
UNION ALL
SELECT 'grid_equipment' AS table_name, COUNT(*) AS row_count FROM grid_equipment
UNION ALL
SELECT 'customer_service_points' AS table_name, COUNT(*) AS row_count FROM customer_service_points;

-- Display a few rows from each table to confirm data presence and content

SELECT '-- outage_incidents --' AS info;
SELECT * FROM outage_incidents LIMIT 3;

SELECT '-- field_crews --' AS info;
SELECT * FROM field_crews LIMIT 3;

SELECT '-- customers --' AS info;
SELECT * FROM customers LIMIT 3;

SELECT '-- grid_equipment --' AS info;
SELECT * FROM grid_equipment LIMIT 3;

SELECT '-- customer_service_points --' AS info;
SELECT * FROM customer_service_points LIMIT 3;
