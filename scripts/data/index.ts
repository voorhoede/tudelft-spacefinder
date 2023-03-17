import * as dotenv from "dotenv";
dotenv.config();
import { writeFile } from "fs";
import { getData as getDataFromCsv, transform } from "./csv/index";
import {
  getBuildingsDataFromCms,
  getInfoDataFromCms,
  getFeedbackPageFromCms,
  getOnboardingDataFromCms,
  convertCmsInfo,
} from "./cms/index";
import exchange from "./exchange/index.js";
import validate from "./validate/index.js";

const { CSV_PATH: csvPath } = process.env;
if (!csvPath) {
  throw "CSV_PATH missing in env";
}

const writeFiles = (files: { path: string; contents: any }[]) => {
  return Promise.all(
    files.map(({ path, contents }) => {
      const stringifiedData = JSON.stringify(contents, null, 2);
      return new Promise<void>((resolve, reject) => {
        writeFile(`./src/data/${path}.json`, stringifiedData, "utf8", (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    })
  );
};

Promise.all([
  getDataFromCsv(csvPath),
  getBuildingsDataFromCms(),
  getInfoDataFromCms(),
  getFeedbackPageFromCms(),
  getOnboardingDataFromCms(),
])
  .then(([csv, buildings, info, feedback, onboarding]) =>
    Promise.all([
      Promise.resolve(transform(csv, buildings))
        .then(exchange.addOpeningHours)
        .then(validate),
      info,
      feedback,
      onboarding,
    ])
  )
  .then(([{ spaces, buildings }, info, feedback, onboarding]) => {
    const infoPage = convertCmsInfo(info);
    const feedbackPage = convertCmsInfo(feedback);
    return [
      spaces,
      buildings,
      infoPage,
      feedbackPage,
      convertCmsInfo(onboarding),
    ];
  })
  .then(([spaces, buildings, infoPage, feedbackPage, onboarding]) =>
    writeFiles([
      { path: "spaces", contents: spaces },
      { path: "buildings", contents: buildings },
      { path: "infopage", contents: infoPage },
      { path: "feedbackpage", contents: feedbackPage },
      { path: "onboarding", contents: onboarding },
    ])
  )
  .then(() => console.info("Wrote data for spaces, buildings and CMS"))
  .catch(({ message }) =>
    console.error(`An error occurred writing data: ${message}`)
  );
