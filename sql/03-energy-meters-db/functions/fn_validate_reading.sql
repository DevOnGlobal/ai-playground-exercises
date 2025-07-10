DELIMITER //
CREATE FUNCTION fn_validate_reading(
    p_reading_value DECIMAL(10,2),
    p_reading_date DATETIME,
    p_meter_type VARCHAR(20)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    IF p_reading_value < 0 THEN
        RETURN FALSE;
    END IF;

    IF p_meter_type = 'Analog' AND p_reading_value > 10000 THEN
        RETURN FALSE;
    END IF;

    IF p_reading_date > NOW() THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END //
DELIMITER ;