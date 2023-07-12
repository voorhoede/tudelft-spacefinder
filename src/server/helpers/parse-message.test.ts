import { test, expect } from "vitest";
import { parseMessage } from "./parse-message";

test("Parse with common valid data", () => {
  expect(parseMessage({
    timestamp: "1679400080000",
      decodedValue: {
      ap_deployment_mode: "Campus",
      ap_group: "default",
      client_count: 3,
      cluster_id: "DL0006883",
      group_name: "default",
      name: "A-23-0-007",
      serial: "VNPFK9V37D",
      site: "",
      status: "Up",
      swarm_id: "",
      swarm_name: "",
    }
  })).toMatchInlineSnapshot(`
    {
      "access_point_name": "A-23-0-007",
      "building_number": 23,
      "device_count": 3,
      "updated_at": "2023-03-21T12:01:20.000Z",
    }
  `);
});

test("Parse building number", () => {
  expect(
    parseMessage({
      timestamp: "1679400080000",
      decodedValue: {
        name: "AP-066-00-01-350-03",
        site: "",
      }
    }),
    "from name with dashes"
  )
    .toContain({
      "building_number": 66,
    });

  expect(
    parseMessage({
      timestamp: "1679400080000",
      decodedValue: {
        name: "nope-yes",
        site: "",
      }
    }),
    "fallback with invalid name"
  )
    .toContain({
      "building_number": 0,
    });
});
