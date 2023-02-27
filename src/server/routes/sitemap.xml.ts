import { SitemapStream, streamToPromise } from "sitemap";
import routes from "../../../config/routes";
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
