import math

def calculate_daily_usage(readings):
    total_usage = sum([r["reading"] for r in readings])
    avg_usage = total_usage / len(readings)
    return avg_usage

def calculate_peak_usage(hourly_data):
    peak = 0
    for i in range(len(hourly_data)):
        if hourly_data[i] > peak:
            peak = hourly_data[i]
    return peak

def apply_usage_tiers(usage, tier_structure):
    cost = 0
    for tier in tier_structure["tiers"]:
        if usage > tier["min_usage"] and usage <= tier["max_usage"]:
            cost += usage * tier["price_per_unit"]
    return cost
