import { defineNuxtConfig } from "nuxt/config";
import routes from "./config/routes";

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
      routes: ["/sitemap.xml", "/robots.txt", ...routes],
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
          urlPattern: 'https://www.datocms-assets.com/.*',
          handler: 'CacheFirst',
          method: 'GET',
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
