"""
Grid monitoring service for real-time operational awareness and alert generation.
Tracks grid segment status and identifies potential issues based on capacity thresholds.
"""

import logging
from datetime import datetime
from typing import List, Dict
from ..utils.data_loader import GridDataLoader
from ..models.grid_infrastructure import GridSegment

class GridMonitoringSystem:
    """
    Monitors the electrical grid in real-time, checking segment utilization
    and generating alerts based on predefined thresholds.
    
    Business Rules for GridMonitoringSystem:
    - Normal: < 80% capacity (no alerts)
    - Warning: 80-90% capacity (yellow alert, monitor closely)
    - Critical: 90-95% capacity (red alert, prepare load shedding)
    - Emergency: > 95% capacity (immediate action required)
    
    Copilot Prompting Tip:
    "Implement the GridMonitoringSystem class. Focus on methods to check all segments, generate capacity alerts based on utilization thresholds, and track alert history. Include logging for audit trails."
    """
    def __init__(self):
        self.data_loader = GridDataLoader()
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        self.alert_history = []

    def _get_recommended_action(self, alert_level: str, segment: GridSegment) -> str:
        """
        Provides a recommended action based on the alert level and segment status.
        
        Args:
            alert_level: The severity level of the alert (e.g., "WARNING", "CRITICAL").
            segment: The GridSegment object associated with the alert.
            
        Returns:
            A string describing the recommended action.
        """
        if alert_level == "WARNING":
            return f"Monitor segment {segment.segment_id} closely. Consider minor load adjustments."
        elif alert_level == "CRITICAL":
            return f"Prepare for load shedding or transfer from {segment.segment_id}. Investigate immediately."
        elif alert_level == "EMERGENCY":
            return f"Immediate load shedding or transfer required for {segment.segment_id}. Critical situation."
        else:
            return "No specific action recommended."

    def generate_capacity_alerts(self) -> List[Dict]:
        """Generate alerts for segments approaching or exceeding capacity limits"""
        alerts = []
        grid_state = self.data_loader.get_current_grid_state()
        
        for segment in grid_state["topology"].segments:
            utilization = segment.get_utilization_percentage()
            
            alert_level = None
            if utilization >= 95:
                alert_level = "EMERGENCY"
            elif utilization >= 90:
                alert_level = "CRITICAL" 
            elif utilization >= 80:
                alert_level = "WARNING"
            
            if alert_level:
                alert = {
                    "segment_id": segment.segment_id,
                    "alert_level": alert_level,
                    "utilization_pct": utilization,
                    "current_load_mw": segment.current_load_mw,
                    "max_capacity_mw": segment.max_capacity_mw,
                    "timestamp": datetime.now().isoformat(),
                    "recommended_action": self._get_recommended_action(alert_level, segment)
                }
                alerts.append(alert)
                self.alert_history.append(alert) # Track alert history
                
                # Log alert for audit trail
                self.logger.warning(f"Capacity alert: {segment.segment_id} at {utilization:.1f}% capacity - Level: {alert_level}")
        
        return alerts

    def check_all_segments(self) -> List[Dict]:
        """
        Monitor all grid segments and generate alerts for capacity issues.
        
        Checks each segment against safety thresholds and generates appropriate alerts.
        Returns list of active alerts for operational dashboards.
        
        Copilot Prompting Tip:
        "Implement the check_all_segments method. It should retrieve the current grid state, iterate through each segment, calculate its utilization, and call generate_capacity_alerts if thresholds are met. Log the monitoring events."
        """
        self.logger.info("Performing routine grid segment check.")
        active_alerts = self.generate_capacity_alerts()
        if not active_alerts:
            self.logger.info("All segments operating within normal parameters.")
        return active_alerts

    def track_alert_history(self) -> List[Dict]:
        """
        Returns the historical record of generated alerts.
        
        Copilot Prompting Tip:
        "Implement a method to return the stored alert history."
        
        Returns:
            A list of dictionaries, each representing a past alert.
        """
        return self.alert_history

    def create_operational_summary(self) -> Dict:
        """
        Generates a summary report of the current grid operational status.
        
        Includes overall system utilization, number of active alerts, and segment statuses.
        
        Copilot Prompting Tip:
        "Implement a method to create an operational summary. Include total capacity, total load, system utilization, and a count of alerts by severity. Return a dictionary with this summary."
        
        Returns:
            A dictionary containing the operational summary.
        """
        grid_state = self.data_loader.get_current_grid_state()
        active_alerts = self.generate_capacity_alerts() # Re-run to get current alerts

        alert_counts = {"WARNING": 0, "CRITICAL": 0, "EMERGENCY": 0}
        for alert in active_alerts:
            alert_counts[alert["alert_level"]] += 1

        return {
            "timestamp": datetime.now().isoformat(),
            "total_capacity_mw": grid_state["total_capacity_mw"],
            "total_current_load_mw": grid_state["total_current_load_mw"],
            "system_utilization_pct": grid_state["system_utilization_pct"],
            "active_alerts_count": len(active_alerts),
            "alert_breakdown": alert_counts,
            "segment_status_summary": {
                segment.segment_id: {
                    "utilization_pct": segment.get_utilization_percentage(),
                    "status": segment.status.value # Assuming GridSegmentStatus has a .value
                } for segment in grid_state["topology"].segments
            }
        }
