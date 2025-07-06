"""
Core load balancing service for the smart grid system.
Implements algorithms to analyze grid capacity and optimize power distribution.
"""

from typing import List, Dict, Optional
from ..utils.data_loader import GridDataLoader
from ..models.grid_infrastructure import GridSegment, PowerTransferPath, GridTopology
from ..models.power_sources import PowerSource

class GridLoadBalancer:
    """
    Manages load distribution across grid segments and optimizes power transfers.
    
    Business Rules for GridLoadBalancer:
    - Never exceed segment safety thresholds during transfers.
    - Minimize transmission losses (calculate using transfer path loss percentages).
    - Prioritize renewable energy when cost-competitive.
    - Maintain 15% system reserve capacity.
    
    Copilot Prompting Tip:
    "Implement the GridLoadBalancer class, focusing on methods for analyzing grid capacity, calculating optimal transfers, and optimizing power source dispatch."
    """
    
    def __init__(self):
        self.data_loader = GridDataLoader()
        self.current_grid_state = self.data_loader.get_current_grid_state()
        self.topology: GridTopology = self.current_grid_state["topology"]
        self.power_sources: List[PowerSource] = self.current_grid_state["power_sources"]

    def analyze_grid_capacity(self) -> Dict[str, List[GridSegment]]:
        """
        Analyze grid segments and categorize by capacity utilization.
        
        Examines each segment's current load vs capacity to identify risks.
        Returns categorized segments for load balancing decisions.
        
        Business Rules:
        - Healthy: < 80% utilization
        - Warning: 80-90% utilization
        - Critical: > 90% utilization
        
        Copilot Prompting Tip:
        "Iterate through self.topology.segments. Calculate utilization percentage for each segment. Categorize segments into 'healthy', 'warning', and 'critical' based on the specified thresholds. Return a dictionary with these categories."
        
        Returns:
            Dictionary with categorized segments (e.g., {"healthy": [...], "warning": [...], "critical": [...]})
        """
        categorized_segments = {
            "healthy": [],
            "warning": [],
            "critical": []
        }

        for segment in self.topology.segments:
            utilization = segment.get_utilization_percentage()
            if utilization < 80.0:
                categorized_segments["healthy"].append(segment)
            elif 80.0 <= utilization <= 90.0:
                categorized_segments["warning"].append(segment)
            else:
                categorized_segments["critical"].append(segment)
        return categorized_segments

    def _find_transfer_path(self, from_segment_id: str, to_segment_id: str) -> Optional[PowerTransferPath]:
        """
        Helper method to find a power transfer path between two segments.
        
        Args:
            from_segment_id: The ID of the originating segment.
            to_segment_id: The ID of the destination segment.
            
        Returns:
            The PowerTransferPath object if found, otherwise None.
        """
        for path in self.topology.transfer_paths:
            if path.from_segment_id == from_segment_id and path.to_segment_id == to_segment_id:
                return path
        return None

    def calculate_optimal_transfers(self) -> List[Dict]:
        """
        Calculate optimal power transfers to balance loads across grid segments.
        
        Finds overloaded segments and available capacity elsewhere.
        Recommends transfers that minimize transmission losses and costs.
        
        Business Rules:
        - Prioritize transferring load from critical segments.
        - Only transfer to healthy segments with sufficient available capacity.
        - Account for power loss during transmission.
        - Do not exceed the max_transfer_mw of any transfer path.
        
        Copilot Prompting Tip:
        "Implement the logic to calculate optimal power transfers. Iterate through critical segments, find suitable healthy segments, identify transfer paths, and calculate the feasible transfer amount considering power loss and path capacity. Return a list of recommended transfers."
        
        Returns:
            List of dictionaries, each representing a recommended transfer.
        """
        transfer_recommendations = []
        capacity_analysis = self.analyze_grid_capacity()
        overloaded_segments = sorted(capacity_analysis.get("critical", []), key=lambda s: s.get_utilization_percentage(), reverse=True)
        available_segments = sorted(capacity_analysis.get("healthy", []), key=lambda s: s.get_utilization_percentage())

        for overloaded in overloaded_segments:
            # Calculate the amount of load that needs to be shed from this segment
            # This is the load above the safety threshold
            load_to_shed = overloaded.current_load_mw - (overloaded.max_capacity_mw * (overloaded.safety_threshold_pct / 100))
            if load_to_shed <= 0: # No excess load to shed
                continue

            for available in available_segments:
                # Calculate available capacity in the target segment
                available_capacity = available.max_capacity_mw - available.current_load_mw
                if available_capacity <= 0: # No capacity to receive load
                    continue

                transfer_path = self._find_transfer_path(overloaded.segment_id, available.segment_id)
                if not transfer_path: # No direct transfer path
                    continue

                # Calculate the maximum feasible transfer considering path capacity and available capacity
                # The actual power that arrives at the destination after losses
                max_transfer_after_loss = transfer_path.max_transfer_mw * (1 - transfer_path.power_loss_pct / 100)
                
                # The amount of power we can send from the overloaded segment
                transfer_amount_from_source = min(load_to_shed, transfer_path.max_transfer_mw)

                # The amount of power the destination can receive
                transfer_amount_to_dest = min(available_capacity, max_transfer_after_loss)

                # The actual amount to transfer is limited by both source's need and destination's capacity
                actual_transfer_mw = min(transfer_amount_from_source, transfer_amount_to_dest)

                if actual_transfer_mw > 0:
                    transfer_recommendations.append({
                        "from_segment_id": overloaded.segment_id,
                        "to_segment_id": available.segment_id,
                        "transfer_mw": actual_transfer_mw,
                        "estimated_loss_mw": actual_transfer_mw * (transfer_path.power_loss_pct / 100),
                        "path_id": f"{overloaded.segment_id}->{available.segment_id}"
                    })
                    # Reduce load_to_shed and available_capacity for subsequent iterations
                    load_to_shed -= actual_transfer_mw
                    available_capacity -= actual_transfer_mw
                    
                    if load_to_shed <= 0: # All excess load handled for this segment
                        break
        return transfer_recommendations

    def validate_transfer_feasibility(self, transfer_plan: List[Dict]) -> bool:
        """
        Validate if a proposed transfer plan is feasible and adheres to grid constraints.
        
        Business Rules:
        - Each transfer must not cause the receiving segment to exceed its max_capacity_mw.
        - Each transfer must not cause the sending segment to drop below a minimum operational load (if applicable).
        - The total transfer amount for any path must not exceed its max_transfer_mw.
        - Consider power losses for accurate load calculations at the destination.
        
        Copilot Prompting Tip:
        "Implement a method to validate a list of proposed power transfers. For each transfer, check if it respects the max capacity of the destination segment, the max transfer capacity of the path, and accounts for power loss. Return True if all transfers are feasible, False otherwise."
        
        Args:
            transfer_plan: A list of dictionaries, each describing a proposed transfer.
            
        Returns:
            True if the plan is feasible, False otherwise.
        """
        # TODO: Implement validation logic for transfer plan
        # - Check if receiving segment capacity is exceeded
        # - Check if transfer path capacity is exceeded
        # - Account for power losses in validation
        # - Ensure no segment goes below a minimum operational load (if defined)
        return True # Placeholder

    def optimize_power_source_dispatch(self) -> List[Dict]:
        """
        Optimize the dispatch of power sources based on cost and grid demand.
        
        Prioritizes cheaper and more reliable sources while meeting current load.
        Considers startup times and operational constraints of different source types.
        
        Business Rules:
        - Meet current grid demand efficiently.
        - Prioritize renewable sources (solar, wind, hydro) when available and cost-effective.
        - Minimize overall operational cost.
        - Maintain a system reserve capacity (e.g., 15% of total demand).
        - Account for startup times for dispatch decisions.
        
        Copilot Prompting Tip:
        "Implement a method to optimize power source dispatch. Consider current grid load, available power sources, their costs, reliability, and startup times. Prioritize renewables. Return a list of recommended dispatch adjustments for each power source."
        
        Returns:
            List of dictionaries, each representing a dispatch recommendation.
        """
        # TODO: Implement power source dispatch optimization
        # - Get current grid demand from self.current_grid_state
        # - Sort power sources by cost, reliability, and type (renewables first)
        # - Allocate generation to meet demand and reserve capacity
        # - Consider startup times for dispatching non-instantaneous sources
        # - Return dispatch recommendations (source_id, new_output_mw)
        return [] # Placeholder
