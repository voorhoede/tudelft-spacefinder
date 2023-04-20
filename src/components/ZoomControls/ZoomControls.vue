<template>
  <ul class="flat-list">
    <li class="zoom-controls__item">
      <button
        class="button button--round"
        @click="$emit('auto-focus')"
      >
        <SvgIcon
          name="focus-icon"
          class="button--round__icon"
        />
        <span class="a11y-sr-only">{{ $t('focusMap') }}</span>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
</script>

<style>
@import "../app-core/variables.css";

.zoom-controls__item {
  margin-top: var(--spacing-half);
}
</style>
