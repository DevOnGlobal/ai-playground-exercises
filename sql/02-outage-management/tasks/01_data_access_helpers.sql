-- Task 1: Data Access Foundation
-- GitHub Copilot Learning Focus: Writing helper queries and views that provide clean data access

-- Objective:
-- Create data access helpers that connect the provided sample data to business logic.
-- This eliminates the "where do I get data from?" problem and sets up clear patterns for Copilot to follow.

-- Instructions:
-- Use GitHub Copilot to create these specific helper views:

-- TODO: Create a view that shows all active incidents with customer impact
-- Business context: "Active" means status in ('DETECTED', 'ASSIGNED', 'IN_PROGRESS')
-- Include: incident details, total customers affected, critical customers count
-- Geographic data: incident location and affected radius
-- Copilot prompt: "Create view active_incidents_with_impact that joins outage_incidents with customer counts"

CREATE VIEW active_incidents_with_impact AS
-- Let Copilot generate this based on the comment above

-- TODO: Create a view showing available crews with their capabilities
-- Business context: "Available" means status = 'AVAILABLE' and shift_end_time > NOW()
-- Include: crew details, specialization, current location, remaining shift hours
-- Calculate overtime eligibility: overtime_hours_today < 4 means eligible for emergency assignment
-- Copilot prompt: "Create view available_crews_detailed with location and overtime calculations"

CREATE VIEW available_crews_detailed AS
-- Let Copilot generate this based on the comment above

-- TODO: Create a helper function to calculate distance between two geographic points
-- Business context: Used for crew dispatch optimization and customer impact radius calculations
-- Formula: Haversine formula for distance in kilometers between lat/lng coordinates
-- Copilot prompt: "Create function calculate_distance_km that takes two lat/lng pairs and returns kilometers"

DELIMITER //
CREATE FUNCTION calculate_distance_km(
    lat1 DECIMAL(10,8), lng1 DECIMAL(11,8), 
    lat2 DECIMAL(10,8), lng2 DECIMAL(11,8)
) RETURNS DECIMAL(8,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    -- Let Copilot implement Haversine formula
END //
DELIMITER ;
