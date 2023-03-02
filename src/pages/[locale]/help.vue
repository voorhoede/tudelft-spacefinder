<template>
  <section class="default-layout__info default-layout__info--info-page">
    <h1>{{ title }}</h1>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="$pageContent('infoPage.body')" />
  </section>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";

definePageMeta({ alias: "/:locale/hulp" });

const { $pageContent } = useNuxtApp();
const mapStore = useMapStore();

const title = computed(() => $pageContent("infoPage.title"));

useSpacefinderHead({ title });

onMounted(() => {
  mapStore.zoomToCampus();
  mapStore.updateMarkers();
});
</script>
