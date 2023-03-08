<template>
  <section
    v-if="!$isMapMode.value || !$isMobile.value"
    class="default-layout__info"
  >
    <h2 class="a11y-sr-only">
      {{ allSpacesTitle }}
    </h2>
    <SpaceList :spaces="store.filteredSpaces" />
  </section>
</template>

<script setup lang="ts">
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";
const { $t } = useNuxtApp();
const store = useStore();
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
