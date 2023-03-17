import { config } from "dotenv";
import { writeFile } from "fs";
import { getData as getDataFromCsv, transform } from "./csv/index.mjs";
import cms from "./cms/index.js";
import exchange from "./exchange/index.js";
import validate from "./validate/index.js";

config();

const { CSV_PATH: csvPath } = process.env;

const writeFiles = (files = []) => {
  return Promise.all(
    files.map(({ path, contents }) => {
      const stringifiedData = JSON.stringify(contents, null, 2);
      return new Promise((resolve, reject) => {
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
  cms.getBuildingsDataFromCms(),
  cms.getInfoDataFromCms(),
  cms.getFeedbackPageFromCms(),
  cms.getOnboardingDataFromCms(),
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
    const infoPage = cms.convertCmsInfo(info);
    const feedbackPage = cms.convertCmsInfo(feedback);
    return [
      spaces,
      buildings,
      infoPage,
      feedbackPage,
      cms.convertCmsInfo(onboarding),
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
