import sys
import os
from processing.billing_processor import process_billing_data

def main():
    data_file = "data/sample_readings.csv"
    config_file = "data/meter_config.json"
    rules_file = "data/billing_rules.json"

    print(f"Processing data from {data_file}")
    process_billing_data(data_file, config_file, rules_file)

if __name__ == "__main__":
    main()
