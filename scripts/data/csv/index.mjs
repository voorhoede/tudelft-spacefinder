import { readFile } from "fs";
import { parse } from "csv-parse/sync";
import { getSpaces } from "./transform-spaces.mjs";
import { getBuildings } from "./transform-buildings.mjs";
import parserOptions from "./config.js";

export function getData(csvPath) {
  return new Promise((resolve, reject) => {
    readFile(csvPath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(parse(data, parserOptions));
    });
  });
}

export function transform(dataFromCsv, dataFromCms) {
  return {
    spaces: getSpaces(dataFromCsv),
    buildings: getBuildings(dataFromCsv, dataFromCms),
  };
}
