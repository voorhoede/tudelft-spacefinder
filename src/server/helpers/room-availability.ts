import moment from "moment";
import * as dotenv from "dotenv";
import { soapTemplate } from "./soap-template";
import { getSoapClient } from "./soap-client";

dotenv.config();

const start = moment().startOf("day").toISOString(true);
const end = moment().add(6, "days").endOf("day").toISOString(true);

export function getRoomAvailability(emailAddresses: string[]) {
  const soapClient = getSoapClient({
    username: process.env.EWS_USER!,
    password: process.env.EWS_PASS!,
    url: process.env.EWS_ENDPOINT!,
  });
  const soapDocument = soapTemplate({
    emails: emailAddresses,
    start,
    end,
  });

  return soapClient(soapDocument);
};
