import pandas as pd
import numpy as np

def aggregate_hourly_usage(readings_df):
    readings_df['timestamp'] = pd.to_datetime(readings_df['timestamp'])
    readings_df.set_index('timestamp', inplace=True)
    hourly_agg = readings_df.resample('H').sum()
    return hourly_agg

def calculate_usage_statistics(usage_df):
    stats = {
        'mean': usage_df['reading'].mean(),
        'median': usage_df['reading'].median(),
        'std': usage_df['reading'].std()
    }
    return stats
