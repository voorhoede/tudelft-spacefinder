import type { Occupancy } from "../types/Filters";

export default function calculateOccupancy(
  deviceCount: number,
  location: {
    occupancyLimit?: number | null;
    seats?: number;
    totalSeats?: number;
  }
): Occupancy {
  const visitorCountEstimate = deviceCount / 2.5;
  const capacity =
    location.occupancyLimit || location.seats || location.totalSeats;
  if (!capacity) return "crowded";
  const occupancyShare = visitorCountEstimate / capacity;
  if (occupancyShare <= 0.5) return "quiet";
  if (occupancyShare <= 0.7) return "busy";
  return "crowded";
}
