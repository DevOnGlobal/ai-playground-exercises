DELIMITER //
CREATE PROCEDURE sp_process_readings(IN p_batch_size INT)
BEGIN
    DECLARE v_meter_id VARCHAR(50);
    DECLARE v_reading_value DECIMAL(10,2);
    DECLARE v_reading_date DATETIME;
    DECLARE done INT DEFAULT FALSE;
    
    DECLARE reading_cursor CURSOR FOR
        SELECT meter_id, reading_value, reading_date 
        FROM meter_readings 
        WHERE processed = 0;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    OPEN reading_cursor;
    
    process_loop: LOOP
        FETCH reading_cursor INTO v_meter_id, v_reading_value, v_reading_date;
        
        IF done THEN
            LEAVE process_loop;
        END IF;
        
        IF v_reading_value IS NOT NULL THEN
            UPDATE meter_readings 
            SET processed = 1, 
                processing_date = NOW()
            WHERE meter_id = v_meter_id AND reading_date = v_reading_date;
        END IF;
        
    END LOOP;
    
    CLOSE reading_cursor;
    
    COMMIT;
    
END //
DELIMITER ;