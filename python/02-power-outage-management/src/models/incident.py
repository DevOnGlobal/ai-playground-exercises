"""
Outage incident models with comprehensive lifecycle tracking.
Handles classification, severity assessment, and status management for power outages.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum
import uuid
from ..utils.data_loader import data_loader

class OutageCause(str, Enum):
    """Root causes of power outages for classification and analysis"""
    EQUIPMENT_FAILURE = "equipment_failure"
    SEVERE_WEATHER = "severe_weather"
    VEHICLE_ACCIDENT = "vehicle_accident"
    VEGETATION = "vegetation"
    ANIMAL_CONTACT = "animal_contact"
    PLANNED_MAINTENANCE = "planned_maintenance"

class OutageSeverity(str, Enum):
    """Severity classification based on customer impact and complexity"""
    MINOR = "minor"          # <100 customers, <2 hours
    MODERATE = "moderate"    # 100-500 customers, 2-6 hours
    MAJOR = "major"          # 500-2000 customers, 6-12 hours
    CRITICAL = "critical"    # >2000 customers or critical infrastructure
    CATASTROPHIC = "catastrophic"  # Multiple substations, >24 hours

class IncidentStatus(str, Enum):
    """Incident lifecycle status for workflow management"""
    REPORTED = "reported"
    CONFIRMED = "confirmed"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class OutageIncident(BaseModel):
    """
    Comprehensive outage incident with full lifecycle tracking.
    
    Captures essential information for emergency response coordination,
    crew dispatch optimization, and regulatory compliance reporting.
    """
    
    incident_id: str = Field(default_factory=lambda: f"INC_{uuid.uuid4().hex[:8]}")
    created_at: datetime = Field(default_factory=datetime.now)
    
    # Geographic impact area
    latitude: float = Field(..., ge=-90, le=90, description="Incident latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Incident longitude coordinate") 
    affected_radius_km: float = Field(default=2.0, gt=0, description="Impact radius in kilometers")
    
    # Classification and severity
    cause: OutageCause
    severity: OutageSeverity
    status: IncidentStatus = Field(default=IncidentStatus.REPORTED)
    
    # Equipment and infrastructure
    failed_equipment_ids: List[str] = Field(default_factory=list)
    backup_power_available: bool = Field(default=False)
    
    # Customer impact metrics
    estimated_customers_affected: int = Field(..., gt=0)
    critical_infrastructure_count: int = Field(default=0, ge=0)
    commercial_customer_count: int = Field(default=0, ge=0)
    residential_customer_count: int = Field(default=0, ge=0)
    
    # Timeline and estimates
    estimated_restoration_hours: float = Field(default=4.0, gt=0)
    actual_restoration_time: Optional[datetime] = None
    last_status_update: datetime = Field(default_factory=datetime.now)
    
    @validator('estimated_customers_affected')
    def validate_customer_count(cls, v):
        """Customer count must be positive"""
        if v <= 0:
            raise ValueError("Customer count must be positive")
        return v
    
    def calculate_priority_score(self) -> float:
        """
        Calculate incident priority score for crew dispatch optimization.
        
        Business Rules for Priority Scoring:
        - Critical infrastructure customers = 100 points each
        - Commercial customers = 10 points each  
        - Residential customers = 1 point each
        - Severity multipliers: CATASTROPHIC=10x, CRITICAL=5x, MAJOR=3x, MODERATE=2x, MINOR=1x
        - Duration penalty: +20 points per hour since incident creation
        - Weather condition multiplier: SEVERE_WEATHER incidents get 1.5x multiplier
        
        Copilot Prompting Tip:
        "Calculate priority using customer type weights, severity multipliers, and time penalties"
        
        Returns:
            Numeric priority score (higher = more urgent)
        """
        # TODO: Implement priority scoring algorithm using the business rules above
        # Base score from customer impact
        base_score = (
            self.critical_infrastructure_count * 100 +
            self.commercial_customer_count * 10 +
            self.residential_customer_count * 1
        )
        
        # TODO: Apply severity multiplier based on OutageSeverity enum
        # TODO: Add duration penalty based on hours since creation
        # TODO: Apply weather multiplier if cause is SEVERE_WEATHER
        # TODO: Return final calculated priority score
        
        return 0.0  # Placeholder - implement in tasks

    def get_affected_customers(self) -> List[Dict]:
        """
        Retrieve all customers affected by this incident.
        
        Uses incident location and radius to find customers in impact area.
        Connects to data loader for customer information.
        
        Returns:
            List of customer records within incident impact radius
        """
        return data_loader.get_customers_in_area(
            self.latitude, 
            self.longitude, 
            self.affected_radius_km
        )

class IncidentTimeline(BaseModel):
    """
    Timeline tracking for incident status changes and milestones.
    Provides audit trail and performance measurement data.
    """
    
    incident_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    status_change: Optional[IncidentStatus] = None
    description: str
    updated_by: str = Field(default="system")
    crew_id: Optional[str] = None
    estimated_completion: Optional[datetime] = None