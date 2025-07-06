"""
Data loading utilities that connect JSON files to business logic.
Provides complete operational context for all outage management components.
"""

import json
from typing import Dict, List, Optional
from pathlib import Path

class OutageDataLoader:
    """
    Central data access for all outage management components.
    Loads and provides structured access to infrastructure, crew, and customer data.
    """
    
    def __init__(self, data_directory: str = "data"):
        self.data_dir = Path(data_directory)
        self._infrastructure_cache = None
        self._crew_cache = None
        self._customer_cache = None
    
    def get_current_grid_state(self) -> Dict:
        """
        Load complete infrastructure topology and current operational status.
        
        Returns:
            Complete grid state including substations, power lines, and current loads
        """
        if self._infrastructure_cache is None:
            with open(self.data_dir / "infrastructure_map.json") as f:
                self._infrastructure_cache = json.load(f)
        return self._infrastructure_cache
    
    def get_available_crews(self) -> List[Dict]:
        """
        Load all crew information with current status and capabilities.
        
        Returns:
            List of crew objects with location, specialization, and availability
        """
        if self._crew_cache is None:
            with open(self.data_dir / "crew_roster.json") as f:
                crew_data = json.load(f)
                self._crew_cache = crew_data["crews"]
        return self._crew_cache
    
    def get_customers_in_area(self, latitude: float, longitude: float, 
                             radius_km: float = 5.0) -> List[Dict]:
        """
        Find customers within specified radius of incident location.
        
        Args:
            latitude: Incident latitude coordinate
            longitude: Incident longitude coordinate
            radius_km: Search radius in kilometers (default 5km)
            
        Returns:
            List of affected customers with contact preferences and priority levels
        """
        if self._customer_cache is None:
            with open(self.data_dir / "customer_database.json") as f:
                customer_data = json.load(f)
                self._customer_cache = customer_data["customers"]
        
        # TODO: Filter customers by distance from incident
        # Business Rule: Use Haversine formula for distance calculation
        # Business Rule: Include customers within radius_km of incident location
        # Tip for Copilot: "Find customers within radius using geographic distance"
        affected_customers = []
        # Implementation will be done in tasks
        return affected_customers
    
    def get_equipment_by_id(self, equipment_id: str) -> Optional[Dict]:
        """
        Retrieve specific equipment details by ID.
        
        Args:
            equipment_id: Equipment identifier (e.g., "SUB_001", "LINE_005")
            
        Returns:
            Equipment details or None if not found
        """
        grid_state = self.get_current_grid_state()
        
        # Search in substations
        for substation in grid_state.get("substations", []):
            if substation["equipment_id"] == equipment_id:
                return substation
                
        # Search in power lines
        for line in grid_state.get("power_lines", []):
            if line["equipment_id"] == equipment_id:
                return line
                
        return None

# Global data loader instance for use throughout the application
data_loader = OutageDataLoader()