// TODO: Implement time estimation utilities.
// This file can contain helper functions for calculating estimated times for various operations,
// such as travel time, repair time, and overall restoration time.

export class TimeEstimation {
  /**
   * Calculates the travel time between two geographical points given a speed.
   * Uses the Haversine formula for distance calculation.
   * @param point1 The starting geographical point (latitude, longitude).
   * @param point2 The ending geographical point (latitude, longitude).
   * @param speedKmH The speed in kilometers per hour.
   * @returns Travel time in minutes.
   */
  public static calculateTravelTimeMinutes(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }, speedKmH: number): number {
    const distanceKm = this.calculateDistanceKm(point1, point2);
    const travelTimeHours = distanceKm / speedKmH;
    return travelTimeHours * 60; // Convert to minutes
  }

  /**
   * Calculates the great-circle distance between two points on a sphere given their longitudes and latitudes.
   * Uses the Haversine formula.
   * @param point1 The first geographical point (latitude, longitude).
   * @param point2 The second geographical point (latitude, longitude).
   * @returns Distance in kilometers.
   */
  public static calculateDistanceKm(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLon = this.deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Estimates the base repair time for an incident based on its cause.
   * @param cause The cause of the outage.
   * @param isSubstationOutage Boolean indicating if the outage affects a substation.
   * @returns Base repair time in hours.
   */
  public static estimateBaseRepairTimeHours(cause: string, isSubstationOutage: boolean): number {
    let baseHours: number;
    switch (cause) {
      case 'EQUIPMENT_FAILURE':
        baseHours = 3; // Average of 2-4 hours
        break;
      case 'VEGETATION':
        baseHours = 1.5; // Average of 1-2 hours
        break;
      default:
        baseHours = 4; // Default estimate
        break;
    }

    if (isSubstationOutage) {
      baseHours = 6; // Average of 4-8 hours for substation
    }
    return baseHours;
  }

  /**
   * Applies a weather multiplier to estimated time.
   * @param weatherCondition A string representing the weather condition (e.g., 'WEATHER', 'RAIN', 'SNOW').
   * @returns Weather multiplier.
   */
  public static getWeatherMultiplier(weatherCondition: string): number {
    switch (weatherCondition) {
      case 'WEATHER': // General weather impact
      case 'RAIN':
        return 1.5;
      case 'SNOW':
      case 'ICE':
        return 2.0;
      case 'HIGH_WINDS':
        return 1.8;
      default:
        return 1.0;
    }
  }

  /**
   * Applies a crew experience factor to estimated time.
   * @param skillLevel The skill level of the assigned crew.
   * @returns Crew experience factor.
   */
  public static getCrewExperienceFactor(skillLevel: 'JUNIOR' | 'SENIOR' | 'EXPERT'): number {
    switch (skillLevel) {
      case 'JUNIOR':
        return 1.5;
      case 'SENIOR':
        return 1.2;
      case 'EXPERT':
        return 1.0;
      default:
        return 1.0;
    }
  }

  /**
   * Applies a complexity factor to estimated time.
   * @param numberOfEquipmentAffected Number of equipment affected.
   * @param hasSafetyHazards Boolean indicating presence of safety hazards.
   * @returns Complexity factor.
   */
  public static getComplexityFactor(numberOfEquipmentAffected: number, hasSafetyHazards: boolean): number {
    let factor = 1.0;
    if (numberOfEquipmentAffected > 1) {
      factor += 0.5; // +50% for multiple equipment
    }
    if (hasSafetyHazards) {
      factor += 0.3; // +30% for safety hazards
    }
    return factor;
  }
}
