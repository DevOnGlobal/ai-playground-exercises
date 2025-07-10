-- Sample grid segments with realistic operational parameters
INSERT INTO grid_segments VALUES
('GRID_DT01', 'Downtown Financial District', 175.50, 85.0, 40.7589, -73.9851, 'operational', '2024-05-15', CURRENT_TIMESTAMP),
('GRID_RN02', 'Residential North Hills', 89.25, 80.0, 40.7829, -73.9654, 'operational', '2024-06-01', CURRENT_TIMESTAMP),
('GRID_IS03', 'Industrial South Port', 245.75, 90.0, 40.6892, -74.0445, 'operational', '2024-04-22', CURRENT_TIMESTAMP),
('GRID_WB04', 'West Borough Shopping', 112.30, 82.0, 40.7282, -74.0776, 'operational', '2024-06-10', CURRENT_TIMESTAMP),
('GRID_EC05', 'East Coast Residential', 95.80, 78.0, 40.7505, -73.9934, 'maintenance', '2024-06-20', CURRENT_TIMESTAMP);

-- Current power sources with realistic output levels
INSERT INTO power_sources VALUES
('PWR_NG01', 'Central Natural Gas Plant', 'natural_gas', 300.0, 285.5, 85.50, 0.98, NULL),
('PWR_SF01', 'Riverside Solar Farm', 'solar', 150.0, 95.2, 0.00, 0.85, NULL),
('PWR_WF01', 'Coastal Wind Farm', 'wind', 200.0, 145.8, 25.30, 0.82, NULL),
('PWR_NG02', 'Backup Gas Turbine', 'natural_gas', 100.0, 0.0, 125.00, 0.95, NULL),
('PWR_HY01', 'Mountain Hydro Dam', 'hydro', 75.0, 68.3, 35.20, 0.99, '2024-07-05');

-- Critical infrastructure customers for emergency prioritization
INSERT INTO customers VALUES
('CUST_H001', 'GRID_DT01', 'critical', 'Metro General Hospital', 100),
('CUST_H002', 'GRID_RN02', 'critical', 'North Hills Emergency Center', 100),
('CUST_D001', 'GRID_DT01', 'critical', 'Emergency Operations Center', 100),
('CUST_C001', 'GRID_DT01', 'commercial', 'Financial Exchange Building', 10),
('CUST_C002', 'GRID_WB04', 'commercial', 'Metro Shopping Mall', 10),
('CUST_R001', 'GRID_RN02', 'residential', 'North Hills Apartments (450 units)', 450),
('CUST_R002', 'GRID_EC05', 'residential', 'East Coast Condos (280 units)', 280);

-- Realistic segment connections with power transfer capabilities
INSERT INTO segment_connections VALUES
(NULL, 'GRID_DT01', 'GRID_RN02', 65.0, 2.5, 'underground'),
(NULL, 'GRID_DT01', 'GRID_IS03', 85.0, 3.2, 'overhead'),
(NULL, 'GRID_RN02', 'GRID_WB04', 45.0, 2.1, 'underground'),
(NULL, 'GRID_IS03', 'GRID_WB04', 70.0, 2.8, 'overhead'),
(NULL, 'GRID_WB04', 'GRID_EC05', 55.0, 2.3, 'underground');