// Defines the different types of customers and their priority levels.

// An enumeration of the different customer priority levels.
export enum CustomerPriority {
  CRITICAL = 'CRITICAL',     // Hospitals, emergency services
  COMMERCIAL = 'COMMERCIAL', // Businesses, industrial
  RESIDENTIAL = 'RESIDENTIAL' // Homes, apartments
}

// Represents a single customer.
export interface Customer {
  // A unique identifier for the customer.
  id: string;
  // The name of the customer.
  name: string;
  // The priority level of the customer.
  priority: CustomerPriority;
  // The ID of the grid segment that the customer is connected to.
  segmentId: string;
  // The customer's typical power consumption in megawatts (MW).
  typicalLoadMW: number;
  // The type of contract that the customer has.
  contractType: 'GUARANTEED_SUPPLY' | 'STANDARD';
}
