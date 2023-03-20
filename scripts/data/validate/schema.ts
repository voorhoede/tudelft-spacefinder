import Ajv from "ajv";

// schema files
import baseSchema from "../../../schema/base.json";
import buildingSchema from "../../../schema/building.json";
import spaceSchema from "../../../schema/space.json";

const ajv = new Ajv({
  schemas: [baseSchema, buildingSchema, spaceSchema],
  verbose: true,
});

// json schema validator function for spaces
export const validateSpace = ajv.compile(spaceSchema);

// json schema validator function for buildings
export const validateBuilding = ajv.compile(buildingSchema);
