export default defineNuxtPlugin(() => {
  return {
    provide: {
      isMobile: computed(() => !useMediaQuery("(min-width: 700px)").value),
      isMapMode: ref(false),
    },
  };
});
