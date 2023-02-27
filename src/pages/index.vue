<template>
  <section v-if="!isMapMode || !isMobile" class="default-layout__info">
    <h2 class="a11y-sr-only">
      {{ $t("allSpaces") }}
    </h2>
    <space-list :spaces="filteredSpaces" />
  </section>
</template>

<script setup lang="ts">
import { useStore } from "~/stores/store";
import { useI18n } from "vue-i18n";
import metaHead from "~/lib/meta-head";
import { storeToRefs } from "pinia";
import { useMapStore } from "~/stores/map";
const { t } = useI18n();
const store = useStore();
const mapStore = useMapStore();
const { isMobile, isMapMode, filteredSpaces } = storeToRefs(store);

useHead(() =>
  metaHead({
    title: t("spacesTitle"),
    description: t("allSpaces"),
  })
);
onMounted(() => {
  store.clearSelection();
  mapStore.zoomToCampus();
  mapStore.getMap().then(() => mapStore.updateMarkers());
});
</script>
