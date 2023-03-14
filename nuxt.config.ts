import { defineNuxtConfig } from 'nuxt/config';
import routes from "./config/routes";

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
    supabaseCredentials: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY,
    },
    kafkaConfig: {
      url: process.env.KAFKA_URL,
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
      groupId: 'tud_wifi_jasper_moelker',
      topic: 'tud_wifi_access_point_details',
    },
    schemaRegistry: {
      url: process.env.SCHEMA_REGISTRY_URL,
      username: process.env.SCHEMA_REGISTRY_USERNAME,
      password: process.env.SCHEMA_REGISTRY_PASSWORD,
    },
    public: {
      maxboxToken: process.env.MAPBOX_TOKEN,
      baseUrl: process.env.URL,
    },
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt", ...routes],
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
