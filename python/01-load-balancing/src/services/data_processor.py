"""
Data processing service for analyzing load data and calculating grid metrics.
Uses standard Python libraries for data manipulation and analysis.
"""

import json
import csv
from typing import List, Dict, Tuple, Optional
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import statistics
import math

class LoadDataProcessor:
    """
    Processes load measurement data and calculates grid performance metrics.
    Provides aggregations, trend analysis, and capacity utilization calculations.
    """
    
    def __init__(self, data_loader):
        self.data_loader = data_loader
        self.processed_data = {}
        self.alert_thresholds = {
            "warning": 80.0,
            "critical": 90.0, 
            "emergency": 95.0
        }
    
    def analyze_load_patterns(self, measurements: List[Dict]) -> Dict[str, any]:
        """
        Analyze load measurement patterns for operational insights.
        
        Examines time-series data to identify peak periods, trends, and anomalies.
        Used for load forecasting and capacity planning decisions.
        
        Args:
            measurements: List of load measurement records with timestamps and values
            
        Returns:
            Dictionary with pattern analysis results and operational recommendations
        """
        # TODO: Implement comprehensive load pattern analysis
        # - Group measurements by time periods (hourly, daily patterns)
        # - Calculate peak load times and minimum load periods
        # - Identify weekly and seasonal patterns
        # - Detect unusual consumption patterns or anomalies
        # - Calculate load growth rates and trending
        # - Return actionable insights for grid operations
        
        if not measurements:
            return {"error": "No measurement data provided"}
        
        # Group measurements by segment and time period
        segment_data = defaultdict(list)
        hourly_patterns = defaultdict(list)
        
        for measurement in measurements:
            segment_id = measurement.get("segment_id")
            timestamp = measurement.get("timestamp")
            load_mw = measurement.get("load_mw")
            
            if segment_id and timestamp and load_mw is not None:
                segment_data[segment_id].append(load_mw)
                
                # Extract hour for daily pattern analysis
                if isinstance(timestamp, datetime):
                    hour = timestamp.hour
                    hourly_patterns[hour].append(load_mw)
        
        # Calculate statistics for each segment
        segment_stats = {}
        for segment_id, loads in segment_data.items():
            if loads:
                segment_stats[segment_id] = {
                    "average_load": statistics.mean(loads),
                    "peak_load": max(loads),
                    "min_load": min(loads),
                    "load_variance": statistics.variance(loads) if len(loads) > 1 else 0
                }
        
        # Calculate daily patterns
        daily_pattern = {}
        for hour, loads in hourly_patterns.items():
            if loads:
                daily_pattern[hour] = {
                    "average_load": statistics.mean(loads),
                    "load_count": len(loads)
                }
        
        return {
            "segment_statistics": segment_stats,
            "daily_load_pattern": daily_pattern,
            "total_measurements": len(measurements),
            "analysis_timestamp": datetime.now()
        }
    
    def detect_load_anomalies(self, measurements: List[Dict], threshold_std: float = 2.0) -> List[Dict]:
        """
        Identify unusual load patterns that may indicate equipment issues.
        
        Uses statistical analysis to find outliers and abnormal consumption patterns.
        Returns list of anomaly events with severity and timestamps for investigation.
        
        Args:
            measurements: Load measurement data for analysis
            threshold_std: Number of standard deviations for anomaly detection
            
        Returns:
            List of detected anomalies with timestamps and severity levels
        """
        # TODO: Implement statistical anomaly detection
        # - Calculate rolling averages and standard deviations for each segment
        # - Identify measurements outside normal statistical ranges
        # - Classify anomaly types: sudden spike, unexpected drop, sustained deviation
        # - Calculate anomaly severity based on magnitude and duration
        # - Generate anomaly reports with actionable information for operators
        anomalies = []
        
        # Group measurements by segment for individual analysis
        segment_measurements = defaultdict(list)
        for measurement in measurements:
            segment_id = measurement.get("segment_id")
            if segment_id:
                segment_measurements[segment_id].append(measurement)
        
        # Analyze each segment for anomalies
        for segment_id, segment_data in segment_measurements.items():
            if len(segment_data) < 5:  # Need minimum data for statistical analysis
                continue
            
            loads = [m.get("load_mw", 0) for m in segment_data]
            mean_load = statistics.mean(loads)
            std_load = statistics.stdev(loads) if len(loads) > 1 else 0
            
            # Find outliers beyond threshold
            for measurement in segment_data:
                load_value = measurement.get("load_mw", 0)
                deviation = abs(load_value - mean_load)
                
                if std_load > 0 and deviation > (threshold_std * std_load):
                    anomaly_severity = "HIGH" if deviation > (3 * std_load) else "MEDIUM"
                    
                    anomalies.append({
                        "segment_id": segment_id,
                        "timestamp": measurement.get("timestamp"),
                        "load_mw": load_value,
                        "expected_load": mean_load,
                        "deviation": deviation,
                        "severity": anomaly_severity,
                        "anomaly_type": "STATISTICAL_OUTLIER"
                    })
        
        return sorted(anomalies, key=lambda x: x.get("timestamp", datetime.min))
    
    def calculate_grid_efficiency_metrics(self, grid_state: Dict) -> Dict[str, float]:
        """
        Calculate key performance indicators for grid operations.
        
        Computes efficiency metrics, utilization rates, and performance indicators.
        Used for operational dashboards and regulatory reporting.
        """
        # TODO: Implement comprehensive efficiency calculations
        # - Calculate overall grid utilization percentage
        # - Determine load factor and capacity factor metrics
        # - Compute power loss percentages across transfer paths
        # - Calculate demand diversity factor across segments
        # - Generate reliability and availability metrics
        # - Return structured metrics for dashboard display
        
        # Business Rule: Overall grid utilization is total_current_load_mw / total_capacity_mw * 100
        # Business Rule: Power loss across transfer paths is sum of (transfer_mw * power_loss_pct)
        # Copilot Prompting Tip: "Implement calculation for overall grid utilization and total power loss across all active transfer paths."

        total_capacity = grid_state.get("total_capacity_mw", 0.0)
        total_current_load = grid_state.get("total_current_load_mw", 0.0)
        
        overall_utilization_pct = (total_current_load / total_capacity) * 100 if total_capacity > 0 else 0.0

        total_power_loss_mw = 0.0
        # Assuming transfer_paths are part of the grid_state topology and have current transfer data
        # This part would typically require actual transfer data from the load balancer
        # For now, we'll assume a simplified calculation or placeholder
        
        # Placeholder for power loss calculation - would need actual transfers to be meaningful
        # For a more complete implementation, this would integrate with the load balancer's transfer recommendations
        # For the purpose of this exercise, we'll keep it simple.
        
        # Example: If we had a list of active transfers with their amounts and path losses
        # for transfer in active_transfers:
        #     path = self.data_loader.load_grid_topology().get_transfer_path(transfer["from"], transfer["to"])
        #     if path:
        #         total_power_loss_mw += transfer["amount"] * (path.power_loss_pct / 100)

        return {
            "overall_grid_utilization_pct": overall_utilization_pct,
            "total_power_loss_mw": total_power_loss_mw, # This will be 0.0 until integrated with actual transfers
            "timestamp": datetime.now()
        }
