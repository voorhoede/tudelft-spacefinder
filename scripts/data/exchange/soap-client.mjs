import { post } from "httpntlm";
import { parse } from "fast-xml-parser";

export default (config) => (xml) => {
  return new Promise((resolve, reject) => {
    post(
      {
        ...config,
        headers: {
          "Content-type": "text/xml",
        },
        body: xml,
      },
      (err, res) => {
        if (err) {
          return reject(err);
        } else if (res && res.statusCode !== 200) {
          return reject(
            new Error(res.body || "failed to make SOAP to EWS call")
          );
        }

        const parsed = parse(res.body);
        // Cautiously get user availability response
        const availability =
          parsed?.["s:Envelope"]?.["s:Body"]?.GetUserAvailabilityResponse ??
          null;

        if (availability) {
          resolve(availability);
        } else {
          reject(
            new Error(
              "could not find UserAvailabilityResponse in SOAP envelope"
            )
          );
        }
      }
    );
  });
};
