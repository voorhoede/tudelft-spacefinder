<template>
  <svg>
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>
