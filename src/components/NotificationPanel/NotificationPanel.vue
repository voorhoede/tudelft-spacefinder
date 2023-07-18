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
  z-index: var(--layer--popup);
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-default) var(--spacing-three-quarter) var(--spacing-default) var(--spacing-default);
  bottom: var(--spacing-default);
  left: var(--spacing-default);
  width: calc(100% - var(--spacing-double));
  background: var(--brand-secondary-color);
  border: 1px solid transparent;
  box-shadow: var(--shadow-small);
  color: var(--background-color);
  line-height: 1.3;
}

.notification-panel__content {
  max-width: 800px;
  align-self: center;
}

@media (min-width: 700px) {
  .notification-panel {
    bottom: var(--spacing-double);
    left: var(--spacing-double);
    width: calc(100% - 2 * var(--spacing-double));
  }
}
</style>
  