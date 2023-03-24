export function generateRoutes(
  { buildings, spaces, rooms }:
  { buildings: unknown, spaces: unknown, rooms: unknown }
) {
  const buildingMap = {} as Record<number, any>;

  for (const building of buildings) buildingMap[building.number] = building;

  const routes = [
    "/en/",
    "/en/buildings/",
    "/en/help/",
    "/en/feedback/",
    "/nl/",
    "/nl/gebouwen/",
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
