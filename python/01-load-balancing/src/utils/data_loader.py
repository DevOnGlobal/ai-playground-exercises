"""
Data loading utilities to connect business logic with sample data files.
Provides clean access to grid topology, power sources, and measurement data.
"""

import json
import csv
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from pathlib import Path

from ..models.grid_infrastructure import GridTopology, GridSegment, PowerTransferPath
from ..models.power_sources import PowerSource, PowerSourceType
from ..models.load_measurements import LoadMeasurement, MeasurementQuality

class GridDataLoader:
    """
    Central data loading class that provides clean access to all grid data.
    Connects sample JSON/CSV files to business logic without external dependencies.
    """
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
    
    def load_grid_topology(self) -> GridTopology:
        """
        Load complete grid topology from JSON configuration.
        
        Reads grid_topology.json and converts to validated Pydantic models.
        Provides current grid state with segments, capacities, and connections.
        """
        # TODO: Load and parse grid_topology.json
        # - Read JSON file with error handling
        # - Convert to GridSegment and PowerTransferPath objects
        # - Validate data integrity and relationships
        # - Return complete GridTopology with segments and connections
        try:
            with open(self.data_dir / "grid_topology.json", "r") as f:
                data = json.load(f)
            
            # Convert segments data to GridSegment objects
            segments = [GridSegment(**segment_data) for segment_data in data["segments"]]
            
            # Convert transfer paths if present
            transfer_paths = []
            if "transfer_paths" in data:
                transfer_paths = [PowerTransferPath(**path_data) for path_data in data["transfer_paths"]]
            
            return GridTopology(segments=segments, transfer_paths=transfer_paths)
        except Exception as e:
            raise ValueError(f"Failed to load grid topology: {e}")
    
    def load_power_sources(self) -> List[PowerSource]:
        """
        Load power generation sources with their characteristics.
        
        Reads power_sources.json with capacity, cost, and reliability data.
        Used for economic dispatch and generation optimization decisions.
        
        Copilot Prompting Tip:
        "Implement the load_power_sources method. Read power_sources.json, parse each source, and convert to PowerSource Pydantic models. Include error handling."
        """
        try:
            with open(self.data_dir / "power_sources.json", "r") as f:
                data = json.load(f)
            return [PowerSource(**source_data) for source_data in data["sources"]]
        except Exception as e:
            raise ValueError(f"Failed to load power sources: {e}")
    
    def load_measurement_data(self, file_path: str = "sample_load_data.csv") -> List[LoadMeasurement]:
        """
        Load load measurement data from CSV file with data quality validation.
        
        Reads time-series load data and validates for analysis.
        Returns clean data ready for load balancing calculations.
        
        Args:
            file_path: CSV file with timestamp, segment_id, load_mw columns
            
        Returns:
            List of measurement records with parsed timestamps and validated values
            
        Copilot Prompting Tip:
        "Implement robust CSV file reading for load measurement data. Parse timestamp strings to datetime objects, convert load_mw to float with validation, and validate measurement_quality. Filter out invalid or missing data points and return a list of LoadMeasurement Pydantic models."
        """
        measurements = []
        
        try:
            with open(self.data_dir / file_path, "r") as f:
                csv_reader = csv.DictReader(f)
                for row in csv_reader:
                    try:
                        # Attempt to create a LoadMeasurement Pydantic model
                        # Pydantic will handle type conversion and validation based on the model definition
                        measurement = LoadMeasurement(
                            timestamp=row['timestamp'],
                            segment_id=row['segment_id'],
                            load_mw=float(row['load_mw']),
                            measurement_quality=row.get('measurement_quality', 'good') # Default to 'good' if not present
                        )
                        measurements.append(measurement)
                    except (ValueError, KeyError) as e:
                        print(f"Skipping invalid measurement row: {row} - Error: {e}")
                        # Log or handle invalid rows as needed
        except Exception as e:
            raise ValueError(f"Failed to load measurement data from {file_path}: {e}")
        
        return measurements
    
    def get_current_grid_state(self) -> Dict[str, any]:
        """
        Get complete current state of the grid for decision making.
        
        Combines topology, current loads, and available power sources.
        Calculates system-wide metrics for monitoring and optimization.
        
        Copilot Prompting Tip:
        "Implement the get_current_grid_state method. Load grid topology and power sources. Calculate total system capacity and demand. Return a comprehensive dictionary including topology, power sources, total capacity, total current load, system utilization, and a timestamp."
        """
        topology = self.load_grid_topology()
        power_sources = self.load_power_sources()
        
        # Calculate total current load from the segments in the topology
        total_current_load = sum(segment.current_load_mw for segment in topology.segments)
        total_capacity = sum(segment.max_capacity_mw for segment in topology.segments)
        
        return {
            "topology": topology,
            "power_sources": power_sources,
            "total_capacity_mw": total_capacity,
            "total_current_load_mw": total_current_load,
            "system_utilization_pct": (total_current_load / total_capacity) * 100 if total_capacity > 0 else 0.0,
            "timestamp": datetime.now()
        }
