import { defineNuxtConfig } from "nuxt/config";
import { generateRoutes } from "./config/routes";
import { loadBuildings, loadRooms, loadSpaces } from "./src/data/load-data";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
  ],
  css: ["normalize.css", "@/components/app-core/index.css"],
  app: {
    head: {
      title: "TU Delft Spacefinder",
      link: [
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "dns-prefetch", href: "https://api.mapbox.com/" },
        { rel: "dns-prefetch", href: "https://www.datocms-assets.com/" },
      ],
      meta: [
        {
          name: "google-site-verification",
          content: "zpj1hb-uMNGkFLJlxqC96oWE067G1lzXcRFsWM4m_8M",
        },
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
      topics: [
        "tud_aruba_access_point_client_counts",
      ],
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
      const generatedRoutes = await Promise.all([
        loadBuildings(),
        loadSpaces(),
        loadRooms(),
      ]).then(([buildings, spaces, rooms]) =>
        generateRoutes({ buildings, spaces, rooms })
      );
      // routes is of type Set, so we need to add each route individually
      generatedRoutes.forEach((route) => {
        routes.add(route);
      });
    },
  },
  pwa: {
    registerType: "autoUpdate",
    useCredentials: true,
    workbox: {
      globPatterns: ["_nuxt/*"],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: "https://www.datocms-assets.com/.*",
          handler: "CacheFirst",
          method: "GET",
        },
      ],
    },
    manifest: {
      name: "TU Delft\nSpacefinder",
      short_name: "Spacefinder",
      background_color: "#00a6d6",
      theme_color: "#00a6d6",
      display: "standalone",
      icons: [
        {
          src: "/favicon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/favicon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/favicon-512--maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },
});
