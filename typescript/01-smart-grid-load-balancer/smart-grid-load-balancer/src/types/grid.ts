// Defines the core data structures for the electrical grid infrastructure.

// Represents a segment of the electrical grid, such as a neighborhood or industrial park.
export interface GridSegment {
  // A unique identifier for the grid segment.
  id: string;
  // A human-readable name for the segment.
  name: string;
  // The maximum power capacity of the segment in megawatts (MW).
  maxCapacityMW: number;
  // The current power load on the segment in megawatts (MW).
  currentLoadMW: number;
  // The geographic location of the segment.
  location: {
    latitude: number;
    longitude: number;
  };
  // A list of IDs of other segments that this segment is connected to.
  connectedSegments: string[];
  // The safety threshold for the segment's capacity, as a percentage (e.g., 85 for 85%).
  safetyThresholdPercent: number;
  // The current operational status of the segment's equipment.
  equipmentStatus: 'OPERATIONAL' | 'MAINTENANCE' | 'FAILED';
}

// Represents a connection between two grid segments, allowing power to be transferred.
export interface GridConnection {
  // The ID of the segment where the power is coming from.
  fromSegmentId: string;
  // The ID of the segment where the power is going to.
  toSegmentId: string;
  // The maximum power that can be transferred through this connection in megawatts (MW).
  transmissionCapacityMW: number;
  // The percentage of power that is lost during transmission over this connection.
  transmissionLossPercentage: number;
  // The type of connection.
  connectionType: 'PRIMARY' | 'BACKUP' | 'EMERGENCY';
}

// Represents the entire topology of the grid, including all segments and their connections.
export interface GridTopology {
  segments: GridSegment[];
  connections: GridConnection[];
}

// Represents the overall state of the grid at a specific point in time.
export interface GridState {
  topology: GridTopology;
  timestamp: Date;
  totalDemandMW: number;
  totalSupplyMW: number;
}
