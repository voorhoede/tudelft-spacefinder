export function buildingNumberFromId(buildingId: string) {
  const result = parseInt(buildingId);
  return isNaN(result) ? null : result;
}
