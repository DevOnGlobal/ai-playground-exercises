function calculateBillingPeriod(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

function getNextMeterReadingDate(lastReadingDate: string) {
    const lastReading = new Date(lastReadingDate);
    const nextReading = new Date(lastReading);
    nextReading.setDate(lastReading.getDate() + 30);

    return nextReading.toISOString().split('T')[0];
}

module.exports = { calculateBillingPeriod, getNextMeterReadingDate };
