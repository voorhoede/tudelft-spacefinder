export function parseMessage(
  { timestamp, decodedValue }:
  { timestamp: string; decodedValue: Record<string, any> }
) {

  return {
    "updated_at": new Date(Number(timestamp)).toISOString(),
    "access_point_name": decodedValue.name,
    "device_count": decodedValue.client_count,
    "building_number": Number(decodedValue.name.split("-").at(1))
      // || Number(decodedValue.site.split("_").at(0).split("B").at(1))
      || 0,
  };
}
