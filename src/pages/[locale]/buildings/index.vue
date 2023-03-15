<template>
  <section class="default-layout__info building-overview">
    <h2 class="a11y-sr-only">
      {{ title }}
    </h2>

    <BuildingCard
      v-for="building in buildingsOrdered"
      :key="building.number"
      :building="building"
    />
  </section>
</template>

<script setup lang="ts">
import { useSpacesStore } from "~/stores/spaces";
import { useMapStore } from "~/stores/map";
import type { Building } from "~/types/Building";

definePageMeta({ alias: "/:locale/gebouwen" });

const { buildings } = useSpacesStore();

const mapStore = useMapStore();
const { $t } = useNuxtApp();

function compareBuildingsByName(a: Building, b: Building) {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}

const buildingsOrdered = computed(() =>
  [...buildings].sort(compareBuildingsByName)
);

const title = computed(() => $t("buildingTitle"));

useSpacefinderHead({ title });

onMounted(() => {
  mapStore.zoomToCampus();
});
</script>

<style>
.building-overview {
  padding: var(--spacing-default);
  -webkit-overflow-scrolling: touch;
}

.building-overview .building-card:not(:last-child) {
  margin-bottom: var(--spacing-default);
}
</style>
