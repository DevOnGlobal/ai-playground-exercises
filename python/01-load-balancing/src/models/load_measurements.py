"""
Load measurement data models using Pydantic for validation.
Defines the core structures for time-series load data.
"""

from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional
from enum import Enum

class MeasurementQuality(str, Enum):
    """Quality status of a load measurement."""
    GOOD = 'good'
    SUSPECT = 'suspect'
    BAD = 'bad'
    MISSING = 'missing'

class LoadMeasurement(BaseModel):
    """
    Represents a single load measurement at a specific timestamp for a grid segment.
    
    Business Rules for LoadMeasurement:
    - timestamp must be a valid datetime object.
    - load_mw must be a non-negative float.
    - segment_id must be a non-empty string.
    
    Copilot Prompting Tip:
    "Implement a Pydantic model for LoadMeasurement including fields for timestamp, segment_id, load_mw, and measurement_quality. Add validation for load_mw to be non-negative."
    
    Args:
        timestamp: The datetime when the measurement was taken.
        segment_id: The ID of the grid segment where the measurement was taken.
        load_mw: The measured load in MW.
        measurement_quality: The quality of the measurement (e.g., GOOD, SUSPECT).
    """
    timestamp: datetime
    segment_id: str = Field(..., min_length=1, description="ID of the grid segment")
    load_mw: float = Field(ge=0, description="Measured load in MW")
    measurement_quality: MeasurementQuality = MeasurementQuality.GOOD

    @validator('timestamp', pre=True)
    def parse_timestamp(cls, v):
        """Parse timestamp string to datetime object."
        # Business Rule: Timestamps can come as strings and need to be parsed.
        # Copilot Prompting Tip: "Add a Pydantic validator to parse timestamp strings into datetime objects. Consider common formats like ISO 8601."
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v.replace('Z', '+00:00')) # Handle 'Z' for UTC
            except ValueError:
                # Attempt to parse other common formats if ISO fails
                for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S.%f'):
                    try:
                        return datetime.strptime(v, fmt)
                    except ValueError:
                        continue
                raise ValueError(f"Could not parse timestamp: {v}")
        return v
