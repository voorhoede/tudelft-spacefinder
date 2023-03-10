<template>
  <section
    v-if="!$isMapMode.value || !$isMobile.value"
    class="default-layout__info"
  >
    <h2 class="a11y-sr-only">
      {{ allSpacesTitle }}
    </h2>
    <SpaceList
      :spaces="spacesStore.filteredSpaces"
      :show-building-occupancy="true"
    />
  </section>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
const { $t } = useNuxtApp();
const spacesStore = useSpacesStore();
const mapStore = useMapStore();

const allSpacesTitle = computed(() => $t("allSpaces"));

useSpacefinderHead({
  title: computed(() => $t("spacesTitle")),
  description: allSpacesTitle,
});

onMounted(() => {
  mapStore.zoomToCampus();
});
</script>
