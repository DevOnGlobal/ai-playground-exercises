## Effective SQL Comments for Copilot

- **Ineffective**: "Get grid data"
- **Effective**: "Calculate current load percentage for each operational grid segment, showing segments above 85% threshold first"

- **Ineffective**: "Find power sources"  
- **Effective**: "Rank available power sources by cost effectiveness (available_capacity_mw / cost_per_mwh) for economic dispatch"

## Business Context Patterns

**Pattern**: [Business Goal] + [Specific Data] + [Calculations] + [Constraints] + [Expected Result]

**Example**:
- **Business Goal**: Emergency response planning for transformer failure
- **Specific Data**: Customer counts by type, priority scores, segment capacity
- **Calculations**: Total impact score = SUM(priority_score), utilization = load/capacity * 100  
- **Constraints**: Critical customers must have power within 30 minutes
- **Expected Result**: 5 segments with customer impact assessment, ordered by priority