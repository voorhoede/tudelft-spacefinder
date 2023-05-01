<template>
  <div>
    <template v-for="{ locale, name } in languages">
      <NuxtLink
        v-if="locale !== $locale.value"
        :key="locale"
        :to="getLocalePath(locale)"
        :hreflang="locale"
        class="app-menu__link"
        @click="handleLanguageLinkClick()"
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
import { useMapStore } from "~/stores/map";

const languages = [
  { locale: "en", name: "english" },
  { locale: "nl", name: "nederlands" },
];

const spacesStore = useSpacesStore();
const mapStore = useMapStore();
const { $localePath } = useNuxtApp();
const { name: routeName } = useRoute();
const emit = defineEmits(['close'])

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

async function handleLanguageLinkClick() {
  mapStore.updateData();
  // emit an event
  emit('close');
}
</script>
