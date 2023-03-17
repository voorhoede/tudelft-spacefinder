import { readFile } from "fs";
import { parse } from "csv-parse/sync";
import { getSpaces } from "./transform-spaces";
import { getBuildings } from "./transform-buildings";
import parserOptions from "./config";

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
  dataFromCms: Record<string, any>[]
) {
  return {
    spaces: getSpaces(dataFromCsv),
    buildings: getBuildings(dataFromCsv, dataFromCms),
  };
}
