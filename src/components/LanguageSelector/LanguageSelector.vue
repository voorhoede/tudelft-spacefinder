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
  if (selection.value.building) {
    const buildingSlug = selection.value.building.i18n[locale].slug;
    if (selection.value.space) {
      const spaceSlug = selection.value.space.i18n[locale].slug;
      return $localePath("/buildings/:buildingSlug/spaces/:spaceSlug", {
        buildingSlug,
        spaceSlug,
        locale,
      });
    }
    return $localePath("/buildings/:buildingSlug", {
      buildingSlug: buildingSlug!,
      locale,
    });
  }

  const [, rootSegment] = (routeName as string).split("-");
  return $localePath(`/${rootSegment ?? ""}`, { locale });
}
</script>
