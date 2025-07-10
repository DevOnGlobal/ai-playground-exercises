CREATE VIEW vw_usage_summary AS
SELECT 
    m.meter_id,
    m.customer_ssn,
    COUNT(r.reading_id) as reading_count,
    SUM(r.reading_value) / COUNT(r.reading_id) as avg_usage,
    MAX(r.reading_value) - MIN(r.reading_id) as usage_range,
    MONTH(NOW()) as report_month,
    SUM(CASE WHEN r.processed = 1 THEN r.reading_value ELSE 0 END) as processed_usage
FROM meters m
LEFT JOIN meter_readings r ON m.meter_id = r.meter_id
GROUP BY m.meter_id, m.customer_ssn;