"""
Utility functions for calculating incident priority.
"""

from typing import Dict
from ..models.incident import OutageIncident, OutageSeverity, OutageCause
from datetime import datetime, timedelta

def calculate_incident_priority(incident: OutageIncident) -> float:
    """
    Calculate incident priority score for crew dispatch optimization.
    
    Business Rules for Priority Scoring:
    - Critical infrastructure customers = 100 points each
    - Commercial customers = 10 points each  
    - Residential customers = 1 point each
    - Severity multipliers: CATASTROPHIC=10x, CRITICAL=5x, MAJOR=3x, MODERATE=2x, MINOR=1x
    - Duration penalty: +20 points per hour since incident creation
    - Weather condition multiplier: SEVERE_WEATHER incidents get 1.5x multiplier
    
    Args:
        incident: The OutageIncident object.
        
    Returns:
        Numeric priority score (higher = more urgent)
    """
    base_score = (
        incident.critical_infrastructure_count * 100 +
        incident.commercial_customer_count * 10 +
        incident.residential_customer_count * 1
    )
    
    severity_multiplier = {
        OutageSeverity.MINOR: 1,
        OutageSeverity.MODERATE: 2,
        OutageSeverity.MAJOR: 3,
        OutageSeverity.CRITICAL: 5,
        OutageSeverity.CATASTROPHIC: 10
    }.get(incident.severity, 1)
    
    score = base_score * severity_multiplier
    
    # Duration penalty
    time_since_creation = (datetime.now() - incident.created_at).total_seconds() / 3600
    score += time_since_creation * 20
    
    # Weather condition multiplier
    if incident.cause == OutageCause.SEVERE_WEATHER:
        score *= 1.5
    
    return score