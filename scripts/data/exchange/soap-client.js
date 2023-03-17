const httpntlm = require("httpntlm");
const parser = require("fast-xml-parser");

module.exports = (config) => (xml) => {
  return new Promise((resolve, reject) => {
    httpntlm.post(
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

        const parsed = parser.parse(res.body);
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
