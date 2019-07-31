<template>
  <nuxt-link
    :to="to"
    v-on:click.native="goBack"
    class="back-button button button--round"
  >
    <svg-icon
      name="back-icon"
      class="button--round__icon"
    />
    <span class="a11y-sr-only">
      <slot>{{ $t('back') }}</slot>
    </span>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack(event) {
      //event.preventDefault()
      //window.history.back()
    }
  }
}
</script>

<style>
@import '../app-core/variables.css';

.back-button {
  position: fixed;
  top: calc(var(--header-height-mobile) + var(--spacing-default));
  left: var(--spacing-default);
}

@media (min-width: 700px) {
  .back-button {
    top: calc(var(--header-height-desktop) + var(--spacing-default));
    left: calc(var(--column-width-desktop) + var(--spacing-default));
  }
}
</style>

