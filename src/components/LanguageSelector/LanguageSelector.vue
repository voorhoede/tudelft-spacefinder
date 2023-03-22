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
        <SvgIcon
          name="world-icon"
          class="app-menu__icon"
        />
        <span class="app-menu__link-name">
          {{ name }}
        </span>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";

const languages = [
  { locale: "en", name: "english" },
  { locale: "nl", name: "nederlands" },
];

const spacesStore = useSpacesStore();
const { $localePath } = useNuxtApp();
const { name: routeName } = useRoute();

function getLocalePath(locale: string) {
  if (spacesStore.currentBuilding) {
    if (spacesStore.currentSpace) {
      return $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        space: spacesStore.currentSpace,
        locale,
      });
    }
    return $localePath("/buildings/:buildingSlug", {
      building: spacesStore.currentBuilding,
      locale,
    });
  }

  const [, rootSegment] = (routeName as string).split("-");
  return $localePath(`/${rootSegment ?? ""}`, { locale });
}
</script>
