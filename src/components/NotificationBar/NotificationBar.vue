<template>
  <div class="notification-bar">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<style>
@import "../app-core/variables.css";

.notification-bar {
  z-index: var(--layer--popup);
  position: absolute;
  padding: var(--spacing-default);
  bottom: var(--spacing-default);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--spacing-double));
  max-width: 800px;
  background: var(--brand-secondary-color);
  border: 1px solid transparent;
  box-shadow: var(--shadow-small);
  text-align: center;
  color: var(--background-color);
}

@media (min-width: 700px) {
  .notification-bar {
    bottom: var(--spacing-double);
  }
}
</style>
