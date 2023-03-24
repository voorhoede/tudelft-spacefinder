import { validateBuilding, validateRoom, validateSpace } from "./schema";
import { BuildingI18n } from "./../../../src/types/Building";
import { SpaceI18n, RoomI18n } from "./../../../src/types/Space";
import type { ErrorObject, ValidateFunction } from "ajv";

function logErrors(name: string, errors: ErrorObject[]) {
  const errorText = [`${name} did not pass json schema validation:`].concat(
    errors.map((error) => {
      const { dataPath, message, data, params } = error;
      // generic display of offending data
      let errorState = `Got ${data}`;

      if ("missingProperty" in params && params.missingProperty) {
        // error text for missing required property
        errorState = `Object was: \n${JSON.stringify(data, null, 2)}`;
      } else if ("additionalProperty" in params && params.additionalProperty) {
        // Too many properties
        errorState = `Offending property: ${params.additionalProperty}`;
      }

      return `> ${dataPath || ""} ${message}. ${errorState}`;
    })
  );

  console.warn(errorText.join("\n"));
}

function validateItems<T>(
  items: T[],
  validator: ValidateFunction,
  nameGetter: (item: T) => string | undefined
) {
  const itemsPassed: T[] = [];
  for (const item of items) {
    const isValid = validator(item);
    if (!isValid) {
      const name = nameGetter(item) || "unknown";
      logErrors(name, validator.errors!);
      continue;
    }
    itemsPassed.push(item);
  }
  return itemsPassed;
}

export function validateBuildings(buildings: BuildingI18n[]) {
  return validateItems(
    buildings,
    validateBuilding,
    (building) => building.i18n?.nl?.slug || building.buildingId
  );
}

export function validateRooms(rooms: RoomI18n[]) {
  return validateItems(rooms, validateRoom, (room) => room.realEstateNumber);
}

export function validateSpaces(spaces: SpaceI18n[]) {
  return validateItems(
    spaces,
    validateSpace,
    (space) => space.slug || space.spaceId
  );
}
