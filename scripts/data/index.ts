import fs from "node:fs/promises";
import * as dotenv from "dotenv";
import { transform } from "./csv/index";
import {
  getBuildingsDataFromCms,
  getNotificationFromCms,
  getPageFromCms,
  convertCmsInfo,
  convertCmsNotification,
} from "./cms/index";

dotenv.config();

const csvPath = './src/data/studieplekken.csv';

function writeFile(path: string, contents: unknown) {
  const stringifiedData = JSON.stringify(contents, null, 2);

  return fs.writeFile(`./src/data/${path}.json`, stringifiedData);
}

function prepareSpaces(csvPath: string) {
  return getBuildingsDataFromCms()
    .then((cmsBuildings) => {
      const { spaces, rooms, buildings } = transform(cmsBuildings);
      Promise.all([
        writeFile("spaces", spaces),
        writeFile("rooms", rooms),
        writeFile("buildings", buildings),
      ]);
    });
}

function preparePage(name: string) {
  return getPageFromCms(name).then((page) =>
    writeFile(name.toLowerCase(), convertCmsInfo(page))
  );
}

function prepareNotification() {
  return getNotificationFromCms().then((content) =>
    writeFile('notification', convertCmsNotification(content))
  );
}

Promise.all([
  prepareSpaces(csvPath),
  ...["infoPage", "feedbackPage"].map(preparePage),
  prepareNotification(),
])
  .then(() => console.info("Wrote data for spaces, buildings and CMS"))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  );
