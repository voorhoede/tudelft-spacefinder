<template>
  <section class="default-layout__info building-overview">
    <h2 class="a11y-sr-only">
      {{ title }}
    </h2>

    <building-card
      v-for="building in buildings"
      :key="building.slug"
      :building="building"
    />
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import metaHead from "~/lib/meta-head";
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";

definePageMeta({
  alias: "/:locale/gebouwen",
});

const store = useStore();
const mapStore = useMapStore();
const { buildings } = storeToRefs(store);
const { t } = useI18n();

const title = computed(() => t("buildingTitle"));

useHead(() =>
  metaHead({
    title: title.value,
    description: "",
  })
);

onMounted(() => {
  store.clearSelection();
  mapStore.zoomToCampus();
  mapStore.getMap().then(() => mapStore.updateMarkers());
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
