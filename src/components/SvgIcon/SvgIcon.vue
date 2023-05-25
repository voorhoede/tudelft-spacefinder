<template>
  <svg aria-hidden="true">
    <use :xlink:href="`#${props.name}`" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>
