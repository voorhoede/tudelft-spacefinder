export function buildingNumberFromId(buildingId) {
  const result = parseInt(buildingId);
  return isNaN(result) ? null : result;
}
