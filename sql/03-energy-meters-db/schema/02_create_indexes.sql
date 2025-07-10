CREATE INDEX idx_readings_date_meter ON meter_readings (reading_date, meter_id);

CREATE INDEX idx_billing_notes ON billing_records (customer_notes(100));