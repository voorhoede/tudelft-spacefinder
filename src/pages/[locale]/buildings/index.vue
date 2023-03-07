<template>
  <section class="default-layout__info building-overview">
    <h2 class="a11y-sr-only">
      {{ title }}
    </h2>

    <BuildingCard
      v-for="building in buildings"
      :key="building.number"
      :building="building"
    />
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";

definePageMeta({ alias: "/:locale/gebouwen" });

const store = useStore();
const mapStore = useMapStore();
const { buildings } = storeToRefs(store);
const { $t } = useNuxtApp();

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
