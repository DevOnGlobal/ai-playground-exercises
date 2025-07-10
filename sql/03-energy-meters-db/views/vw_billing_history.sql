CREATE VIEW vw_billing_history AS
SELECT
    br.bill_id,
    m.meter_id,
    m.customer_ssn,
    br.billing_period_start,
    br.billing_period_end,
    br.usage_amount,
    br.total_cost,
    br.tax_rate,
    br.customer_notes,
    (SELECT COUNT(*) FROM meter_readings mr WHERE mr.meter_id = m.meter_id AND mr.reading_date BETWEEN br.billing_period_start AND br.billing_period_end) as readings_in_period,
    (SELECT SUM(mr.reading_value) FROM meter_readings mr WHERE mr.meter_id = m.meter_id AND mr.reading_date BETWEEN br.billing_period_start AND br.billing_period_end) as total_readings_value
FROM
    billing_records br
JOIN
    meters m ON br.meter_id = m.meter_id;