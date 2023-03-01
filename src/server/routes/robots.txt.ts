export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  let baseUrl = runtimeConfig.public.baseUrl;
  if (!baseUrl.endsWith("/")) baseUrl += "/";
  setResponseHeader(event, "Content-Type", "text/plain");
  return `Sitemap: ${baseUrl}sitemap.xml`;
});
