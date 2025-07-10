DELIMITER //
CREATE TRIGGER tr_update_meter_status
AFTER UPDATE ON meter_readings
FOR EACH ROW
BEGIN
    DECLARE v_current_status VARCHAR(10);

    SELECT status INTO v_current_status FROM meters WHERE meter_id = NEW.meter_id;

    IF NEW.reading_value > 0 AND v_current_status = 'Inactive' THEN
        UPDATE meters SET status = 'Active' WHERE meter_id = NEW.meter_id;
    END IF;
END //
DELIMITER ;