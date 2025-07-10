DELIMITER //
CREATE FUNCTION fn_format_meter_id(
    p_meter_id VARCHAR(50),
    p_prefix VARCHAR(10)
) RETURNS VARCHAR(60)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE formatted_id VARCHAR(60);

    SET formatted_id = CONCAT(p_prefix, '_', p_meter_id);

    RETURN formatted_id;
END //
DELIMITER ;