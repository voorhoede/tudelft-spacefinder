import { SitemapStream, streamToPromise } from "sitemap";
import { generateRoutes } from "../../../config/routes";
import buildings from "../../data/buildings.json";
import spaces from "../../data/spaces.json";

const routes = generateRoutes({ buildings, spaces });

export default defineEventHandler(async (event) => {
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
