import type { BuildingI18n } from "../src/types/Building";
import type { RoomI18n, SpaceI18n } from "../src/types/Space";

export function generateRoutes(
  { buildings, spaces, rooms }:
  { buildings: BuildingI18n[]; spaces: SpaceI18n[]; rooms: RoomI18n[] }
) {
  const buildingMap = {} as Record<number, any>;

  for (const building of buildings) buildingMap[building.number] = building;

  const routes = [
    "/en/",
    "/en/buildings/",
    "/en/spaces/",
    "/en/help/",
    "/en/feedback/",
    "/nl/",
    "/nl/gebouwen/",
    "/nl/ruimtes/",
    "/nl/hulp/",
    "/nl/feedback/",
  ];

  for (const building of buildings) {
    routes.push(`/en/buildings/${building.i18n.en.slug}/`);
    routes.push(`/nl/gebouwen/${building.i18n.nl.slug}/`);
  }

  if (process.env.SPACES_MODE == "rooms") {
    for (const room of rooms) {
      const building = buildingMap[room.buildingNumber];
      routes.push(`/en/buildings/${building.i18n.en.slug}/spaces/${room.slug}/`);
      routes.push(`/nl/gebouwen/${building.i18n.nl.slug}/ruimtes/${room.slug}/`);
    }
  } else {
    for (const space of spaces) {
      const building = buildingMap[space.buildingNumber];
      routes.push(`/en/buildings/${building.i18n.en.slug}/spaces/${space.slug}/`);
      routes.push(`/nl/gebouwen/${building.i18n.nl.slug}/ruimtes/${space.slug}/`);
    }
  }

  return routes;
}
