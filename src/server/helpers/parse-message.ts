export function parseMessageWifi(
  { timestamp, decodedValue }:
  { timestamp: string; decodedValue: Record<string, string | number> }
) {
  return {
    "updated_at": new Date(Number(timestamp)).toISOString(),
    "access_point_name": decodedValue.name,
    "device_count": decodedValue.clientCount,
    "building_number": Number(String(decodedValue.name).split("-").at(1))
      || Number(String(decodedValue.mapLocation).split(".").at(0))
      || null,
    "floor": String(decodedValue.locationHierarchy).split(">").at(-1)?.trim() || null,
    "room_id": String(decodedValue.mapLocation).split(" ").at(0),
    "map_location": decodedValue.mapLocation,
    "location_hierarchy": decodedValue.locationHierarchy,
  };
}

export function parseMessageAruba(
  { timestamp, decodedValue }:
  { timestamp: string; decodedValue: Record<string, string | number> }
) {
  return {
    "updated_at": new Date(Number(timestamp)).toISOString(),
    "access_point_name": decodedValue.name,
    "device_count": decodedValue.client_count,
    "building_number": Number(String(decodedValue.name).split("-").at(1)) || null,
  };
}

