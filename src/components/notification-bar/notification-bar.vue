<template>
  <div class="notification-bar">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
  },
}
</script>

<style>
@import '../app-core/variables.css';

.notification-bar {
  z-index: var(--layer--popup);
  position: absolute;
  padding: var(--spacing-default);
  bottom: var(--spacing-default);
  left: var(--spacing-default);
  width: calc(100% - var(--spacing-double));
  background: var(--brand-secondary-color);
  border: 1px solid transparent;
  box-shadow: var(--shadow-small);
  text-align: center;
  color: var(--background-color);
}

@media (min-width: 700px) {
  .notification-bar {
    bottom: var(--spacing-double);
    left: var(--spacing-double);
    width: calc(100% - 2 * var(--spacing-double));
  }
}
</style>
