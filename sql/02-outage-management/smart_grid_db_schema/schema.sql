-- SQL Schema for Power Outage Management Database System
-- This schema defines the tables required for tracking outage incidents, field crews,
-- customer information, service points, and grid equipment.
-- Designed to support GitHub Copilot collaboration by providing clear structure and comments.

-- Table: outage_incidents
-- Stores details about power outage events, including their cause, severity,
-- affected customers, restoration times, and geographic location.
-- incident_id: Unique identifier for each outage incident (e.g., INC_001)
-- created_time: Timestamp when the incident was first recorded
-- outage_cause: Reason for the outage (e.g., EQUIPMENT_FAILURE, WEATHER)
-- severity_level: Impact level of the outage (e.g., MINOR, CRITICAL)
-- estimated_customers_affected: Initial estimate of affected customers
-- actual_customers_affected: Confirmed number of affected customers
-- estimated_restoration_time: Predicted time for power restoration
-- actual_restoration_time: Actual time when power was restored
-- incident_status: Current status of the incident (e.g., DETECTED, RESOLVED)
-- geographic_lat, geographic_lng: Latitude and longitude of the incident's center
-- affected_radius_km: Radius in kilometers of the affected area
CREATE TABLE outage_incidents (
    incident_id VARCHAR(20) PRIMARY KEY,
    created_time DATETIME NOT NULL,
    outage_cause ENUM('EQUIPMENT_FAILURE', 'WEATHER', 'VEHICLE_ACCIDENT', 'VEGETATION', 'PLANNED_MAINTENANCE'),
    severity_level ENUM('MINOR', 'MODERATE', 'MAJOR', 'CRITICAL'),
    estimated_customers_affected INT,
    actual_customers_affected INT,
    estimated_restoration_time DATETIME,
    actual_restoration_time DATETIME,
    incident_status ENUM('DETECTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'),
    geographic_lat DECIMAL(10, 8),
    geographic_lng DECIMAL(11, 8),
    affected_radius_km DECIMAL(5, 2)
);

-- Table: field_crews
-- Contains information about field crews responsible for outage restoration,
-- including their specialization, skill level, current location, and availability.
-- crew_id: Unique identifier for each field crew (e.g., CREW_001)
-- crew_name: Name of the crew (e.g., "Alpha Team")
-- specialization: Primary skill set of the crew (e.g., LINE_WORKER, TREE_REMOVAL)
-- skill_level: Experience level of the crew (e.g., JUNIOR, EXPERT)
-- current_latitude, current_longitude: Real-time geographic location of the crew
-- status: Current operational status (e.g., AVAILABLE, ASSIGNED, OFF_DUTY)
-- shift_end_time: Scheduled end time of the current shift
-- overtime_hours_today: Accumulated overtime hours for the current day
CREATE TABLE field_crews (
    crew_id VARCHAR(20) PRIMARY KEY,
    crew_name VARCHAR(100) NOT NULL,
    specialization ENUM('LINE_WORKER', 'TREE_REMOVAL', 'SUBSTATION_TECH', 'EMERGENCY_RESPONSE'),
    skill_level ENUM('JUNIOR', 'SENIOR', 'EXPERT', 'SUPERVISOR'),
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    status ENUM('AVAILABLE', 'ASSIGNED', 'ON_CALL', 'OFF_DUTY'),
    shift_end_time DATETIME,
    overtime_hours_today DECIMAL(4, 2) DEFAULT 0
);

-- Table: customers
-- Stores customer details, including their type, priority level, service address,
-- and contact preferences.
-- customer_id: Unique identifier for each customer (e.g., CUST_001)
-- name: Customer's full name or company name
-- customer_type: Classification of the customer (e.g., RESIDENTIAL, COMMERCIAL, CRITICAL_INFRASTRUCTURE)
-- priority_level: Importance level for restoration (e.g., STANDARD, CRITICAL)
-- service_address: Physical address where service is provided
-- latitude, longitude: Geographic coordinates of the service address
-- backup_power: Indicates if the customer has backup power (TRUE/FALSE)
-- annual_kwh_usage: Annual electricity consumption in kWh
-- contact_preferences: Set of preferred communication methods (e.g., SMS, EMAIL)
CREATE TABLE customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    customer_type ENUM('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'CRITICAL_INFRASTRUCTURE'),
    priority_level ENUM('STANDARD', 'HIGH', 'CRITICAL'),
    service_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    backup_power BOOLEAN DEFAULT FALSE,
    annual_kwh_usage INT,
    contact_preferences SET('SMS', 'EMAIL', 'PHONE', 'MOBILE_APP')
);

-- Table: grid_equipment
-- Defines various components of the electrical grid infrastructure,
-- such as transformers, power lines, and substations.
-- equipment_id: Unique identifier for each piece of equipment (e.g., EQ_001)
-- equipment_type: Type of grid component (e.g., TRANSFORMER, SUBSTATION)
-- location_name: Descriptive name or identifier for the equipment's location
-- latitude, longitude: Geographic coordinates of the equipment
-- max_capacity_kw: Maximum power capacity in kilowatts
-- current_load_kw: Current power load in kilowatts
-- status: Operational status of the equipment (e.g., OPERATIONAL, FAILED)
CREATE TABLE grid_equipment (
    equipment_id VARCHAR(20) PRIMARY KEY,
    equipment_type ENUM('TRANSFORMER', 'POWER_LINE', 'SUBSTATION', 'SWITCH', 'GENERATOR'),
    location_name VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    max_capacity_kw INT,
    current_load_kw INT DEFAULT 0,
    status ENUM('OPERATIONAL', 'MAINTENANCE', 'FAILED', 'OFFLINE')
);

-- Table: customer_service_points
-- Links customers to the specific grid equipment that provides them service.
-- service_point_id: Unique identifier for each service connection point
-- customer_id: Foreign key referencing the customers table
-- equipment_id: Foreign key referencing the grid_equipment table
-- connection_type: Type of connection (e.g., PRIMARY, BACKUP)
-- This table is crucial for understanding which customers are affected by equipment failures.
CREATE TABLE customer_service_points (
    service_point_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20),
    equipment_id VARCHAR(20),
    connection_type ENUM('PRIMARY', 'BACKUP', 'TEMPORARY'),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (equipment_id) REFERENCES grid_equipment(equipment_id)
);
