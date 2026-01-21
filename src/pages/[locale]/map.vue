<!-- eslint-disable vue/valid-template-root -->
<template />
<script setup lang="ts">
import { useMapStore } from "~/stores/map";

const { $t } = useNuxtApp();
const mapStore = useMapStore();

useSpacefinderHead({
  title: computed(() => $t("map")),
  description: computed(() => $t("map")),
});

onMounted(() => {
  mapStore.restoreMapState();
});
</script>
