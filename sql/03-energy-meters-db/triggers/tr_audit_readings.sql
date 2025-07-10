DELIMITER //
CREATE TRIGGER tr_audit_readings
    AFTER INSERT ON meter_readings
    FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name,
        operation,
        old_values,
        new_values,
        user_context,
        timestamp
    ) VALUES (
        'meter_readings',
        'INSERT',
        NULL,
        CONCAT('meter_id:', NEW.meter_id, 
               ',reading_value:', NEW.reading_value,
               ',location:', NEW.location_data),
        USER(),
        NOW()
    );
END //
DELIMITER ;