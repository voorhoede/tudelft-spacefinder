import { describe, test, expect } from "vitest";
import { parseMessageAruba, parseMessageCisco } from "./parse-message";

describe("parseMessageCisco", () => {
  test("Parse with common valid data", () => {
    expect(parseMessageCisco({
      timestamp: "1679400080000",
      decodedValue: {
        displayName: "8024886886",
        id: 8024886886,
        adminStatus: "ENABLE",
        apType: "AP3700I",
        clientCount: 3,
        clientCount_2_4GHz: 1,
        clientCount_5GHz: 2,
        locationHierarchy: "TUDelft > 23-CITG > BG",
        mapLocation: "23.00.00.960 C1A13 CA-29-01 23.00.00.960",
        model: "AIR-CAP3702I-E-K9",
        name: "A-23-0-007",
        reachabilityStatus: "REACHABLE",
        serialNumber: "FCW2011NQLN",
        softwareVersion: "8.5.182.0",
        status: "CLEARED",
        type: "UnifiedAp",
        upTime: 1330107174,
        ethernetMac: "003a7d33f3c8",
        ipAddress: "10.23.129.7",
        macAddress: "003a7d27d070"
      }
    })).toMatchInlineSnapshot(`
    {
      "access_point_name": "A-23-0-007",
      "building_number": 23,
      "device_count": 3,
      "floor": "BG",
      "location_hierarchy": "TUDelft > 23-CITG > BG",
      "map_location": "23.00.00.960 C1A13 CA-29-01 23.00.00.960",
      "room_id": "23.00.00.960",
      "updated_at": "2023-03-21T12:01:20.000Z",
    }
  `);
  });

  test("Parse building number", () => {
    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "TUDelft > 34-3ME > 1e Verdieping",
          mapLocation: "ap-36-01-02-160-00",
          name: "A-24-0-007",
        }
      }),
      "from name with dashes"
    )
      .toContain({
        "building_number": 24,
      });

    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "TUDelft > 34-3ME > 1e Verdieping",
          mapLocation: "23.00.01.960 I2A08 IC-01-07 23.00.01.960",
          name: "AP003a.7d33.f22c"
        }
      }),
      "from name with dots"
    )
      .toContain({
        "building_number": 23,
      });

    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "TUDelft > 34-3ME > 1e Verdieping",
          mapLocation: "",
          name: "nope-yes"
        }
      }),
      "fallback with invalid name"
    )
      .toContain({
        "building_number": null,
      });

    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "TUDelft > 34-3ME > 1e Verdieping",
          mapLocation: "nope.00.01.960 I2A08",
          name: ""
        }
      }),
      "fallback with invalid mapLocation"
    )
      .toContain({
        "building_number": null,
      });
  });

  test("Parse floor", () => {
    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "Root Area > Begane Grond",
          mapLocation: "23.00.01.960 I2A08 IC-01-07 23.00.01.960",
          name: "AP003a.7d33.f22c"
        }
      }),
      "from locationHierarchy with arrows"
    )
      .toContain({
        "floor": "Begane Grond",
      });

    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "Root Area",
          mapLocation: "23.00.01.960 I2A08 IC-01-07 23.00.01.960",
          name: "AP003a.7d33.f22c"
        }
      }),
      "from locationHierarchy with no arrows"
    )
      .toContain({
        "floor": "Root Area",
      });
  });

  test("Parse room id", () => {
    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "Root Area > Begane Grond",
          mapLocation: "23.00.01.960 I2A08 IC-01-07 23.00.01.960",
          name: "AP003a.7d33.f22c"
        }
      }),
      "from mapLocation with spaces"
    )
      .toContain({
        "room_id": "23.00.01.960",
      });

    expect(
      parseMessageCisco({
        timestamp: "1679400080000",
        decodedValue: {
          clientCount: 20,
          locationHierarchy: "Root Area",
          mapLocation: "HB-01-AP1",
          name: "AP003a.7d33.f22c"
        }
      }),
      "from mapLocation no spaces"
    )
      .toContain({
        "room_id": "HB-01-AP1",
      });
  });
});

describe("parseMessageAruba", () => {
  test("Parse with common valid data", () => {
    expect(parseMessageAruba({
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
      parseMessageAruba({
        timestamp: "1679400080000",
        decodedValue: {
          name: "AP-066-00-01-350-03",
          site: "",
          status: "Up",
        }
      }),
      "from name with dashes"
    )
      .toContain({
        "building_number": 66,
      });

    expect(
      parseMessageAruba({
        timestamp: "1679400080000",
        decodedValue: {
          name: "nope-yes",
          site: "",
          status: "Up",
        }
      }),
      "fallback with invalid name"
    )
      .toContain({
        "building_number": null,
      });
  });

  test("Return null for exceptions", () => {
    expect(
      parseMessageAruba({
        timestamp: "1689600507169",
        decodedValue: {
          status: "Down",
        },
      }),
      "for status"
    )
      .toBe(null);
  });
});
