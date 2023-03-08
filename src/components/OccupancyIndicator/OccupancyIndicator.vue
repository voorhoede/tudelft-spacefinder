<template>
  <ClientOnly> {{ $t("activeDevices") }}: {{ activeDevices }} </ClientOnly>
</template>

<script setup lang="ts">
defineProps<{ activeDevices: number }>();
</script>
