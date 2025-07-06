"""
Field crew models with specializations, availability, and location tracking.
Supports optimal dispatch and workload balancing across service territory.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Tuple
from datetime import datetime, time
from enum import Enum
import math

class CrewSpecialization(str, Enum):
    """Different types of field crew specializations for outage restoration"""
    LINE_WORKER = "line_worker"           # Power line repair and maintenance
    TREE_REMOVAL = "tree_removal"         # Vegetation management and removal
    SUBSTATION_TECH = "substation_tech"   # Substation equipment repair
    EMERGENCY_RESPONSE = "emergency_response"  # First response and assessment

class CrewStatus(str, Enum):
    """Real-time crew availability and activity status"""
    AVAILABLE = "available"      # Ready for assignment
    DISPATCHED = "dispatched"    # En route to incident
    ON_SITE = "on_site"         # Working at incident location
    RETURNING = "returning"      # Returning to base
    OFF_DUTY = "off_duty"       # Not available for assignments

class FieldCrew(BaseModel):
    """
    Field crew with specializations, equipment, and real-time status tracking.
    
    Enables optimal dispatch decisions based on skills, location, and availability.
    Tracks crew capabilities for complex restoration work assignments.
    """
    
    crew_id: str
    name: str
    team_size: int = Field(..., ge=1, le=8)
    
    # Specialization and capabilities
    specialization: CrewSpecialization
    skill_level: str = Field(..., regex="^(JUNIOR|SENIOR|EXPERT)$")
    certifications: List[str] = Field(default_factory=list)
    equipment: List[str] = Field(default_factory=list)
    
    # Location and availability
    current_latitude: float = Field(..., ge=-90, le=90)
    current_longitude: float = Field(..., ge=-180, le=180)
    status: CrewStatus = Field(default=CrewStatus.AVAILABLE)
    last_location_update: datetime = Field(default_factory=datetime.now)
    
    # Schedule and workload
    shift_end: datetime
    current_assignments: List[str] = Field(default_factory=list)  # List of incident IDs
    hours_worked_today: float = Field(default=0.0, ge=0)
    
    def is_available_for_assignment(self) -> bool:
        """
        Check if crew is available for new incident assignments.
        
        Business Rules for Availability:
        - Status must be AVAILABLE or RETURNING
        - Must have less than 16 hours worked today (safety regulation)
        - Shift must not end within 4 hours (minimum assignment time)
        - Cannot have more than 2 active assignments
        
        Copilot Prompting Tip:
        "Check crew availability using status, hours worked, shift time, and assignment count"
        
        Returns:
            True if crew can accept new assignments
        """
        # TODO: Implement availability checking logic using business rules above
        # TODO: Check status is AVAILABLE or RETURNING
        # TODO: Verify hours_worked_today < 16
        # TODO: Check shift_end is more than 4 hours away
        # TODO: Ensure len(current_assignments) < 2
        # TODO: Return boolean result
        
        return False  # Placeholder - implement in tasks
    
    def calculate_response_time(self, incident_latitude: float, incident_longitude: float) -> int:
        """
        Calculate estimated response time to incident location.
        
        Business Rules for Response Time:
        - Emergency vehicle speed: 60 km/h in city, 80 km/h on highway
        - Add 15 minutes for crew preparation and equipment loading
        - Add 5 minutes per specialization equipment item (crane, bucket truck, etc.)
        - Round up to nearest 15-minute interval for scheduling
        
        Args:
            incident_latitude: Incident location latitude
            incident_longitude: Incident location longitude
            
        Returns:
            Estimated response time in minutes
        """
        # TODO: Calculate distance using Haversine formula
        # TODO: Apply emergency vehicle speed (assume 60 km/h average in city)
        # TODO: Add preparation time (15 minutes base + 5 minutes per equipment item)
        # TODO: Round up to nearest 15-minute interval
        # TODO: Return total estimated time in minutes
        
        return 60  # Placeholder - implement in tasks
    
    def get_specialization_match_score(self, required_specialization: CrewSpecialization) -> int:
        """
        Calculate how well crew specialization matches incident requirements.
        
        Business Rules for Specialization Matching:
        - Exact match: 100 points
        - LINE_WORKER can do EMERGENCY_RESPONSE: 75 points
        - EMERGENCY_RESPONSE can do any other: 50 points  
        - All others: 25 points (basic electrical work)
        
        Args:
            required_specialization: Specialization needed for incident
            
        Returns:
            Match score from 0-100 (higher is better)
        """
        # TODO: Implement specialization matching logic using business rules above
        # TODO: Check for exact match first (100 points)
        # TODO: Apply cross-training rules for related specializations
        # TODO: Return appropriate score based on match quality
        
        return 50  # Placeholder - implement in tasks

class CrewAssignment(BaseModel):
    """
    Assignment linking crews to specific outage incidents.
    Tracks assignment timeline, progress, and completion status.
    """
    
    assignment_id: str = Field(default_factory=lambda: f"ASSIGN_{uuid.uuid4().hex[:6]}")
    crew_id: str
    incident_id: str
    assigned_at: datetime = Field(default_factory=datetime.now)
    
    # Assignment details
    role: str = Field(..., regex="^(LEAD|SUPPORT|SPECIALIST)$")
    estimated_arrival: datetime
    actual_arrival: Optional[datetime] = None
    estimated_completion: datetime
    actual_completion: Optional[datetime] = None
    
    # Progress tracking
    work_progress_percent: int = Field(default=0, ge=0, le=100)
    status_notes: List[str] = Field(default_factory=list)
    resources_used: Dict[str, float] = Field(default_factory=dict)  # equipment hours, materials
