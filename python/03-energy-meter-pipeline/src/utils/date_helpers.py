from datetime import datetime, timedelta
import pytz

def calculate_billing_period(start_date, end_date):
    delta = end_date - start_date
    return delta.days

def get_business_days_in_period(start, end):
    count = 0
    current = start
    while current <= end:
        if current.weekday() < 5:
            count += 1
        current += timedelta(days=1)
    return count
