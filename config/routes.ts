import buildings from "../src/data/buildings.json";
import spaces from "../src/data/spaces.json";
const buildingMap = {} as Record<number, any>;
for (const building of buildings) buildingMap[building.number] = building;

//TODO: rewrite after getting rid of vue-i18n
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

for (const space of spaces) {
  const building = buildingMap[space.buildingNumber];
  routes.push(`/en/buildings/${building.i18n.en.slug}/spaces/${space.slug}/`);
  routes.push(`/nl/gebouwen/${building.i18n.nl.slug}/ruimtes/${space.slug}/`);
}

export default routes;
