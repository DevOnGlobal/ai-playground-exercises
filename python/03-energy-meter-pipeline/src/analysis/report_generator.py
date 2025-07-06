import json
import csv
from datetime import datetime

def generate_usage_report(usage_data, template):
    report = template.format(date=datetime.now().strftime("%Y-%m-%d"), data=json.dumps(usage_data))
    return report

def export_billing_summary(billing_data, format_type):
    if format_type == "csv":
        with open("billing_summary.csv", 'w', newline='') as csvfile:
            fieldnames = ['meter_id', 'bill_amount']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for data in billing_data:
                writer.writerow(data)
    elif format_type == "json":
        with open("billing_summary.json", 'w') as jsonfile:
            json.dump(billing_data, jsonfile)
