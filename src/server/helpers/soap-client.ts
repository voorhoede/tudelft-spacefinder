import httpntlm from "httpntlm";
import { XMLParser } from "fast-xml-parser";

export function parseReponse(responseBody: string) {
  const parser = new XMLParser();
  const parsed = parser.parse(responseBody);
  // Cautiously get user availability response
  return parsed?.["s:Envelope"]?.["s:Body"]?.GetUserAvailabilityResponse;
}

export function getSoapClient(config: {
  username: string;
  password: string;
  url: string;
}) {
  return (xml: string) => {
    return new Promise((resolve, reject) => {
      httpntlm.post(
        {
          ...config,
          headers: { "Content-type": "text/xml" },
          body: xml,
        },
        (err: any, res: any) => {
          if (err) return reject(err);
          if (res && res.statusCode !== 200)
            return reject(
              new Error(res.body || "failed to make SOAP to EWS call")
            );
          const availability = parseReponse(res.body);
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
}
