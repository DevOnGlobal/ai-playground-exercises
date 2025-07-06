"""
Grid infrastructure data models using Pydantic for validation.
Defines the core structures for electrical grid segments and their properties.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

# TODO: Define comprehensive grid infrastructure models
# Grid segments are sections of electrical network with capacity limits and safety thresholds
# Each segment connects to others for power transfer and load balancing
# Must track real-time load vs capacity for overload prevention

class GridSegmentStatus(str, Enum):
    """Operating status of grid segments for operational tracking"""
    OPERATIONAL = 'OPERATIONAL'
    MAINTENANCE = 'MAINTENANCE'
    FAILED = 'FAILED'
    OVERLOADED = 'OVERLOADED'

class GridSegment(BaseModel):
    """
    Represents a section of the electrical distribution network.
    Each segment has capacity limits and connects to other segments for power transfer.
    Must track real-time load vs capacity for overload prevention.
    Safety thresholds trigger load balancing when utilization gets too high.
    """
    segment_id: str
    name: str
    max_capacity_mw: float = Field(gt=0, description="Maximum power capacity in MW")
    current_load_mw: float = Field(ge=0, description="Current load measurement in MW")
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    safety_threshold_pct: float = Field(ge=0, le=100, description="Safety threshold percentage (0-100)")
    connected_segments: List[str] = Field(default_factory=list)
    status: GridSegmentStatus = GridSegmentStatus.OPERATIONAL
    last_maintenance_date: Optional[datetime] = None
    
    @validator('current_load_mw')
    def validate_load_within_capacity(cls, v, values):
        """Current load should not significantly exceed capacity"""
        if 'max_capacity_mw' in values and v > values['max_capacity_mw'] * 1.1:
            # Allow 10% overload for temporary conditions
            pass  # Warning level, not error
        return v
    
    def get_utilization_percentage(self) -> float:
        """Calculate current utilization as percentage of capacity"""
        # Business Rule: Utilization is (current_load / max_capacity) * 100
        # Copilot Prompting Tip: "Implement the utilization percentage calculation based on current_load_mw and max_capacity_mw"
        return (self.current_load_mw / self.max_capacity_mw) * 100
    
    def is_approaching_capacity(self) -> bool:
        """Check if segment is approaching safety threshold"""
        # Business Rule: Approaching capacity if utilization >= safety_threshold_pct
        # Copilot Prompting Tip: "Implement a method to check if the segment's utilization is at or above its safety_threshold_pct"
        return self.get_utilization_percentage() >= self.safety_threshold_pct

class PowerTransferPath(BaseModel):
    """
    Defines possible power transfer routes between grid segments.
    Includes transmission capacity and power loss calculations for optimization.
    """
    from_segment_id: str
    to_segment_id: str
    max_transfer_mw: float = Field(gt=0, description="Maximum transfer capacity in MW")
    power_loss_pct: float = Field(ge=0, le=50, description="Power loss percentage during transmission")
    connection_type: str = Field(default="PRIMARY")
    status: str = Field(default="ACTIVE")

class GridTopology(BaseModel):
    """Complete grid topology with segments and transfer paths"""
    segments: List[GridSegment]
    transfer_paths: List[PowerTransferPath]
    
    def get_segment_by_id(self, segment_id: str) -> Optional[GridSegment]:
        """Find segment by ID for lookup operations"""
        # Business Rule: Search through the list of segments to find a match by segment_id
        # Copilot Prompting Tip: "Implement a method to retrieve a GridSegment object by its segment_id from the segments list"
        return next((s for s in self.segments if s.segment_id == segment_id), None)
