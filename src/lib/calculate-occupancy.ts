import type { Occupancy } from "../types/Filters";

type Location = {
  occupancyLimit?: number | null;
  seats?: number;
  totalSeats?: number;
};

export default function calculateOccupancy(
  deviceCount: number | null | undefined,
  location: Location
): Occupancy | undefined {
  if (deviceCount === undefined || deviceCount === null) return undefined;

  const visitorCountEstimate = deviceCount / 2.5;
  const capacity =
    location.occupancyLimit ?? location.seats ?? location.totalSeats;

  if (!capacity) return "crowded";

  const occupancyShare = visitorCountEstimate / capacity;

  if (occupancyShare <= 0.5) return "quiet";
  if (occupancyShare <= 0.7) return "busy";
  if (occupancyShare <= 1) return "crowded";

  return "unknown";
}
