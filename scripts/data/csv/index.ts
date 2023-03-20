import { readFile } from "fs";
import { parse } from "csv-parse/sync";
import parserOptions from "./config";
import { getBuilding } from "./transform-buildings";
import { getSpace } from "./transform-spaces";
import { CsvSpaceData } from "./../../../src/types/Space";
import {
  CsvBuildingData,
  CsvAndCmsBuildingData,
  CmsBuildingData,
} from "./../../../src/types/Building";

export function buildingNumberFromId(buildingId: string) {
  const result = parseInt(buildingId);
  return isNaN(result) ? undefined : result;
}

export function getData(csvPath: string) {
  return new Promise<Record<string, any>[]>((resolve, reject) => {
    readFile(csvPath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(parse(data, parserOptions) as Record<string, any>[]);
    });
  });
}

export function transform(
  dataFromCsv: Record<string, any>[],
  dataFromCms: CmsBuildingData[]
) {
  const spaces: CsvSpaceData[] = [];
  const buildings = {} as Record<number, CsvBuildingData>;

  for (const source of dataFromCsv) {
    const buildingNumber = buildingNumberFromId(source.buildingId);
    if (buildingNumber == null) {
      console.error("Invalid buildingId: ", source.buildingId);
      continue;
    }
    const space = getSpace(buildingNumber, source);
    spaces.push(space);

    if (!(buildingNumber in buildings))
      buildings[buildingNumber] = getBuilding(buildingNumber, source);
    buildings[buildingNumber].totalSeats += source.seats;
    buildings[buildingNumber].totalSpaces += 1;
  }

  for (const cmsBuilding of dataFromCms) {
    const building = buildings[cmsBuilding.number] as CsvAndCmsBuildingData;
    if (!building) continue;
    building.bounds = cmsBuilding.bounds;
    building.image = cmsBuilding.image;
  }

  return {
    spaces,
    buildings: Object.values(buildings) as CsvAndCmsBuildingData[],
  };
}
