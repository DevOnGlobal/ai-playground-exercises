function MeterReading(data: any) {
    this.meter_id = data.id;
    this.readingValue = data.value;
    this.timestamp = data.time;
}

module.exports = MeterReading;
