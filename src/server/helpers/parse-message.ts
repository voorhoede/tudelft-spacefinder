export function parseMessageWifi(
  { timestamp, decodedValue }:
  { timestamp: string; decodedValue: Record<string, any> }
) {
  return {
    "updated_at": new Date(Number(timestamp)).toISOString(),
    "access_point_name": decodedValue.name,
    "device_count": decodedValue.clientCount,
    "building_number": Number(decodedValue.name.split("-").at(1))
      || Number(decodedValue.mapLocation.split(".").at(0))
      || 0,
    "floor": decodedValue.locationHierarchy.split(">").at(-1).trim(),
    "room_id": decodedValue.mapLocation.split(" ").at(0),
    "map_location": decodedValue.mapLocation,
    "location_hierarchy": decodedValue.locationHierarchy,
  };
}

export function parseMessageAruba(
  { timestamp, decodedValue }:
  { timestamp: string; decodedValue: Record<string, any> }
) {
  return {
    "updated_at": new Date(Number(timestamp)).toISOString(),
    "access_point_name": decodedValue.name,
    "device_count": decodedValue.client_count,
    "building_number": Number(decodedValue.name.split("-").at(1)) || 0,
  };
}

