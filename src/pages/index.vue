<!-- eslint-disable vue/valid-template-root -->
<template>
</template>
<script setup lang="ts">
const { $localePath } = useNuxtApp();
navigateTo($localePath("/"));
</script>
