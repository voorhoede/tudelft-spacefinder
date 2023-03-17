import * as dotenv from "dotenv";
dotenv.config();

import template from "./soap-template";
import client from "./soap-client";
import moment from "moment";

const {
  EWS_USER: username,
  EWS_PASS: password,
  EWS_ENDPOINT: url,
} = process.env;
const useMockData = process.env.USE_MOCK_DATA_EXCHANGE === "1";
const start = moment().startOf("day").toISOString(true);
const end = moment().add(6, "days").endOf("day").toISOString(true);

export default (emailAddresses) => {
  const soapClient = client({ username, password, url });
  const soapDocument = template({
    emails: emailAddresses,
    start,
    end,
  });
  if (useMockData) {
    return import("../../../mock/exchange/availability.json").then(
      (mock) => mock.default
    );
  } else {
    return soapClient(soapDocument);
  }
};
