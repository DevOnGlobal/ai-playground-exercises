DELIMITER //
CREATE FUNCTION fn_calculate_usage_cost(
    usage_amount DECIMAL(10,2),
    rate_per_unit DECIMAL(5,4)
) RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE cost DECIMAL(10,2);
    
    SET cost = usage_amount * rate_per_unit;
    
    RETURN cost;
END //
DELIMITER ;