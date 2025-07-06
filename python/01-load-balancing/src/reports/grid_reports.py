
Reporting functions for generating operational summaries and performance analysis of the smart grid.
Uses standard Python libraries for data aggregation and formatting.


import statistics
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from typing import List, Dict

class GridReports:
    """
    Generates various reports on grid performance, utilization, and events.
    """
    def __init__(self, data_loader, data_processor, monitoring_system):
        self.data_loader = data_loader
        self.data_processor = data_processor
        self.monitoring_system = monitoring_system

    def generate_daily_performance_summary(self, grid_state: Dict, measurements: List[Dict]) -> str:
        """
        Generate daily grid performance summary for operational review.
        
        Creates formatted text report with key metrics and recommendations.
        Suitable for email distribution to grid operations staff.
        
        Business Rules:
        - Summarize overall system utilization.
        - Identify segments with highest and lowest utilization.
        - Report on peak load times and values.
        - Include a summary of active alerts.
        - Provide actionable recommendations for the next day's operations.
        
        Copilot Prompting Tip:
        "Implement the generate_daily_performance_summary method. Calculate key performance indicators like overall utilization, identify segments with extreme utilization, summarize active alerts, and format all this information into a readable text report with recommendations."
        
        Args:
            grid_state: Current state of the grid from data_loader.get_current_grid_state().
            measurements: List of load measurement records for analysis.
            
        Returns:
            A formatted string representing the daily performance summary report.
        """
        summary_lines = []
        summary_lines.append(f"--- Daily Grid Performance Summary - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---")
        summary_lines.append("")

        # Overall System Metrics
        summary_lines.append("1. Overall System Metrics:")
        summary_lines.append(f"   Total Capacity: {grid_state.get("total_capacity_mw", 0.0):.2f} MW")
        summary_lines.append(f"   Total Current Load: {grid_state.get("total_current_load_mw", 0.0):.2f} MW")
        summary_lines.append(f"   System Utilization: {grid_state.get("system_utilization_pct", 0.0):.2f}%")
        summary_lines.append("")

        # Segment Utilization Summary
        summary_lines.append("2. Segment Utilization Summary:")
        segment_utilizations = []
        for segment in grid_state["topology"].segments:
            utilization = segment.get_utilization_percentage()
            segment_utilizations.append((segment.segment_id, utilization))
            summary_lines.append(f"   - {segment.name} ({segment.segment_id}): {utilization:.2f}% utilized")
        
        if segment_utilizations:
            highest_util_segment = max(segment_utilizations, key=lambda item: item[1])
            lowest_util_segment = min(segment_utilizations, key=lambda item: item[1])
            summary_lines.append(f"   Highest Utilization: {highest_util_segment[0]} ({highest_util_segment[1]:.2f}%) ")
            summary_lines.append(f"   Lowest Utilization: {lowest_util_segment[0]} ({lowest_util_segment[1]:.2f}%) ")
        summary_lines.append("")

        # Load Pattern Analysis (using data_processor)
        summary_lines.append("3. Load Pattern Analysis:")
        if measurements:
            load_analysis = self.data_processor.analyze_load_patterns(measurements)
            if "daily_load_pattern" in load_analysis:
                peak_hour = max(load_analysis["daily_load_pattern"], key=lambda hour: load_analysis["daily_load_pattern"][hour]["average_load"])
                peak_load_avg = load_analysis["daily_load_pattern"][peak_hour]["average_load"]
                summary_lines.append(f"   Peak Load Hour (Avg): {peak_hour}:00 (Avg Load: {peak_load_avg:.2f} MW)")
            summary_lines.append(f"   Total Measurements Analyzed: {load_analysis.get("total_measurements", 0)}")
        else:
            summary_lines.append("   No measurement data available for detailed load pattern analysis.")
        summary_lines.append("")

        # Active Alerts Summary
        summary_lines.append("4. Active Alerts:")
        active_alerts = self.monitoring_system.generate_capacity_alerts() # Get current alerts
        if active_alerts:
            alert_counts = Counter([alert["alert_level"] for alert in active_alerts])
            for level, count in alert_counts.items():
                summary_lines.append(f"   - {level}: {count} alerts")
            summary_lines.append("   Review monitoring system for details and recommended actions.")
        else:
            summary_lines.append("   No active alerts. All segments operating within normal parameters.")
        summary_lines.append("")

        # Recommendations
        summary_lines.append("5. Recommendations for Next Operations:")
        if highest_util_segment[1] > 85: # Example threshold for recommendation
            summary_lines.append(f"   - Consider load balancing or generation adjustments for {highest_util_segment[0]} due to high utilization.")
        if active_alerts:
            summary_lines.append("   - Address all CRITICAL and EMERGENCY alerts immediately.")
        summary_lines.append("   - Continue to monitor system utilization and power source availability.")
        summary_lines.append("")

        return "\n".join(summary_lines)

    def calculate_efficiency_metrics(self, grid_state: Dict) -> Dict[str, float]:
        """
        Calculate key performance indicators for grid operations.
        
        Computes efficiency metrics, utilization rates, and performance indicators.
        Used for operational dashboards and regulatory reporting.
        
        Copilot Prompting Tip:
        "Implement a method to calculate grid efficiency metrics. Include overall grid utilization, and if possible, power loss percentages across transfer paths. Return these as a dictionary."
        
        Args:
            grid_state: Current state of the grid.
            
        Returns:
            A dictionary of calculated efficiency metrics.
        """
        return self.data_processor.calculate_grid_efficiency_metrics(grid_state)

    def analyze_power_source_utilization(self, power_sources: List[Dict]) -> Dict[str, float]:
        """
        Analyzes the utilization of different power sources.
        
        Business Rules:
        - Calculate the total capacity and current output for each source type.
        - Determine the utilization percentage for each source type.
        - Identify the most and least utilized source types.
        
        Copilot Prompting Tip:
        "Implement a method to analyze power source utilization. Group sources by type, calculate total capacity and output for each type, and determine utilization percentages. Identify the most and least utilized types."
        
        Args:
            power_sources: A list of power source dictionaries.
            
        Returns:
            A dictionary summarizing power source utilization by type.
        """
        source_type_summary = defaultdict(lambda: {'total_capacity': 0.0, 'total_output': 0.0})

        for source in power_sources:
            source_type = source.get("source_type", "UNKNOWN")
            source_type_summary[source_type]['total_capacity'] += source.get("max_capacity_mw", 0.0)
            source_type_summary[source_type]['total_output'] += source.get("current_output_mw", 0.0)
        
        results = {}
        for source_type, data in source_type_summary.items():
            utilization_pct = (data['total_output'] / data['total_capacity']) * 100 if data['total_capacity'] > 0 else 0.0
            results[source_type] = {
                "total_capacity_mw": data['total_capacity'],
                "total_output_mw": data['total_output'],
                "utilization_pct": utilization_pct
            }
        return results

    def create_capacity_trend_report(self, measurements: List[Dict]) -> Dict:
        """
        Generates a report on capacity utilization trends over time.
        
        Business Rules:
        - Aggregate load data by time intervals (e.g., hourly, daily).
        - Calculate average, peak, and minimum utilization for each interval.
        - Identify periods of high and low utilization.
        
        Copilot Prompting Tip:
        "Implement a method to create a capacity trend report. Aggregate load measurements by time (e.g., hourly), calculate average and peak loads for each interval, and identify trends. Return a dictionary summarizing these trends."
        
        Args:
            measurements: List of load measurement records.
            
        Returns:
            A dictionary summarizing capacity utilization trends.
        """
        # This will leverage the analyze_load_patterns from data_processor
        return self.data_processor.analyze_load_patterns(measurements)

    def export_data_to_csv(self, data: List[Dict], filename: str, headers: List[str]) -> str:
        """
        Exports a list of dictionaries to a CSV file.
        
        Business Rules:
        - Ensure all dictionaries in the list have the specified headers as keys.
        - Handle missing keys gracefully (e.g., write empty string).
        
        Copilot Prompting Tip:
        "Implement a method to export a list of dictionaries to a CSV file. Take a list of dictionaries, a filename, and a list of headers. Write the data to the CSV, ensuring all headers are present."
        
        Args:
            data: List of dictionaries to export.
            filename: Name of the CSV file to create.
            headers: List of strings representing the CSV headers.
            
        Returns:
            The absolute path to the created CSV file.
        """
        file_path = self.data_loader.data_dir / filename
        try:
            with open(file_path, 'w', newline='') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=headers)
                writer.writeheader()
                for row in data:
                    writer.writerow(row)
            return str(file_path.resolve())
        except Exception as e:
            raise IOError(f"Failed to export data to CSV: {e}")

