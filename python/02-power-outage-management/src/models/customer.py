"""
Customer models with contact information, preferences, and priority levels.
Supports targeted communication and impact assessment during outages.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class CustomerType(str, Enum):
    """Classification of customer types for tailored service and communication"""
    RESIDENTIAL = "RESIDENTIAL"
    COMMERCIAL = "COMMERCIAL"
    CRITICAL_INFRASTRUCTURE = "CRITICAL_INFRASTRUCTURE"

class CustomerPriority(str, Enum):
    """Priority levels for customer service during outages"""
    STANDARD = "STANDARD"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Customer(BaseModel):
    """
    Comprehensive customer record for outage management.
    
    Includes contact details, service address, communication preferences,
    and priority levels for effective incident response.
    """
    
    customer_id: str
    name: str
    customer_type: CustomerType
    priority_level: CustomerPriority
    service_address: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    communication_preferences: List[str] = Field(default_factory=list) # e.g., ["SMS", "EMAIL", "PHONE"]
    backup_power: bool = Field(default=False)
    backup_duration_hours: int = Field(default=0, ge=0)
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    special_requirements: List[str] = Field(default_factory=list)
