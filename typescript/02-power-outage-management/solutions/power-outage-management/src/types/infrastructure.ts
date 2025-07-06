// TODO: Define infrastructure types like substations, power lines, transformers, and their relationships.
// This will be used to map outages to affected equipment and customers.

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Substation {
  id: string;
  name: string;
  location: Location;
  voltage: string;
  capacity: string;
  status: 'operational' | 'maintenance' | 'outage';
  downstream_equipment: string[]; // IDs of transformers or power lines connected
}

export interface Transformer {
  id: string;
  substation_id: string;
  location: Location;
  voltage: string;
  customers_served: number;
  critical_customers: string[]; // IDs of critical customers served by this transformer
}

export interface PowerLine {
  id: string;
  from_equipment: string; // ID of substation or transformer
  to_equipment: string;   // ID of transformer or another power line
  length_km: number;
  customers_served: number;
  vulnerability: string; // e.g., 'high_wind', 'vegetation_prone'
}

export interface InfrastructureMap {
  substations: Substation[];
  transformers: Transformer[];
  power_lines: PowerLine[];
}
