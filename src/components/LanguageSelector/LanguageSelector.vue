<template>
  <div>
    <template v-for="{ locale, name } in languages">
      <NuxtLink
        v-if="locale !== $locale.value"
        :key="locale"
        :to="getLocalePath(locale)"
        :hreflang="locale"
        class="app-menu__link"
        @click="$emit('close')"
      >
        <SvgIcon name="world-icon" class="app-menu__icon" />
        <span class="app-menu__link-name">
          {{ name }}
        </span>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "~/stores/store";
import { useHistoryStore } from "~/stores/history";

const languages = [
  { locale: "en", name: "english" },
  { locale: "nl", name: "nederlands" },
];

const history = useHistoryStore();
const store = useStore();
const { selection } = storeToRefs(store);
const { $localePath } = useNuxtApp();
function getLocalePath(locale: string) {
  const localisedRouteName = history.currentPageRoute.name;
  const genericRouteName = localisedRouteName.split("___")[0];
  const parts = genericRouteName.split("-");
  if (parts.length < 3) return $localePath(`/${parts[1]}`, { locale });
  const buildingSlug =
    selection.value.building && selection.value.building.i18n[locale].slug;
  const spaceSlug =
    selection.value.space && selection.value.space.i18n[locale].slug;

  if (spaceSlug)
    return $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
      buildingSlug: buildingSlug!,
      spaceSlug,
      locale,
    });

  return $localePath("/buildings/:buildingSlug", {
    buildingSlug: buildingSlug!,
    locale,
  });
}
</script>
