-- Grid infrastructure with realistic operational data
CREATE TABLE grid_segments (
    segment_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_capacity_mw DECIMAL(8,2) NOT NULL,
    safety_threshold_pct DECIMAL(5,2) DEFAULT 85.0,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    operational_status VARCHAR(20) DEFAULT 'operational',
    last_maintenance_date DATE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-time load measurements (contains 30 days of 15-minute interval data)
CREATE TABLE load_measurements (
    measurement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    segment_id VARCHAR(20) NOT NULL,
    measurement_time TIMESTAMP NOT NULL,
    load_mw DECIMAL(8,2) NOT NULL,
    quality_score DECIMAL(3,2) DEFAULT 1.0,
    data_source VARCHAR(50) DEFAULT 'smart_meter',
    INDEX idx_segment_time (segment_id, measurement_time),
    INDEX idx_time (measurement_time),
    FOREIGN KEY (segment_id) REFERENCES grid_segments(segment_id)
) PARTITION BY RANGE (UNIX_TIMESTAMP(measurement_time)) (
    PARTITION p202406 VALUES LESS THAN (UNIX_TIMESTAMP('2024-07-01')),
    PARTITION p202407 VALUES LESS THAN (UNIX_TIMESTAMP('2024-08-01'))
);

-- Power generation sources with current output data
CREATE TABLE power_sources (
    source_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    source_type ENUM('solar', 'wind', 'natural_gas', 'nuclear', 'hydro') NOT NULL,
    max_capacity_mw DECIMAL(8,2) NOT NULL,
    current_output_mw DECIMAL(8,2) NOT NULL,
    cost_per_mwh DECIMAL(8,2) NOT NULL,
    reliability_score DECIMAL(3,2) DEFAULT 0.95,
    maintenance_until DATE NULL
);

-- Segment connections for power transfer calculations
CREATE TABLE segment_connections (
    connection_id INT AUTO_INCREMENT PRIMARY KEY,
    from_segment VARCHAR(20) NOT NULL,
    to_segment VARCHAR(20) NOT NULL,
    max_transfer_mw DECIMAL(8,2) NOT NULL,
    power_loss_pct DECIMAL(5,3) NOT NULL,
    connection_type ENUM('overhead', 'underground', 'submarine') NOT NULL,
    FOREIGN KEY (from_segment) REFERENCES grid_segments(segment_id),
    FOREIGN KEY (to_segment) REFERENCES grid_segments(segment_id)
);

-- Customer priority data for emergency planning
CREATE TABLE customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    segment_id VARCHAR(20) NOT NULL,
    customer_type ENUM('critical', 'commercial', 'residential') NOT NULL,
    name VARCHAR(100) NOT NULL,
    priority_score INT NOT NULL, -- 100=critical, 10=commercial, 1=residential
    FOREIGN KEY (segment_id) REFERENCES grid_segments(segment_id)
);