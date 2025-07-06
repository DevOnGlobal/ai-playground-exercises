"""
Power source data models using Pydantic for validation.
Defines the core structures for various types of power generation facilities.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class PowerSourceType(str, Enum):
    SOLAR = 'SOLAR'
    WIND = 'WIND'
    COAL = 'COAL'
    NATURAL_GAS = 'NATURAL_GAS'
    NUCLEAR = 'NUCLEAR'
    HYDROELECTRIC = 'HYDROELECTRIC'

class PowerSource(BaseModel):
    """
    Power generation facility with capacity and economic characteristics.
    
    Business Rules for PowerSource:
    - current_output_mw must not exceed max_capacity_mw.
    - reliability_score must be between 0.0 and 1.0.
    - cost_per_mwh must be non-negative.
    - startup_time_minutes must be non-negative.
    
    Copilot Prompting Tip:
    "Implement a Pydantic model for PowerSource including validation for output vs capacity, reliability score, and cost."
    
    Args:
        source_id: Unique identifier for the power source.
        name: Human-readable name of the power source.
        source_type: Type of power generation (e.g., SOLAR, WIND).
        max_capacity_mw: Maximum power generation capacity in MW.
        current_output_mw: Current power output in MW.
        reliability_score: A score from 0.0 to 1.0 indicating reliability.
        cost_per_mwh: Cost of generating 1 MWh of power.
        latitude: Latitude coordinate of the power source.
        longitude: Longitude coordinate of the power source.
        operational_status: Current operational status (e.g., ONLINE, OFFLINE).
        startup_time_minutes: Time in minutes required to bring the source online.
        weather_dependent: Boolean indicating if output is weather-dependent.
    """
    source_id: str
    name: str
    source_type: PowerSourceType
    max_capacity_mw: float = Field(gt=0, description="Maximum power generation capacity in MW")
    current_output_mw: float = Field(ge=0, description="Current power output in MW")
    reliability_score: float = Field(ge=0.0, le=1.0, description="Reliability score (0.0-1.0)")
    cost_per_mwh: float = Field(ge=0, description="Cost per MWh of generation")
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    operational_status: str = Field(default="UNKNOWN")
    startup_time_minutes: Optional[int] = Field(ge=0, default=0)
    weather_dependent: bool = False

    @validator('current_output_mw')
    def validate_output_within_capacity(cls, v, values):
        """Current output should not exceed maximum capacity."""
        # Business Rule: current_output_mw must be less than or equal to max_capacity_mw.
        # Copilot Prompting Tip: "Add a Pydantic validator to ensure current_output_mw does not exceed max_capacity_mw."
        if 'max_capacity_mw' in values and v > values['max_capacity_mw']:
            raise ValueError('current_output_mw cannot exceed max_capacity_mw')
        return v

    def get_cost_per_hour(self, output_mw: float) -> float:
        """Calculate the operational cost per hour for a given output.
        
        Business Rule: Cost per hour is (output_mw * cost_per_mwh).
        Copilot Prompting Tip: "Implement a method to calculate the hourly cost of operation given a specific output in MW."
        
        Args:
            output_mw: The power output in MW for which to calculate the cost.
            
        Returns:
            The operational cost per hour.
        """
        return output_mw * self.cost_per_mwh

    def is_renewable(self) -> bool:
        """Check if the power source is renewable."
        # Business Rule: Renewable sources are SOLAR, WIND, HYDROELECTRIC.
        # Copilot Prompting Tip: "Implement a method to determine if the power source type is renewable."
        return self.source_type in [PowerSourceType.SOLAR, PowerSourceType.WIND, PowerSourceType.HYDROELECTRIC]
