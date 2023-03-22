import { generateRoutes } from "./config/routes";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@kevinmarrec/nuxt-pwa",
  ],
  css: ["normalize.css", "@/components/app-core/index.css"],
  app: {
    head: {
      title: "TU Delft Spacefinder",
      link: [
        { rel: "dns-prefetch", href: "https://api.mapbox.com/" },
        { rel: "dns-prefetch", href: "https://www.datocms-assets.com/" },
      ],
      script: [
        {
          src: "//siteimproveanalytics.com/js/siteanalyze_6005654.js",
          defer: true,
        },
      ],
    },
  },
  build: {
    transpile: ["floating-vue"],
  },
  runtimeConfig: {
    internalSecret: process.env.INTERNAL_SECRET,
    kafkaConfig: {
      url: process.env.KAFKA_URL,
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
      groupId: "tud_wifi_jasper_moelker",
      topic: "tud_wifi_access_point_details",
    },
    schemaRegistry: {
      url: process.env.SCHEMA_REGISTRY_URL,
      username: process.env.SCHEMA_REGISTRY_USERNAME,
      password: process.env.SCHEMA_REGISTRY_PASSWORD,
    },
    public: {
      mapboxToken: process.env.MAPBOX_TOKEN,
      baseUrl: process.env.URL,
      isOpeningHoursEnabled:
        !!process.env.IS_OPENING_HOURS_ENABLED &&
        process.env.IS_OPENING_HOURS_ENABLED != "0",
      spacesMode: process.env.SPACES_MODE ?? "spaces",
    },
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },
  hooks: {
    "prerender:routes": async ({ routes }) => {
      const buildings = await import("./src/data/buildings.json");
      const spaces = await import("./src/data/spaces.json");
      const generatedRoutes = generateRoutes({ buildings, spaces });

      // routes is of type Set, so we need to add each route individually
      generatedRoutes.forEach((route) => {
        routes.add(route);
      })
    },
  },
  pwa: {
    manifest: {
      name: "TU Delft\nSpacefinder",
      short_name: "Spacefinder",
      background_color: "#00a6d6",
      theme_color: "#00a6d6",
      display: "standalone",
      crossorigin: "use-credentials",
    },
    meta: {
      name: "TU Delft Spacefinder",
      twitterCard: false,
    },
  },
});
