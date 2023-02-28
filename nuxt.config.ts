import routes from "./config/routes";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@kevinmarrec/nuxt-pwa"],
  css: ["normalize.css", "@/components/app-core/index.css"],
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
    // workbox: {
    //   runtimeCaching: [
    //     {
    //       urlPattern: 'https://www.datocms-assets.com/.*',
    //       handler: 'cacheFirst',
    //       method: 'GET',
    //     },
    //   ],
    // },
  },
});
