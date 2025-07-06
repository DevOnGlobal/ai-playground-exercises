
Main entry point for the Smart Grid Load Balancing System.
This script demonstrates the integration of data loading, load balancing, monitoring, and reporting components.

from src.utils.data_loader import GridDataLoader
from src.services.load_balancer import GridLoadBalancer
from src.services.monitoring_system import GridMonitoringSystem
from src.services.data_processor import LoadDataProcessor
from src.reports.grid_reports import GridReports
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    logging.info("Starting Smart Grid Load Balancing System simulation...")

    # Initialize components
    data_loader = GridDataLoader(data_dir="./data")
    load_data_processor = LoadDataProcessor(data_loader)
    monitoring_system = GridMonitoringSystem()
    grid_load_balancer = GridLoadBalancer()
    grid_reports = GridReports(data_loader, load_data_processor, monitoring_system)

    try:
        # 1. Load initial grid state
        logging.info("Loading grid topology and power sources...")
        grid_topology = data_loader.load_grid_topology()
        power_sources = data_loader.load_power_sources()
        logging.info(f"Loaded {len(grid_topology.segments)} grid segments and {len(power_sources)} power sources.")

        # 2. Simulate loading measurement data
        logging.info("Loading sample load measurement data...")
        # In a real scenario, this would be continuous stream
        sample_measurements = data_loader.load_measurement_data(file_path="sample_load_data.csv")
        logging.info(f"Loaded {len(sample_measurements)} sample load measurements.")

        # 3. Get current grid state (combines topology with current loads)
        current_grid_state = data_loader.get_current_grid_state()
        logging.info(f"Current system utilization: {current_grid_state["system_utilization_pct"]:.2f}%")

        # 4. Analyze grid capacity and identify issues
        logging.info("Analyzing grid segment capacities...")
        capacity_analysis = grid_load_balancer.analyze_grid_capacity()
        logging.info(f"Critical segments: {len(capacity_analysis["critical"])}")
        logging.info(f"Warning segments: {len(capacity_analysis["warning"])}")

        # 5. Generate and display alerts
        logging.info("Checking for and generating alerts...")
        active_alerts = monitoring_system.check_all_segments()
        if active_alerts:
            logging.warning(f"Found {len(active_alerts)} active alerts.")
            for alert in active_alerts:
                logging.warning(f"  Alert: {alert["segment_id"]} - {alert["alert_level"]} at {alert["utilization_pct"]:.2f}% - Action: {alert["recommended_action"]}")
        else:
            logging.info("No active alerts. Grid is stable.")

        # 6. Calculate optimal load transfers (if any critical segments)
        if capacity_analysis["critical"]:
            logging.info("Calculating optimal load transfers for critical segments...")
            transfer_recommendations = grid_load_balancer.calculate_optimal_transfers()
            if transfer_recommendations:
                logging.info(f"Recommended {len(transfer_recommendations)} load transfers.")
                for transfer in transfer_recommendations:
                    logging.info(f"  Transfer: {transfer["transfer_mw"]:.2f} MW from {transfer["from_segment_id"]} to {transfer["to_segment_id"]}")
            else:
                logging.info("No optimal transfers found or needed at this time.")
        else:
            logging.info("No critical segments, no load transfers needed.")

        # 7. Optimize power source dispatch
        logging.info("Optimizing power source dispatch...")
        dispatch_recommendations = grid_load_balancer.optimize_power_source_dispatch()
        if dispatch_recommendations:
            logging.info(f"Recommended {len(dispatch_recommendations)} power source dispatch adjustments.")
        else:
            logging.info("Power sources are optimally dispatched or no adjustments needed.")

        # 8. Generate daily performance summary report
        logging.info("Generating daily performance summary report...")
        daily_report = grid_reports.generate_daily_performance_summary(current_grid_state, sample_measurements)
        print("\n" + "="*80)
        print("Daily Performance Summary Report:")
        print(daily_report)
        print("="*80 + "\n")

        # 9. Calculate and display efficiency metrics
        logging.info("Calculating grid efficiency metrics...")
        efficiency_metrics = grid_reports.calculate_efficiency_metrics(current_grid_state)
        logging.info(f"Efficiency Metrics: {efficiency_metrics}")

        logging.info("Smart Grid Load Balancing System simulation completed.")

    except Exception as e:
        logging.error(f"An error occurred during simulation: {e}")

if __name__ == "__main__":
    main()
