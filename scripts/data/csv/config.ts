// CSV parser configuration
// See: https://csv.js.org/parse
export default {
  relax_column_count: true,
  from_line: 2,
  delimiter: ";",
  cast,
  columns: [
    "spaceId",
    "buildingNameNL",
    "buildingNameEN",
    "buildingId",
    "buildingAbbreviationNL",
    "buildingAbbreviationEN",
    "floor",
    "realEstateNumber",
    "roomNumber",
    "roomId",
    "spaceNameNL",
    "spaceNameEN",
    null,
    "exchangeBuildingId",
    "exchangeRoomId",
    "latitude",
    "longitude",
    null,
    "seats",
    "tables",
    null,
    "adjustableChairs",
    null,
    null,
    null,
    null,
    "quietness",
    null,
    "daylit",
    "powerOutlets",
    null, // this was the ethernet field in the csv which is permanently removed as filter
    null, // this was the stationaryPC field in the csv which is permanently removed as filter and will be replaced for dockingstations
    "whiteBoard",
    null, // this was the smartBoard field in the csv which is permanently removed as filter 
    "presentationScreen",
    "nearCoffeeMachine",
    "nearPrinter",
    "nearBathroom",
  ],
};

function cast(value: string, context: { column: string | number }) {
  const { column } = context;
  switch (column) {
    // conversion to integers
    case "id":
    case "seats":
    case "tables":
    case "otherSeats":
    case "individualStudySeats":
      return parseInt(value, 10) || 0;
    // convert floats: latitude & longitude
    case "latitude":
    case "longitude":
      return parseFloat(value);
    // conversion to booleans
    case "daylit":
    case "whiteBoard":
    case "presentationScreen":
    case "nearCoffeeMachine":
      return distanceToBoolean(value);
    case "nearPrinter":
    case "nearBathroom":
      return distanceToBoolean(value);
    // noise level
    case "quietness":
      return quietness(value);
    // power outlets
    case "powerOutlets":
      return maybeDutchBooleanAmount(value);
    case "adjustableChairs":
      return value !== "0";
    default:
      return value;
  }
}

function distanceToBoolean(value: string | null | undefined) {
  if (value === "0-25m") {
    return true;
  } else if (value === ">25m") {
    return false;
  } else {
    return maybeDutchBoolean(value);
  }
}

function maybeDutchBoolean(value: string | null | undefined) {
  if (value === "ja") {
    return true;
  } else if (value === "nee") {
    return false;
  } else {
    return value;
  }
}

function maybeDutchBooleanAmount(value: string | null | undefined) {
  switch (value) {
    case "ja":
    case "ja (<1 pp)":
    case "ja (>/= 1 pp)":
      return true;
    case "nee":
      return false;
    default:
      return value;
  }
}

function quietness(value: string | null | undefined) {
  switch (value) {
    case "stil":
      return "silent";
    case "rustig":
      return "quiet";
    case "rumoerig":
      return "noisy";
    default:
      return value;
  }
}
