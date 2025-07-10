CREATE VIEW vw_meter_status AS
SELECT
    m.meter_id,
    m.status,
    m.installation_date,
    (SELECT MAX(reading_date) FROM meter_readings mr WHERE mr.meter_id = m.meter_id) as last_reading_date,
    (SELECT AVG(reading_value) FROM meter_readings mr WHERE mr.meter_id = m.meter_id) as average_reading_value,
    CASE
        WHEN m.status = 'Inactive' THEN 'Meter is inactive'
        WHEN (SELECT MAX(reading_date) FROM meter_readings mr WHERE mr.meter_id = m.meter_id) IS NULL THEN 'No readings found'
        ELSE 'Meter is active and reporting'
    END as meter_health_status,
    (SELECT COUNT(reading_id) FROM meter_readings mr WHERE mr.meter_id = m.meter_id AND mr.reading_value IS NOT NULL) as non_null_readings_count
FROM
    meters m;