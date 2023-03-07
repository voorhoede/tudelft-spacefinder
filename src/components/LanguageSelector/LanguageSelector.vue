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
import { useStore } from "~/stores/store";

const languages = [
  { locale: "en", name: "english" },
  { locale: "nl", name: "nederlands" },
];

const store = useStore();
const { $localePath } = useNuxtApp();
const { name: routeName } = useRoute();

function getLocalePath(locale: string) {
  if (store.currentBuilding) {
    if (store.currentSpace) {
      return $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        space: store.currentSpace,
        locale,
      });
    }
    return $localePath("/buildings/:buildingSlug", {
      building: store.currentBuilding,
      locale,
    });
  }

  const [, rootSegment] = (routeName as string).split("-");
  return $localePath(`/${rootSegment ?? ""}`, { locale });
}
</script>
