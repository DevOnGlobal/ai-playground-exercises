DELETE FROM meters WHERE status = 'Inactive' AND installation_date < '2022-01-01';

DELETE FROM meter_readings WHERE reading_date < '2022-01-01';
