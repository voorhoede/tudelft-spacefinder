export default defineNuxtPlugin((nuxtApp) => {
  const isMobile = ref(false);
  // Lifecycle-dependend composables like useMediaQuery cannot be used directly during plugin setup
  // so we wait for the Vue app to be mounted
  nuxtApp.hook("app:mounted", () => {
    watchEffect(() => {
      isMobile.value = !useMediaQuery("(min-width: 700px)").value;
    });
  });
  return {
    provide: {
      isMobile: computed(() => isMobile.value),
      isMapMode: ref(false),
    },
  };
});
