from src.services.incident_manager import OutageIncidentManager
from src.services.crew_dispatcher import CrewDispatchService
from src.services.customer_notifier import CustomerNotificationService
from src.models.incident import OutageCause, OutageSeverity, IncidentStatus
from datetime import datetime, timedelta

def main():
    print("Starting Outage Management System Simulation...")

    # Initialize services
    incident_manager = OutageIncidentManager()
    crew_dispatcher = CrewDispatchService()
    customer_notifier = CustomerNotificationService()

    # --- Simulation Scenario ---
    # 1. Create an incident
    print("\n--- Creating a new incident ---")
    failed_equipment_id = "SUB_001"  # Example: Main Street Substation
    incident_latitude = 40.7589
    incident_longitude = -73.9851
    cause = OutageCause.EQUIPMENT_FAILURE.value

    incident_id = incident_manager.create_incident_from_equipment_failure(
        failed_equipment_id, cause, incident_latitude, incident_longitude
    )
    print(f"New incident created: {incident_id}")

    # 2. Find optimal crew and assign
    print("\n--- Finding and assigning crew ---")
    incident = incident_manager.active_incidents.get(incident_id)
    if incident:
        optimal_assignment = crew_dispatcher.find_optimal_crew_for_incident(incident)
        if optimal_assignment and optimal_assignment.get("crew_id"):
            assigned_crew_id = optimal_assignment["crew_id"]
            print(f"Optimal crew found: {assigned_crew_id}")
            assignment_details = crew_dispatcher.assign_crew_to_incident(
                assigned_crew_id, incident_id, estimated_duration_hours=6.0
            )
            print(f"Crew {assigned_crew_id} assigned to incident {incident_id}.")
            print(f"Estimated arrival: {assignment_details.get('estimated_arrival')}")
        else:
            print("No optimal crew found for this incident.")
    else:
        print(f"Incident {incident_id} not found.")

    # 3. Notify customers
    print("\n--- Notifying affected customers ---")
    if incident:
        notification_counts = customer_notifier.notify_customers_of_outage(incident)
        print(f"Notifications sent: {notification_counts}")

    # 4. Update incident status (simulate progress)
    print("\n--- Updating incident status ---")
    if incident_manager.update_incident_status(incident_id, IncidentStatus.IN_PROGRESS, assigned_crew_id, "Crew on site, assessing damage."):
        print(f"Incident {incident_id} status updated to IN_PROGRESS.")

    # 5. Send progress update to customers
    print("\n--- Sending progress updates ---")
    if incident:
        customer_notifier.send_restoration_progress_update(
            incident_id, "Damage assessed, repairs underway.", datetime.now() + timedelta(hours=3)
        )
        print("Progress updates sent to customers.")

    # 6. Resolve incident
    print("\n--- Resolving incident ---")
    if incident_manager.update_incident_status(incident_id, IncidentStatus.RESOLVED, assigned_crew_id, "Power restored to all customers."):
        print(f"Incident {incident_id} status updated to RESOLVED.")

    # 7. Calculate outage statistics
    print("\n--- Generating outage statistics ---")
    stats = incident_manager.calculate_outage_statistics(hours_back=24)
    print("Outage Statistics (last 24 hours):")
    for key, value in stats.items():
        print(f"  {key}: {value}")

    print("\nSimulation complete.")

if __name__ == "__main__":
    main()