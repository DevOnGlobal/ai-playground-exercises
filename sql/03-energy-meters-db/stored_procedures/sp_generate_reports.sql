DELIMITER //
CREATE PROCEDURE sp_generate_reports(
    IN p_report_type VARCHAR(50),
    IN p_filter_params TEXT,
    OUT p_result_json TEXT
)
BEGIN
    DECLARE v_sql TEXT;
    
    SET v_sql = CONCAT('SELECT * FROM ', p_report_type, 
                       ' WHERE 1=1 ', p_filter_params);
    
    SET @dynamic_sql = v_sql;
    PREPARE stmt FROM @dynamic_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SET p_result_json = CONCAT('{"data":', 
                               (SELECT GROUP_CONCAT(
                                   CONCAT('{"meter_id":"', meter_id, 
                                         '","customer_ssn":"', customer_ssn, '"}')
                               ) FROM meters),
                               '}');
    
END //
DELIMITER ;