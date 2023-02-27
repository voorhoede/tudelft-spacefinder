import routes from "./config/routes";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  modules: ["@pinia/nuxt", "@vueuse/nuxt"],
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
      routes: ["/sitemap.xml", ...routes],
    },
  },
});
