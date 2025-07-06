"""
Equipment models for tracking infrastructure components and their status.
Supports impact assessment and resource allocation during outages.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class EquipmentType(str, Enum):
    """Types of electrical grid equipment"""
    SUBSTATION = "substation"
    POWER_LINE = "power_line"
    TRANSFORMER = "transformer"
    POLE = "pole"
    CIRCUIT_BREAKER = "circuit_breaker"

class EquipmentStatus(str, Enum):
    """Operational status of equipment"""
    OPERATIONAL = "operational"
    OUT_OF_SERVICE = "out_of_service"
    UNDER_MAINTENANCE = "under_maintenance"
    DAMAGED = "damaged"

class Equipment(BaseModel):
    """
    Base model for electrical grid equipment.
    
    Captures common attributes for various equipment types.
    """
    equipment_id: str
    name: str
    equipment_type: EquipmentType
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    status: EquipmentStatus = Field(default=EquipmentStatus.OPERATIONAL)
    customers_served: int = Field(default=0, ge=0)
    voltage_level: Optional[str] = None
    capacity_mva: Optional[float] = None
    last_inspection_date: Optional[str] = None
    next_maintenance_date: Optional[str] = None

class Substation(Equipment):
    """
    Model for a substation, inheriting from Equipment.
    """
    equipment_type: EquipmentType = EquipmentType.SUBSTATION
    backup_available: bool = Field(default=False)
    critical_customers: List[str] = Field(default_factory=list)

class PowerLine(Equipment):
    """
    Model for a power line, inheriting from Equipment.
    """
    equipment_type: EquipmentType = EquipmentType.POWER_LINE
    from_substation: str
    to_substation: str
    line_length_km: float = Field(default=0.0, ge=0)
    max_load_amps: Optional[int] = None
