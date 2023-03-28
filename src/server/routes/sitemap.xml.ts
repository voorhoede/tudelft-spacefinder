import { SitemapStream, streamToPromise } from "sitemap";
import { generateRoutes } from "../../../config/routes";
import { loadBuildings, loadRooms, loadSpaces } from "../../data/load-data";

export default defineEventHandler(async (event) => {
  const routes = await Promise.all([
    loadBuildings(),
    loadSpaces(),
    loadRooms(),
  ]).then(([buildings, spaces, rooms]) =>
    generateRoutes({ buildings, spaces, rooms })
  );
  const runtimeConfig = useRuntimeConfig();
  const sitemap = new SitemapStream({
    hostname: runtimeConfig.public.baseUrl,
  });
  for (const route of routes) {
    sitemap.write({ url: route }); //changefreq: 'monthly'
  }
  sitemap.end();
  return streamToPromise(sitemap);
});
