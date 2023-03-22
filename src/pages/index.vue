<!-- eslint-disable vue/valid-template-root -->
<template />
<script setup lang="ts">
const { $localePath } = useNuxtApp();
navigateTo($localePath("/"));
</script>
