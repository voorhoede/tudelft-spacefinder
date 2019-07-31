<template>
  <ul class="flat-list">
    <li
      v-for="action in actions"
      :key="action.event"
      class="zoom-controls__item"
    >
      <button
        class="button button--round"
        @click="$emit(action.event)"
      >
        <svg-icon
          :name="`${action.icon}-icon`"
          class="button--round__icon"
        />

        <span class="a11y-sr-only">{{ $t(action.text) }}</span>
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
.zoom-controls__item {
  margin-top: var(--spacing-half);
}
</style>
