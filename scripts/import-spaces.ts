import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { buildClient } from "@datocms/cma-client-node";
import { config } from "dotenv";
import { datocmsEnvironment } from "../src/constants";

config();

const client = buildClient({
  apiToken: process.env.DATO_API_TOKEN!,
  environment: datocmsEnvironment,
});

fs.readFile("./src/data/studieplekken.csv")
  .then((data) =>
    parse(data, {
      relaxColumnCount: true,
      fromLine: 2,
      columns: [
        "ref",
        "buildingNumber",
        "id",
        "roomId",
        "nameNL",
        "nameEN",
        "floor",
        "latitude",
        "longitude",
        "seats",
        "adjustableChairs",
        "quietness",
        "daylit",
        "powerOutlets",
        "whiteBoard",
        "presentationScreen",
        "nearCoffeeMachine",
        "nearPrinter",
        "nearBathroom",
      ],
      cast: (value, context) => {
        switch (context.column) {
          case "buildingNumber":
            return value.split(" ").at(0);
          case "seats":
            return parseInt(value, 10);
          case "adjustableChairs":
            return value !== "0";
          case "quietness":
            return quietness(value);
          case "daylit":
            return value === "daglicht";
          case "powerOutlets":
          case "whiteBoard":
          case "presentationScreen":
            return maybeDutchBooleanAmount(value);
          case "nearCoffeeMachine":
          case "nearPrinter":
          case "nearBathroom":
            return value === "0-25m";
          default:
            return value;
        }
      },
    }),
  )
  .then(async (parsedData) => {
    const spaceModelId = "2040795";
    const buildings = await client.items.list({
      filter: { type: "building" },
    });

    parsedData.forEach(async (space, index) => {
      await client.items
        .create({
          item_type: { type: "item_type", id: spaceModelId },
          name: { en: space.nameEN, nl: space.nameNL },
          space_id:
            parsedData.find(({ ref, id }) => space.id === id && space.ref !== ref)
              ? `${space.id}--${space.ref}`
              : space.id,
          room_id: space.roomId,
          floor: { en: space.floor, nl: space.floor },
          location: { latitude: space.latitude, longitude: space.longitude },
          seats: space.seats,

          adjustable_chairs: space.adjustableChairs,
          quietness: space.quietness,
          daylit: space.daylit,
          power_outlets: space.powerOutlets,
          white_board: space.whiteBoard,
          presentation_screen: space.presentationScreen,
          near_coffee_machine: space.nearCoffeeMachine,
          near_printer: space.nearPrinter,
          near_bathroom: space.nearBathroom,
          building: buildings.find(
            (building) => space.buildingNumber === building.number,
          )?.id,
        })
        .catch(({ errors }) => {
          if (
            errors.find(
              (error) =>
                error.attributes.details.field === "space_id" &&
                error.attributes.details.code === "VALIDATION_UNIQUE",
            )
          ) {
            return;
          }
          console.error(space, JSON.stringify(errors, null, 2));
        });
    });
  });

function maybeDutchBooleanAmount(value?: string) {
  switch (value) {
    case "ja":
    case "ja (<1 pp)":
    case "ja (>/= 1 pp)":
      return true;
    case "nee":
      return false;
    default:
      return;
  }
}

function quietness(value?: string) {
  switch (value) {
    case "stil":
      return "silent";
    case "rustig":
      return "quiet";
    case "rumoerig":
      return "noisy";
    default:
      return;
  }
}
