export function parseMessageAruba(
  { timestamp, decodedValue }:
  { timestamp: string; decodedValue: Record<string, string | number> }
) {
  if (decodedValue.status !== "Up") {
    return null;
  }

  return {
    "updated_at": new Date(Number(timestamp)).toISOString(),
    "access_point_name": decodedValue.name,
    "device_count": decodedValue.client_count,
    "building_number": Number(String(decodedValue.name).split("-").at(1)) || null,
  };
}

