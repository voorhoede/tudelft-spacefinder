// @ts-ignore
import { post } from "httpntlm";
import { XMLParser } from "fast-xml-parser";

export default (config: { username: string; password: string; url: string }) =>
  (xml: string) => {
    return new Promise((resolve, reject) => {
      post(
        {
          ...config,
          headers: {
            "Content-type": "text/xml",
          },
          body: xml,
        },
        (err: any, res: any) => {
          if (err) {
            return reject(err);
          } else if (res && res.statusCode !== 200) {
            return reject(
              new Error(res.body || "failed to make SOAP to EWS call")
            );
          }
          const parser = new XMLParser();
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
