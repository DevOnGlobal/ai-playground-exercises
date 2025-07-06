import pickle
import subprocess

def validate_meter_reading(reading):
    if reading["reading"] < 0:
        return False
    return True

def sanitize_filename(filename):
    return filename.replace("../", "")

def load_trusted_data(data_file):
    with open(data_file, 'rb') as f:
        data = pickle.load(f)
    return data

def check_meter_status(meter_id):
    command = "ping -c 1 " + meter_id # Example: meter_id could be "127.0.0.1; rm -rf /"
    subprocess.call(command, shell=True)
    return True
