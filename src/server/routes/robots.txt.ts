export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  let baseUrl = runtimeConfig.public.baseUrl;
  if (!baseUrl.endsWith("/")) baseUrl += "/";
  return `Sitemap: ${baseUrl}sitemap.xml`;
});
