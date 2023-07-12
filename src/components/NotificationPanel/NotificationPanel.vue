<template>
  <div class="notification-panel">
    <div
      v-html="message"
      class="notification-panel__content"
    />

    <button
      type="button"
      class="button button--navigation"
      @click="closePanel"
    >
      <SvgIcon
        name="close-icon"
        class="button--navigation__icon"
      />

      {{ $t("close") }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();

function closePanel() {
  console.log('close panel');
}
</script>

<style>
@import "../app-core/variables.css";

.notification-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-three-quarter) var(--spacing-half) var(--spacing-three-quarter) var(--spacing-default);
  background: var(--brand-secondary-color);
  color: var(--background-color);
  line-height: 1.2;
}

.notification-panel__content {
  max-width: 800px;
}

@media (min-width: 700px) {
  .notification-panel {
    padding: var(--spacing-three-quarter) var(--spacing-default);
  }
}
</style>
  