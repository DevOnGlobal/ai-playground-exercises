// This file contains common TypeScript patterns and utility functions
// that might be useful throughout the Power Outage Management exercise.
// You can refer to these patterns or ask Copilot to generate similar ones.

// --- 1. Enum and Interface Definitions ---
// Clearly defined enums and interfaces provide strong typing and context for Copilot.
// Example:
export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: Status;
  createdAt: Date;
}

// --- 2. Data Loading and Parsing ---
// Functions to load data from external sources (e.g., JSON files) and parse them into typed objects.
// Copilot can help with JSON parsing and mapping to interfaces.
// Example (simplified, assuming data is imported directly):
export class DataLoader {
  public static loadUsers(): User[] {
    // In a real app, this would fetch from a file or API
    const rawData = [
      { id: '1', name: 'Alice', email: 'alice@example.com', status: 'ACTIVE', createdAt: '2023-01-01T10:00:00Z' },
      { id: '2', name: 'Bob', email: 'bob@example.com', status: 'PENDING', createdAt: '2023-01-05T11:30:00Z' },
    ];
    return rawData.map(item => ({
      ...item,
      status: item.status as Status, // Type assertion
      createdAt: new Date(item.createdAt)
    }));
  }
}

// --- 3. Geographical Calculations (Haversine Formula) ---
// A common pattern for location-based services. Copilot is good at recalling this.
// Example:
export function calculateDistanceKm(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = deg2rad(point2.latitude - point1.latitude);
  const dLon = deg2rad(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.latitude)) * Math.cos(deg2rad(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// --- 4. Filtering and Sorting Arrays ---
// Essential for data manipulation. Copilot can quickly generate filter/sort logic based on comments.
// Example:
export function filterActiveUsers(users: User[]): User[] {
  return users.filter(user => user.status === Status.ACTIVE);
}

export function sortUsersByName(users: User[]): User[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}

// --- 5. Conditional Logic and Business Rules ---
// Translating `if/else if/else` or `switch` statements from natural language rules.
// Example:
export function determineUserAccessLevel(user: User): 'Admin' | 'Editor' | 'Viewer' {
  if (user.email.endsWith('@admin.com')) {
    return 'Admin';
  } else if (user.status === Status.ACTIVE && user.createdAt.getFullYear() < 2023) {
    return 'Editor';
  } else {
    return 'Viewer';
  }
}

// --- 6. Asynchronous Operations (Promises/Async-Await) ---
// For simulating network requests or time-consuming operations.
// Example:
export async function simulateNetworkRequest<T>(data: T, delayMs: number = 1000): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Simulated network request completed after ${delayMs}ms.`);
      resolve(data);
    }, delayMs);
  });
}

// --- 7. Error Handling ---
// Basic try-catch blocks for robust code.
// Example:
export function safeParseJSON(jsonString: string): any | null {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}
