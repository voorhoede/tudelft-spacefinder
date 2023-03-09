export default defineNuxtPlugin((nuxtApp) => {
  const isMobile = ref(false);
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
