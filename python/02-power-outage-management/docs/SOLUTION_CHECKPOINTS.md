# Solution Checkpoints: Power Outage Management System

This document outlines the tasks for the Power Outage Management System exercise, providing clear instructions and success criteria for each step. Use these checkpoints to guide your implementation and verify your progress.

## Task 1: Data Infrastructure and Integration (10 minutes)
**Objective**: Complete data loading utilities that connect sample data to business logic

**Instructions**:
1. Open `src/utils/data_loader.py`
2. Complete the `get_customers_in_area()` method:
   - Implement Haversine distance calculation for geographic filtering
   - Filter customers within the specified radius from incident location
   - Return list of affected customers with all their details

3. Test the data integration by completing `src/models/incident.py`:
   - Finish the `calculate_priority_score()` method using the provided business rules
   - Use the specific scoring algorithm: critical=100pts, commercial=10pts, residential=1pt
   - Apply severity multipliers and duration penalties as specified

**Success Criteria**:
- `get_customers_in_area()` correctly filters customers based on latitude, longitude, and radius using Haversine formula.
- `calculate_priority_score()` in `OutageIncident` accurately computes the priority based on customer types, severity, and incident duration.

## Task 2: Crew Assignment Optimization (12 minutes)
**Objective**: Implement intelligent crew dispatch using multi-factor scoring

**Instructions**:
1. Open `src/services/crew_dispatcher.py`
2. Complete the `find_optimal_crew_for_incident()` method:
   - Score each crew using: specialization (0-100) + distance penalty (-2/km) + experience bonus (EXPERT=+20, SENIOR=+10) + customer impact (+1 per customer, max 500)
   - Calculate actual distances using the Haversine formula
   - Return the crew with the highest total score

3. Implement `calculate_haversine_distance()`:
   - Use the standard Haversine formula for great circle distance
   - Return distance in kilometers for travel time calculations

4. Complete the `assign_crew_to_incident()` method:
   - Validate crew availability and incident status
   - Calculate estimated arrival time (distance ÷ 60 km/h + 15 min prep)
   - Create assignment record with timeline tracking

**Success Criteria**:
- `find_optimal_crew_for_incident()` identifies the best crew based on the multi-factor scoring algorithm.
- `calculate_haversine_distance()` provides accurate distance calculations.
- `assign_crew_to_incident()` correctly assigns a crew, updates statuses, and calculates estimated arrival times.

## Task 3: Customer Communication System (12 minutes)
**Objective**: Build realistic customer notification system with personalization

**Instructions**:
1. Open `src/services/customer_notifier.py`
2. Complete the `notify_customers_of_outage()` method:
   - Group customers by type (CRITICAL_INFRASTRUCTURE, COMMERCIAL, RESIDENTIAL)
   - Apply different notification timing: critical=immediate, commercial=15min, residential=30min
   - Generate personalized messages for each customer type
   - Use realistic delivery simulation

3. Implement `send_restoration_progress_update()`:
   - Find customers affected by specific incident
   - Check appropriate timing (6 AM - 10 PM for non-critical)
   - Send updates with revised completion times
   - Track delivery for audit compliance

4. Enhance `generate_personalized_outage_message()`:
   - Use different message templates based on customer type
   - Convert technical outage causes to customer-friendly language
   - Include relevant safety information for each outage type

**Success Criteria**:
- `notify_customers_of_outage()` sends notifications according to customer type and timing rules.
- `send_restoration_progress_update()` delivers timely progress updates with revised ETAs.
- `generate_personalized_outage_message()` creates tailored messages based on customer type and incident details.

## Task 4: Incident Management Workflows (8 minutes)
**Objective**: Complete incident lifecycle management with business validation

**Instructions**:
1. Open `src/services/incident_manager.py`
2. Complete the `create_incident_from_equipment_failure()` method:
   - Look up failed equipment using `data_loader.get_equipment_by_id()`
   - Calculate affected customers from equipment's service area
   - Determine severity based on customer types and count
   - Auto-escalate to CRITICAL if hospitals or >2000 customers affected

3. Implement `update_incident_status()` with business rules:
   - Validate status transitions (can't go backwards)
   - Require crew_id when changing to ASSIGNED status
   - Update timeline and trigger customer notifications
   - Track performance metrics for regulatory reporting

4. Complete `calculate_outage_statistics()`:
   - Calculate Customer Minutes Interrupted (CMI = customers × duration)
   - Group incidents by cause and severity for trend analysis
   - Identify incidents requiring regulatory reporting (>4 hours)
   - Generate executive summary metrics

**Success Criteria**:
- `create_incident_from_equipment_failure()` accurately assesses impact and sets initial incident severity.
- `update_incident_status()` enforces valid transitions and updates incident state correctly.
- `calculate_outage_statistics()` provides accurate CMI and other key performance indicators.

## Task 5: Performance Analytics and Reporting (3 minutes)
**Objective**: Create operational dashboards using built-in Python capabilities

**Instructions**:
1. Create `src/reports/outage_analytics.py`
2. Implement these reporting functions using `collections.Counter` and `statistics`:
   - `generate_daily_operations_summary()` - Key metrics for management
   - `calculate_crew_performance_metrics()` - Response time and efficiency analysis
   - `analyze_customer_impact_trends()` - Pattern identification for planning

3. Use realistic business metrics:
   - System Average Interruption Duration Index (SAIDI)
   - System Average Interruption Frequency Index (SAIFI) 
   - Customer Average Interruption Duration Index (CAIDI)
   - Crew utilization rates and response time percentiles

**Success Criteria**:
- `outage_analytics.py` contains functions to generate daily summaries, crew performance, and customer impact trends.
- Reports include SAIDI, SAIFI, CAIDI, and other specified metrics.
