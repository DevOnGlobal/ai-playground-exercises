# Effective Prompting Examples

## Task 1: Grid Infrastructure Modeling

**Bad Prompt (Vague):**
```typescript
// Create a grid segment
export interface GridSegment {}
```

**Good Prompt (Specific and Descriptive):**
```typescript
// Represents a segment of the electrical grid, such as a neighborhood or industrial park.
// It should include properties for its unique ID, name, maximum capacity in megawatts (MW),
// current load in MW, geographic location (latitude and longitude), a list of connected segment IDs,
// a safety threshold percentage, and its current equipment status (e.g., OPERATIONAL, MAINTENANCE, FAILED).
export interface GridSegment {}
```

## Task 4: Load Balancing Algorithm

**Bad Prompt (No Context):**
```typescript
// Redistribute power
public redistributePower() {}
```

**Good Prompt (Context-Rich with Business Rules):**
```typescript
// Business Rules:
// - Never exceed 90% capacity on any segment during redistribution.
// - Prefer shorter transmission paths to minimize losses.
// - Maintain 15% system-wide reserve capacity.
// Copilot Prompt: "Implement the redistributePower method. Find segments with available capacity and calculate the optimal power transfers from overloaded to available segments. Consider transmission losses and connection capacity limits. Return a PowerRedistributionPlan."
public redistributePower(healthReport: GridHealthReport): PowerRedistributionPlan {}
```

## Task 5: Emergency Response System

**Bad Prompt (Abstract):**
```typescript
// Handle an emergency
public handleEmergency() {}
```

**Good Prompt (Scenario-Based):**
```typescript
// Scenario: A downtown transformer fails, affecting 500 commercial customers, 2 hospitals, and 1 data center.
// Business Rules:
// - Find all customers in the failed segment.
// - Prioritize by customer priority (CRITICAL > COMMERCIAL > RESIDENTIAL).
// - Identify alternative segments with available capacity.
// - Create a rerouting plan or a load shedding plan if capacity is insufficient.
// Copilot Prompt: "Implement the handleEquipmentFailure method. Find the customers in the failed segment, prioritize them, and then create a plan to reroute power or shed load. Return an EmergencyResponse object."
public handleEquipmentFailure(failedSegmentId: string): EmergencyResponse {}
```
