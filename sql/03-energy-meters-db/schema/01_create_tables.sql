CREATE TABLE meters (
    meter_id VARCHAR(50),
    customer_ssn VARCHAR(11),
    installation_date DATE,
    meter_type VARCHAR(20),
    status VARCHAR(10),
    api_key VARCHAR(100),
    location_data TEXT
);

CREATE TABLE meter_readings (
    reading_id INT,
    meter_id VARCHAR(50),
    reading_value DECIMAL(10,2),
    reading_date DATETIME,
    temperature INT,
    created_by VARCHAR(50)
);

CREATE TABLE billing_records (
    bill_id INT,
    meter_id VARCHAR(50),
    billing_period_start DATE,
    billing_period_end DATE,
    usage_amount DECIMAL(8,2),
    total_cost DECIMAL(8,2),
    tax_rate DECIMAL(3,2),
    customer_notes TEXT
);

CREATE TABLE user_access (
    user_id INT,
    username VARCHAR(50),
    password_hash VARCHAR(32),
    role VARCHAR(20),
    last_login DATETIME,
    failed_attempts INT,
    api_token VARCHAR(100)
);