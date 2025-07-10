-- Sample Data for Energy Meter Data Processing System

-- Meter Data
INSERT INTO meters (meter_id, customer_ssn, installation_date, meter_type, status, api_key, location_data) VALUES
('METER001', '12345678901', '2022-01-15', 'Smart', 'Active', 'key_abc123', '{"lat": 34.0522, "lon": -118.2437}'),
('METER002', '98765432109', '2021-11-01', 'Analog', 'Active', 'key_def456', '{"lat": 34.0522, "lon": -118.2437}'),
('METER003', '11223344556', '2023-03-20', 'Smart', 'Inactive', 'key_ghi789', '{"lat": 34.0522, "lon": -118.2437}'),
('METER004', '22334455667', '2020-05-10', 'Smart', 'Active', 'key_jkl012', '{"lat": 34.0522, "lon": -118.2437}'),
('METER005', '33445566778', '2024-01-01', 'Smart', 'Active', 'key_mno345', '{"lat": 34.0522, "lon": -118.2437}');

-- Reading Data
INSERT INTO meter_readings (reading_id, meter_id, reading_value, reading_date, temperature, created_by) VALUES
(1, 'METER001', 100.50, '2023-01-01 10:00:00', 25, 'system'),
(2, 'METER001', 105.20, '2023-01-02 10:00:00', 26, 'system'),
(3, 'METER001', 110.00, '2023-01-03 10:00:00', 24, 'system'),
(4, 'METER002', 50.00, '2023-01-01 11:00:00', 20, 'system'),
(5, 'METER002', 52.50, '2023-01-02 11:00:00', 21, 'system'),
(6, 'METER003', 0.00, '2023-01-01 12:00:00', 18, 'system'),
(7, 'METER004', 99999.99, '2023-01-01 13:00:00', 30, 'system'),
(8, 'METER004', -10.00, '2023-01-02 13:00:00', 28, 'system'),
(9, 'METER001', 120.00, '2025-01-01 10:00:00', 25, 'system');

INSERT INTO billing_records (bill_id, meter_id, billing_period_start, billing_period_end, usage_amount, total_cost, tax_rate, customer_notes) VALUES
(1, 'METER001', '2022-12-01', '2022-12-31', 300.00, 33.00, 0.10, 'Normal billing period'),
(2, 'METER002', '2022-12-01', '2022-12-31', 150.00, 16.50, 0.10, 'Normal billing period'),
(3, 'METER001', '2023-01-01', '2023-01-01', 10.00, 1.10, 0.10, 'Short billing period'),
(4, 'METER004', '2023-01-01', '2023-01-31', 100000.00, 11000.00, 0.10, 'High usage billing'),
(5, 'METER001', '2023-02-01', '2023-01-31', 50.00, 5.50, 0.10, 'Invalid date range');