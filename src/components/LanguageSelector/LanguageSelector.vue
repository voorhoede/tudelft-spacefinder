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

const languages = [
  { locale: "en", name: "english" },
  { locale: "nl", name: "nederlands" },
];

const store = useStore();
const { selection } = storeToRefs(store);
const { $localePath } = useNuxtApp();
const { name: routeName } = useRoute();

function getLocalePath(locale: string) {
  const parts = (routeName as string).split("-");
  if (parts.length < 3) return $localePath(`/${parts[1] ?? ""}`, { locale });
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
