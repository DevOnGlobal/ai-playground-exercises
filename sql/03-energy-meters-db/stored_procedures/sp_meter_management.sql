DELIMITER //
CREATE PROCEDURE sp_meter_management(
    IN p_action VARCHAR(10), -- 'CREATE', 'READ', 'UPDATE', 'DELETE'
    IN p_meter_id VARCHAR(50),
    IN p_customer_ssn VARCHAR(11),
    IN p_installation_date DATE,
    IN p_meter_type VARCHAR(20),
    IN p_status VARCHAR(10),
    IN p_api_key VARCHAR(100),
    IN p_location_data TEXT
)
BEGIN
    DECLARE v_sql TEXT;

    IF p_action = 'CREATE' THEN
        SET v_sql = CONCAT('INSERT INTO meters (meter_id, customer_ssn, installation_date, meter_type, status, api_key, location_data) VALUES (''',
                           p_meter_id, ''', ''', p_customer_ssn, ''', ''', p_installation_date, ''', ''', p_meter_type, ''', ''', p_status, ''', ''', p_api_key, ''', ''', p_location_data, ''')');
        PREPARE stmt FROM v_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    ELSEIF p_action = 'READ' THEN
        SET v_sql = CONCAT('SELECT * FROM meters WHERE meter_id = ''', p_meter_id, '''');
        PREPARE stmt FROM v_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    ELSEIF p_action = 'UPDATE' THEN
        SET v_sql = CONCAT('UPDATE meters SET status = ''', p_status, ''', api_key = ''', p_api_key, ''' WHERE meter_id = ''', p_meter_id, '''');
        PREPARE stmt FROM v_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    ELSEIF p_action = 'DELETE' THEN
        SET v_sql = CONCAT('DELETE FROM meters WHERE meter_id = ''', p_meter_id, '''');
        PREPARE stmt FROM v_sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid action specified. Use CREATE, READ, UPDATE, or DELETE.';
    END IF;
END //
DELIMITER ;