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
  },
});
