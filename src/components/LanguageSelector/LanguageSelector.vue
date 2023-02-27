<template>
  <div>
    <template v-for="{ locale, name } in languages">
      <nuxt-link
        v-if="locale !== $i18n.locale"
        :key="locale"
        :to="getLocalePath(locale)"
        :hreflang="locale"
        class="app-menu__link"
        @click="$emit('close')"
      >
        <svg-icon name="world-icon" class="app-menu__icon" />
        <span class="app-menu__link-name">
          {{ name }}
        </span>
      </nuxt-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "~/stores/store";
import { useHistoryStore } from "~/stores/history";
import { useI18n } from "vue-i18n";

const languages = [
  { locale: "en", name: "english" },
  { locale: "nl", name: "nederlands" },
];

const history = useHistoryStore();
const store = useStore();
const { selection } = storeToRefs(store);
const { genericRoute, buildingRoute, spaceRoute } = useLocaleRoute();
function getLocalePath(locale: string) {
  const localisedRouteName = history.currentPageRoute.name;
  const genericRouteName = localisedRouteName.split("___")[0];
  const parts = genericRouteName.split("-");
  if (parts.length < 3) return genericRoute(locale, parts[1]);
  const buildingSlug =
    selection.value.building && selection.value.building.i18n[locale].slug;
  const spaceSlug =
    selection.value.space && selection.value.space.i18n[locale].slug;

  if (spaceSlug)
    return spaceRoute({ buildingSlug: buildingSlug!, spaceSlug, locale });

  return buildingRoute({ buildingSlug: buildingSlug!, locale });
}
</script>
