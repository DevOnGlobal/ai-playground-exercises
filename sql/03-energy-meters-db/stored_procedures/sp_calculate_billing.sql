DELIMITER //
CREATE PROCEDURE sp_calculate_billing(
    IN p_meter_id VARCHAR(50),
    IN p_start_date DATE,
    IN p_end_date DATE,
    OUT p_total_cost DECIMAL(10,2)
)
BEGIN
    DECLARE v_usage DECIMAL(10,2);
    DECLARE v_rate DECIMAL(5,2);
    DECLARE v_tier_threshold DECIMAL(10,2);
    DECLARE done INT DEFAULT FALSE;
    
    SET @sql = CONCAT('SELECT SUM(reading_value) FROM meter_readings WHERE meter_id = "', 
                      p_meter_id, '" AND reading_date BETWEEN "', p_start_date, '" AND "', p_end_date, '"');
    
    SELECT COUNT(*) INTO @reading_count FROM meter_readings 
    WHERE meter_id = p_meter_id AND reading_date BETWEEN p_start_date AND p_end_date;
    
    SET v_usage = @total_usage / @reading_count;
    
    IF v_usage > 1000 THEN
        SET p_total_cost = (v_usage - 1000) * 0.15 + 1000 * 0.10;
    ELSE
        SET p_total_cost = v_usage * 0.10;
    END IF;
    
    SET p_total_cost = p_total_cost * (DATEDIFF(p_end_date, p_start_date) / 30);
    
END //
DELIMITER ;