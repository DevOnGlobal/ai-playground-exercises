// Defines the different types of power sources and their characteristics.

// An enumeration of the different types of power sources.
export enum PowerSourceType {
  SOLAR = 'SOLAR',
  WIND = 'WIND',
  COAL = 'COAL',
  NATURAL_GAS = 'NATURAL_GAS',
  NUCLEAR = 'NUCLEAR',
  HYDROELECTRIC = 'HYDROELECTRIC'
}

// Represents a single power source, such as a solar farm or a coal power plant.
export interface PowerSource {
  // A unique identifier for the power source.
  id: string;
  // The type of the power source.
  type: PowerSourceType;
  // A human-readable name for the power source.
  name: string;
  // The maximum power capacity of the source in megawatts (MW).
  maxCapacityMW: number;
  // The current power output of the source in megawatts (MW).
  currentOutputMW: number;
  // The cost of electricity from this source, in dollars per megawatt-hour ($/MWh).
  costPerMWh: number;
  // The operational cost of the power source.
  operationalCost: number;
  // A score from 0.0 to 1.0 indicating the reliability of the power source.
  reliability: number;
  // The time it takes for the power source to start up, in minutes.
  startupTimeMinutes: number;
  // The time it takes for the power source to shut down, in minutes.
  shutdownTimeMinutes: number;
  // The current operational status of the power source.
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'STARTUP';
  // For renewable sources, a factor indicating the impact of weather on power output.
  weatherImpactFactor?: number;
  // For renewable sources, the reliability of the weather forecast.
  forecastReliability?: number;
}

// Represents the allocation of power from a specific source.
export interface PowerSourceAllocation {
  sourceId: string;
  allocatedMW: number;
  costPerMWh: number;
  reliability: number;
}
