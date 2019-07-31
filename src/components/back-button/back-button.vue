<template>
  <a
    v-if="useHistory && previousPageUrl"
    :href="previousPageUrl"
    @click.prevent="goBack"
    class="back-button button button--round"
  >
    <svg-icon
      name="back-icon"
      class="button--round__icon"
    />
    <span class="a11y-sr-only">
      <slot>{{ $t('back') }}</slot>
    </span>
  </a>

  <nuxt-link 
    v-else 
    :to="to"
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
import { mapGetters } from 'vuex'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    useHistory: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      previousPageUrl: 'history/previousPageUrl'
    })
  },
  methods: {
    goBack() {
      this.$store.commit('history/goBack')
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

