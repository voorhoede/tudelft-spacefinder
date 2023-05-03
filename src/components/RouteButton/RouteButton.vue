<template>
  <NuxtLink
    :to="to"
    target="_blank"
    class="button button--round"
  >
    <SvgIcon
      name="route-icon"
      class="button--round__icon"
    />
    <span class="a11y-sr-only">{{ $t("route") }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ to: string }>();
</script>
