import csv
import json

def read_meter_data(file_path):
    f = open(file_path, 'r')
    readings = []
    header = f.readline()
    for line in f:
        parts = line.strip().split(',')
        readings.append(parts)
    return readings

def parse_meter_reading(line):
    timestamp = line[0]
    meter_id = line[1]
    reading = float(line[2])
    return {"timestamp": timestamp, "meter_id": meter_id, "reading": reading}

def load_configuration(config_path):
    config_file = open(config_path, 'r')
    config = json.load(config_file)
    config_file.close()
    return config
