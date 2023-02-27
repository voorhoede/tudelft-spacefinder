import { useI18n } from "vue-i18n";

export default function useLocaleRoute() {
  const { t, locale: currentLocale, messages } = useI18n();

  function localSegment(locale: string, segment: string) {
    return messages.value[locale]["routes." + segment];
  }

  function genericRoute(locale: string, name: string) {
    return `/${locale}/${name ? localSegment(locale, name) + "/" : ""}`;
  }

  const rootRoute = computed(() => `/${currentLocale.value}/`);
  const helpRoute = computed(
    () => `/${currentLocale.value}/${t("routes.help")}/`
  );
  const feedbackRoute = computed(
    () => `/${currentLocale.value}/${t("routes.feedback")}/`
  );
  const buildingsRoute = computed(
    () => `/${currentLocale.value}/${t("routes.buildings")}/`
  );
  function buildingRoute({
    buildingSlug,
    locale,
  }: {
    buildingSlug: string;
    locale?: string;
  }) {
    const l = locale ?? currentLocale.value;
    return `${genericRoute(l, "buildings")}${buildingSlug}/`;
  }
  function spaceRoute({
    buildingSlug,
    spaceSlug,
    locale,
  }: {
    buildingSlug: string;
    spaceSlug: string;
    locale?: string;
  }) {
    const l = locale ?? currentLocale.value;
    return `${genericRoute(l, "buildings")}${buildingSlug}/${localSegment(
      l,
      "spaces"
    )}/${spaceSlug}/`;
  }
  return {
    genericRoute,
    rootRoute,
    helpRoute,
    feedbackRoute,
    buildingsRoute,
    buildingRoute,
    spaceRoute,
  };
}
