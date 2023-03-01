<template>
  <section class="default-layout__info default-layout__info--info-page">
    <h1>{{ $pageContent("feedbackPage.title") }}</h1>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="$pageContent('feedbackPage.body')" />
  </section>
</template>

<script setup lang="ts">
import metaHead from "~/lib/meta-head";
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";

const { $pageContent } = useNuxtApp();
const store = useStore();
const mapStore = useMapStore();

useHead(() =>
  metaHead({
    title: $pageContent("feedbackPage.title"),
    description: "",
  })
);

onMounted(() => {
  store.clearSelection();
  mapStore.zoomToCampus();
  mapStore.getMap().then(() => mapStore.updateMarkers());
});
</script>
