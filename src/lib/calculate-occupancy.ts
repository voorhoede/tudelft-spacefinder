import type { Occupancy } from "../types/Filters";

export default function calculateOccupancy(
  deviceCount: number | null | undefined,
  location: {
    occupancyLimit?: number | null;
    seats?: number;
    totalSeats?: number;
  }
): Occupancy | undefined {
  if (deviceCount == undefined) return undefined;
  const visitorCountEstimate = deviceCount / 2.5;
  const capacity =
    location.occupancyLimit || location.seats || location.totalSeats;
  if (!capacity) return "crowded";
  const occupancyShare = visitorCountEstimate / capacity;
  if (occupancyShare <= 0.5) return "quiet";
  if (occupancyShare <= 0.7) return "busy";
  return "crowded";
}
