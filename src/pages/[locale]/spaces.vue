<template>
  <section class="default-layout__info">
    <SpaceList :spaces="spacesStore.filteredSpaces" />
  </section>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
definePageMeta({ alias: "/:locale/ruimtes" });
const { $t } = useNuxtApp();
const spacesStore = useSpacesStore();
const mapStore = useMapStore();

const allSpacesTitle = computed(() => $t("allSpaces"));

useSpacefinderHead({
  title: computed(() => $t("spacesTitle")),
  description: allSpacesTitle,
});

onMounted(() => {
  mapStore.restoreMapState();
});
</script>
