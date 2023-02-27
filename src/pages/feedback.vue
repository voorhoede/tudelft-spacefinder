<template>
  <section class="default-layout__info default-layout__info--info-page">
    <h1>{{ title }}</h1>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="body" />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import metaHead from "~/lib/meta-head";
import { useStore } from "~/stores/store";
import { useMapStore } from "~/stores/map";
import { usePageContent } from "~/stores/pageContent";

const { locale } = useI18n();
const store = useStore();
const pageContent = usePageContent();
const mapStore = useMapStore();

const title = computed(() => pageContent.feedbackPage[locale.value].title);
const body = computed(() => pageContent.feedbackPage[locale.value].body);

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
