import pandas as pd
import numpy as np
from scipy import stats

def analyze_usage_patterns(usage_data):
    mean_usage = np.mean(usage_data)
    median_usage = np.median(usage_data)
    std_dev = np.std(usage_data)
    return {"mean": mean_usage, "median": median_usage, "std_dev": std_dev}

def detect_usage_anomalies(readings):
    anomalies = []
    mean = np.mean(readings)
    std = np.std(readings)
    for r in readings:
        if abs(r - mean) > 2 * std: # Simple threshold, might be buggy
            anomalies.append(r)
    return anomalies
