<template>
  <ul class="zoom-controls">
    <li
      v-for="action in actions"
      :key="action.event"
      class="zoom-controls__item"
    >
      <button
        :aria-label="$t(action.text)"
        class="zoom-controls__button"
        @click="$emit(action.event)"
      >
        <svg-icon
          :name="`${action.icon}-icon`"
          class="zoom-controls__icon"
        />
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      actions: [
        { event: 'auto-focus', icon: 'focus', text: 'focusMap' },
        { event: 'zoom-in', icon: 'add', text: 'zoomIn' },
        { event: 'zoom-out', icon: 'remove', text: 'zoomOut' }
      ]
    }
  }
}
</script>

<style>
  .zoom-controls {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .zoom-controls__item {
    margin-top: 5px;
  }
  .zoom-controls__button {
    background: white;
  }
  .zoom-controls__icon {
    height: 24px;
    width: 24px;
  }
</style>
