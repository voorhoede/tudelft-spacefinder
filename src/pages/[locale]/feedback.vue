<template>
  <section class="default-layout__info default-layout__info--info-page">
    <h1>{{ title }}</h1>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="$pageContent('feedbackPage.body')" />
  </section>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";

const { $pageContent } = useNuxtApp();
const mapStore = useMapStore();

const title = computed(() => $pageContent("feedbackPage.title"));

useSpacefinderHead({ title });

onMounted(() => {
  mapStore.restoreMapState();
});
</script>
