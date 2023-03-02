import Cookie from "js-cookie";

export default defineNuxtRouteMiddleware((to, from) => {
  const { $locale } = useNuxtApp();
  if (
    to.params.locale &&
    typeof to.params.locale == "string" &&
    to.params.locale != $locale.value
  ) {
    $locale.value = to.params.locale;
    Cookie.set("nf_lang", to.params.locale);
  }
});
