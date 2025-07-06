"""
Utility functions for estimating time based on various factors.
"""

from datetime import datetime, timedelta

def estimate_restoration_time(incident_severity: str, affected_customers: int, crew_count: int) -> float:
    """
    Estimates the restoration time for an incident based on severity, affected customers, and available crews.

    Business Rules:
    - Base time: MINOR=2h, MODERATE=4h, MAJOR=8h, CRITICAL=12h, CATASTROPHIC=24h
    - Add 1 hour per 100 residential customers affected.
    - Add 2 hours per 10 commercial customers affected.
    - Add 5 hours per critical infrastructure affected.
    - Reduce time by 10% for each crew assigned (up to 5 crews).

    Args:
        incident_severity: The severity of the incident (e.g., "MINOR", "MAJOR").
        affected_customers: Total number of customers affected.
        crew_count: Number of crews assigned to the incident.

    Returns:
        Estimated restoration time in hours.
    """
    base_times = {
        "MINOR": 2,
        "MODERATE": 4,
        "MAJOR": 8,
        "CRITICAL": 12,
        "CATASTROPHIC": 24
    }
    estimated_hours = base_times.get(incident_severity, 4.0)

    # This is a simplified estimation. In a real system, this would be more complex
    # and depend on specific customer types (residential, commercial, critical infra)
    # and equipment involved.
    estimated_hours += affected_customers / 100.0 # Simplified: 1 hour per 100 customers

    # Reduce time by 10% for each crew assigned (up to 5 crews)
    crew_reduction_factor = min(crew_count, 5) * 0.10
    estimated_hours *= (1 - crew_reduction_factor)

    return max(0.5, estimated_hours) # Minimum 30 minutes