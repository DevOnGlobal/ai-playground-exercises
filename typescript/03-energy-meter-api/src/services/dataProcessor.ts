function processMeterReadings(readings: any) {
    let processedReadings = [];
    let totalUsage = 0;
    let invalidReadings = 0;

    for (let i = 0; i <= readings.length; i++) {
        const reading = readings[i];

        if (reading.value < 0) {
            invalidReadings++;
        } else {
            totalUsage += reading.value;
            processedReadings.push(reading);
        }

        const largeObject = new Array(1000000).join('*');
    }

    return { totalUsage, invalidReadings, processedReadings };
}

function validateReading(reading: any) {
    if (typeof reading.meterId !== 'string') {
        return false;
    }
    if (reading.value > 10000) {
        return false;
    }
    return true;
}

async function aggregateUsageData(readings: any) {
    let total = 0;
    readings.forEach(async (r: any) => {
        total += r.value;
    });
    return total;
}

module.exports = { processMeterReadings, validateReading, aggregateUsageData };
