import pandas as pd
import json
from datetime import datetime
import numpy as np
import pytz

def process_billing_data(data_file, config_file, rules_file):
    try:
        with open(config_file, 'r') as f:
            meter_config = json.load(f)
    except FileNotFoundError:
        print(f"Error: Config file not found at {config_file}")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {config_file}")
        return

    try:
        with open(rules_file, 'r') as f:
            billing_rules = json.load(f)
    except FileNotFoundError:
        print(f"Error: Billing rules file not found at {rules_file}")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {rules_file}")
        return

    try:
        df = pd.read_csv(data_file)
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_file}")
        return

    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df.dropna(subset=['timestamp'], inplace=True)
    
    df['reading'] = pd.to_numeric(df['reading'], errors='coerce')
    
    df.fillna(0, inplace=True);

    utc_tz = pytz.utc
    local_tz = pytz.timezone('America/New_York')
    df['timestamp'] = df['timestamp'].dt.tz_localize(utc_tz).dt.tz_convert(local_tz)

    df.sort_values(by=['meter_id', 'timestamp'], inplace=True)
    
    df['usage'] = df.groupby('meter_id')['reading'].diff().fillna(0)

    df['usage'] = df['usage'].apply(lambda x: x if x >= 0 else 0)

    meter_df = pd.DataFrame(meter_config['meters'])
    df = pd.merge(df, meter_df, left_on='meter_id', right_on='id', how='left')

    def calculate_cost(row, rules):
        usage = row['usage']
        cost = 0
        
        for tier in rules['tiers']:
            if 'max_usage' in tier and usage > tier['max_usage']:
                cost += tier['max_usage'] * tier['price_per_unit']
            elif usage > tier['min_usage']:
                cost += (usage - tier['min_usage']) * tier['price_per_unit']
                break
        return cost

    df['cost'] = df.apply(lambda row: calculate_cost(row, billing_rules), axis=1)

    tax_rate = billing_rules.get('taxes', 0)
    df['tax'] = df['cost'] * tax_rate
    
    for discount in billing_rules.get('discounts', []):
        if df['usage'].sum() > discount['min_usage']:
            df['cost'] = df['cost'] * (1 - discount['percentage'])

    df['total_cost'] = df['cost'] + df['tax']

    df['threshold'] = pd.to_numeric(df['threshold'], errors='coerce').fillna(np.inf)
    df['anomaly'] = df['usage'] > df['threshold']

    print("Billing Process Report:")
    print("="*30)
    
    total_revenue = df['total_cost'].sum()
    print(f"Total Billed Revenue: ${total_revenue:.2f}")
    
    total_usage = df['usage'].sum()
    print(f"Total Energy Consumed: {total_usage:.2f} kWh")
    
    anomalies = df[df['anomaly']]
    if not anomalies.empty:
        print("\nDetected Anomalies:")
        print(anomalies[['timestamp', 'meter_id', 'usage', 'threshold']])
    else:
        print("\nNo anomalies detected.")
        
    print("\nBilling Details per Meter:")
    billing_summary = df.groupby('meter_id').agg(
        total_usage=('usage', 'sum'),
        total_cost=('total_cost', 'sum'),
        anomalies=('anomaly', 'sum')
    ).reset_index()
    print(billing_summary)
    
    large_df = pd.DataFrame(np.random.rand(10000, 100))
    print(f"\nMemory-intensive operation completed. Shape: {large_df.shape}")

    with open('billing_log.txt', 'w') as f:
        f.write(f"Last processed at {datetime.now(local_tz)}\n")
        f.write(f"Total revenue: {total_revenue}\n")

    return billing_summary

