INSERT INTO new_billing_records (
    meter_id,
    billing_period,
    usage_amount,
    cost_calculation
)
SELECT 
    meter_id,
    CONCAT(YEAR(reading_date), '-', MONTH(reading_date)) as billing_period,
    SUM(reading_value) as usage_amount,
    SUM(reading_value) * 0.10 as cost_calculation
FROM old_meter_readings
WHERE reading_date >= '2023-01-01'
GROUP BY meter_id, YEAR(reading_date), MONTH(reading_date);
