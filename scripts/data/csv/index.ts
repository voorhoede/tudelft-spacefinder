import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";
import parserOptions from "./config";
import { getBuilding } from "./transform-buildings";
import { getSpace } from "./transform-spaces";
import { getRoom } from "./transform-rooms";
import { CsvSpaceData, CsvRoomData } from "./../../../src/types/Space";
import {
  CsvBuildingData,
  CsvAndCmsBuildingData,
  CmsBuildingData,
} from "./../../../src/types/Building";
import { FACILITIES } from "../../../src/types/Filters";

export function buildingNumberFromId(buildingId: string) {
  const result = parseInt(buildingId);
  return isNaN(result) ? undefined : result;
}

export function getData(csvPath: string) {
  return fs.readFile(csvPath)
    .then((data) => parse(data, parserOptions))
}

export function transform(
  dataFromCsv: Record<string, any>[],
  dataFromCms: CmsBuildingData[]
) {
  const spaces: CsvSpaceData[] = [];
  const buildings = {} as Record<number, CsvBuildingData>;
  const rooms = {} as Record<string, CsvRoomData>;
  const buildingRoomRealEstateNumbers = new WeakMap<
    CsvBuildingData,
    string[]
  >();

  for (const source of dataFromCsv) {
    const buildingNumber = buildingNumberFromId(source.buildingId);
    if (buildingNumber == undefined) {
      console.error("Invalid buildingId: ", source.buildingId);
      continue;
    }
    const space = getSpace(buildingNumber, source);
    spaces.push(space);

    if (!(buildingNumber in buildings)) {
      const building = getBuilding(buildingNumber, source);
      buildings[buildingNumber] = building;
      buildingRoomRealEstateNumbers.set(building, []);
    }
    const building = buildings[buildingNumber];
    building.totalSeats += source.seats;
    building.totalSpaces += 1;
    const realEstateNumbersForBuilding =
      buildingRoomRealEstateNumbers.get(building)!;
    if (!realEstateNumbersForBuilding.includes(source.realEstateNumber)) {
      realEstateNumbersForBuilding.push(source.realEstateNumber);
      building.totalRooms++;
    }

    if (!(source.realEstateNumber in rooms))
      rooms[source.realEstateNumber] = getRoom(buildingNumber, source);
    else {
      //TODO: remove these checks later
      const room = rooms[source.realEstateNumber];
      if (room.floor != source.floor)
        throw `Different floors for room ${source.realEstateNumber}`;
      if (room.roomId != source.roomId)
        throw `Different room IDs for room ${source.realEstateNumber}: ${room.roomId}, ${source.roomId}`;

      if (room.facilities.studyType != source.studyType)
        throw `Different study types for room ${source.realEstateNumber}: ${room.facilities.studyType}, ${source.studyType}`;

      if (room.facilities.quietness != source.quietness)
        throw `Different quietness for room ${source.realEstateNumber}: ${room.facilities.quietness}, ${source.quietness}`;

      if (room.exchangeBuildingId != source.exchangeBuildingId)
        throw `Different exchangeBuildingId for room ${source.realEstateNumber}: ${room.exchangeBuildingId}, ${source.exchangeBuildingId}`;

      if (room.exchangeRoomId != source.exchangeRoomId)
        throw `Different exchangeRoomId for room ${source.realEstateNumber}: ${room.exchangeRoomId}, ${source.exchangeRoomId}`;

      if (room.i18n.nl.name != source.spaceNameNL.trim())
        throw `Different NL names for room ${source.realEstateNumber}: ${
          room.i18n.nl.name
        }, ${source.spaceNameNL.trim()}`;

      if (room.i18n.en.name != source.spaceNameEN.trim())
        throw `Different EN names for room ${source.realEstateNumber}: ${
          room.i18n.en.name
        }, ${source.spaceNameEN.trim()}`;
    }
    const room = rooms[source.realEstateNumber];
    room.seats += source.seats;
    room.tables += source.tables;
    room.spaces += 1;
    room.latitude =
      (room.latitude * (room.spaces - 1) + source.latitude) / room.spaces;
    room.longitude =
      (room.longitude * (room.spaces - 1) + source.longitude) / room.spaces;
    for (const facility of FACILITIES)
      room.facilities[facility] ||= source[facility];
  }

  for (const cmsBuilding of dataFromCms) {
    const building = buildings[cmsBuilding.number] as CsvAndCmsBuildingData;
    if (!building) continue;
    building.bounds = cmsBuilding.bounds;
    building.image = cmsBuilding.image;
  }

  return {
    spaces,
    rooms: Object.values(rooms) as CsvRoomData[],
    buildings: Object.values(buildings) as CsvAndCmsBuildingData[],
  };
}
