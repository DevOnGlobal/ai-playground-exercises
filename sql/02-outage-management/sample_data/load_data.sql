-- Sample Data for Power Outage Management Database System
-- This script populates the database with realistic test data for the exercise.
-- It includes data for outage incidents, field crews, customers, grid equipment,
-- and customer service points, ensuring relationships are maintained.

-- Disable foreign key checks temporarily to allow data insertion in any order
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data (optional, for re-running script)
TRUNCATE TABLE customer_service_points;
TRUNCATE TABLE grid_equipment;
TRUNCATE TABLE customers;
TRUNCATE TABLE field_crews;
TRUNCATE TABLE outage_incidents;

-- Insert data into outage_incidents
INSERT INTO outage_incidents (incident_id, created_time, outage_cause, severity_level, estimated_customers_affected, actual_customers_affected, estimated_restoration_time, actual_restoration_time, incident_status, geographic_lat, geographic_lng, affected_radius_km)
VALUES
('INC_001', '2025-06-28 10:00:00', 'EQUIPMENT_FAILURE', 'CRITICAL', 5000, 4800, '2025-06-28 14:00:00', '2025-06-28 13:45:00', 'RESOLVED', 34.0522, -118.2437, 2.5),
('INC_002', '2025-06-29 08:30:00', 'WEATHER', 'MAJOR', 2000, NULL, '2025-06-29 18:00:00', NULL, 'IN_PROGRESS', 34.0600, -118.2500, 1.8),
('INC_003', '2025-06-29 11:00:00', 'VEHICLE_ACCIDENT', 'MODERATE', 500, NULL, '2025-06-29 15:00:00', NULL, 'ASSIGNED', 34.0400, -118.2600, 0.5),
('INC_004', '2025-06-29 12:00:00', 'PLANNED_MAINTENANCE', 'MINOR', 100, NULL, '2025-06-29 16:00:00', NULL, 'DETECTED', 34.0700, -118.2300, 0.2),
('INC_005', '2025-06-29 13:00:00', 'VEGETATION', 'MAJOR', 1500, NULL, '2025-06-29 20:00:00', NULL, 'IN_PROGRESS', 34.0550, -118.2450, 1.0);

-- Insert data into field_crews
INSERT INTO field_crews (crew_id, crew_name, specialization, skill_level, current_latitude, current_longitude, status, shift_end_time, overtime_hours_today)
VALUES
('CREW_001', 'Alpha Team', 'LINE_WORKER', 'EXPERT', 34.0500, -118.2400, 'AVAILABLE', '2025-06-29 17:00:00', 1.5),
('CREW_002', 'Bravo Team', 'TREE_REMOVAL', 'SENIOR', 34.0650, -118.2550, 'ASSIGNED', '2025-06-29 18:00:00', 0.0),
('CREW_003', 'Charlie Team', 'SUBSTATION_TECH', 'SUPERVISOR', 34.0350, -118.2350, 'AVAILABLE', '2025-06-29 16:00:00', 3.0),
('CREW_004', 'Delta Team', 'EMERGENCY_RESPONSE', 'EXPERT', 34.0450, -118.2650, 'ON_CALL', '2025-06-29 20:00:00', 0.0),
('CREW_005', 'Echo Team', 'LINE_WORKER', 'JUNIOR', 34.0750, -118.2250, 'AVAILABLE', '2025-06-29 17:30:00', 0.5);

-- Insert data into customers
INSERT INTO customers (customer_id, name, customer_type, priority_level, service_address, latitude, longitude, backup_power, annual_kwh_usage, contact_preferences)
VALUES
('CUST_001', 'Metro Hospital', 'CRITICAL_INFRASTRUCTURE', 'CRITICAL', '123 Main St', 34.0520, -118.2430, TRUE, 1000000, 'EMAIL,PHONE'),
('CUST_002', 'Downtown Office Park', 'COMMERCIAL', 'HIGH', '456 Oak Ave', 34.0610, -118.2510, FALSE, 500000, 'EMAIL'),
('CUST_003', 'Residential Home A', 'RESIDENTIAL', 'STANDARD', '789 Pine Ln', 34.0410, -118.2610, FALSE, 15000, 'SMS'),
('CUST_004', 'Industrial Plant X', 'INDUSTRIAL', 'HIGH', '101 Factory Rd', 34.0710, -118.2310, TRUE, 2000000, 'PHONE'),
('CUST_005', 'Residential Home B', 'RESIDENTIAL', 'STANDARD', '202 Elm St', 34.0560, -118.2460, FALSE, 12000, 'EMAIL,SMS'),
('CUST_006', 'City Hall', 'CRITICAL_INFRASTRUCTURE', 'CRITICAL', '303 Government Plaza', 34.0530, -118.2440, TRUE, 750000, 'PHONE');

-- Insert data into grid_equipment
INSERT INTO grid_equipment (equipment_id, equipment_type, location_name, latitude, longitude, max_capacity_kw, current_load_kw, status)
VALUES
('EQ_001', 'TRANSFORMER', 'T-Downtown-001', 34.0525, -118.2435, 5000, 3500, 'FAILED'),
('EQ_002', 'POWER_LINE', 'PL-Main-001', 34.0605, -118.2505, 10000, 7000, 'FAILED'),
('EQ_003', 'SUBSTATION', 'SS-West-001', 34.0395, -118.2605, 20000, 15000, 'OPERATIONAL'),
('EQ_004', 'SWITCH', 'SW-North-001', 34.0705, -118.2305, 1000, 500, 'OPERATIONAL'),
('EQ_005', 'TRANSFORMER', 'T-South-001', 34.0555, -118.2455, 4000, 2800, 'OPERATIONAL');

-- Insert data into customer_service_points
INSERT INTO customer_service_points (service_point_id, customer_id, equipment_id, connection_type)
VALUES
('SP_001', 'CUST_001', 'EQ_001', 'PRIMARY'),
('SP_002', 'CUST_002', 'EQ_002', 'PRIMARY'),
('SP_003', 'CUST_003', 'EQ_003', 'PRIMARY'),
('SP_004', 'CUST_004', 'EQ_004', 'PRIMARY'),
('SP_005', 'CUST_005', 'EQ_001', 'PRIMARY'), -- CUST_005 also affected by EQ_001 failure
('SP_006', 'CUST_006', 'EQ_001', 'PRIMARY'); -- CUST_006 also affected by EQ_001 failure

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
