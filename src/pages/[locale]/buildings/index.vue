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

definePageMeta({ alias: "/:locale/gebouwen" });

const spacesStore = useSpacesStore();

const mapStore = useMapStore();
const { $t } = useNuxtApp();

const buildingsOrdered = computed(() =>
  [...spacesStore.buildings].sort((a, b) => a.name.localeCompare(b.name))
);

const title = computed(() => $t("buildingTitle"));

useSpacefinderHead({ title });

onMounted(() => {
  mapStore.restoreMapState();
});
</script>

<style>
.building-overview {
  padding: var(--spacing-default);
  height: calc(100% - var(--navigation-height-mobile));
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 700px) {
  .building-overview {
    height: calc(100% - var(--navigation-height-desktop));
  }
}

.building-overview .building-card:not(:last-child) {
  margin-bottom: var(--spacing-default);
}
</style>
