-- Basic assertion helper
CREATE PROCEDURE AssertEquals
    @expected NVARCHAR(MAX),
    @actual NVARCHAR(MAX),
    @testName NVARCHAR(100)
AS
BEGIN
    IF @expected = @actual
        PRINT @testName + ': PASSED'
    ELSE
        PRINT @testName + ': FAILED - Expected: ' + ISNULL(@expected, 'NULL') + 
              ', Actual: ' + ISNULL(@actual, 'NULL')
END

-- Numeric assertion
CREATE PROCEDURE AssertEqualsInt
    @expected INT,
    @actual INT,
    @testName NVARCHAR(100)
AS
BEGIN
    IF @expected = @actual
        PRINT @testName + ': PASSED'
    ELSE
        PRINT @testName + ': FAILED - Expected: ' + CAST(@expected AS NVARCHAR) + 
              ', Actual: ' + CAST(@actual AS NVARCHAR)
END

-- Example function to test
CREATE FUNCTION CalculateDiscount(@amount DECIMAL(10,2), @customerType NVARCHAR(20))
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @discount DECIMAL(10,2) = 0
    
    IF @customerType = 'Premium'
        SET @discount = @amount * 0.10
    ELSE IF @customerType = 'Regular'
        SET @discount = @amount * 0.05
        
    RETURN @discount
END

-- Test cases
DECLARE @result DECIMAL(10,2)

-- Test: Premium customer discount
SET @result = dbo.CalculateDiscount(100.00, 'Premium')
EXEC AssertEquals '10.00', CAST(@result AS NVARCHAR), 'Premium customer gets 10% discount'
