import { getBuilding } from "./transform-buildings";
import { getSpace } from "./transform-spaces";

export function buildingNumberFromId(buildingId: string) {
  const result = parseInt(buildingId);
  return isNaN(result) ? undefined : result;
}

export function transform(buildingDataFromCms: unknown[]) {
  return {
    buildings: buildingDataFromCms.map(getBuilding),
    spaces: buildingDataFromCms.flatMap(getSpace),
    rooms: [],
  };
}
