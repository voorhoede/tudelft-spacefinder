import { getBuilding } from "./transform-buildings";
import { getSpace } from "./transform-spaces";

export function transform(buildingDataFromCms: unknown[]) {
  return {
    buildings: buildingDataFromCms.map(getBuilding),
    spaces: buildingDataFromCms.flatMap(getSpace),
    rooms: [],
  };
}
