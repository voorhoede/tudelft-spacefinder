import buildings from "../src/public/data/buildings.json";
import spaces from "../src/public/data/spaces.json";
const buildingMap = {} as Record<number, any>;
for (const building of buildings) buildingMap[building.number] = building;

//TODO: rewrite after getting rid of vue-i18n
const routes = [
  "/en/",
  "/en/buildings/",
  "/en/help/",
  "/en/feedback/",
  "/nl/",
  "/nl/gebouwen",
  "/nl/hulp/",
  "/nl/feedback/",
];

for (const building of buildings) {
  routes.push("/en/buildings/" + building.i18n.en.slug + "/");
  routes.push("/en/buildings/" + building.i18n.en.slug + "/spaces/");
  routes.push("/nl/gebouwen/" + building.i18n.nl.slug + "/");
  routes.push("/nl/gebouwen/" + building.i18n.nl.slug + "/ruimtes/");
}

for (const space of spaces) {
  const building = buildingMap[space.buildingNumber];
  routes.push(
    "/en/buildings/" +
      building.i18n.en.slug +
      "/spaces/" +
      space.i18n.en.slug +
      "/"
  );
  routes.push(
    "/nl/gebouwen/" +
      building.i18n.nl.slug +
      "/ruimtes/" +
      space.i18n.nl.slug +
      "/"
  );
}

export default routes;
