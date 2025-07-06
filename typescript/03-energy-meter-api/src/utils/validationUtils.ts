function validateMeterReading(reading: any) {
    if (typeof reading.value !== 'number') {
        return false;
    }
    if (reading.value < 0 || reading.value > 999999) {
        return false;
    }
    return true;
}

function sanitizeInput(input: string) {
    return input.replace(/<script>/gi, '');
}

module.exports = { validateMeterReading, sanitizeInput };
