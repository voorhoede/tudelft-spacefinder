import type { Occupancy } from "../types/Filters";

export default function calculateOccupancy(
  deviceCount: number,
  seatCount: number,
  occupancyLimit: number,
): Occupancy {
  const visitorCountEstimate = deviceCount / 2.5;
  const occupancyShare = visitorCountEstimate / occupancyLimit || seatCount;
  if (occupancyShare <= 0.5) return "quiet";
  if (occupancyShare <= 0.7) return "busy";
  return "crowded";
}
