<template>
  <ClientOnly> Active devices: {{ activeDevices }} </ClientOnly>
</template>

<script setup lang="ts">
defineProps<{ activeDevices: number }>();
</script>
